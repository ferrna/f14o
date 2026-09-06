---
title: Barista
order: 4
category: Plataforma retail
year: 2026
role: Full stack
duration: '2026'
stack: ['Go', 'Next.js', 'Kotlin', 'Voucherify']
summary: Una cadena de café para Guatemala, del pickup y el delivery a los granos, el monedero y el POS.
status: Todavía no es público
specs:
  - label: Superficies
    value: Tienda, admin, Android
  - label: Mesh
    value: 12 APIs Go, MySQL, Redis
  - label: Pagos
    value: PowerTranz 3DS
  - label: Lealtad
    value: Voucherify
  - label: Local
    value: Micros POS
cover: '../../../assets/projects/barista-origin.png'
gallery:
  - src: '../../../assets/projects/barista-origin.png'
    caption: Museo del Café
  - src: '../../../assets/projects/barista-cup.png'
    caption: Marca
  - src: '../../../assets/projects/barista-playlist.png'
    caption: Playlists
draft: false
---

## El encargo

Barista necesitaba que la tienda, la app y el local vendieran el
mismo café. Pickup, delivery, granos de lealtad, un monedero con
QR y un admin de productos y sucursales. El stack es
microservicios en Go sobre Huawei Cloud. Tribal tomó la
plataforma, la hizo correr en local y cerró los flujos que
seguían abiertos.

## Qué hice

Levanté el mesh local: doce APIs en Go, MySQL, Redis, la tienda
en Next.js, el admin en React y la app Android (Google y Huawei).
La lealtad habla con Voucherify de verdad. Las tarjetas van por
PowerTranz con 3DS. El local habla con Micros POS. El push es
OneSignal.

Terminé el monedero, el CRUD del admin para museo, playlists,
tutoriales y notificaciones programadas, el login en UTF-8 y el
crash de Huawei al arrancar.

Lo difícil no fue un servicio. Fue que el pedido, los granos y el
monedero coincidieran entre web, Android y el POS sin una cola
en el medio.

## Spec

Tienda en Next.js, admin en React, Android en Google y Huawei. Doce APIs en Go, MySQL, Redis. Lealtad por Voucherify. Tarjetas por PowerTranz con 3DS. El local habla con Micros POS. El push es OneSignal.

## Resultado

La plataforma está armada. Producción todavía no es pública. Las capturas de arriba son del producto.
