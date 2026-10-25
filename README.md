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

## Запуск через Docker

Скопируйте пример окружения:

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

GraphQL-модели отделены от Prisma-моделей. В публичной схеме компания доступна только как часть `Experience`; внутренние `companyId`, `profileId` и служебные поля связей не публикуются.

## Данные и seed

Seed настроен через Prisma 7 в `prisma7.config.ts`. Он идемпотентен:
компании и профиль создаются через `upsert`, а связанные записи текущего
профиля заменяются актуальным набором. Обычный запуск приложения не изменяет
базу данных и не выполняет seed.
