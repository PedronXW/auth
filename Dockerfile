FROM node:19-slim

WORKDIR /usr/app

COPY package.json ./

RUN apt-get update \
     && apt-get install default-jre -y \
     && apt-get install default-jdk -y

RUN npm install --force

COPY . .

CMD ["npm", "run", "start:dev"]

EXPOSE 3333