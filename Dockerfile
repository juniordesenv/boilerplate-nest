FROM node:12-alpine
LABEL maintainer = 'Junior Miranda'

ENV API=/home/api

EXPOSE 8080

COPY ./package.json $API/package.json

WORKDIR $API

RUN yarn install 

COPY . $API/

CMD yarn start:dev