FROM node:alpine as builder

WORKDIR /src
COPY package-lock.json .
COPY package.json .

RUN npm install
RUN npm install -g @angular/cli
COPY . .

RUN ng b --prod

FROM alpine as deployer
COPY --from=builder /src/dist /src/dist

CMD ["mkdir -p /tmp/anachrome-fe && cp /src/dist /tmp/anachrome-fe"]
