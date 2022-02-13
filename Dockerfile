FROM node:lts-alpine AS builder
WORKDIR /usr/src/app
# Копируем файлы необходимые для запуска
COPY package*.json ./
RUN npm ci
# Копируем все файлы и собираем
COPY . .
RUN npm run build

FROM nginx:latest 
WORKDIR /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/app/build ./
