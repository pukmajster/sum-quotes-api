FROM node:16.5.0 AS builder
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:16.5.0-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 8000
CMD ["npm", "run", "start:prod"]

