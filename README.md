# Home Dashboard

Inspired by [Mafl](https://github.com/hywax/mafl)

## Installation

```yaml
services:
  homepage:
    container_name: home-dashboard
    image: chnikel/home-dashboard
    environment:
      NODE_ENV: production
    ports:
      - 3005:3000
    volumes:
      - ./data:/app/server/data
```

## Migrations

Run migration

```sh
docker exec -it <container_name> bash
npm run db:migrate
```
