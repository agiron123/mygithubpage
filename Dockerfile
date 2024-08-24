# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /astro

# Copy the entire astro directory to the container
COPY /astro /astro
RUN npm install
RUN npm run build

EXPOSE 5000
CMD ["npm", "run", "astro", "preview", "--", "--host", "0.0.0.0", "--port", "5000"]