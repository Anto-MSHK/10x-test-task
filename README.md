# Our online courses — catalog

Card catalog with **live search** and **category filtering**, built pixel-perfect
from a Figma mock. No frameworks or libraries — **HTML + vanilla JS + SCSS**,
markup organised by the [BEM methodology](https://en.bem.info/methodology/).

🔗 **Live demo:** _add your Vercel/Netlify link here_
🎨 **Figma:** [Test Task](https://www.figma.com/design/iuXLXifXgv4ZCzad0KeYKr/Test-Task?node-id=0-1)

## Features

- **Pixel-perfect** layout from 1920 px down to 320 px.
- **Fluid responsive** design — no hard breakpoints. The grid flows 3 → 2 → 1
  columns via CSS Grid `auto-fill` + `minmax`, the controls reflow with
  `flex-wrap`, and sizes scale with `clamp()`.
- **Live search** by course title (instant, debounced, no reload).
- **Category filtering** via tabs with live counters; search and category
  combine.
- **Load more** pagination with an empty state.
- Accessible: semantic markup, `role`/`aria` on tabs, a labelled search field,
  alt text and lazy-loaded images.

## Tech stack

- **HTML5** — single static `index.html`.
- **SCSS** — compiled to `css/main.css`. Source lives in `src/scss`, split into
  `abstracts` (design tokens + mixins), `base` (reset) and one partial per BEM
  block.
- **Vanilla JS (ES modules)** — `src/js/data.js` is the single source of truth;
  `src/js/main.js` renders tabs/cards and wires up the interactions.

## Project structure

```
.
├── index.html
├── css/
│   └── main.css            # compiled SCSS (committed so the static deploy just works)
├── src/
│   ├── scss/
│   │   ├── main.scss       # entry point (@use)
│   │   ├── abstracts/      # _variables (design tokens), _mixins
│   │   ├── base/           # _reset
│   │   └── blocks/         # _catalog, _heading, _controls, _tabs, _search,
│   │                       #   _courses, _card, _badge, _load-more, _decor
│   └── js/
│       ├── data.js         # courses + categories
│       └── main.js         # rendering + search/filter/load-more
└── assets/images/          # course photos, icons, decorative shapes (from Figma)
```

## Getting started

Requires Node.js (for the SCSS compiler only).

```bash
npm install        # installs the `sass` compiler

npm run build      # compile src/scss → css/main.css (minified)
npm run dev        # watch mode while developing

npm start          # serve the folder locally (http://localhost:3000)
```

The site is fully static — `css/main.css` is committed, so it also runs by just
opening `index.html` through any static server.

## Deployment (Vercel / Netlify)

No build step is required because `css/main.css` is committed.

- **Vercel:** import the repo, framework preset **Other**, build command empty,
  output directory `.` (root).
- **Netlify:** publish directory `.` (root), build command empty.

> If you prefer building on the host: build command `npm run build`, output `.`.

## Notes & possible improvements

- **Data set.** The mock shows 9 courses while the tab counters add up to 17.
  I kept the 9 mock courses verbatim and added 8 more in the same style so the
  counts match (Marketing 4 · Management 3 · HR & Recruting 5 · Design 2 ·
  Development 3) and search / "Load more" are easy to try. The extra courses
  reuse the mock photos.
- Original mock typos (`Prduct`, `HR & Recruting`) are kept on purpose to stay
  faithful to the design.
- **What I'd add with more time:** keyboard arrow navigation between tabs,
  reflecting the active filter/search in the URL (shareable state), a skeleton
  loading state, and unit tests for the filtering logic.
