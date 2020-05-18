FROM node:12.16.3 as builder
WORKDIR /www

COPY . /www

RUN yarn

RUN yarn run build

FROM nginx:latest
COPY --from=builder /www/packages /usr/share/nginx/html
COPY --from=builder /www/www.conf /etc/nginx/conf.d/default.conf