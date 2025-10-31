This is my personal website.
I decided to take this on as a little project over the holiday break.

## Development with Docker

This site can be developed locally using Docker. This ensures a consistent development environment regardless of your local setup.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/) (usually included with Docker Desktop)

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/agiron123/mygithubpage.git
   cd mygithubpage
   ```

2. Start the development server:
   ```bash
   docker-compose up
   ```

3. Open your browser and navigate to `http://localhost:4001`

The site will automatically reload when you make changes to your files.

### Docker Commands

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

### Alternative: Using Docker directly

If you prefer to use Docker without Docker Compose:

```bash
# Build the image
docker build -t jekyll-site .

# Run the container
docker run -p 4001:4001 -p 35729:35729 -v $(pwd):/srv/jekyll jekyll-site
```

