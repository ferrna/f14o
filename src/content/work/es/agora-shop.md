---
title: Agora Shop
order: 1
category: E-commerce
year: 2025
role: Full stack
duration: 2024 — 2025
stack: ['WooCommerce', 'PHP', 'Algolia', 'AWS']
summary: Una tienda de calzado para Guatemala, del sync de catálogo al pago y la factura.
liveUrl: https://agorashop.com
specs:
  - label: Catálogo
    value: Sync desde una API externa
  - label: Pagos
    value: PowerTranz, puntos, notas de crédito
  - label: Factura
    value: FEL / G4S
  - label: Búsqueda
    value: Algolia
cover: '../../../assets/projects/agora-home.png'
gallery:
  - src: '../../../assets/projects/agora-home.png'
    caption: Tienda
  - src: '../../../assets/projects/agora-catalog.png'
    caption: Catálogo
  - src: '../../../assets/projects/agora-product.png'
    caption: Producto
draft: false
---

## El encargo

Agora necesitaba una tienda que sostuviera más de 12.000 pares, hablara con
su operación y se siguiera leyendo como un shop, no como un ERP con tema.
El catálogo, el stock y las fotos llegan de afuera de WooCommerce. El
checkout tiene que resolver tarjeta, puntos, notas de crédito y factura
electrónica en la misma compra. Tribal pidió una sola persona en el full
stack.

## Qué hice

Armé y sostuve la tienda sobre WordPress y WooCommerce: Nginx, AWS WAF contra
el scraping del catálogo, y el sync diario de productos, clientes, stock e
imágenes por FTP contra una API Node externa.

Los pagos van por un gateway propio de PowerTranz (3DS, tokenización). La
factura es FEL con G4S Documenta: PDF en el pedido, mail y SAP por Grabafac.
Las devoluciones llevan evidencia fotográfica, estados de revisión, notas de
crédito automáticas y descuento de puntos. La búsqueda es Algolia, incluido
el chat de la tienda. Los reportes salen en CSV y PDF. Las plantillas de
Mailchimp y el login de Facebook viven sobre ACF.

Lo difícil no fue un plugin. Fue que esos flujos convivieran en un solo
checkout sin que el catálogo o la factura se desfasaran.

## Resultado

La tienda está en [agorashop.com](https://agorashop.com). El stock y las
fotos siguen entrando en horario. Una compra puede llevar tarjeta, puntos y
documento fiscal sin salir del pedido.
