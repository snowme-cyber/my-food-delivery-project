-- "ВЕЧНЫЙ" СКРИПТ (Данные сохраняются при перезапуске)
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;
-- 1. КАТЕГОРИИ (Вставляем, если нет)
INSERT INTO categories (id, name) VALUES (1, 'Пицца') ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name) VALUES (2, 'Бургеры') ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name) VALUES (3, 'Закуски') ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name) VALUES (4, 'Суши и Роллы') ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name) VALUES (5, 'Салаты') ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name) VALUES (6, 'Супы') ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name) VALUES (7, 'Паста и Вок') ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name) VALUES (8, 'Горячее') ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name) VALUES (9, 'Десерты') ON CONFLICT (id) DO NOTHING;
INSERT INTO categories (id, name) VALUES (10, 'Напитки') ON CONFLICT (id) DO NOTHING;



-- 3. БЛЮДА (Используем явные ID + ON CONFLICT)

-- ПИЦЦА
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(1, 'Пепперони', 'Классическая пицца с пикантными колбасками пепперони и моцареллой. (30 см, 510 г)', 17.70, 'https://image.pollinations.ai/prompt/pepperoni%20pizza%20mozzarella%20close%20up%20fast%20food', true, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(2, 'Маргарита', 'Итальянская классика: спелые томаты, свежий базилик, моцарелла. (30 см, 450 г)', 13.50, 'https://image.pollinations.ai/prompt/margherita%20pizza%20basil%20tomato%20fresh', true, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(3, 'Четыре Сыра', 'Сливочная основа, моцарелла, горгонзола, пармезан и эмменталь. (30 см, 480 г)', 19.50, 'https://image.pollinations.ai/prompt/four%20cheese%20pizza%20quattro%20formaggi%20delicious', true, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(4, 'Гавайская', 'Куриное филе, сочные ананасы, ветчина и моцарелла. (30 см, 520 г)', 17.40, 'https://image.pollinations.ai/prompt/hawaiian%20pizza%20pineapple%20ham%20chicken', true, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(5, 'Мясная', 'Бекон, ветчина, пепперони, курица и охотничьи колбаски. (30 см, 600 г)', 21.60, 'https://image.pollinations.ai/prompt/meat%20lovers%20pizza%20bacon%20sausage%20bbq', true, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(6, 'Карбонара', 'Бекон, моцарелла, пармезан, яйцо и сливочный соус. (30 см, 530 г)', 18.90, 'https://image.pollinations.ai/prompt/carbonara%20pizza%20egg%20bacon%20cream%20sauce', true, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(7, 'Грибная', 'Шампиньоны, белые грибы, сливочный соус, трюфельное масло. (30 см, 490 г)', 18.30, 'https://image.pollinations.ai/prompt/mushroom%20pizza%20truffle%20oil%20white%20sauce', true, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(8, 'Дьябло (Острая)', 'Колбаски чоризо, халапеньо, красный лук, соус чили. (30 см, 510 г)', 18.00, 'https://image.pollinations.ai/prompt/spicy%20diablo%20pizza%20jalapeno%20chorizo%20chili', true, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(9, 'Вегетарианская', 'Сладкий перец, цукини, баклажаны, черри, оливки. (30 см, 460 г)', 15.60, 'https://image.pollinations.ai/prompt/vegetarian%20pizza%20vegetables%20peppers%20fresh', true, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(10, 'Цезарь', 'Куриное филе, салат айсберг, черри, пармезан, соус цезарь. (30 см, 540 г)', 19.20, 'https://image.pollinations.ai/prompt/caesar%20pizza%20chicken%20salad%20parmesan', true, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(11, 'Барбекю Цыпленок', 'Куриное филе, красный лук, моцарелла, соус барбекю. (30 см, 520 г)', 17.10, 'https://image.pollinations.ai/prompt/bbq%20chicken%20pizza%20red%20onion%20sauce', true, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(12, 'С грушей и горгонзолой', 'Груша, сыр с голубой плесенью, грецкие орехи, мед. (30 см, 470 г)', 20.40, 'https://image.pollinations.ai/prompt/pizza%20pear%20gorgonzola%20walnut%20gourmet', true, 1) ON CONFLICT (id) DO NOTHING;

-- БУРГЕРЫ
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(13, 'Классический Чизбургер', 'Говяжья котлета, чеддер, огурчики, лук, кетчуп, горчица. (280 г)', 11.70, 'https://image.pollinations.ai/prompt/classic%20cheeseburger%20beef%20cheddar%20brioche', true, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(14, 'BBQ Бекон Бургер', 'Говядина, хрустящий бекон, лук фри, чеддер, соус барбекю. (320 г)', 13.50, 'https://image.pollinations.ai/prompt/bacon%20bbq%20burger%20fried%20onion%20delicious', true, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(15, 'Чикен Бургер', 'Куриное филе в панировке, свежий салат, томаты, майонез. (260 г)', 10.80, 'https://image.pollinations.ai/prompt/crispy%20chicken%20burger%20lettuce%20mayo', true, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(16, 'Трюфельный Бургер', 'Говядина, грибное рагу, швейцарский сыр, трюфельный соус. (310 г)', 16.50, 'https://image.pollinations.ai/prompt/gourmet%20truffle%20burger%20mushrooms%20swiss%20cheese', true, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(17, 'Фиш Бургер', 'Филе трески в кляре, чеддер, соус тар-тар, салат. (270 г)', 12.30, 'https://image.pollinations.ai/prompt/fish%20burger%20tartar%20sauce%20cod%20fillet', true, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(18, 'Острый Мексиканский', 'Говядина, перец халапеньо, сальса, начос, гуакамоле. (330 г)', 14.10, 'https://image.pollinations.ai/prompt/spicy%20mexican%20burger%20jalapeno%20nachos%20guacamole', true, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(19, 'Веган Бургер', 'Котлета Beyond Meat, веганский сыр, авокадо, песто. (290 г)', 17.70, 'https://image.pollinations.ai/prompt/vegan%20burger%20avocado%20plant%20based%20green', true, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(20, 'Двойной Бургер', 'Две сочные говяжьи котлеты, двойной сыр, бекон. (450 г)', 19.50, 'https://image.pollinations.ai/prompt/double%20cheeseburger%20huge%20meat%20bacon', true, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(21, 'Блю Чиз Бургер', 'Говядина, сыр с голубой плесенью, карамелизированный лук. (300 г)', 14.70, 'https://image.pollinations.ai/prompt/blue%20cheese%20burger%20gourmet%20beef', true, 2) ON CONFLICT (id) DO NOTHING;

-- ЗАКУСКИ
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(22, 'Картофель Фри', 'Золотистые ломтики картофеля с солью. (150 г)', 5.70, 'https://image.pollinations.ai/prompt/french%20fries%20golden%20crispy%20ketchup', true, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(23, 'Сырные палочки', 'Моцарелла в хрустящей панировке с брусничным соусом. (6 шт / 180 г)', 8.40, 'https://image.pollinations.ai/prompt/mozzarella%20sticks%20fried%20cheese%20appetizer', true, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(24, 'Куриные крылышки BBQ', 'Запеченные крылышки в фирменном маринаде барбекю. (250 г)', 11.70, 'https://image.pollinations.ai/prompt/bbq%20chicken%20wings%20grilled%20sauce', true, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(25, 'Наггетсы', 'Нежное куриное филе в золотистой панировке. (9 шт / 160 г)', 7.50, 'https://image.pollinations.ai/prompt/chicken%20nuggets%20crispy%20golden%20fast%20food', true, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(26, 'Луковые кольца', 'Сладкий лук в кляре, обжаренный во фритюре. (150 г)', 6.30, 'https://image.pollinations.ai/prompt/onion%20rings%20fried%20golden%20snack', true, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(27, 'Чесночные гренки', 'Гренки из бородинского хлеба с чесноком и соусом. (130 г)', 6.30, 'https://image.pollinations.ai/prompt/garlic%20bread%20rye%20croutons%20snack', true, 3) ON CONFLICT (id) DO NOTHING;

-- СУШИ И РОЛЛЫ
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(28, 'Филадельфия', 'Лосось, сливочный сыр, огурец, рис, нори. (8 шт / 240 г)', 17.70, 'https://image.pollinations.ai/prompt/sushi%20philadelphia%20roll%20salmon%20cream%20cheese', true, 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(29, 'Калифорния', 'Снежный краб, авокадо, огурец, тобико, майонез. (8 шт / 230 г)', 14.40, 'https://image.pollinations.ai/prompt/sushi%20california%20roll%20crab%20avocado%20tobiko', true, 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(30, 'Дракон', 'Угорь, сливочный сыр, огурец, соус унаги, кунжут. (8 шт / 250 г)', 19.50, 'https://image.pollinations.ai/prompt/sushi%20dragon%20roll%20eel%20unagi%20sauce', true, 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(31, 'Запеченный с лососем', 'Теплый ролл с лососем, рисом и фирменным сырным соусом. (8 шт / 260 г)', 15.60, 'https://image.pollinations.ai/prompt/baked%20sushi%20roll%20hot%20melted%20cheese%20salmon', true, 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(32, 'Маки с огурцом', 'Классический ролл с огурцом и кунжутом. (6 шт / 110 г)', 5.70, 'https://image.pollinations.ai/prompt/maki%20sushi%20cucumber%20simple%20roll', true, 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(33, 'Маки с лососем', 'Классический ролл с лососем. (6 шт / 120 г)', 8.70, 'https://image.pollinations.ai/prompt/maki%20sushi%20salmon%20small%20roll', true, 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(34, 'Спайси Тунец', 'Тунец, огурец, острый соус спайси. (8 шт / 220 г)', 16.20, 'https://image.pollinations.ai/prompt/spicy%20tuna%20roll%20sushi%20red%20sauce', true, 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(35, 'Темпура с креветкой', 'Горячий ролл в хрустящем кляре с тигровой креветкой. (8 шт / 280 г)', 16.80, 'https://image.pollinations.ai/prompt/tempura%20sushi%20roll%20fried%20shrimp%20hot', true, 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(36, 'Суши Лосось', 'Традиционная суши нигири с лососем. (1 шт / 35 г)', 3.60, 'https://image.pollinations.ai/prompt/nigiri%20sushi%20salmon%20fresh%20fish%20rice', true, 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(37, 'Суши Угорь', 'Нигири с копченым угрем, соусом унаги и кунжутом. (1 шт / 35 г)', 4.20, 'https://image.pollinations.ai/prompt/nigiri%20sushi%20eel%20unagi%20sesame', true, 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(38, 'Сет Филоман', 'Большой набор из 4-х видов роллов с лососем. (32 шт / 1 кг)', 48.00, 'https://image.pollinations.ai/prompt/large%20sushi%20set%20platter%20salmon%20rolls%20assorted', true, 4) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(39, 'Гункан с лососем', 'Рубленый лосось в остром соусе на подушке из риса. (1 шт / 40 г)', 4.20, 'https://image.pollinations.ai/prompt/gunkan%20maki%20salmon%20sushi%20boat%20spicy', true, 4) ON CONFLICT (id) DO NOTHING;

-- САЛАТЫ
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(40, 'Цезарь с курицей', 'Салат айсберг, куриное филе, гренки, пармезан, соус. (230 г)', 12.60, 'https://image.pollinations.ai/prompt/caesar%20salad%20chicken%20croutons%20parmesan', true, 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(41, 'Цезарь с креветками', 'Салат айсберг, тигровые креветки, гренки, пармезан. (230 г)', 16.50, 'https://image.pollinations.ai/prompt/caesar%20salad%20shrimps%20fresh%20plate', true, 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(42, 'Греческий', 'Огурцы, помидоры, перец, маслины, сыр фета, масло. (210 г)', 11.40, 'https://image.pollinations.ai/prompt/greek%20salad%20feta%20olives%20tomato%20cucumber', true, 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(43, 'Капрезе', 'Свежая моцарелла, спелые томаты, соус песто, базилик. (200 г)', 13.50, 'https://image.pollinations.ai/prompt/caprese%20salad%20mozzarella%20tomato%20pesto%20basil', true, 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(44, 'Чука', 'Маринованные водоросли с ореховым соусом Гамадари. (150 г)', 8.40, 'https://image.pollinations.ai/prompt/chuka%20seaweed%20salad%20green%20nut%20sauce', true, 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(45, 'Нисуаз', 'Консервированный тунец, стручковая фасоль, яйцо, картофель. (240 г)', 15.60, 'https://image.pollinations.ai/prompt/nicoise%20salad%20tuna%20egg%20beans%20french', true, 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(46, 'Теплый салат с говядиной', 'Микс салатов, обжаренная говядина, овощи гриль. (250 г)', 17.70, 'https://image.pollinations.ai/prompt/warm%20beef%20salad%20grilled%20meat%20vegetables', true, 5) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(47, 'Оливье с говядиной', 'Традиционный салат с отварной говядиной и домашним майонезом. (200 г)', 10.50, 'https://image.pollinations.ai/prompt/russian%20salad%20olivier%20beef%20vegetables%20mayo', true, 5) ON CONFLICT (id) DO NOTHING;

-- СУПЫ
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(48, 'Борщ', 'На наваристом говяжьем бульоне. Подается со сметаной. (300 мл / 30 г)', 10.50, 'https://image.pollinations.ai/prompt/borscht%20soup%20red%20beetroot%20sour%20cream%20bread', true, 6) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(49, 'Том Ям', 'Тайский острый суп с креветками, кальмарами и кокосовым молоком. (350 мл)', 16.50, 'https://image.pollinations.ai/prompt/tom%20yum%20soup%20shrimp%20spicy%20thai%20coconut', true, 6) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(50, 'Грибной крем-суп', 'Нежный суп-пюре из шампиньонов со сливками и гренками. (300 мл)', 9.60, 'https://image.pollinations.ai/prompt/mushroom%20cream%20soup%20bowl%20croutons', true, 6) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(51, 'Куриный бульон', 'Легкий бульон с домашней лапшой, морковью и зеленью. (300 мл)', 7.50, 'https://image.pollinations.ai/prompt/chicken%20noodle%20soup%20clear%20broth%20healthy', true, 6) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(52, 'Рамен с курицей', 'Пшеничная лапша, куриное филе, маринованное яйцо, нори. (450 мл)', 14.40, 'https://image.pollinations.ai/prompt/chicken%20ramen%20noodles%20egg%20japanese%20soup', true, 6) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(53, 'Солянка', 'Насыщенный мясной суп с копченостями, маслинами и лимоном. (300 мл)', 11.70, 'https://image.pollinations.ai/prompt/solyanka%20soup%20meat%20lemon%20olives%20hearty', true, 6) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(54, 'Тыквенный крем-суп', 'Густой суп из тыквы с сливками и тыквенными семечками. (300 мл)', 9.30, 'https://image.pollinations.ai/prompt/pumpkin%20cream%20soup%20orange%20seeds%20autumn', true, 6) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(55, 'Сырный крем-суп', 'Из трех видов сыра (чеддер, пармезан, сливочный). (300 мл)', 10.20, 'https://image.pollinations.ai/prompt/cheese%20soup%20bowl%20creamy%20yellow%20croutons', true, 6) ON CONFLICT (id) DO NOTHING;

-- ПАСТА И ВОК
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(56, 'Паста Карбонара', 'Спагетти, бекон, сливочно-яичный соус, пармезан. (280 г)', 13.50, 'https://image.pollinations.ai/prompt/pasta%20carbonara%20spaghetti%20bacon%20egg%20cheese', true, 7) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(57, 'Паста Болоньезе', 'Классический мясной соус из говядины с томатами и травами. (300 г)', 14.10, 'https://image.pollinations.ai/prompt/pasta%20bolognese%20tomato%20meat%20sauce%20italian', true, 7) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(58, 'Феттучине с лососем', 'Широкая паста в сливочном соусе с кусочками лосося. (290 г)', 17.40, 'https://image.pollinations.ai/prompt/fettuccine%20alfredo%20salmon%20creamy%20pasta', true, 7) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(59, 'Вок с курицей', 'Лапша удон, куриное филе, овощи, соус терияки, кунжут. (350 г)', 12.60, 'https://image.pollinations.ai/prompt/wok%20noodles%20chicken%20teriyaki%20vegetables%20box', true, 7) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(60, 'Вок с морепродуктами', 'Рисовая лапша, креветки, кальмары, мидии, острый соус. (350 г)', 16.80, 'https://image.pollinations.ai/prompt/seafood%20wok%20noodles%20shrimp%20spicy%20asian', true, 7) ON CONFLICT (id) DO NOTHING;

-- ГОРЯЧЕЕ
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(61, 'Стейк Рибай', 'Мраморная говядина зернового откорма. Прожарка Medium. (300 г)', 57.00, 'https://image.pollinations.ai/prompt/ribeye%20steak%20grilled%20beef%20juicy%20medium%20rare', true, 8) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(62, 'Куриная грудка гриль', 'Диетическое куриное филе на гриле, овощи на пару. (150/150 г)', 11.70, 'https://image.pollinations.ai/prompt/grilled%20chicken%20breast%20vegetables%20healthy%20diet', true, 8) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(63, 'Лосось на гриле', 'Стейк атлантического лосося с лимоном и сливочным соусом. (180 г)', 33.00, 'https://image.pollinations.ai/prompt/grilled%20salmon%20steak%20lemon%20fish%20dish', true, 8) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(64, 'Бефстроганов', 'Кусочки говядины в сметанном соусе с грибами. Гарнир: пюре. (280 г)', 18.60, 'https://image.pollinations.ai/prompt/beef%20stroganoff%20mashed%20potatoes%20creamy%20sauce', true, 8) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(65, 'Ризотто с грибами', 'Итальянский рис арборио, белые грибы, сливки, пармезан. (260 г)', 16.20, 'https://image.pollinations.ai/prompt/mushroom%20risotto%20creamy%20italian%20rice%20dish', true, 8) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(66, 'Котлеты по-киевски', 'Куриная котлета со сливочным маслом и зеленью внутри. (160 г)', 13.50, 'https://image.pollinations.ai/prompt/chicken%20kiev%20cutlet%20butter%20herbs%20fried', true, 8) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(67, 'Лазанья', 'Слои пасты, мясное рагу болоньезе, соус бешамель, сыр. (320 г)', 15.30, 'https://image.pollinations.ai/prompt/lasagna%20italian%20pasta%20layers%20meat%20cheese', true, 8) ON CONFLICT (id) DO NOTHING;

-- ДЕСЕРТЫ
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(68, 'Чизкейк Нью-Йорк', 'Классический творожный десерт на песочной основе. (120 г)', 9.60, 'https://image.pollinations.ai/prompt/new%20york%20cheesecake%20slice%20berry%20sauce%20dessert', true, 9) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(69, 'Тирамису', 'Итальянский десерт: печенье савоярди, кофе, крем маскарпоне. (140 г)', 10.50, 'https://image.pollinations.ai/prompt/tiramisu%20dessert%20cocoa%20coffee%20italian', true, 9) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(70, 'Шоколадный фондан', 'Горячий кекс с жидким шоколадным центром и шариком мороженого. (100/50 г)', 11.40, 'https://image.pollinations.ai/prompt/chocolate%20lava%20cake%20fondant%20ice%20cream%20melting', true, 9) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(71, 'Наполеон', 'Множество слоев хрустящего теста и нежный заварной крем. (150 г)', 9.00, 'https://image.pollinations.ai/prompt/napoleon%20cake%20layered%20pastry%20cream%20slice', true, 9) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(72, 'Медовик', 'Ароматные медовые коржи со сметанным кремом. (140 г)', 8.70, 'https://image.pollinations.ai/prompt/honey%20cake%20medovik%20layered%20dessert%20russian', true, 9) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(73, 'Мороженое (шарик)', 'Вкус на выбор: Ваниль, Шоколад, Клубника. (50 г)', 3.60, 'https://image.pollinations.ai/prompt/ice%20cream%20scoop%20cone%20dessert%20sweet', true, 9) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(74, 'Фруктовый салат', 'Свежие яблоко, груша, апельсин, киви, банан, йогурт. (180 г)', 7.50, 'https://image.pollinations.ai/prompt/fruit%20salad%20bowl%20fresh%20healthy%20colorful', true, 9) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(75, 'Брауни', 'Влажный шоколадный пирог с грецким орехом. (100 г)', 8.40, 'https://image.pollinations.ai/prompt/chocolate%20brownie%20square%20walnut%20fudge', true, 9) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(76, 'Эклер', 'Заварное пирожное с ванильным кремом, покрытое шоколадом. (70 г)', 5.40, 'https://image.pollinations.ai/prompt/eclair%20chocolate%20pastry%20cream%20french', true, 9) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(77, 'Панкейки', 'Пышные американские блинчики с кленовым сиропом и ягодами. (200 г)', 9.30, 'https://image.pollinations.ai/prompt/fluffy%20pancakes%20stack%20maple%20syrup%20berries%20plate%20photorealistic', true, 9) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(78, 'Маффин шоколадный', 'Мягкий кекс с кусочками шоколада. (80 г)', 3.60, 'https://image.pollinations.ai/prompt/chocolate%20muffin%20cupcake%20bakery', true, 9) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(79, 'Круассан с миндалем', 'Французская выпечка с миндальным кремом и лепестками. (90 г)', 5.70, 'https://image.pollinations.ai/prompt/almond%20croissant%20pastry%20french%20breakfast', true, 9) ON CONFLICT (id) DO NOTHING;

-- НАПИТКИ
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(80, 'Кока-Кола 0.5', 'Освежающий газированный напиток. Классический вкус. (0.5 л)', 3.60, 'https://image.pollinations.ai/prompt/coca%20cola%20bottle%20glass%20ice%20drink', true, 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(81, 'Фанта 0.5', 'Яркий апельсиновый вкус с пузырьками. (0.5 л)', 3.60, 'https://image.pollinations.ai/prompt/fanta%20orange%20soda%20bottle%20drink', true, 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(82, 'Спрайт 0.5', 'Кристально чистый вкус лимона и лайма. (0.5 л)', 3.60, 'https://image.pollinations.ai/prompt/sprite%20lemon%20lime%20soda%20bottle', true, 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(83, 'Морс Клюквенный', 'Натуральный морс из лесных ягод. (250 мл)', 4.50, 'https://image.pollinations.ai/prompt/cranberry%20juice%20mors%20red%20drink%20glass', true, 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(84, 'Морс Облепиховый', 'Горячий или холодный напиток из облепихи с медом. (250 мл)', 4.80, 'https://image.pollinations.ai/prompt/seabuckthorn%20juice%20orange%20drink%20berry', true, 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(85, 'Сок Апельсиновый', '100% апельсиновый сок Rich. (200 мл)', 4.20, 'https://image.pollinations.ai/prompt/orange%20juice%20glass%20fresh%20fruit', true, 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(86, 'Свежевыжатый Апельсиновый', 'Фреш из сладких апельсинов. (250 мл)', 8.70, 'https://image.pollinations.ai/prompt/freshly%20squeezed%20orange%20juice%20citrus', true, 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(87, 'Вода без газа', 'Минеральная вода BonAqua. (0.5 л)', 2.70, 'https://image.pollinations.ai/prompt/mineral%20water%20bottle%20pure%20clear', true, 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(88, 'Эспрессо', 'Крепкий черный кофе. (30 мл)', 3.30, 'https://image.pollinations.ai/prompt/espresso%20coffee%20cup%20black%20strong', true, 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(89, 'Капучино', 'Кофе с густой молочной пенкой. (180 мл)', 5.70, 'https://image.pollinations.ai/prompt/cappuccino%20coffee%20foam%20art%20cup', true, 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(90, 'Латте', 'Кофейный напиток с большим количеством молока. (250 мл)', 6.30, 'https://image.pollinations.ai/prompt/latte%20macchiato%20glass%20coffee%20milk', true, 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(91, 'Чай Черный', 'Эрл Грей, чайник. (500 мл)', 7.50, 'https://image.pollinations.ai/prompt/black%20tea%20teapot%20cup%20earl%20grey', true, 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(92, 'Чай Зеленый', 'Сенча, чайник. (500 мл)', 7.50, 'https://image.pollinations.ai/prompt/green%20tea%20cup%20leaves%20teapot%20herbal', true, 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(93, 'Лимонад Домашний', 'Освежающий лимонад с мятой и льдом. (350 мл)', 6.60, 'https://image.pollinations.ai/prompt/homemade%20lemonade%20mint%20ice%20glass%20refreshing', true, 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(94, 'Молочный коктейль Ванильный', 'Взбитое молоко с мороженым. (300 мл)', 8.40, 'https://image.pollinations.ai/prompt/vanilla%20milkshake%20glass%20whipped%20cream%20cherry', true, 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(95, 'Смузи Ягодный', 'Клубника, малина, банан, йогурт. (300 мл)', 9.60, 'https://image.pollinations.ai/prompt/berry%20smoothie%20jar%20strawberry%20healthy', true, 10) ON CONFLICT (id) DO NOTHING;
INSERT INTO dishes (id, name, description, price, image_url, is_available, category_id) VALUES
(96, 'Пиво Светлое б/а', 'Безалкогольный лагер. (0.5 л)', 7.50, 'https://image.pollinations.ai/prompt/lager%20beer%20glass%20foam%20pub', true, 10) ON CONFLICT (id) DO NOTHING;

-- 6. ОБНОВЛЕНИЕ СЧЕТЧИКА ID (Чтобы новые блюда получали правильный ID)
SELECT setval('dishes_id_seq', (SELECT MAX(id) FROM dishes));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));