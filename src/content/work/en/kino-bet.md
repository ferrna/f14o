---
title: Kino Bet
order: 3
category: Quinielas
year: 2026
role: Full stack
duration: 2021 — 2026
stack: ['Laravel', 'Angular', 'Flutter']
summary: A white-label quiniela for companies, from the player PWA to admin and live scoring.
liveUrl: https://playkino.app
specs:
  - label: Surfaces
    value: PWA, admin, scoring
  - label: Model
    value: Multi-tenant white-label
cover: '../../../assets/projects/kino-home.png'
gallery:
  - src: '../../../assets/projects/kino-home.png'
    caption: Landing
  - src: '../../../assets/projects/kino-app.png'
    caption: Player app
  - src: '../../../assets/projects/kino-login.png'
    caption: Login
draft: false
---

## The brief

Tribal needed a sports pool that a company can put their name on.
Players pick match results on their phone. Admins run seasons,
matches and rankings from a panel. Each client gets a slug, colours
and their own users. It is quinielas — not a sportsbook. Talla
Mundial is one of the tenants on the same product.

## What I did

I built the three sides: a Laravel API with JWT and tenant
isolation, an Angular admin for pools, matches and publicity, and a
Flutter PWA for picks, results and ranking. Branding arrives per
tenant. Scores sync from a live-results provider on a schedule;
Tribal HQ can override a result across deployments. Push and mail
remind players before the kickoff.

The hard part was not the picks screen. It was making one codebase
serve many companies without the ranking or the score landing on
the wrong tenant.

## Outcome

The platform is live at [playkino.app](https://playkino.app).
Tenants share the same stack. A company can run a season without
shipping a new app.
