# API NodeJS Rest - Tshirts

## Funcionalidad

Servicio REST creado en NodeJS para soporte ecommerce de camisetas.
Implemetado con Mongodb y Redis.
Realización con Cluster.
Añadido Domain para controlar errores en la base de datos.

## Uso

1. Arrancar servidor Mongo

2. Arrancar servidor Redis
```
$ wget http://download.redis.io/redis-stable.tar.gz
$ tar xvzf redis-stable.tar.gz
$ cd redis-stable
$ make/make install

$ cd redis
$ redis-server
```

3. Arrancar servidor Products (ProductsServer)
```
$ cd tshirts-node-api-rest
$ npm install
$ node server.js
```

## Rutas REST

1. app.get('/tshirts', getAllTshirts);
2. app.get('/tshirts/:id', getTshirtById);
3. app.post('/tshirts', addTshirt); - Parámetro JSON {model:"Titulo camiseta"} requerido.
4. app.put('/tshirts/:id', updateTshirt); - Parámetro JSON {model:"Titulo camiseta"} requerido.
5. app.delete('/tshirts/:id', deleteTshirt);
6. app.get('/hot', hotTshirt);
7. app.get('/washot/:yearstart/:monthstart/:daystart/:yearend/:monthend/:dayend', washotTshirt);

## Licencia
*Roberto Marco Sánchez 2014*
Universidad Europea de Madrid
