#!/bin/bash

# Start Jekyll development server
echo "Starting Jekyll development server..."
echo "Site will be available at: http://localhost:4001"
echo "Press Ctrl+C to stop the server"
echo ""

bundle exec jekyll serve --host 0.0.0.0 --port 4001 --livereload
