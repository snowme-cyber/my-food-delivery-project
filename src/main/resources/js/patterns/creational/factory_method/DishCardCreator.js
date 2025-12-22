import Creator from './Creator.js';
// Важно: импортируем класс из соседнего файла
import ConcreteProductDishCard from './ConcreteProductDishCard.js'; 

export default class DishCardCreator extends Creator {
    createProduct(dishData) {
        // Создаем экземпляр класса из соседнего файла
        return new ConcreteProductDishCard(dishData);
    }
}