// Константы для настройки попита
const ROWS = 6;
const COLS = 6; 
const POP_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2615/2615-preview.mp3';
const VIBRATION_DURATION = 100; // Увеличил длительность вибрации до 100мс
const VIBRATION_PATTERN = [100, 50, 100]; // Паттерн вибрации: вибрация-пауза-вибрация

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

// Проверка поддержки вибрации более подробно
const hasVibrationSupport = 'vibrate' in navigator || 'mozVibrate' in navigator || 'webkitVibrate' in navigator;

// Полифилл для вибрации в разных браузерах
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || function(){};

// Тестовая функция активации вибрации при запуске (скрытая от пользователя)
function testVibration() {
    if (hasVibrationSupport) {
        try {
            // Короткая незаметная вибрация для "разблокировки" вибрации на устройстве
            navigator.vibrate(1);
            console.log('Тестовая вибрация выполнена');
        } catch (e) {
            console.error('Ошибка при тестировании вибрации:', e);
        }
    }
}

// Если вибрация не поддерживается, отключаем чекбокс
if (!hasVibrationSupport) {
    vibrationToggle.disabled = true;
    vibrationToggle.parentElement.style.opacity = '0.5';
    vibrationToggle.parentElement.title = 'Ваше устройство не поддерживает вибрацию';
} else {
    // Пробуем выполнить тестовую вибрацию
    testVibration();
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
        try {
            // Используем паттерн вибрации вместо одиночной
            navigator.vibrate(VIBRATION_PATTERN);
            console.log('Вибрация активирована:', VIBRATION_PATTERN);
            
            // Для некоторых устройств может потребоваться "форсированная" вибрация
            setTimeout(() => {
                if (vibrationEnabled) {
                    navigator.vibrate(0); // Сначала отменяем текущую вибрацию
                    navigator.vibrate(VIBRATION_DURATION * 2); // Затем запускаем более длительную
                }
            }, 50);
        } catch (error) {
            console.error('Ошибка при активации вибрации:', error);
        }
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
        
        // Принудительно вызываем вибрацию напрямую для тач-устройств
        if (vibrationEnabled && hasVibrationSupport) {
            // Пробуем несколько подходов для вибрации
            navigator.vibrate && navigator.vibrate(VIBRATION_PATTERN);
            window.navigator.vibrate && window.navigator.vibrate(VIBRATION_PATTERN);
            
            // Для iOS устройств (которые могут игнорировать первые вызовы)
            setTimeout(() => {
                navigator.vibrate && navigator.vibrate(VIBRATION_DURATION * 2);
            }, 10);
        }
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
document.addEventListener('DOMContentLoaded', function() {
    createPopit();
    
    // Добавляем обработчик для инициализации вибрации при первом взаимодействии
    document.body.addEventListener('click', function initVibration() {
        if (hasVibrationSupport) {
            // Первоначальная инициализация вибрации через пользовательское действие
            navigator.vibrate(1);
            console.log('Вибрация инициализирована после взаимодействия пользователя');
        }
        // Удаляем обработчик после первого использования
        document.body.removeEventListener('click', initVibration);
    }, { once: true });
    
    // Аналогично для тач-событий
    document.body.addEventListener('touchstart', function initVibration() {
        if (hasVibrationSupport) {
            navigator.vibrate(1);
            console.log('Вибрация инициализирована после тач-взаимодействия пользователя');
        }
        document.body.removeEventListener('touchstart', initVibration);
    }, { once: true });
}); 