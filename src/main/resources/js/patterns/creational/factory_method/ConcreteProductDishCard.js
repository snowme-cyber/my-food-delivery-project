import Product from './Product.js';
import CartService from '../../../services/CartService.js';
import DishDetailModal from '../../../components/DishDetailModal.js';
import NotificationService from '../../../services/NotificationService.js';

export default class ConcreteProductDishCard extends Product {
    constructor(dish) {
        super();
        this.dish = dish;
        this.cartService = new CartService();
    }

    render() {
        const card = document.createElement('div');
        card.className = 'dish-card';
        
        const isAvail = this.dish.isAvailable;
        
        const opacityStyle = isAvail ? '' : 'filter: grayscale(100%); opacity: 0.9;';
        const buttonText = isAvail ? 'В корзину' : 'Стоп-лист';

        
        // --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
        // Было #F5F4F2 (серый), стало #FCE000 (ЖЕЛТЫЙ)
        const buttonStyle = isAvail 
            ? 'background: #FCE000; color: #21201F;' 
            : 'background: #e0e0e0; color: #555; cursor: not-allowed;';
        // -------------------------

        card.style.cssText = `
            ${opacityStyle}
            position: relative;
            background: #fff; border-radius: 16px; overflow: hidden;
            box-shadow: 0 4px 24px rgba(0,0,0,0.06); transition: transform 0.2s;
            display: flex; flex-direction: column; height: 100%; 
            cursor: pointer;
            pointer-events: auto !important;
        `;

        card.addEventListener('click', (e) => {
            if (e.target.closest('.add-btn')) return;
            DishDetailModal.open(this.dish);
        });

        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'dish-image-wrapper';
        imgWrapper.style.cssText = 'height: 200px; overflow: hidden; position: relative;';
        
        const img = document.createElement('img');
        img.src = this.dish.image;
        img.onerror = () => { img.src = 'https://via.placeholder.com/300?text=No+Image'; };
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; transition: 0.3s;';
        
        if (!isAvail) {
            const overlay = document.createElement('div');
            overlay.innerHTML = 'НЕТ В НАЛИЧИИ';
            overlay.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.6); display:flex; justify-content:center; align-items:center; font-weight:800; color:#555; z-index:2; pointer-events: none;';
            imgWrapper.appendChild(overlay);
        }
        imgWrapper.appendChild(img);

        const content = document.createElement('div');
        content.style.padding = '16px';
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        content.style.flex = '1';

        const title = document.createElement('h3');
        title.innerText = this.dish.name;
        title.style.marginBottom = '4px';
        title.style.fontSize = '16px';

        const desc = document.createElement('p');
        desc.innerText = this.dish.description;
        desc.style.cssText = 'font-size: 13px; color: #9E9B98; margin-bottom: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';

        const footer = document.createElement('div');
        footer.style.marginTop = 'auto';
        footer.style.display = 'flex';
        footer.style.justifyContent = 'space-between';
        footer.style.alignItems = 'center';

        const price = document.createElement('div');
        price.innerText = this.dish.getFormattedPrice();
        price.style.cssText = 'font-weight: 700; font-size: 18px;';

        const btn = document.createElement('button');
        btn.className = 'add-btn';
        btn.innerHTML = buttonText;
        btn.style.cssText = `
            padding: 10px 20px; border: none;
            border-radius: 12px; font-weight: 600; 
            transition: 0.2s; ${buttonStyle}
            z-index: 10; position: relative;
        `;
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (!isAvail) {
                NotificationService.show('Блюдо временно недоступно', 'error');
                return;
            }

            this.cartService.addToCart(this.dish);
            
            // Анимация успешного добавления (зеленый -> желтый)
            const original = btn.innerHTML;
            btn.innerText = 'Добавлено';
            btn.style.background = '#2ecc71'; // Зеленый
            btn.style.color = '#fff';
            setTimeout(() => { 
                btn.innerHTML = original; 
                btn.style.background = '#FCE000'; // Возвращаем Желтый
                btn.style.color = '#21201F';
            }, 800);
        });

        footer.appendChild(price);
        footer.appendChild(btn);
        content.appendChild(title);
        content.appendChild(desc);
        content.appendChild(footer);
        card.appendChild(imgWrapper);
        card.appendChild(content);

        card.onmouseenter = () => img.style.transform = 'scale(1.05)';
        card.onmouseleave = () => img.style.transform = 'scale(1)';

        return card;
    }
}