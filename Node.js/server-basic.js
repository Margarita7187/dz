const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Mock данные
let posts = [
    { id: 1, title: 'Первая статья', content: 'Содержание', author: 'admin', tags: ['nodejs'], createdAt: new Date() },
    { id: 2, title: 'Вторая статья', content: 'Содержание', author: 'user', tags: ['express'], createdAt: new Date() }
];

// GET /api/posts - все статьи
app.get('/api/posts', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    
    res.json({
        data: posts.slice(startIndex, startIndex + limit),
        pagination: { page, limit, total: posts.length }
    });
});

// GET /api/posts/search - поиск
app.get('/api/posts/search', (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Параметр q обязателен' });
    
    const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(q.toLowerCase()) ||
        post.content.toLowerCase().includes(q.toLowerCase())
    );
    
    res.json({ data: filtered });
});

// GET /api/posts/:id - статья по ID
app.get('/api/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).json({ error: 'Статья не найдена' });
    res.json({ data: post });
});

// POST /api/posts - создать
app.post('/api/posts', (req, res) => {
    const { title, content, author, tags } = req.body;
    if (!title || !content || !author) {
        return res.status(400).json({ error: 'Title, content и author обязательны' });
    }
    
    const newPost = {
        id: posts.length + 1,
        title, content, author, tags: tags || [],
        createdAt: new Date()
    };
    
    posts.push(newPost);
    res.status(201).json({ message: 'Статья создана', data: newPost });
});

// PUT /api/posts/:id - обновить
app.put('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) return res.status(404).json({ error: 'Статья не найдена' });
    
    posts[postIndex] = { ...posts[postIndex], ...req.body, updatedAt: new Date() };
    res.json({ message: 'Статья обновлена', data: posts[postIndex] });
});

// DELETE /api/posts/:id - удалить
app.delete('/api/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex === -1) return res.status(404).json({ error: 'Статья не найдена' });
    
    const deleted = posts.splice(postIndex, 1)[0];
    res.json({ message: 'Статья удалена', data: deleted });
});

app.listen(PORT, () => console.log(`Basic API на порту ${PORT}`));