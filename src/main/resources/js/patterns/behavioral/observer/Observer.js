/**
 * Абстрактный класс Observer.
 * @abstract
 */
export default class Observer {
    constructor() {
        if (new.target === Observer) {
            throw new Error("Abstract class 'Observer' cannot be instantiated directly.");
        }
    }

    /**
     * Метод, вызываемый издателем при изменении состояния.
     * @abstract
     * @param {Object} data - Данные, переданные издателем
     */
    update(data) {
        throw new Error("Method 'update(data)' must be implemented.");
    }
}