export default class Dish {
    // Добавили isAvailable в конструктор
    constructor(id, name, price, image, description, isAvailable, tags = []) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.description = description || '';
        this.isAvailable = isAvailable; // <--- ВАЖНО
        this.tags = tags;
    }

    getFormattedPrice() {
        return `${this.price} BYN`;
    }
}