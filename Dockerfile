FROM ruby:3.1

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /srv/jekyll

# Copy Gemfile and install dependencies
COPY Gemfile* ./
RUN gem install bundler && bundle install

# Copy the rest of the application
COPY . .

# Expose Jekyll default port
EXPOSE 4001

# Set environment variable for Jekyll
ENV JEKYLL_ENV=development

# Command to serve Jekyll site
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "4001", "--livereload"]
