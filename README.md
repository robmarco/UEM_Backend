# Integración de Servicios en Red

## Contenido

1. **tshirts-node-api-rest**. Primera parte obligatoria con servicio REST realizado en NodeJS para solución de camisetas online. Está implementado usando MongoDB, Redis, Clusters y Domains. Más info en: [https://github.com/robmarco/UEM_Backend/tree/master/tshirts-node-api-rest](https://github.com/robmarco/UEM_Backend/tree/master/tshirts-node-api-rest). Funcionalidades:
	* Servicio “what’s hot now”: se deberá guardar los artículo visitados (ver detalle de artículo) en redis como claves con tiempo de expiración corto (ej:1 min). Se creará un servicio que devuelva un listado de artículos que cumplan esa condición. Tip:crear claves en redis en la ruta “whatshotnow:”.
	* Servicio “what was hot then”: se deberá crear un log de artículos visitados en mongo que permita devolver una lista de artículos más visitados en un rango de tiempo. *Requisitos previos: servicio de listado de artículos y servicio de detalle de artículo.
	* Uso de domains para capturar errores en NodeJS. Crear un domain para capturar los errores del acceso a BBDD. Crear un domain para capturar los errores del servidor web: dentro del código de proceso de la request o en un middleware.
	* Crear un cluster de servidores web.

2. Servidor REST en NodeJS para crear pedidos de tienda online. La integración del servicio se lleva a cabo mediante **ProductService** y **DeliveryService**. Funcionalidad:
	* **ProductService**. API para carrito de la compra. Implementación de servicio de login usando proveedor de identidadRealizar login usando un proveedor de identidad (google,facebook, twitter,github): se asocia el pedido al usuario después de realizar un login usando passport. [http://www.sitepoint.com/passport-authentication-for-nodejs-applications/](http://www.sitepoint.com/passport-authentication-for-nodejs-applications/). INCLUYE CLIENTE WEB.

	* **DeliveryService**. Servidor/Client Delivery al que llegan los avisos de nuevos pedidos y se publican a una red de repartidores que los irán reclamando y marcando como entregados.

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
$ cd ProductService
$ node server.js
```


## Licencia
*Roberto Marco Sánchez 2014*
Universidad Europea de Madrid