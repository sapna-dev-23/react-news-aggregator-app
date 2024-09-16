FROM node:18-alpine
WORKDIR /react-news-aggregator-app/
COPY public/ /react-news-aggregator-app/public
COPY src/ /react-news-aggregator-app/src
COPY package.json /react-news-aggregator-app/
COPY tailwind.config.js /react-news-aggregator-app/
COPY postcss.config.js /react-news-aggregator-app/
RUN npm install
CMD [ "npm" , "start" ]

