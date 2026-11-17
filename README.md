This is my personal website, now built with Astro.

## Local development

### Prerequisites

- Node.js 18+ (or 20+ recommended)
- Yarn 1.22.22 (`corepack enable` uses the version pinned in `package.json`)

### Quick start

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Start the dev server:

   ```bash
   yarn dev --port 4001
   ```

3. Open your browser and navigate to `http://localhost:4001`

## Development with Docker

This site can be developed locally using Docker.

### Prerequisites

- Docker
- Docker Compose

### Quick start

1. Build and start the dev server:

   ```bash
   docker-compose up
   ```

2. Open your browser and navigate to `http://localhost:4001`

### Docker commands

- **Start the development server**:

  ```bash
  docker-compose up
  ```

- **Start in detached mode** (runs in background):

  ```bash
  docker-compose up -d
  ```

- **Stop the server**:

  ```bash
  docker-compose down
  ```

- **Rebuild the Docker image** (after changing dependencies):

  ```bash
  docker-compose build
  ```

- **View logs**:
  ```bash
  docker-compose logs -f
  ```
