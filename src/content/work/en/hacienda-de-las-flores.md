---
title: Hacienda de las Flores
order: 2
category: Real estate
year: 2026
role: Full stack
duration: 2025 — 2026
stack: ['React', 'Laravel', 'Odoo', 'CyberSource']
summary: A housing platform for Guatemala, from the lot map to the reservation and the owner portal.
status: Not public yet
specs:
  - label: Surfaces
    value: Public site, owner portal
  - label: Inventory
    value: Odoo, every 4h
  - label: Payments
    value: CyberSource / Neopay
  - label: CMS
    value: Laravel 11 + Filament
  - label: Flow
    value: Map, quote, finishes, reserve
cover: '../../../assets/projects/hdf-home.jpg'
gallery:
  - src: '../../../assets/projects/hdf-home.jpg'
    caption: Home
  - src: '../../../assets/projects/hdf-andana.jpg'
    caption: Vistas de Andana
  - src: '../../../assets/projects/hdf-gate.jpg'
    caption: About
draft: false
---

## The brief

Hacienda de las Flores needed a site that sells housing — not a
brochure with a form at the bottom. Inventory lives in Odoo. Copy
and photography are edited in a CMS. A buyer has to pick a unit on
the map, quote it, choose finishes and reserve with a card. After
that they come back as an owner. Tribal asked for the full stack:
the Laravel API and the React site.

## What I did

I built a Laravel 11 headless CMS with Filament, and a React SPA
that consumes `/api/v1`. Properties, models and towers sync from
Odoo every four hours. The public site is CMS-driven: home, Vistas
de Andana, community life, FAQs, appointments.

The purchase path is one flow: ImageMapPro lot picker, quote
calculator, personalization, reservation, CyberSource via Tribal
Neopay. The owner portal shows payments, statements, regulations
and a suggestion box. Receipts and account PDFs come from the API.

The hard part was not the map or the payment. It was keeping Odoo
stock, the CMS unit and the reservation on the same house
without the map lying.

## Spec

Public site and owner portal. Inventory from Odoo every four hours. CMS in Laravel 11 and Filament. Purchase path: lot map, quote, finishes, reservation through CyberSource / Neopay. Receipts and statements as PDF from the API.

## Outcome

The platform is built. Production is not public yet. The screens above are from the product itself.
