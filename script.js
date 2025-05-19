// Константы для настройки попита
const ROWS = 8;
const COLS = 8; 
const POP_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2615/2615-preview.mp3';
const VIBRATION_DURATION = 50; // Длительность вибрации в миллисекундах

// Настройки звука и вибрации
let soundEnabled = true;
let vibrationEnabled = true;
let volumeLevel = 0.3; // Начальная громкость 30%

// Создаем звуковой эффект
const popSound = new Audio(POP_SOUND_URL);
popSound.volume = volumeLevel;

// Получаем элементы DOM
const popitContainer = document.getElementById('popit');
const resetButton = document.getElementById('reset-button');
const colorButtons = document.querySelectorAll('.color-btn');
const volumeSlider = document.getElementById('volume-slider');
const volumeValue = document.getElementById('volume-value');
const soundToggle = document.getElementById('sound-toggle');
const vibrationToggle = document.getElementById('vibration-toggle');

// Проверка поддержки вибрации
const hasVibrationSupport = 'vibrate' in navigator;

// Если вибрация не поддерживается, отключаем чекбокс
if (!hasVibrationSupport) {
    vibrationToggle.disabled = true;
    vibrationToggle.parentElement.style.opacity = '0.5';
    vibrationToggle.parentElement.title = 'Ваше устройство не поддерживает вибрацию';
}

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

// Обработчик изменения громкости
volumeSlider.addEventListener('input', function() {
    volumeLevel = this.value / 100;
    volumeValue.textContent = `${this.value}%`;
    popSound.volume = volumeLevel;
});

// Обработчики переключателей
soundToggle.addEventListener('change', function() {
    soundEnabled = this.checked;
});

vibrationToggle.addEventListener('change', function() {
    vibrationEnabled = this.checked;
});

// Функция для активации вибрации
function triggerVibration() {
    if (vibrationEnabled && hasVibrationSupport) {
        navigator.vibrate(VIBRATION_DURATION);
    }
}

// Функция для воспроизведения звука
function playSound() {
    if (soundEnabled) {
        const soundClone = popSound.cloneNode();
        soundClone.volume = volumeLevel;
        soundClone.play().catch(err => {
            console.log('Звук не может быть воспроизведен автоматически:', err);
        });
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
        playSound();
        
        // Вибрация для мобильных устройств
        triggerVibration();
    }
});

// Добавляем обработчик тач-событий для мобильных устройств
popitContainer.addEventListener('touchstart', (event) => {
    // Предотвращаем стандартное поведение (скролл, зум и т.д.)
    event.preventDefault();
    
    // Получаем элемент, на который нажал пользователь
    const target = document.elementFromPoint(
        event.touches[0].clientX,
        event.touches[0].clientY
    );
    
    // Проверяем, что нажатие было на пузырек
    if (target && target.classList.contains('bubble') && !target.classList.contains('pressed')) {
        target.classList.add('pressed');
        playSound();
        triggerVibration();
    }
}, { passive: false });

// Обработчик кнопки сброса
resetButton.addEventListener('click', () => {
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach(bubble => {
        bubble.classList.remove('pressed');
    });
    
    // Вибрация при сбросе для обратной связи
    triggerVibration();
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
        
        // Вибрация при смене цвета для обратной связи
        triggerVibration();
    }
});

// Инициализация попита при загрузке страницы
document.addEventListener('DOMContentLoaded', createPopit); 