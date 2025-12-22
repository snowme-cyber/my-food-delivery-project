import GUIFactory from './GUIFactory.js';
import Button from './Button.js';
import Checkbox from './Checkbox.js';

// --- Конкретные продукты Светлой темы ---

class LightButton extends Button {
    render() {
        const btn = document.createElement('button');
        btn.textContent = this.text;
        // Стили Светлой темы (Яндекс Желтый)
        btn.style.cssText = `
            background-color: #FCE000; 
            color: #21201F;
            border: none;
            padding: 10px 20px;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        `;
        btn.addEventListener('click', this.onClick);
        btn.addEventListener('mouseover', () => btn.style.backgroundColor = '#F2D600');
        btn.addEventListener('mouseout', () => btn.style.backgroundColor = '#FCE000');
        return btn;
    }
}

class LightCheckbox extends Checkbox {
    render() {
        const wrapper = document.createElement('label');
        wrapper.style.cssText = `display: flex; gap: 8px; align-items: center; cursor: pointer; color: #21201F;`;
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = this.isChecked;
        input.style.accentColor = '#FCE000'; // Цвет галочки
        input.addEventListener('change', (e) => this.onChange(e.target.checked));

        wrapper.appendChild(input);
        wrapper.appendChild(document.createTextNode(this.label));
        return wrapper;
    }
}

// --- Конкретная фабрика Светлой темы ---

export default class LightThemeFactory extends GUIFactory {
    createButton(text, onClick) {
        return new LightButton(text, onClick);
    }

    createCheckbox(label, isChecked, onChange) {
        return new LightCheckbox(label, isChecked, onChange);
    }
}
