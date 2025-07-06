# Blossom API

A REST API for retrieving character information from Pokemon and Digimon franchises.

## Features

- **Multi-franchise support**: Pokemon and Digimon APIs
- **Environment-based configuration**: Uses `.env` variables for API URLs
- **Rich data extraction**: Captures abilities, types, moves, evolutions, etc.
- **Comprehensive logging**: Request tracking and debugging
- **Swagger documentation**: Interactive API documentation

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# API Configuration
POKEMON_API_BASE_URL=https://pokeapi.co/api/v2
DIGIMON_API_BASE_URL=https://digi-api.com/api/v1

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Run the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### 4. Access the API

- **API Base URL**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api-docs

## API Usage

### Get Pokemon Character

```bash
# Using environment variables (recommended)
curl "http://localhost:3000/api/characters/pokemon/v1?metadata={\"name\":\"pikachu\"}"

# With explicit configuration
curl "http://localhost:3000/api/characters/pokemon/v1?metadata={\"name\":\"pikachu\"}&config={\"baseUrl\":\"https://pokeapi.co/api/v2\"}"
```

### Get Digimon Character

```bash
# Using environment variables (recommended)
curl "http://localhost:3000/api/characters/digimon/v1?metadata={\"id\":1}"

# With explicit configuration
curl "http://localhost:3000/api/characters/digimon/v1?metadata={\"id\":1}&config={\"baseUrl\":\"https://digi-api.com/api/v1\"}"
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `POKEMON_API_BASE_URL` | Pokemon API base URL | `https://pokeapi.co/api/v2` |
| `DIGIMON_API_BASE_URL` | Digimon API base URL | `https://digi-api.com/api/v1` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |

## Configuration Priority

1. **Explicit config parameter** (highest priority)
2. **Environment variables** (from `.env` file)
3. **Default values** (fallback)

## Development

### Available Scripts

```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Test
npm run test
npm run test:e2e

# Lint
npm run lint
```

### Project Structure

```
src/
├── application/          # Application services and use cases
├── domain/              # Domain entities and value objects
├── infrastructure/      # External adapters and implementations
│   ├── adapters/
│   │   ├── external-apis/  # Pokemon and Digimon API adapters
│   │   ├── http/           # HTTP controllers
│   │   └── database/       # Database adapters
│   └── config/             # Configuration management
└── shared/              # Shared DTOs and enums
```

## API Sources

- **Pokemon**: https://pokeapi.co/api/v2
- **Digimon**: https://digi-api.com/api/v1

## Documentation

- [API Usage Guide](API_USAGE.md)
- [Environment Variables](ENVIRONMENT_VARIABLES.md)
- [Swagger Documentation](http://localhost:3000/api-docs) (when running)


