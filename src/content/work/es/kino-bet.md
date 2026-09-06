---
title: Kino Bet
order: 3
category: Quinielas
year: 2026
role: Full stack
duration: 2021 — 2026
stack: ['Laravel', 'Angular', 'Flutter']
summary: Una quiniela white-label para empresas, de la PWA del jugador al admin y el marcador.
liveUrl: https://playkino.app
specs:
  - label: Superficies
    value: PWA, admin, marcador
  - label: Modelo
    value: White-label multi-tenant
cover: '../../../assets/projects/kino-home.png'
gallery:
  - src: '../../../assets/projects/kino-home.png'
    caption: Landing
  - src: '../../../assets/projects/kino-app.png'
    caption: App del jugador
  - src: '../../../assets/projects/kino-login.png'
    caption: Login
draft: false
---

## El encargo

Tribal necesitaba una quiniela que una empresa pueda ponerse
encima. Los jugadores eligen resultados en el celular. Los admins
arman temporadas, partidos y rankings desde un panel. Cada cliente
tiene slug, colores y sus usuarios. No es un sportsbook. Talla
Mundial es uno de los tenants del mismo producto.

## Qué hice

Armé los tres lados: una API en Laravel con JWT y aislamiento por
tenant, un admin en Angular para pools, partidos y publicidad, y
una PWA en Flutter para picks, resultados y ranking. El branding
llega por tenant. Los marcadores entran de un proveedor en
horario; Tribal HQ puede corregir un resultado en todos los
deploys. Push y mail recuerdan el partido.

Lo difícil no fue la pantalla de picks. Fue que un solo codebase
sirva a muchas empresas sin que el ranking o el marcador caigan
en el tenant equivocado.

## Resultado

La plataforma está en [playkino.app](https://playkino.app). Los
tenants comparten el mismo stack. Una empresa puede correr una
temporada sin publicar una app nueva.
