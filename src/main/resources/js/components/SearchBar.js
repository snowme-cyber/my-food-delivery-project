import VisualComponent from '../patterns/structural/decorator/Component.js';

export default class SearchBar extends VisualComponent {
    constructor(onSearch) {
        super();
        this.onSearch = onSearch;
        this.debounceTimer = null;
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'search-wrapper';
        
        const icon = document.createElement('span');
        icon.innerHTML = '🔍';
        icon.className = 'search-icon';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Найти блюдо...';
        input.className = 'search-input';

        input.addEventListener('input', (e) => {
            const query = e.target.value;
            
            // Задержка поиска (debounce), чтобы не слать запросы на каждой букве
            if (this.debounceTimer) clearTimeout(this.debounceTimer);

            this.debounceTimer = setTimeout(() => {
                this.onSearch(query);
            }, 500);
        });

        wrapper.appendChild(icon);
        wrapper.appendChild(input);
        return wrapper;
    }
}