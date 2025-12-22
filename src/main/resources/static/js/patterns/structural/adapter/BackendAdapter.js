import Target from './Target.js';
import Dish from '../../../domain/Dish.js';

export default class BackendAdapter extends Target {
    mapToDish(serverDishDto) {
        // 1. "ШПИОН": Выводим в консоль то, что пришло с сервера
        // (Потом можно будет убрать)
        console.log("Пришло с сервера:", serverDishDto);

        const tags = [];
        if (serverDishDto.description && serverDishDto.description.toLowerCase().includes('остр')) {
            tags.push('spicy');
        }
        if (serverDishDto.description && serverDishDto.description.toLowerCase().includes('новинк')) {
            tags.push('new');
        }

        const imageUrl = serverDishDto.imageUrl || 'https://via.placeholder.com/300?text=No+Image';

        // 2. ИСПРАВЛЕНИЕ ОШИБКИ "isAvailable is not defined"
        // Мы создаем переменную finalStatus.
        let finalStatus = true; // По умолчанию - доступно

        // Проверяем поле ВНУТРИ объекта serverDishDto
        if (serverDishDto.isAvailable !== undefined && serverDishDto.isAvailable !== null) {
            finalStatus = serverDishDto.isAvailable;
        } 
        // На случай, если Java обрезала имя до "available"
        else if (serverDishDto.available !== undefined && serverDishDto.available !== null) {
            finalStatus = serverDishDto.available;
        }

        return new Dish(
            serverDishDto.id,
            serverDishDto.name,
            serverDishDto.price,
            imageUrl,
            serverDishDto.description,
            finalStatus, // Передаем статус
            tags
        );
    }
}

