FROM node:20.2.0 as builder

WORKDIR /src
COPY package.json .
RUN npm i -g npm 
RUN npm install

ENV PATH=$PATH:/src/node_modules/.bin
COPY . .
RUN rm -rf /src/dist
RUN mkdir /src/dist
RUN ng b --configuration production

FROM zaker/http-fileserver:v0.0.8

COPY --from=builder /src/dist /web
WORKDIR /web

