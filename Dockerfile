FROM node:lts-alpine AS base
RUN apk add rsync
RUN mkdir -p /var/lib/sabbath-lessons/output
RUN mkdir -p /mnt/docker/
WORKDIR /var/lib/sabbath-lessons/

RUN npm install cheerio@1.0.0-rc.3 json2md handlebars turndown@6.0.0
RUN npm cache clean --force

FROM base AS dev

COPY --chown=node:node code.js .
COPY --chown=node:node oppetykk.html .
ADD template ./template/

ENTRYPOINT rm -rf output/oppetukk && node code.js && rsync -av ./output/oppetukk /mnt/docker/docker-mount/
