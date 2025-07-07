
# 🌸 Blossom API

A RESTful API built with **NestJS**, **TypeScript**, and **Hexagonal Architecture** to retrieve and normalize character data from public **Pokémon** and **Digimon** APIs.

---

## ✅ Features

- 🎮 Multi-franchise support: Pokémon and Digimon
- 🧱 Hexagonal architecture: Clear separation between layers
- ⚙️ Configurable via `.env` or `config` query param
- 🪵 Request logging (in memory or database)
- 📜 Swagger UI to explore the API
- 🧪 Unit tests for adapters
- 🐳 Ready for local or Docker deployment

---

## ⚡ Requirements

- Node.js v22 (as defined in Dockerfile)
- Yarn as the package manager

---

## 🔧 Local Setup

### 1. Clone and setup environment

```bash
git clone https://github.com/diegocumbe1/blossom-api.git
cd blossom-api
cp .env.example .env
````

### 2. Install dependencies

```bash
yarn install
```

### 3. Run the project

```bash
# Development mode (with hot reload)
yarn start:dev

# Production build
yarn build
yarn start:prod
```

---

## 🐳 Running with Docker

### 1. Build Docker image

```bash
docker build -t blossom-api .
```

### 2. Run image manually

```bash
docker run -p 3000:3000 --env-file .env blossom-api
```

### 3. Or use Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    container_name: blossom-api
    ports:
      - '3000:3000'
    volumes:
      - ./.env:/app/.env
      - ./logs.sqlite:/app/logs.sqlite
    environment:
      - NODE_ENV=development
```

```bash
# Start with compose
docker-compose up --build
```

---

## 🔌 Main Endpoint

```
GET /api/:franchise/:version
```

### Route Parameters

* `:franchise`: `"pokemon"` or `"digimon"`
* `:version`: e.g. `"v1"`

### Query Parameters

* `metadata`: JSON object with character data
* `config`: JSON object with adapter configuration

### Examples:

#### Pokémon

```bash
curl "http://localhost:3000/api/pokemon/v1?metadata={\"name\":\"pikachu\"}&config={\"baseUrl\":\"https://pokeapi.co/api/v2\"}"
```

#### Digimon

```bash
curl "http://localhost:3000/api/digimon/v1?metadata={\"id\":42}&config={\"baseUrl\":\"https://digi-api.com/api/v1\"}"
```

---

## 📄 Expected Response

```json
{
  "name": "pikachu",
  "weight": 60,
  "powers": ["static", "lightning-rod"],
  "evolutions": ["pichu", "pikachu", "raichu"]
}
```

---

## 📁 Project Structure

```
src/
├── application/         # Use cases, services, ports
├── domain/              # Domain entities and business logic
├── infrastructure/      # API/database/http adapters
├── shared/              # DTOs, enums, utilities
├── main.ts              # Application entry point
```

---

## ⚙️ Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# External APIs
POKEMON_API_BASE_URL=https://pokeapi.co/api/v2
DIGIMON_API_BASE_URL=https://digi-api.com/api/v1

# Database
DATABASE_TYPE=sqlite
DATABASE_URL=sqlite:./logs.sqlite
```

---

## 🧪 Testing

```bash
# Run unit tests
yarn test

# Run linter
yarn lint
```

---

## 📚 Documentation

* Swagger UI: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
* Pokémon API: [https://pokeapi.co/](https://pokeapi.co/)
* Digimon API: [https://digi-api.com/](https://digi-api.com/)

---

## 👤 Author

**Diego Cumbe**
[GitHub Profile](https://github.com/diegocumbe1) · Software Engineer 

---

