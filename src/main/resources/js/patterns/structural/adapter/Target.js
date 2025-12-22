/**
 * Target - абстрактный класс (интерфейс), который ожидает клиент.
 * @abstract
 */
export default class Target {
    constructor() {
        if (new.target === Target) {
            throw new Error("Abstract class 'Target' cannot be instantiated directly.");
        }
    }

    /**
     * @abstract
     * @param {Object} data 
     * @returns {import('../../../domain/Dish.js').default}
     */
    mapToDish(data) {
        throw new Error("Method 'mapToDish' must be implemented.");
    }
}
