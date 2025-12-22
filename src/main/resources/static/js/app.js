import ApiClient from './core/ApiClient.js';
import DishCardCreator from './patterns/creational/factory_method/DishCardCreator.js';
import BackendAdapter from './patterns/structural/adapter/BackendAdapter.js';
import SpicyBadgeDecorator from './patterns/structural/decorator/SpicyBadgeDecorator.js';
import CartService from './services/CartService.js';
import CartWidget from './components/CartWidget.js';
import CartSidebar from './components/CartSidebar.js';
import HeaderAuthWidget from './components/HeaderAuthWidget.js';
import AuthService from './services/AuthService.js';
import SearchBar from './components/SearchBar.js';
import CategoryWidget from './components/CategoryWidget.js';

class App {
    constructor() {
        this.api = new ApiClient();
        this.creator = new DishCardCreator();
        this.adapter = new BackendAdapter();
        this.cartService = new CartService();
        this.authService = new AuthService();

        this._initHeader();
        this._initCartUI();
        this._initCategories();
        
        // Загрузка всех блюд по умолчанию
        this.loadMenuData('/menu');
    }
    
    _initHeader() {
        let header = document.getElementById('main-header');
        
        // Если хедера нет в HTML, создаем его
        if (!header) {
            header = document.createElement('header');
            header.id = 'main-header';
            header.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100;";
            document.body.prepend(header);
        }

        // 1. Логотип (если нет)
        if (!header.querySelector('.logo')) {
            const logo = document.createElement('div');
            logo.className = 'logo';
            logo.innerHTML = '<span style="font-size: 24px; font-weight: 800; cursor:pointer; color:#333"><span style="color: #FCE000;">🍕</span> YummyFood</span>';
            logo.onclick = () => window.location.href = '/';
            header.prepend(logo);
        }

        // 2. ПОИСК (Центральная секция)
        // Проверяем, есть ли уже поиск, чтобы не дублировать
        if (!header.querySelector('.header-center-section')) {
            const centerSection = document.createElement('div');
            centerSection.className = 'header-center-section';
            
            const searchBar = new SearchBar((query) => {
                if (query.trim().length > 0) {
                    this.loadMenuData(`/menu/search?query=${encodeURIComponent(query)}`);
                } else {
                    this.loadMenuData('/menu');
                }
            });
            
            centerSection.appendChild(searchBar.render());
            
            // Вставляем поиск ПОСЛЕ логотипа
            const logo = header.querySelector('.logo');
            logo.after(centerSection);
        }

        // 3. Правая часть (Корзина и Вход)
        let rightSection = header.querySelector('.header-right-section');
        if (!rightSection) {
            rightSection = document.createElement('div');
            rightSection.className = 'header-right-section';
            rightSection.style.cssText = "display: flex; gap: 20px; align-items: center;";
            header.appendChild(rightSection);
        }
        
        if (!document.getElementById('header-auth-container')) {
             const authContainer = document.createElement('div');
             authContainer.id = 'header-auth-container';
             rightSection.appendChild(authContainer);
        }

        if (!document.getElementById('header-cart-container')) {
            const cartContainer = document.createElement('div');
            cartContainer.id = 'header-cart-container';
            rightSection.appendChild(cartContainer);
        }
        
        this.authWidget = new HeaderAuthWidget('header-auth-container');
    }

    _initCategories() {
        const dishesContainer = document.getElementById('dishes-container');
        if (dishesContainer) {
            // Проверяем, не добавлены ли уже категории
            if (document.querySelector('.categories-container')) return;

            const categoryWidget = new CategoryWidget((catId) => {
                if (catId) {
                    this.loadMenuData(`/menu/category/${catId}`);
                } else {
                    this.loadMenuData('/menu');
                }
            });
            
            dishesContainer.parentNode.insertBefore(categoryWidget.render(), dishesContainer);
        }
    }

    _initCartUI() {
        this.cartWidget = new CartWidget('header-cart-container');
        this.cartSidebar = new CartSidebar();
        this.cartService.subscribe(this.cartWidget);
        this.cartService.subscribe(this.cartSidebar);
    }

    async loadMenuData(endpoint) {
        const container = document.getElementById('dishes-container');
        if (!container) return;

        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; font-size: 18px;">⏳ Загружаем меню...</div>';

        try {
            const serverResponse = await this.api.get(endpoint);
            
            container.innerHTML = ''; 

            if (!serverResponse || serverResponse.length === 0) {
                container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; font-size: 18px;">😔 Ничего не найдено</div>';
                return;
            }

            serverResponse.forEach(rawData => {
                const dishModel = this.adapter.mapToDish(rawData);
                let dishCardComponent = this.creator.createProduct(dishModel);

                if (dishModel.tags.includes('spicy')) {
                    dishCardComponent = new SpicyBadgeDecorator(dishCardComponent);
                }
                
                // Проверка на заглушку картинки
                const cardNode = dishCardComponent.render();
                const img = cardNode.querySelector('img');
                if (img) {
                    img.onerror = () => { img.src = 'https://via.placeholder.com/300?text=No+Image'; };
                }

                container.appendChild(cardNode);
            });

        } catch (error) {
            console.error("Ошибка загрузки:", error);
            container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: red;">Ошибка сервера: ${error.message}</div>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});