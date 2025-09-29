class AdvancedPromise {
  static async retry(promiseFn, maxAttempts = 3, delay = 1000) {
    let lastError;
    
    // Пробуем выполнить операцию несколько раз
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await promiseFn();
      } catch (error) {
        lastError = error;
        // Если остались попытки - ждем с экспоненциальной задержкой
        if (attempt < maxAttempts) {
          const currentDelay = delay * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, currentDelay));
        }
      }
    }
    
    throw lastError; // Все попытки исчерпаны - бросаем последнюю ошибку
  }

  static timeout(promise, ms) {
    // Создаем промис, который отвергнется через указанное время
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms);
    });
    
    // Гонка между основным промисом и таймаутом
    return Promise.race([promise, timeoutPromise]);
  }

  static async queue(tasks, concurrency = 1) {
    const results = [];
    let currentIndex = 0;
    
    // Функция-обработчик для каждого воркера
    async function processBatch() {
      while (currentIndex < tasks.length) {
        const taskIndex = currentIndex++;
        try {
          results[taskIndex] = await tasks[taskIndex]();
        } catch (error) {
          results[taskIndex] = error;
        }
      }
    }
    
    // Запускаем несколько воркеров параллельно
    const workers = Array(concurrency).fill().map(() => processBatch());
    await Promise.all(workers);
    return results;
  }
}

// Пример использования AdvancedPromise
AdvancedPromise.retry(
  () => fetch('https://api.example.com/data'),
  3,
  1000
).then(console.log).catch(console.error);