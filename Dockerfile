FROM node:24-alpine

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 4001

CMD ["yarn", "dev", "--host", "0.0.0.0", "--port", "4001"]
