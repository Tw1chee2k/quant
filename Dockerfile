# Официальный минимальный образ Python
FROM python:3.10-slim

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем файл с зависимостями
COPY requirements.txt .

# Установка зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копирование проекта в контейнер
COPY . .

# Переменные окружения для Flask
ENV FLASK_APP=main.py
ENV FLASK_ENV=production

# порт, который использует Flask
EXPOSE 5000

# Команда для запуска приложения
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "main:app"]
