---
title: Barista
order: 4
category: E-commerce
year: 2026
role: Full stack
duration: '2026'
stack: ['Go', 'Next.js', 'Kotlin', 'Voucherify']
summary: A coffee chain for Guatemala, from pickup and delivery to beans, wallet and the store POS.
cover: '../../../assets/projects/barista-origin.png'
gallery:
  - src: '../../../assets/projects/barista-origin.png'
    caption: Museo del Café
  - src: '../../../assets/projects/barista-cup.png'
    caption: Brand
  - src: '../../../assets/projects/barista-playlist.png'
    caption: Playlists
draft: false
---

## The brief

Barista needed the shop, the app and the store to sell the same
coffee. Pickup, delivery, loyalty beans, a digital wallet with QR,
and an admin for products and locations. The stack is Go
microservices on Huawei Cloud. Tribal took the platform, made it
run locally, and closed the flows that were still open.

## What I did

I stood up the local mesh: twelve Go APIs, MySQL, Redis, the
Next.js store, the React admin and the Android app (Google and
Huawei). Loyalty talks to Voucherify for real. Cards go through
PowerTranz with 3DS. The store talks to Micros POS. Push is
OneSignal.

I finished the wallet, the admin CRUD for museum, playlists,
tutorials and scheduled notifications, UTF-8 login, and the Huawei
crash on start.

The hard part was not one service. It was making the order, the
beans and the wallet agree across web, Android and the POS
without a queue in the middle.

## Outcome

The platform is built. Production is not public yet.
