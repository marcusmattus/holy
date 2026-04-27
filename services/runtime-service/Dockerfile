FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY src ./src
CMD ["node", "--experimental-strip-types", "src/index.ts"]
