/**
 * VisualComponent - базовый абстрактный класс.
 * @abstract
 */
export default class VisualComponent {
    constructor() {
        if (new.target === VisualComponent) {
            throw new Error("Cannot instantiate abstract class VisualComponent");
        }
    }

    /**
     * @abstract
     * @returns {HTMLElement}
     */
    render() {
        throw new Error("Method 'render()' implementation required");
    }
}