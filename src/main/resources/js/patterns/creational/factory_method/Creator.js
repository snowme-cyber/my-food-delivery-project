import Product from './Product.js';

/**
 * Абстрактный класс Creator.
 * @abstract
 */
export default class Creator {
    constructor() {
        if (new.target === Creator) {
            throw new Error("Abstract class 'Creator' cannot be instantiated directly.");
        }
    }

    /**
     * Фабричный метод.
     * @abstract
     * @param {Object} data 
     * @returns {Product}
     */
    createProduct(data) {
        throw new Error("Method 'createProduct()' must be implemented.");
    }

    /**
     * Бизнес-логика, работающая с абстрактным продуктом.
     */
    renderOperation(data, containerId) {
        const product = this.createProduct(data);
        
        // Проверка "Утиная типизация" (на всякий случай, для надежности)
        if (!(product instanceof Product)) {
             throw new Error("Creator must create an instance of Product class");
        }
        
        product.mount(containerId);
    }
}