# FoodMaxxing

Affordable meal ideas for Dutch students. Built with vanilla HTML/CSS/JS and **React + Framer Motion** for the home page accordions (Tips & Ideas).

## Run the app

**Development (required for React + scripts):**

```bash
npm install
npm run dev
```

Then open **http://localhost:5173/** (or the port Vite prints). All pages (index, generator, profile, explore, login) are served by Vite; scripts are loaded from `/public`.

**Production build:**

```bash
npm run build
```

Output is in `dist/`. Serve `dist/` with any static server.

## Tech

- **React** + **Framer Motion**: Article cards and Discovery (Ideas) cards on the home page use React for state and Framer Motion for expand/collapse (springs, AnimatePresence, layout).
- **Vanilla JS** (in `public/`): Auth, recipe API, generator, dark mode, chatbot.
- **CSS**: `styles.css` (global styles for the site).

## Project layout

- `index.html` – Home; contains `#article-cards-root` and `#discovery-cards-root` where React mounts.
- `src/main.jsx` – Entry that mounts `ArticleCards` and `DiscoveryCards`.
- `src/ArticleCards.jsx` – Accordion for “Tips for Smarter Grocery Shopping” (one open at a time, motion).
- `src/DiscoveryCards.jsx` – Accordion for “Student Meal Ideas” (one open at a time, scroll-into-view, Explore button).
- `public/` – Legacy scripts (auth, recipes-api, script, dark-mode, chatbot) served at `/` without transformation.
