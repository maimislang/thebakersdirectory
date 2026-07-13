# The Baker's Directory

A free, curated supplier directory for home bakers, microbakeries and professional bakeries.

## Site structure

- `index.html` — page structure and editorial copy
- `styles.css` — responsive visual design
- `app.js` — search, filters, supplier cards and structured data
- `suppliers.js` — supplier catalogue
- `favicon.svg` — site icon
- `CNAME` — custom domain

## Add or edit a supplier

Open `suppliers.js` and update one object in `window.SUPPLIERS`.

Required fields:

- `name`
- `region` (`Philippines` or `International`)
- `location`
- `categories` (array)
- `levels` (`Beginner`, `Growing bakery`, `Professional`)
- `bestFor`
- `description`
- `website`
- `mapsQuery`
- `access`

Set `featured: true` only for especially useful first-stop suppliers.

## Editorial standard

Listings should be useful, current and direct. Avoid paid placement language, copied marketing claims and unverified superlatives. Re-check links, locations and availability before each dated directory review.
