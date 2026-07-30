# Happy Plant — happyplantapp.com

Static site for the Happy Plant iOS app (Happy Plant - No Water Thirst, App Store id 1054160794).
Rebuilt July 2026 from a Claude Design export into plain HTML/CSS/JS. No build step.

## Structure

- `index.html` — home (mascot, features, reviews, demo video, coming soon, origin teaser)
- `about/` — story, timeline, founders, press kit
- `support/` — FAQ (FAQPage schema) + contact
- `privacy/` — privacy policy (content carried over from the old WordPress site)
- `press/`, `blog/`, `succulent-apps/` — redirect stubs for old WordPress URLs
- `404.html` — GitHub Pages picks this up automatically
- `css/site.css` — shared styles, keyframes, responsive rules
- `js/site.js` — nav, scroll reveals, watering-cursor droplets
- `js/home.js` — mascot thirst/watering, streaks (localStorage `hp_site_plant`), selfie booth, video embed

## Notes

- The App Store links point at the real listing (`apps.apple.com/.../id1054160794`); the old
  `appstore.com/happyplantnowaterthirst` vanity URL redirects to a broken generic page.
- `aggregateRating` in the home page schema (4.8, 6 ratings) came from Apple's iTunes API
  (US storefront) on 2026-07-30. Update or remove if it drifts.
- The privacy policy still references Fabric.io, which Google shut down in 2020.
  Text was carried over as-is; worth a legal refresh when the app update ships.
- OG image source lives in this repo's history only as the rendered `assets/og-image.png` (1200x630).

## Deploy

GitHub Pages serves the repo root. Custom domain: happyplantapp.com
(set in repo Settings → Pages; update DNS A/AAAA records at the registrar, then Enforce HTTPS).
