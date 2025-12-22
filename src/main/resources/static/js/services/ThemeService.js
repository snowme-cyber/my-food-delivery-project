import LightThemeFactory from '../patterns/creational/abstract_factory/LightThemeFactory.js';
import DarkThemeFactory from '../patterns/creational/abstract_factory/DarkThemeFactory.js';

export default class ThemeService {
    constructor() {
        this.currentFactory = new LightThemeFactory(); // По умолчанию светлая
        this.isDark = false;
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        
        if (this.isDark) {
            this.currentFactory = new DarkThemeFactory();
            this._applyGlobalDarkStyles();
        } else {
            this.currentFactory = new LightThemeFactory();
            this._applyGlobalLightStyles();
        }

        return this.currentFactory;
    }

    getFactory() {
        return this.currentFactory;
    }

    _applyGlobalLightStyles() {
        document.body.style.backgroundColor = '#FFFFFF';
        document.body.style.color = '#21201F';
        // Обновляем CSS переменные (если используем их)
        document.documentElement.style.setProperty('--background-gray', '#F5F4F2');
    }

    _applyGlobalDarkStyles() {
        document.body.style.backgroundColor = '#1C1C1E'; // Темный фон
        document.body.style.color = '#FFFFFF';
        // Обновляем CSS переменные
        document.documentElement.style.setProperty('--background-gray', '#2C2C2E');
    }
}
