FROM node:alpine as builder

WORKDIR /src
COPY package-lock.json .
COPY package.json .

RUN npm install

ENV PATH=$PATH:/src/node_modules/.bin
COPY . .

RUN ng b --prod

FROM hayd/alpine-deno:1.3.0

COPY --from=builder /src/dist /dist
WORKDIR /dist

# Prefer not to run as root.
USER deno
EXPOSE 4500
CMD ["run","--allow-net", "--allow-read","https://deno.land/std/http/file_server.ts","-p","4500"]
