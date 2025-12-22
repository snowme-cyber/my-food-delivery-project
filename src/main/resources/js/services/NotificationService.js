export default class NotificationService {
    static show(message, type = 'success') {
        // Удаляем старое сообщение, если есть
        const existing = document.querySelector('.custom-message-box');
        if (existing) existing.remove();
        
        const box = document.createElement('div');
        box.className = 'custom-message-box';
        
        // Цвета: success - зеленый, error - красный, info - синий
        let bgColor = '#2ecc71'; // success
        if (type === 'error') bgColor = '#e74c3c';
        if (type === 'info') bgColor = '#3498db';

        box.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            padding: 16px 24px; border-radius: 12px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            color: white; font-weight: 600; font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            transform: translateY(-20px); opacity: 0;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            background-color: ${bgColor};
            display: flex; align-items: center; gap: 10px;
        `;
        
        // Добавляем иконку в зависимости от типа
        const icon = type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️');
        box.innerHTML = `<span>${icon}</span><span>${message}</span>`;
        
        document.body.appendChild(box);
        
        // Анимация появления
        requestAnimationFrame(() => {
            box.style.transform = 'translateY(0)';
            box.style.opacity = '1';
        });
        
        // Удаление через 3 секунды
        setTimeout(() => {
            box.style.transform = 'translateY(-20px)';
            box.style.opacity = '0';
            setTimeout(() => box.remove(), 300);
        }, 3000);
    }
}
