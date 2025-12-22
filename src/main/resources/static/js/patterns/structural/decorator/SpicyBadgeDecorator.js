import Decorator from './Decorator.js';

export default class SpicyBadgeDecorator extends Decorator {
    constructor(component) {
        super(component);
    }

    render() {
        // 1. Получаем DOM элемент от оригинальной карточки
        const cardElement = super.render();

        // 2. Создаем бейдж (Стиль Яндекс Еды: маленький кружок или плашка)
        const badge = document.createElement('div');
        badge.className = 'badge-spicy';
        badge.innerHTML = '🌶️'; // Можно заменить на SVG иконку
        
        // 3. Добавляем стили бейджа (или выносим в CSS)
        // Логика: находим контейнер картинки и вставляем туда бейдж
        const imageWrapper = cardElement.querySelector('.dish-image-wrapper');
        if (imageWrapper) {
            imageWrapper.style.position = 'relative'; // Важно для позиционирования
            imageWrapper.appendChild(badge);
        }

        return cardElement;
    }
}