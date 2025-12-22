import VisualComponent from '../../structural/decorator/Component.js';

// Product теперь тоже является Визуальным Компонентом!
export default class Product extends VisualComponent {
    // constructor и render наследуются или переопределяются
    
    constructor() {
        super();
        if (new.target === Product) {
            throw new Error("Abstract class 'Product' cannot be instantiated directly.");
        }
    }

    /**
     * @abstract
     * @returns {HTMLElement}
     */
    render() {
        throw new Error("Method 'render()' must be implemented in concrete product.");
    }

    /**
     * Общий метод для всех продуктов (не требует переопределения, но можно)
     */
    mount(parentId) {
        const parent = document.getElementById(parentId);
        if (parent) {
            parent.appendChild(this.render());
        } else {
            console.error(`Container #${parentId} not found`);
        }
    }
}
