const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

// Middleware логирования
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Mock пользователи
let users = [
    { id: 1, username: 'admin', email: 'admin@test.com', password: '123456' },
    { id: 2, username: 'user', email: 'user@test.com', password: '123456' }
];

let posts = [
    { id: 1, title: 'Публичная статья', content: 'Все видят', author: 'admin' },
    { id: 2, title: 'Приватная статья', content: 'Только для авторизованных', author: 'admin' }
];

// Middleware аутентификации
const requireAuth = (req, res, next) => {
    const token = req.headers.authorization;
    
    if (!token || token !== 'Bearer secret-token') {
        return res.status(401).json({ error: 'Требуется авторизация' });
    }
    
    req.user = { id: 1, username: 'admin' };
    next();
};

// Публичные эндпоинты
app.post('/api/auth/register', (req, res) => {
    const { username, email, password } = req.body;
    
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Пользователь уже существует' });
    }
    
    const newUser = { id: users.length + 1, username, email, password };
    users.push(newUser);
    
    res.status(201).json({ 
        message: 'Пользователь создан',
        user: { id: newUser.id, username, email },
        token: 'secret-token'
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) return res.status(401).json({ error: 'Неверные данные' });
    
    res.json({ 
        message: 'Успешный вход',
        user: { id: user.id, username: user.username, email: user.email },
        token: 'secret-token'
    });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
    res.json({ user: req.user });
});

// Защищенные эндпоинты
app.get('/api/protected/posts', requireAuth, (req, res) => {
    res.json({ data: posts, message: 'Это защищенный маршрут' });
});

app.post('/api/protected/posts', requireAuth, (req, res) => {
    const newPost = {
        id: posts.length + 1,
        ...req.body,
        author: req.user.username,
        createdAt: new Date()
    };
    posts.push(newPost);
    res.status(201).json({ message: 'Статья создана', data: newPost });
});

app.listen(PORT, () => console.log(`Auth API на порту ${PORT}`));