FROM node:26-slim AS builder

WORKDIR /src
COPY package.json .

RUN npm install && npm audit fix --force

ENV PATH=$PATH:/src/node_modules/.bin
COPY . .
RUN rm -rf /src/dist
RUN mkdir /src/dist
RUN ng b --configuration production

FROM zaker/http-fileserver:v0.0.8

COPY --from=builder /src/dist/browser /web
WORKDIR /web

EXPOSE 4500
ENTRYPOINT ["http-fs"]
