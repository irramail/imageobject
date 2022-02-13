# Ставим зависимости
```bash
npm run i
```

# Запускаем разработку
```bash
npm run dev
```

Поднимет localhost:3000

# Собираем статику

```bash
npm run build
```

Статистика будет в папке build

## Сборку docker можно произвести следующим образом
```bash
# Собираем образ Multistage build
docker build -t shvargon/imageobject:latest .

# Развертываем контейнер из образа
docker run -it --rm -d -p 8080:80 --name web shvargon/imageobject
```

После поднимется nginx на 8080 порту