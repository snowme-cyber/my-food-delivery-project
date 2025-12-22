/**
 * Утилита для проверки реализации интерфейсов.
 * В JS нет интерфейсов, поэтому мы эмулируем контракт.
 */
export default class Interface {
    constructor(name, methods = []) {
        this.name = name;
        this.methods = methods;
    }

    static ensureImplements(object, ...interfaces) {
        for (const interfaceDefinition of interfaces) {
            for (const method of interfaceDefinition.methods) {
                if (!object[method] || typeof object[method] !== 'function') {
                    throw new Error(
                        `Error: Object does not implement the ${interfaceDefinition.name} interface. Method '${method}' was not found.`
                    );
                }
            }
        }
    }
}
