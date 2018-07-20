FROM nginx:latest
WORKDIR /app
COPY ./build /app/build
ADD nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
RUN cp -r build/* /usr/share/nginx/html && rm -rf /app
CMD ["nginx","-g","daemon off;"]

