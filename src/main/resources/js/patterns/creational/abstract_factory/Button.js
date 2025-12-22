import VisualComponent from '../../structural/decorator/Component.js';

/**
 * Абстрактный продукт A: Кнопка
 * @abstract
 */
export default class Button extends VisualComponent {
    constructor(text, onClick) {
        super();
        if (new.target === Button) {
            throw new Error("Abstract class 'Button' cannot be instantiated directly.");
        }
        this.text = text;
        this.onClick = onClick;
    }

    /**
     * @abstract
     * @returns {HTMLElement}
     */
    render() {
        throw new Error("Method 'render()' must be implemented.");
    }
}
