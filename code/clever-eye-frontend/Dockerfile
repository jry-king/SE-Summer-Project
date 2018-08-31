FROM openresty/openresty:alpine

COPY nginx-prometheus-metrics/nginx.conf         /usr/local/openresty/nginx/conf/
COPY nginx-prometheus-metrics/*.vhost            /usr/local/openresty/nginx/conf/
COPY nginx-prometheus-metrics/lib/prometheus.lua /usr/local/openresty/luajit/lib
WORKDIR /app
COPY ./build /app/build
RUN cp -r build/* /usr/local/openresty/nginx/html && rm -rf /app

RUN nginx -t