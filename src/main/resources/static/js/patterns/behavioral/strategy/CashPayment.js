import PaymentStrategy from './PaymentStrategy.js';
import NotificationService from '../../../services/NotificationService.js'; // <-- Импорт

export default class CashPayment extends PaymentStrategy {
    async pay(amount) {
        // ...
        return new Promise((resolve) => {
            // Старое: alert(...)
            NotificationService.show(`Заказ оформлен! Готовьте ${amount} ₽ наличными.`, 'success');
            resolve(true);
        });
    }

    getName() {
        return "Наличными курьеру";
    }
}
