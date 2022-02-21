FROM node:alpine
RUN mkdir -p /var/lib/sabbath-lessons/
WORKDIR /var/lib/sabbath-lessons/
RUN npm install cheerio json2md turndown handlebars
COPY code.js /var/lib/sabbath-lessons/
ENTRYPOINT node /var/lib/sabbath-lessons/code.js
