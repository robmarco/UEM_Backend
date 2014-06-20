# API NodeJS Rest - Tshirts

## Funcionalidad

Servicio REST creado en NodeJS para soporte ecommerce de camisetas.
Implemetado con Mongodb y Redis.
Realización con Cluster.
Añadido Domain para controlar errores en la base de datos.

## Uso

1. Arrancar servidor Mongo
```
$ mkdir db/data
$ ./mongodb/mongod --dbpath db/data (ruta donde se encuentre el server mongo y donde se quiera almacenar la base de datos)
```

2. Arrancar servidor Redis
```
$ wget http://download.redis.io/redis-stable.tar.gz
$ tar xvzf redis-stable.tar.gz
$ cd redis-stable
$ make/make install

$ cd redis
$ redis-server
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

Copyright (c) 2010-2014 Roberto Marco Sánchez
https://github.com/robmarco

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
