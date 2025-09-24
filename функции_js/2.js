function memoize(fn) {
    // Кэш для хранения результатов вычислений
    // Ключ - строка аргументов, значение - результат вызова функции
    const cache = new Map();
    
    return function(...args) {
        // Создаем ключ для кэша на основе аргументов
        // Используем JSON.stringify для работы с любыми типами аргументов
        const key = JSON.stringify(args);
        
        // Если результат уже есть в кэше, возвращаем его
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        // Если результата нет в кэше, вычисляем и сохраняем
        const result = fn.apply(this, args);
        cache.set(key, result);
        
        return result;
    };
}

// Пример использования
function expensiveCalculation(n) {
    console.log("Calculating for", n);
    return n * 3;
}

const memoizedCalculation = memoize(expensiveCalculation);
console.log(memoizedCalculation(7));  // "Calculating for 7", 21
console.log(memoizedCalculation(7));  // 21 (без повторного вычисления)
console.log(memoizedCalculation(11)); // "Calculating for 11", 33
console.log(memoizedCalculation(11)); // 33 (без повторного вычисления)