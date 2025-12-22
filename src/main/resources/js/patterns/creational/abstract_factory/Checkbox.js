import VisualComponent from '../../structural/decorator/Component.js';

/**
 * Абстрактный продукт B: Чекбокс
 * @abstract
 */
export default class Checkbox extends VisualComponent {
    constructor(label, isChecked = false, onChange) {
        super();
        if (new.target === Checkbox) {
            throw new Error("Abstract class 'Checkbox' cannot be instantiated directly.");
        }
        this.label = label;
        this.isChecked = isChecked;
        this.onChange = onChange;
    }

    /**
     * @abstract
     * @returns {HTMLElement}
     */
    render() {
        throw new Error("Method 'render()' must be implemented.");
    }
}
