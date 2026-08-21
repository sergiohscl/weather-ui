FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY patches ./patches

RUN echo "=== PACKAGE LOCK ==="
RUN sha256sum package-lock.json

RUN npm ci

RUN node --version
RUN npm --version

RUN npm list ng2-charts chart.js

RUN echo "=== CHART.JS TYPES ==="
RUN ls -la node_modules/chart.js/dist/types/

RUN echo "=== UTILS ==="
RUN ls -la node_modules/chart.js/dist/types/utils*

COPY . .

RUN npm run build


FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/weather-ui/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]