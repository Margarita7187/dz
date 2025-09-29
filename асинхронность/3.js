class AsyncPipeline {
  constructor() {
    this.steps = []; // Массив для хранения шагов пайплайна
  }
  
  // Добавление шага в пайплайн
  addStep(stepFn) {
    this.steps.push(stepFn);
    return this; // Возвращаем this для цепочки вызовов
  }
  
  async execute(input) {
    let result = input;
    
    // Последовательно выполняем все шаги
    for (const step of this.steps) {
      result = await step(result); // Передаем результат предыдущего шага
    }
    
    return result;
  }
  
  // Параллельное выполнение нескольких пайплайнов
  static async parallel(pipelines) {
    const results = await Promise.all(
      pipelines.map(pipeline => pipeline.execute())
    );
    return results;
  }
}

// Пример использования AsyncPipeline
const pipeline = new AsyncPipeline()
  .addStep(async (data) => data.filter(x => x > 0))     // Фильтруем положительные числа
  .addStep(async (data) => data.map(x => x * 2))        // Умножаем на 2
  .addStep(async (data) => data.reduce((a, b) => a + b, 0)); // Суммируем

const result = await pipeline.execute([-1, 2, -3, 4, 5]);
console.log(result); // 22 (2+4+5 = 11, ×2 = 22)