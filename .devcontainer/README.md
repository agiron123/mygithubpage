# Jekyll Dev Container

This dev container provides a complete Jekyll development environment with all necessary dependencies pre-installed.

## Features

- **Jekyll 4.3.2**: Latest stable version of Jekyll
- **Ruby**: Latest Ruby version with Bundler
- **Port Forwarding**: Automatically forwards ports 4000 and 4001
- **VS Code Extensions**: Pre-configured with useful extensions for web development
- **Git**: Git is available for version control

## Getting Started

1. Open this project in VS Code
2. When prompted, click "Reopen in Container" or use the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and select "Dev Containers: Reopen in Container"
3. Wait for the container to build and install dependencies
4. Once ready, you can start the Jekyll server with:

```bash
bundle exec jekyll serve --host 0.0.0.0 --port 4001
```

The site will be available at `http://localhost:4001`

## Available Commands

- `bundle exec jekyll serve` - Start the development server
- `bundle exec jekyll build` - Build the site for production
- `bundle exec jekyll clean` - Clean the generated site
- `bundle install` - Install/update dependencies

## Configuration

The Jekyll configuration is in `_config.yml`. The dev container is configured to use port 4001 as specified in your config file.

## Troubleshooting

If you encounter issues:

1. Make sure Docker is running
2. Try rebuilding the container: Command Palette → "Dev Containers: Rebuild Container"
3. Check that all dependencies are installed: `bundle install`
