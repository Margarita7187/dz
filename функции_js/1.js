function createCounter() {
    // Приватная переменная счетчика, недоступная извне
    let count = 5;
    
    // Возвращаем объект с методами для работы со счетчиком
    return {
        increment: function() {
            count++;
            return count;
        },
        decrement: function() {
            count--;
            return count;
        },
        getValue: function() {
            return count;
        }
    };
}

const counter = createCounter();
console.log(counter.getValue());
console.log(counter.increment());
console.log(counter.increment());
console.log(counter.decrement());