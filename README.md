# Digital Card API

Backend цифровой визитки на NestJS, Prisma, PostgreSQL и GraphQL. API
публикует один профиль с навыками, опытом работы, компаниями и проектами.

## Стек

- TypeScript и Node.js
- NestJS
- GraphQL с Apollo
- Prisma ORM
- PostgreSQL
- Docker Compose

## Запуск через Docker (рекомендуется)

Для запуска в Docker скопируйте пример окружения:

```bash
cp .env.example .env
docker compose up -d --build
```

После запуска:

- GraphQL API и Apollo Sandbox: <http://localhost:3000/graphql>
- health endpoint: <http://localhost:3000/>

Apollo Sandbox открывается по адресу `/graphql`. В нём можно
выполнить запрос `profile` и получить профиль, навыки, опыт работы, компании и проекты.

Контейнер приложения выполняет `prisma migrate deploy`, затем
`prisma db seed`, и только после этого запускает NestJS.

## Локальный запуск

Для локального запуска PostgreSQL должен быть доступен на `localhost:5433`.
Скопируйте локальный пример окружения:

```bash
cp .env.local.example .env.local
```

Файл `.env.local` используется приложением NestJS, Prisma CLI и командами
миграций/seed. Он содержит локальные параметры подключения к PostgreSQL
(`localhost:5433`), тогда как `.env` предназначен для Docker и использует
сетевое имя сервиса `postgres:5432`.

После запуска PostgreSQL выполните:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run start:dev
```

Для локального запуска не следует использовать Docker-значение
`DATABASE_URL` с хостом `postgres`: это имя доступно только внутри Docker
сети.

## GraphQL API

API предоставляет один query `profile`, потому что приложение представляет
одну цифровую визитку:

```graphql
query {
    profile {
        name
        description
        links
        skills
        experiences {
            company {
                name
            }
            position
            start
            end
            achievements
        }
        projects {
            name
            link
        }
    }
}
```

`skills` оставлены как `[String!]!`, а не отдельная сущность GraphQL. Для
визитки это простое значение без дополнительных атрибутов: уровня, порядка,
категории или связи с несколькими профилями. Отдельная модель понадобилась бы при появлении такой бизнес-логики.

GraphQL-модели отделены от Prisma-моделей. В публичной схеме компания доступна только как часть `experiences`; внутренние `companyId`, `profileId` и служебные поля связей не публикуются.

## Данные и seed

Seed настроен через Prisma 7 в `prisma7.config.ts`. Он идемпотентен:
компании и профиль создаются через `upsert`, а связанные записи текущего
профиля заменяются актуальным набором. Обычный запуск приложения не изменяет
базу данных и не выполняет seed.
