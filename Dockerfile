FROM node:alpine as builder

WORKDIR /src
COPY package-lock.json .
COPY package.json .

RUN npm install

ENV PATH=$PATH:/src/node_modules/.bin
COPY . .

RUN ng b --prod

FROM busybox as deployer
COPY --from=builder /src/dist /dist
RUN mkdir /out
