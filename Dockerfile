FROM node:19-slim

USER root

WORKDIR /app

COPY package.json ./

RUN apt-get update \
     && apt-get install default-jre -y \
     && apt-get install default-jdk -y

RUN npm install --force

COPY . .

RUN npm run build

EXPOSE 3333

CMD [ "node", "build/infra/server.js" ]