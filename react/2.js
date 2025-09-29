import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('week');

  // Имитация загрузки данных с API
  const fetchData = async (range) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Имитация случайной ошибки
        if (Math.random() < 0.1) {
          reject(new Error('Failed to load data from server'));
          return;
        }

        const mockData = {
          users: Math.floor(Math.random() * 1000) + 500,
          revenue: Math.floor(Math.random() * 100000) + 50000,
          sessions: Math.floor(Math.random() * 5000) + 2000,
          conversion: (Math.random() * 10 + 2).toFixed(1),
          chartData: Array(7).fill(0).map(() => Math.floor(Math.random() * 100) + 20)
        };

        resolve(mockData);
      }, 1500);
    });
  };

  // Загрузка данных
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchData(dateRange);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateRange]);

  // Компонент карточки метрики
  const MetricCard = ({ title, value, change }) => (
    <div>
      <h3>{title}</h3>
      <div>{loading ? 'Loading...' : value}</div>
      {change && (
        <div style={{ color: change >= 0 ? 'green' : 'red' }}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </div>
      )}
    </div>
  );

  MetricCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number,
    change: PropTypes.number
  };

  // Компонент графика
  const Chart = ({ data, loading }) => {
    if (loading) {
      return <div>Loading chart...</div>;
    }

    return (
      <div>
        <h3>Analytics Chart</h3>
        <div style={{ display: 'flex', alignItems: 'end', height: '200px' }}>
          {data?.map((value, index) => (
            <div 
              key={index}
              style={{ 
                flex: 1, 
                background: '#007bff', 
                height: `${value}px`,
                margin: '0 2px'
              }}
              aria-label={`Value: ${value}`}
            />
          ))}
        </div>
      </div>
    );
  };

  Chart.propTypes = {
    data: PropTypes.array,
    loading: PropTypes.bool
  };

  // Обработчик ошибок
  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={loadData}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <header>
        <h1>Analytics Dashboard</h1>
        <div>
          {['week', 'month', 'quarter'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              disabled={loading}
              aria-pressed={dateRange === range}
            >
              {range}
            </button>
          ))}
        </div>
      </header>

      <div>
        <MetricCard title="Users" value={data?.users} change={12.5} />
        <MetricCard title="Revenue" value={data?.revenue} change={8.3} />
        <MetricCard title="Sessions" value={data?.sessions} change={-2.1} />
      </div>

      <Chart data={data?.chartData} loading={loading} />
    </div>
  );
};

AnalyticsDashboard.propTypes = {
  // Компонент не принимает пропсы
};

export default AnalyticsDashboard;