FROM node:alpine as builder

WORKDIR /src
COPY package-lock.json .
COPY package.json .

RUN npm install

ENV PATH=$PATH:/src/node_modules/.bin
COPY . .
RUN rm -rf /src/dist

RUN ng b --prod

FROM zaker/http-fileserver:v0.0.7

COPY --from=builder /src/dist /web
WORKDIR /web

