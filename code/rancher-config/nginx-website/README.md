# Docker-compose for website

## nginx.conf

Besides website service, this nginx server also provides static video resources in order to avoid canvas.toDataUrl() CORS problem.(Canvas is used to take a screenshot of static videos.)