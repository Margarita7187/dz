const express = require('express');
const Joi = require('joi');
const fs = require('fs');
const app = express();
const PORT = 3002;

app.use(express.json());

// Middleware логирования ошибок
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Схемы валидации
const postSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(10).required(),
    author: Joi.string().min(2).max(50).required(),
    tags: Joi.array().items(Joi.string().min(2)).max(10)
});

const userSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

// Middleware валидации
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            error: 'Ошибка валидации',
            details: error.details[0].message 
        });
    }
    next();
};

// Mock данные
let posts = [
    { id: 1, title: 'Валидированная статья', content: 'Прошла проверку', author: 'admin', tags: ['validation'] }
];

// Логирование ошибок в файл
const logError = (error) => {
    const log = `${new Date().toISOString()} - ${error}\n`;
    fs.appendFile('errors.log', log, (err) => {
        if (err) console.error('Не удалось записать ошибку:', err);
    });
};

// Endpoints с валидацией
app.post('/api/posts', validate(postSchema), (req, res) => {
    try {
        const newPost = {
            id: posts.length + 1,
            ...req.body,
            createdAt: new Date()
        };
        posts.push(newPost);
        
        res.status(201).json({ 
            success: true,
            message: 'Статья создана',
            data: newPost 
        });
    } catch (error) {
        logError(error);
        res.status(500).json({ 
            success: false,
            error: 'Ошибка при создании статьи' 
        });
    }
});

app.post('/api/users', validate(userSchema), (req, res) => {
    try {
        // Имитация ошибки
        if (req.body.email === 'error@test.com') {
            throw new Error('Тестовая ошибка сервера');
        }
        
        res.status(201).json({ 
            success: true,
            message: 'Пользователь создан',
            data: { id: 1, ...req.body, password: undefined }
        });
    } catch (error) {
        logError(error.stack);
        res.status(500).json({ 
            success: false,
            error: 'Внутренняя ошибка сервера' 
        });
    }
});

// Единообразный формат ошибок
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false,
        error: 'Маршрут не найден' 
    });
});

app.use((err, req, res, next) => {
    logError(err.stack);
    res.status(500).json({ 
        success: false,
        error: 'Внутренняя ошибка сервера' 
    });
});

app.listen(PORT, () => console.log(`Validation API на порту ${PORT}`));