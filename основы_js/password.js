function generatePassword(length, options = {}) {
    // Проверка длины
    if (typeof length !== 'number' || length <= 0 || !Number.isInteger(length)) {
        throw new Error('Длина должна быть положительным целым числом');
    }
    
    // Настройки по умолчанию
    const settings = {
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        ...options
    };
    
    // Наборы символов
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Собираем доступные символы
    let allChars = '';
    if (settings.uppercase) allChars += uppercase;
    if (settings.lowercase) allChars += lowercase;
    if (settings.numbers) allChars += numbers;
    if (settings.symbols) allChars += symbols;
    
    // Проверяем что есть хотя бы один тип символов
    if (allChars.length === 0) {
        throw new Error('Нужно выбрать хотя бы один тип символов');
    }
    
    // Генерируем пароль
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars[randomIndex];
    }
    
    return password;
}

// Примеры использования
console.log(generatePassword(12)); // Все типы символов
console.log(generatePassword(8, { symbols: false, numbers: false })); // Только буквы
console.log(generatePassword(10, { uppercase: false, lowercase: false })); // Только цифры и символы