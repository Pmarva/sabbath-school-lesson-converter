FROM node:alpine
RUN mkdir -p /var/lib/sabbath-lessons/
WORKDIR /var/lib/sabbath-lessons/
#RUN npm install cheerio json2md turndown handlebars
#ADd node_modules ./node_modules/
#COPY code.js .
#COPY oppetykk.html .
#ADD template ./template/
#RUN mkdir output
ENTRYPOINT rm -rf docker-mount/oppetukk && node code.js
#ENTRYPOINT node /tmp/code.js
