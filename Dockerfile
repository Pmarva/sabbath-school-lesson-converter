FROM node:lts-alpine3.17 AS base
RUN apk add rsync poppler-utils
RUN mkdir -p /var/lib/sabbath-lessons/output
RUN mkdir -p /mnt/docker/
WORKDIR /var/lib/sabbath-lessons/

RUN npm install cheerio@1.0.0-rc.3 json2md handlebars turndown@6.0.0 node-vibrant
# --prefix /var/lib/sabbath-lessons/.node_modules/
RUN npm cache clean --force

FROM base AS dev

COPY --chown=node:node code.js .
COPY --chown=node:node oppetykk.html .
COPY --chown=node:node oppetykk.pdf .
ADD template ./template/

#ENTRYPOINT rm -rf output/oppetukk && node code.js && rsync -av ./output/oppetukk /mnt/docker/docker-mount/
ENTRYPOINT ["sh", "-c", "rm -rf /mnt/docker/docker-mount/oppetukk && rm -rf output/oppetukk && pdftocairo -png -f 1 -singlefile oppetykk.pdf cover && node code.js && rsync -av ./output/oppetukk /mnt/docker/docker-mount/"]
