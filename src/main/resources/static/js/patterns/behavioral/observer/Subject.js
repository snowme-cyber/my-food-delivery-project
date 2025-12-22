import Observer from './Observer.js';

/**
 * Базовый класс Subject (Издатель).
 * Управляет списком подписчиков и уведомляет их.
 */
export default class Subject {
    constructor() {
        this.observers = [];
    }

    /**
     * @param {Observer} observer
     */
    subscribe(observer) {
        if (!(observer instanceof Observer)) {
            throw new Error("Subscriber must inherit from Observer class.");
        }
        this.observers.push(observer);
    }

    /**
     * @param {Observer} observer
     */
    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    /**
     * Уведомление всех подписчиков.
     * @param {Object} data - Данные для отправки
     */
    notify(data) {
        this.observers.forEach(observer => observer.update(data));
    }
}
