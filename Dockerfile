FROM node:11.14.0 as builder
WORKDIR /www

COPY package.json /www
COPY yarn.lock /www
RUN yarn

COPY . /www
RUN yarn run build

FROM nginx:latest
COPY --from=builder /www/packages /usr/share/nginx/html
COPY --from=builder /www/www.conf /etc/nginx/conf.d/default.conf

