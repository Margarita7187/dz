import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AdvancedTodoApp = () => {
  // Состояния компонента
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date');
  const [lang, setLang] = useState('en');

  // Локализация текстов
  const t = {
    en: { title: 'Tasks', add: 'Add', search: 'Search', all: 'All', active: 'Active', completed: 'Completed', noTasks: 'No tasks' },
    ru: { title: 'Задачи', add: 'Добавить', search: 'Поиск', all: 'Все', active: 'Активные', completed: 'Завершенные', noTasks: 'Нет задач' }
  }[lang];

  // LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Добавление новой задачи
  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        title: input.trim(),
        completed: false,
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        createdAt: new Date().toISOString()
      }]);
      setInput('');
    }
  };

  // Фильтрация и поиск
  const filteredTasks = tasks
    .filter(task => {
      const matchFilter = filter === 'all' || (filter === 'active' && !task.completed) || (filter === 'completed' && task.completed);
      const matchSearch = task.title.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    })
    .sort((a, b) => sort === 'date' 
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : { high: 3, medium: 2, low: 1 }[b.priority] - { high: 3, medium: 2, low: 1 }[a.priority]
    );

  // Компонент отдельной задачи
  const TaskItem = ({ task }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', border: '1px solid #ccc', margin: '5px 0', background: task.completed ? '#f0f0f0' : 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))}
        />
        <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</span>
        <span style={{ background: task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '12px' }}>
          {task.priority}
        </span>
      </div>
      <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}>×</button>
    </div>
  );

  // Валидация пропсов для TaskItem
  TaskItem.propTypes = {
    task: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      priority: PropTypes.string.isRequired
    }).isRequired
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>{t.title}</h2>
        <button onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}>{lang === 'en' ? 'RU' : 'EN'}</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && addTask()}
          placeholder="New task..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button onClick={addTask}>{t.add}</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t.search}
          style={{ padding: '8px' }}
        />
        {['all', 'active', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ background: filter === f ? '#007bff' : 'white', color: filter === f ? 'white' : 'black' }}
          >
            {t[f]}
          </button>
        ))}
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="date">Date</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      <div>
        {filteredTasks.map(task => <TaskItem key={task.id} task={task} />)}
        {filteredTasks.length === 0 && <div style={{ textAlign: 'center', padding: '20px' }}>{t.noTasks}</div>}
      </div>
    </div>
  );
};

export default AdvancedTodoApp;