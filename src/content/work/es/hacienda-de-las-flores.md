---
title: Hacienda de las Flores
order: 2
category: Inmobiliario
year: 2026
role: Full stack
duration: 2025 — 2026
stack: ['React', 'Laravel', 'Odoo', 'CyberSource']
summary: Una plataforma de viviendas para Guatemala, del mapa de lotes a la reserva y el portal del propietario.
cover: '../../../assets/projects/hdf-home.jpg'
gallery:
  - src: '../../../assets/projects/hdf-home.jpg'
    caption: Inicio
  - src: '../../../assets/projects/hdf-andana.jpg'
    caption: Vistas de Andana
  - src: '../../../assets/projects/hdf-gate.jpg'
    caption: Hacienda
draft: false
---

## El encargo

Hacienda de las Flores necesitaba un sitio que venda viviendas, no
un brochure con un formulario al final. El inventario vive en Odoo.
Los textos y las fotos se editan en un CMS. Un comprador tiene que
elegir unidad en el mapa, cotizar, personalizar y reservar con
tarjeta. Después vuelve como propietario. Tribal pidió el full
stack: la API en Laravel y el sitio en React.

## Qué hice

Armé un CMS headless en Laravel 11 con Filament, y una SPA en React
que consume `/api/v1`. Las propiedades, los modelos y las torres
entran desde Odoo cada cuatro horas. El sitio público sale del CMS:
home, Vistas de Andana, vida en comunidad, FAQs, citas.

El camino de compra es un solo flujo: selector de lotes con
ImageMapPro, cotizador, personalización, reserva, CyberSource por
Tribal Neopay. El portal del propietario muestra pagos, estados de
cuenta, reglamentos y un buzón. Los PDFs de recibo y cuenta salen
de la API.

Lo difícil no fue el mapa ni el pago. Fue que el stock de Odoo, la
unidad del CMS y la reserva hablaran de la misma vivienda sin que
el mapa mintiera.

## Resultado

La plataforma está armada. Producción todavía no es pública.
