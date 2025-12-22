/**
 * Абстрактная стратегия оплаты.
 * @abstract
 */
export default class PaymentStrategy {
    constructor() {
        if (new.target === PaymentStrategy) {
            throw new Error("Abstract class 'PaymentStrategy' cannot be instantiated directly.");
        }
    }

    /**
     * Метод оплаты.
     * @abstract
     * @param {number} amount - Сумма заказа
     * @returns {Promise<boolean>} - Успешна ли оплата
     */
    pay(amount) {
        throw new Error("Method 'pay(amount)' must be implemented.");
    }

    /**
     * Возвращает название метода для отображения в UI
     * @abstract
     * @returns {string}
     */
    getName() {
        throw new Error("Method 'getName()' must be implemented.");
    }
}
