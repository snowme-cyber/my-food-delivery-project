import VisualComponent from '../patterns/structural/decorator/Component.js';

export default class SettingsPanel extends VisualComponent {
    /**
     * @param {import('../patterns/creational/abstract_factory/GUIFactory.js').default} guiFactory 
     * @param {Function} onThemeToggle 
     */
    constructor(guiFactory, onThemeToggle) {
        super();
        this.factory = guiFactory;
        this.onThemeToggle = onThemeToggle;
        this.container = null;
    }

    // Метод для обновления фабрики "на лету" (при переключении темы)
    updateFactory(newFactory) {
        this.factory = newFactory;
        this.reRender();
    }

    reRender() {
        if (this.container) {
            this.container.innerHTML = ''; // Очистка
            this.container.appendChild(this._buildContent());
        }
    }

    render() {
        this.container = document.createElement('div');
        this.container.className = 'settings-panel';
        this.container.style.padding = '20px';
        this.container.style.borderBottom = '1px solid #ccc';
        
        this.container.appendChild(this._buildContent());
        return this.container;
    }

    /**
     * Внутренний метод сборки контента.
     * Именно здесь мы используем Фабрику!
     */
    _buildContent() {
        const wrapper = document.createDocumentFragment();

        const title = document.createElement('h3');
        title.textContent = 'Настройки интерфейса';
        title.style.marginBottom = '16px';
        wrapper.appendChild(title);

        const controlsRow = document.createElement('div');
        controlsRow.style.display = 'flex';
        controlsRow.style.gap = '16px';
        controlsRow.style.alignItems = 'center';

        // 1. Создаем Чекбокс через фабрику (Абстракция!)
        const checkbox = this.factory.createCheckbox(
            'Только веганское', 
            false, 
            (checked) => console.log('Filter changed:', checked)
        );

        // 2. Создаем Кнопку переключения темы через фабрику (Абстракция!)
        const themeButton = this.factory.createButton(
            'Переключить тему 🌗', 
            () => this.onThemeToggle()
        );

        controlsRow.appendChild(checkbox.render());
        controlsRow.appendChild(themeButton.render());
        
        wrapper.appendChild(controlsRow);
        return wrapper;
    }
}
