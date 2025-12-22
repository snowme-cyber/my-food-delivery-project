# --- ЭТАП 1: СБОРКА (Build) ---
# Используем образ с Maven и Java 17
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Копируем файлы проекта в виртуальную машину Render
COPY pom.xml .
COPY src ./src

# Запускаем команду сборки (создаем тот самый .jar файл)
RUN mvn clean package -DskipTests

# --- ЭТАП 2: ЗАПУСК (Run) ---
# Используем легкую Java 17 для запуска
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Копируем СОЗДАННЫЙ на 1 этапе файл в папку запуска
COPY --from=build /app/target/fooddelivery-0.0.1-SNAPSHOT.jar app.jar

# Говорим, какой порт открыть
EXPOSE 8080

# Команда запуска
ENTRYPOINT ["java","-jar","app.jar"]