function curry(fn) {
    // Возвращаем каррированную версию функции
    return function curried(...args) {
        // Если передано достаточное количество аргументов, вызываем исходную функцию
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            // Если недостаточно, возвращаем новую функцию, принимающую остальные аргументы
            return function(...nextArgs) {
                return curried.apply(this, args.concat(nextArgs));
            };
        }
    };
}

// Функция для приветствия
function greet(greeting, name, punctuation) {
    return `${greeting}, ${name}${punctuation}`;
}

// Каррируем функцию приветствия
const curriedGreet = curry(greet);

// Разные способы вызова
console.log(curriedGreet("Привет")("Иван")("!"));        // "Привет, Иван!"
console.log(curriedGreet("Здравствуйте", "Светлана")("!"));  // "Здравствуйте, Анна!"
console.log(curriedGreet("Добрый день")("Александр", "!"));   // "Добрый день, Петр!"