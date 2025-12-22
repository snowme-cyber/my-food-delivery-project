import VisualComponent from '../patterns/structural/decorator/Component.js';

export default class CategoryWidget extends VisualComponent {
    /**
     * @param {Function} onSelectCategory - коллбек (categoryId) => void
     */
    constructor(onSelectCategory) {
        super();
        this.onSelectCategory = onSelectCategory;
        // Хардкод категорий для соответствия data.sql (в реальном проекте можно грузить с API)
        this.categories = [
            { id: null, name: 'Все', icon: '🍽️' }, // null = показать всё
            { id: 1, name: 'Пицца', icon: '🍕' },
            { id: 2, name: 'Бургеры', icon: '🍔' },
            { id: 3, name: 'Закуски', icon: '🍟' },
            { id: 4, name: 'Суши', icon: '🍣' },
            { id: 5, name: 'Салаты', icon: '🥗' },
            { id: 6, name: 'Супы', icon: '🍲' },
            { id: 7, name: 'Паста', icon: '🍝' }, 
            { id: 8, name: 'Горячее', icon: '🍖' },
            { id: 9, name: 'Десерты', icon: '🍰' },
            { id: 10, name: 'Напитки', icon: '🥤' }
        ];
        this.activeId = null;
    }

    render() {
        // Главная обертка
        const wrapper = document.createElement('div');
        wrapper.className = 'categories-wrapper';
        wrapper.style.cssText = 'position: relative; display: flex; align-items: center; margin-bottom: 20px;';

        // Кнопка ВЛЕВО
        const btnLeft = document.createElement('button');
        btnLeft.innerHTML = '‹';
        btnLeft.className = 'cat-scroll-btn';
        btnLeft.onclick = () => {
            container.scrollBy({ left: -200, behavior: 'smooth' });
        };

        // Контейнер с категориями (скрываем скроллбар CSS-ом, но скролл остается)
        const container = document.createElement('div');
        container.className = 'categories-container';
        // Важно: стили для скрытия скроллбара должны быть в CSS, здесь базовая логика
        container.style.cssText = 'display: flex; gap: 10px; overflow-x: auto; scroll-behavior: smooth; width: 100%; -ms-overflow-style: none; scrollbar-width: none;';

        this.categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `category-chip ${this.activeId === cat.id ? 'active' : ''}`;
            btn.innerHTML = `<span>${cat.icon}</span> ${cat.name}`;
            
            btn.onclick = () => {
                container.querySelectorAll('.category-chip').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeId = cat.id;
                this.onSelectCategory(cat.id);
            };
            container.appendChild(btn);
        });

        // Кнопка ВПРАВО
        const btnRight = document.createElement('button');
        btnRight.innerHTML = '›';
        btnRight.className = 'cat-scroll-btn';
        btnRight.onclick = () => {
            container.scrollBy({ left: 200, behavior: 'smooth' });
        };

        wrapper.appendChild(btnLeft);
        wrapper.appendChild(container);
        wrapper.appendChild(btnRight);

        return wrapper;
    }
}