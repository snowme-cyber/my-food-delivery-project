import GUIFactory from './GUIFactory.js';
import Button from './Button.js';
import Checkbox from './Checkbox.js';

// --- Конкретные продукты Темной темы ---

class DarkButton extends Button {
    render() {
        const btn = document.createElement('button');
        btn.textContent = this.text;
        // Стили Темной темы (Инверсия)
        btn.style.cssText = `
            background-color: #333333; 
            color: #FFFFFF;
            border: 1px solid #555;
            padding: 10px 20px;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        `;
        btn.addEventListener('click', this.onClick);
        btn.addEventListener('mouseover', () => btn.style.backgroundColor = '#444');
        btn.addEventListener('mouseout', () => btn.style.backgroundColor = '#333');
        return btn;
    }
}

class DarkCheckbox extends Checkbox {
    render() {
        const wrapper = document.createElement('label');
        wrapper.style.cssText = `display: flex; gap: 8px; align-items: center; cursor: pointer; color: #FFFFFF;`;
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = this.isChecked;
        input.style.accentColor = '#333'; // Темный чекбокс
        input.addEventListener('change', (e) => this.onChange(e.target.checked));

        wrapper.appendChild(input);
        wrapper.appendChild(document.createTextNode(this.label));
        return wrapper;
    }
}

// --- Конкретная фабрика Темной темы ---

export default class DarkThemeFactory extends GUIFactory {
    createButton(text, onClick) {
        return new DarkButton(text, onClick);
    }

    createCheckbox(label, isChecked, onChange) {
        return new DarkCheckbox(label, isChecked, onChange);
    }
}
