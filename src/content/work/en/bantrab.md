---
title: Bantrab
order: 5
category: Banking
year: 2026
role: Full stack
duration: '2026'
stack: ['WordPress', 'PHP', 'Vite', 'VIP Go']
summary: The institutional site for a Guatemalan bank, from product pages to calculators and editorial workflow.
cover: '../../../assets/projects/bantrab-hero.jpg'
gallery:
  - src: '../../../assets/projects/bantrab-hero.jpg'
    caption: Brand
  - src: '../../../assets/projects/bantrab-cotizador.jpg'
    caption: Calculator
  - src: '../../../assets/projects/bantrab-team.jpg'
    caption: Institution
draft: false
---

## The brief

Bantrab needed a corporate site that a bank can publish without
the last live page going dark. Product pages, calculators with
PDF, a branch locator, the USD rate in the header, and a path
from editor to publisher. Tribal moved the institutional site
onto WordPress VIP. Production is not public yet.

## What I did

I built the VIP Go child theme: Gutenberg blocks, Vite and
Tailwind, product templates, cotizadores with Dompdf, the
branch map, and the exchange-rate endpoint from the bank's
system. CMS login is Microsoft Entra SAML. A review does not
replace the live snapshot. Legacy URLs keep a 301.

The hard part was not a block. It was letting the bank edit
without the public page going dark, and without the old URLs
losing their rank.

## Outcome

The platform is built. Production is not public yet.
