export default class ConfirmationModal {
    static ask(message) {
        return new Promise((resolve) => {
            // 1. Создаем элементы
            const overlay = document.createElement('div');
            overlay.className = 'auth-overlay visible';
            overlay.style.zIndex = '10001'; // Поверх всего

            const modal = document.createElement('div');
            modal.className = 'auth-modal visible';
            modal.style.textAlign = 'center';
            modal.style.maxWidth = '350px';

            modal.innerHTML = `
                <h3 style="margin-bottom: 10px;">Подтверждение</h3>
                <p style="margin-bottom: 20px; color: #666;">${message}</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="confirm-no" class="login-submit-btn" style="background: #F5F4F2; color: #000;">Нет</button>
                    <button id="confirm-yes" class="login-submit-btn" style="background: #FCE000; color: #000;">Да</button>
                </div>
            `;

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // 2. Обработчики
            const close = (result) => {
                document.body.removeChild(overlay);
                resolve(result); // Возвращаем true или false
            };

            modal.querySelector('#confirm-no').onclick = () => close(false);
            modal.querySelector('#confirm-yes').onclick = () => close(true);
            
            // Клик по фону - тоже отмена
            overlay.onclick = (e) => {
                if (e.target === overlay) close(false);
            };
        });
    }
}