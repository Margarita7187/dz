async function processDataAsync(data, processorFn, options = {}) {
  const { concurrency = 1, retryAttempts = 0 } = options;
  const results = [];
  const stats = {
    successful: 0,
    failed: 0,
    total: data.length
  };
  
  let currentIndex = 0;
  let isPaused = false;
  
  // Функции для контроля выполнения
  const pause = () => isPaused = true;
  const resume = () => isPaused = false;
  
  async function processItem() {
    while (currentIndex < data.length) {
      // Если пауза - ждем и проверяем снова
      if (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
        continue;
      }
      
      const index = currentIndex++;
      const item = data[index];
      
      let lastError;
      let success = false;
      
      // Попытки выполнения с повторениями
      for (let attempt = 0; attempt <= retryAttempts; attempt++) {
        try {
          results[index] = await processorFn(item, index);
          success = true;
          stats.successful++;
          break;
        } catch (error) {
          lastError = error;
          // Если есть еще попытки - ждем перед повторением
          if (attempt < retryAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          }
        }
      }
      
      // Если все попытки неудачны - сохраняем ошибку
      if (!success) {
        results[index] = { error: lastError };
        stats.failed++;
      }
    }
  }
  
  // Запускаем несколько обработчиков параллельно
  const workers = Array(concurrency).fill().map(() => processItem());
  await Promise.all(workers);
  
  return {
    results,
    stats,
    controls: { pause, resume }
  };
}

// Пример использования processDataAsync
const results = await processDataAsync(
  [1, 2, 3, 4, 5], 
  async (num) => { 
    await new Promise(resolve => setTimeout(resolve, 100));
    return num * 2; 
  },
  {concurrency: 2, retryAttempts: 3}
);