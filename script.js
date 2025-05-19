// Константы для настройки попита
const ROWS = 8;
const COLS = 8; 
const POP_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2615/2615-preview.mp3';

// Создаем звуковой эффект
const popSound = new Audio(POP_SOUND_URL);
popSound.volume = 0.3;

// Получаем элементы DOM
const popitContainer = document.getElementById('popit');
const resetButton = document.getElementById('reset-button');
const colorButtons = document.querySelectorAll('.color-btn');

// Функция для создания попита
function createPopit() {
    // Очищаем контейнер перед добавлением новых элементов
    popitContainer.innerHTML = '';
    
    // Создаем пузырьки попита
    for (let i = 0; i < ROWS * COLS; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.dataset.index = i;
        popitContainer.appendChild(bubble);
    }
}

// Обработчик нажатия на попит (делегирование событий)
popitContainer.addEventListener('click', (event) => {
    // Проверяем, что клик был именно по пузырьку попита
    if (event.target.classList.contains('bubble')) {
        // Если пузырек уже нажат, ничего не делаем
        if (event.target.classList.contains('pressed')) {
            return;
        }
        
        // Добавляем класс "pressed" для стилизации нажатого пузырька
        event.target.classList.add('pressed');
        
        // Проигрываем звук
        // Клонируем звук для возможности одновременного воспроизведения
        const soundClone = popSound.cloneNode();
        soundClone.play().catch(err => {
            // Обрабатываем ошибку для браузеров, которые блокируют автовоспроизведение
            console.log('Звук не может быть воспроизведен автоматически:', err);
        });
    }
});

// Обработчик кнопки сброса
resetButton.addEventListener('click', () => {
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach(bubble => {
        bubble.classList.remove('pressed');
    });
});

// Обработчики кнопок выбора цвета (делегирование через родительский элемент)
document.querySelector('.color-picker').addEventListener('click', (event) => {
    if (event.target.classList.contains('color-btn')) {
        const color = event.target.dataset.color;
        
        // Удаляем все классы цветов
        popitContainer.classList.remove('blue', 'pink', 'green');
        
        // Устанавливаем выбранный цвет
        if (color !== 'blue') { // 'blue' - это класс по умолчанию
            popitContainer.classList.add(color);
        }
    }
});

// Инициализация попита при загрузке страницы
document.addEventListener('DOMContentLoaded', createPopit); 