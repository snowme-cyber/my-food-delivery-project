import VisualComponent from '../patterns/structural/decorator/Component.js';
import CartService from '../services/CartService.js';
import NotificationService from '../services/NotificationService.js';

export default class DishDetailModal extends VisualComponent {
    /**
     * @param {import('../domain/Dish.js').default} dish 
     */
    static open(dish) {
        const existing = document.querySelector('.dish-modal-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'auth-overlay visible dish-modal-overlay';
        
        const rating = (Math.random() * (5.0 - 4.5) + 4.5).toFixed(1);
        const reviews = Math.floor(Math.random() * 200) + 10;

         // ПРОВЕРКА СТАТУСА (Теперь dish.isAvailable точно есть благодаря ШАГУ 2)
        const isAvail = (dish.isAvailable !== false);

        // Меняем цвета в зависимости от статуса
         // Цвета и текст
        const btnBg = isAvail ? '#FCE000' : '#e0e0e0';
        const btnText = isAvail ? 'В корзину' : 'Временно нет в наличии';
        const btnCursor = isAvail ? 'pointer' : 'not-allowed';
        const btnColor = isAvail ? '#21201F' : '#999';
        // ----------------------

        overlay.innerHTML = `
            <div class="auth-modal visible dish-detail-modal" onclick="event.stopPropagation()" 
                 style="max-width: 900px; width: 90%; padding: 0; overflow: hidden; border-radius: 24px;"> 
                 
                <button class="auth-close" style="z-index: 10; background: white; border-radius: 50%; width: 32px; height: 32px; top: 15px; right: 15px; position: absolute; box-shadow: 0 2px 10px rgba(0,0,0,0.1); cursor: pointer;">&times;</button>
                
                <div class="dish-modal-content" style="display: flex;">

                    <div class="dish-modal-image" style="width: 50%; position: relative; overflow: hidden; background: #f0f0f0;">
                        <img src="${dish.image}" alt="${dish.name}" 
                             style="width: 100%; height: 100%; object-fit: cover; object-position: center top; transform: scale(1.15); transform-origin: top center;">
                        
                        ${dish.tags.includes('spicy') ? '<div class="badge-spicy" style="position: absolute; top: 20px; left: 20px; z-index: 5;">🌶️ Острое</div>' : ''}
                        
                        ${!isAvail ? '<div style="position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(0,0,0,0.6); color: white; text-align: center; padding: 10px; font-weight: bold;">СТОП-ЛИСТ</div>' : ''}
                    </div>

                    <div class="dish-modal-info" style="width: 50%; padding: 40px; display: flex; flex-direction: column; overflow-y: auto;">
                        <h2 class="dish-modal-title" style="font-size: 28px; margin-bottom: 10px; margin-top: 0;">${dish.name}</h2>
                        
                        <div class="dish-meta" style="margin-bottom: 20px; color: #888;">
                            <span class="star-rating" style="color: orange; font-weight: bold;">★ ${rating}</span>
                            <span class="review-count">(${reviews} оценок)</span>
                        </div>

                        <div class="dish-description" style="font-size: 16px; line-height: 1.5; flex-grow: 1; color: #555;">
                            ${dish.description || 'Описание отсутствует.'}
                        </div>

                        <div class="dish-modal-footer" style="margin-top: 30px;">
                            <div class="dish-modal-price" style="font-size: 24px; font-weight: bold; margin-bottom: 15px;">${dish.getFormattedPrice()}</div>
                            
                            <!-- КНОПКА ТЕПЕРЬ ЗАВИСИТ ОТ STATUS -->
                            <button class="add-to-cart-big-btn" 
                                style="width: 100%; padding: 16px; background: ${btnBg}; color: ${btnColor}; border: none; border-radius: 16px; font-size: 16px; font-weight: 600; cursor: ${btnCursor}; transition: 0.2s;">
                                ${btnText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const close = () => overlay.remove();
        overlay.onclick = close;
        overlay.querySelector('.auth-close').onclick = close;

        // ЛОГИКА КЛИКА ПО КНОПКЕ
        const btn = overlay.querySelector('.add-to-cart-big-btn');

        btn.onclick = () => {
            // ПРОВЕРКА ПРИ КЛИКЕ
            if (!isAvail) {
                NotificationService.show('Блюдо недоступно для заказа', 'error');
                
                // Анимация тряски для визуального отказа
                btn.style.transform = 'translateX(5px)';
                setTimeout(() => btn.style.transform = 'translateX(-5px)', 100);
                setTimeout(() => btn.style.transform = 'translateX(0)', 200);
                return;
            }


            // Если доступно - добавляем
            CartService.instance.addToCart(dish);
            
            const originalText = btn.innerText;
            const originalBg = btn.style.background;

            btn.innerText = 'Добавлено! ✅';
            btn.style.background = '#2ecc71';
            btn.style.color = 'white';
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = originalBg;
                btn.style.color = '#21201F';
            }, 1000);
        };
    }
}