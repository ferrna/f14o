---
title: Bantrab
order: 5
category: Banca
year: 2026
role: Full stack
duration: '2026'
stack: ['WordPress', 'PHP', 'Vite', 'VIP Go']
summary: El sitio institucional de un banco en Guatemala, de las fichas de producto al cotizador y el flujo editorial.
cover: '../../../assets/projects/bantrab-hero.jpg'
gallery:
  - src: '../../../assets/projects/bantrab-hero.jpg'
    caption: Marca
  - src: '../../../assets/projects/bantrab-cotizador.jpg'
    caption: Cotizador
  - src: '../../../assets/projects/bantrab-team.jpg'
    caption: Institución
draft: false
---

## El encargo

Bantrab necesitaba un sitio corporativo que un banco pueda
publicar sin que la última página en vivo se apague. Fichas de
producto, cotizadores con PDF, un localizador de agencias, el
tipo de cambio en el header y un camino de editor a publisher.
Tribal pasó el sitio institucional a WordPress VIP. Producción
todavía no es pública.

## Qué hice

Armé el child theme en VIP Go: bloques Gutenberg, Vite y
Tailwind, plantillas de producto, cotizadores con Dompdf, el
mapa de agencias y el endpoint del tipo de cambio desde el
sistema del banco. El login del CMS es Microsoft Entra SAML.
Una revisión no reemplaza el snapshot en vivo. Las URLs viejas
conservan un 301.

Lo difícil no fue un bloque. Fue que el banco edite sin que la
página pública se apague, y sin que las URLs viejas pierdan
su lugar.

## Resultado

La plataforma está armada. Producción todavía no es pública.
