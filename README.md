# Integración de Servicios en Red

## Contenido

1. Servidor REST en NodeJS para crear pedidos de tienda online 
⋅⋅1. Carro de la compra en redis: añade líneas de pedido al carro de la compra(id de carro). Si no existe el id del carro se crearía uno nuevo. Se almacenarán en redis con un tiempo de expiración configurable. Alta de pedido en mongo: confirma el pedido con el id del carro. Se almacena el nuevo pedido en mongo. El id de pedido puede ser el mismo que el carro.
⋅⋅2. Servicio “what’s hot now”: se deberá guardar los artículo visitados (ver detalle de artículo) en redis como claves con tiempo de expiración corto (ej:1 min). Se creará un servicio que devuelva un listado de artículos que cumplan esa condición. Tip:crear claves en redis en la ruta “whatshotnow:”.
⋅⋅3. Servicio “what was hot then”: se deberá crear un log de artículos visitados en mongo que permita devolver una lista de artículos más visitados en un rango de tiempo. *Requisitos previos: servicio de listado de artículos y servicio de detalle de artículo.*

2. Uso de domains para capturar errores en NodeJS 
⋅⋅1. Crear un domain para capturar los errores del acceso a BBDD
⋅⋅2. Crear un domain para capturar los errores del servidor web: dentro del código de proceso de la request o en un middleware. 
⋅⋅3. Crear un cluster de servidores web.

3. Implementación de servicio de login usando proveedor de identidadRealizar login usando un proveedor de identidad (google,facebook, twitter,github): se asocia el pedido al usuario después de realizar un login usando passport. [http://www.sitepoint.com/passport-authentication-for-nodejs-applications/](http://www.sitepoint.com/passport-authentication-for-nodejs-applications/)

4. Servidor Delivery al que llegan los avisos de nuevos pedidos y se publican a una red de repartidores que los irán reclamando y marcando como entregados.
⋅⋅1. Conexión sistema de pedidos sistema de envíos: el sistema de envíos estará en otro servicio (servidor web escuchando en otro puerto) y proporciona un API que permite al sistema de pedidos: 

⋅⋅⋅a) Comunicar la llegada de nuevos pedidos. Esta llamada debería de ser no bloqueante. 
⋅⋅⋅b) Consultar el estado de un pedido. 
⋅⋅⋅c) Conexión con la red de repartidores: el sistema de envíos tendrá una página que permita la recepción de nuevos envíos en tiempo real. 
⋅⋅⋅d) Al cargar la página presenta los pedidos pendientes (sin reclamar ni entregar). 
⋅⋅⋅e) El servidor enviará las notificaciones de nuevos pedidos a la página (SSE o socket.io).⋅⋅⋅f) El repartidor marca como reclamado un pedido (AJAX).El servidor debe enviar el cambio de estatus del pedido al resto.Posibilidad de error (otro llega antes). 
⋅⋅⋅g) El repartidor marca como entregado un pedido reclamado(AJAX).

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