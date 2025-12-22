import PaymentStrategy from './PaymentStrategy.js';
import NotificationService from '../../../services/NotificationService.js'; // <-- Импорт

export default class CardPayment extends PaymentStrategy {
    async pay(amount) {
        console.log(`[CardPayment] Initializing transaction for ${amount} RUB...`);
        // Здесь была бы интеграция с эквайрингом (Stripe, CloudPayments)
        
        return new Promise((resolve) => {
            setTimeout(() => {
                // Старое: alert(...)
                NotificationService.show(`Оплата картой на сумму ${amount} ₽ прошла успешно!`, 'success');
                resolve(true);
            }, 1000);
        });
    }

    getName() {
        return "Банковская карта";
    }
}
