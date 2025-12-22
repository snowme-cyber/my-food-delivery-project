/**
 * Абстрактная фабрика GUI.
 * Определяет интерфейс для создания семейства связанных объектов (Кнопок и Чекбоксов).
 * @abstract
 */
export default class GUIFactory {
    constructor() {
        if (new.target === GUIFactory) {
            throw new Error("Abstract class 'GUIFactory' cannot be instantiated directly.");
        }
    }

    /**
     * @abstract
     * @param {string} text
     * @param {Function} onClick
     * @returns {import('./Button.js').default}
     */
    createButton(text, onClick) {
        throw new Error("Method 'createButton' must be implemented.");
    }

    /**
     * @abstract
     * @param {string} label
     * @param {boolean} isChecked
     * @param {Function} onChange
     * @returns {import('./Checkbox.js').default}
     */
    createCheckbox(label, isChecked, onChange) {
        throw new Error("Method 'createCheckbox' must be implemented.");
    }
}
