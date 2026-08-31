---
title: Agora Shop
order: 1
category: E-commerce
year: 2025
role: Full stack
duration: 2024 — 2025
stack: ['WooCommerce', 'PHP', 'Algolia', 'AWS']
summary: A footwear store for Guatemala, from catalog sync to payments and invoicing.
liveUrl: https://agorashop.com
cover: '../../../assets/projects/agora-home.png'
gallery:
  - src: '../../../assets/projects/agora-home.png'
    caption: Storefront
  - src: '../../../assets/projects/agora-catalog.png'
    caption: Catalog
  - src: '../../../assets/projects/agora-product.png'
    caption: Product
draft: false
---

## The brief

Agora needed a store that could hold more than 12,000 pairs, talk to their
existing operations, and still feel like a shop — not an ERP with a theme on
top. Catalog, stock and images arrive from outside WooCommerce. Checkout has
to settle cards, loyalty points, credit notes and electronic invoices in the
same purchase. Tribal asked for one person on the full stack.

## What I did

I built and ran the store on WordPress and WooCommerce: Nginx, AWS WAF against
catalog scrapers, and the daily sync of products, customers, stock and FTP
images against an external Node API.

Payments go through a custom PowerTranz gateway (3DS, tokenization). Invoicing
is FEL via G4S Documenta, with the PDF on the order, mail out, and SAP through
Grabafac. Returns carry photo evidence, review states, automatic credit notes
and loyalty deduction. Search is Algolia, including the shop chat. Reporting
exports CSV and PDF. Mailchimp templates and Facebook login sit on top of ACF.

The hard part was not any one plugin. It was making those flows coexist on a
single checkout without the catalog or the invoice falling out of step.

## Outcome

The store is live at [agorashop.com](https://agorashop.com). New stock and
images keep landing on a schedule. A purchase can take a card, points and a
fiscal document without leaving the order.
