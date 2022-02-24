FROM node:alpine
RUN mkdir -p /var/lib/sabbath-lessons/
WORKDIR /var/lib/sabbath-lessons/
RUN npm install cheerio json2md turndown handlebars
COPY code.js /var/lib/sabbath-lessons/
COPY oppetykk.html /var/lib/sabbath-lessons/
ADD template /var/lib/sabbath-lessons/template/
RUN ls -lah /var/lib/sabbath-lessons/
ENTRYPOINT node /var/lib/sabbath-lessons/code.js && mv /var/lib/sabbath-lessons/oppetukk /tmp/sabbath-lessons/
