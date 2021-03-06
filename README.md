# Integración de Servicios en Red

## Contenido

1. **tshirts-node-api-rest**. Primera parte obligatoria con servicio REST realizado en NodeJS para solución de camisetas online. Está implementado usando MongoDB, Redis, Clusters y Domains. Más info en: [https://github.com/robmarco/UEM_Backend/tree/master/tshirts-node-api-rest](https://github.com/robmarco/UEM_Backend/tree/master/tshirts-node-api-rest). Funcionalidades:
	* Servicio “what’s hot now”: se deberá guardar los artículo visitados (ver detalle de artículo) en redis como claves con tiempo de expiración corto (ej:1 min). Se creará un servicio que devuelva un listado de artículos que cumplan esa condición. Tip:crear claves en redis en la ruta “whatshotnow:”.
	* Servicio “what was hot then”: se deberá crear un log de artículos visitados en mongo que permita devolver una lista de artículos más visitados en un rango de tiempo. *Requisitos previos: servicio de listado de artículos y servicio de detalle de artículo.
	* Uso de domains para capturar errores en NodeJS. Crear un domain para capturar los errores del acceso a BBDD. Crear un domain para capturar los errores del servidor web: dentro del código de proceso de la request o en un middleware.
	* Crear un cluster de servidores web.

2. Servidor REST en NodeJS para crear pedidos de tienda online. La integración del servicio se lleva a cabo mediante **ProductService** y **DeliveryService**. Funcionalidad:
	* **ProductService**. API para carrito de la compra. Implementación de servicio de login usando proveedor de identidadRealizar login usando un proveedor de identidad (google,facebook, twitter,github): se asocia el pedido al usuario después de realizar un login usando passport. [http://www.sitepoint.com/passport-authentication-for-nodejs-applications/](http://www.sitepoint.com/passport-authentication-for-nodejs-applications/). INCLUYE SERVIDOR Y CLIENTE WEB (renderizado con vistas ejs por el servidor).

	* **DeliveryService**. Servidor/Client Delivery al que llegan los avisos de nuevos pedidos y se publican a una red de repartidores que los irán reclamando y marcando como entregados. INCLUYE SERVIDOR Y CLIENTE WEB.

## Uso

### Servicio tshirts-node-api-rest

Más info en: [https://github.com/robmarco/UEM_Backend/tree/master/tshirts-node-api-rest](https://github.com/robmarco/UEM_Backend/tree/master/tshirts-node-api-rest)

### Servicio ProuctService + DeliveryService

- Paso 1. Arrancar servidor Mongo
```
$ mkdir db/data
$ ./mongodb/mongod --dbpath db/data (ruta donde se encuentre el server mongo y donde se quiera almacenar la base de datos)
```
- Paso 2. Arrancar servidor Redis
```
$ wget http://download.redis.io/redis-stable.tar.gz
$ tar xvzf redis-stable.tar.gz
$ cd redis-stable
$ make/make install

$ cd redis
$ redis-server
```
- Paso 3. Arrancar servidor Products (ProductsServer) - Por defecto esta en puerto 8080
```
$ cd ProductService
$ npm install
$ node server.js
```
- Paso 4. Arrancar servidor Delivery (DeliveryServer Server) - Por defecto esta en puerto 8081
```
$ cd DeliveryService/Server
$ npm install
$ node server-delivery.js
```
- Paso 5. Arrancar cliente Delivery (DeliveryServer Client). *Se usa módulo SimpleHTTPServer de python para levantar el cliente en el puerto deseado* (Probado únicamente en sistemas UNIX).
```
$ cd DeliveryService/Client
$ python -m SimpleHTTPServer 3000
```
- Paso 6. ¡A disfrutar!

```
**Tener en cuenta que el servidor ProductService envía una notificación de Orden nueva a DeliveryService. Por ello, es importante tener los dos servidores arriba para un correcto funcionamiento**.
```

## Notas extras

- Tanto el servidor ProductService como el DeliveryService tienen clientes web. Desde el navegador podemos acceder a http://localhost:8080 y a http://localhost:3000 para comprobar su funcionamiento.
- Todos los servidores NodeJs tienen asociados un package.json. Por tanto, tal y como se especifica en el manual de uso, antes de arrancar los servicios se debe hacer un *npm install*.
- A pesar de que **ProductService** incluye la lógica incluída en **tshirts-node-api-rest**, para simplificar se ha obviado el incluir tanto los domain como clusters en **ProductService**. Si se quisiese habilitar, habría que copiar las líneas de código relacionadas con el *require('cluster')*.
- Las peticiones a los modelos TShirt y Kart (en ProductService) tienen log para saber cuanto dura la petición a la base de datos.
- El server de ProductService devuelve el tiempo consumo de memoria.

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