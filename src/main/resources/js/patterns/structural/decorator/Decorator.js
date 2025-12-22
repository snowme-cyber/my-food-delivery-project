import VisualComponent from './Component.js';

/**
 * Базовый Декоратор.
 * Наследуется от Компонента, но внутри содержит ссылку на другой Компонент.
 */
export default class Decorator extends VisualComponent {
    /**
     * @param {VisualComponent} component 
     */
    constructor(component) {
        super(); // Вызов конструктора родителя (VisualComponent)
        // В JS нет типов, но мы ожидаем, что component имеет метод render
        this.component = component; 
    }

    render() {
        return this.component.render();
    }
}