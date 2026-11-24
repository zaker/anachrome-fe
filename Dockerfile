FROM node:26-slim AS builder

WORKDIR /src
COPY package.json .

RUN npm install && npm audit fix --force

ENV PATH=$PATH:/src/node_modules/.bin
COPY . .
RUN rm -rf /src/dist
RUN mkdir /src/dist
RUN ng b --configuration production


FROM golang:1.26 AS build

ARG HTTP_FS_REF=main
WORKDIR /src
RUN curl --fail --location --silent --show-error \
    "https://github.com/zaker/http-fs/archive/${HTTP_FS_REF}.tar.gz" -o /tmp/source.tar.gz \
    && tar -xzf /tmp/source.tar.gz --strip-components=1 -C /src \
    && rm -rf /tmp/source.tar.gz /src/static
COPY --from=builder /src/dist/browser ./static/
RUN CGO_ENABLED=0 go build -trimpath -o /http-fs .

FROM scratch
COPY --from=build /http-fs /http-fs
USER 65532:65532
EXPOSE 4500
ENTRYPOINT ["/http-fs","-addr",":4500"]
