# Pinepath — Smart Baguio Travel Planner

Pinepath is a responsive trip planner for Baguio City and nearby Benguet, including La Trinidad and Tuba. Explore 35 curated places, build an editable multi-day route, review an estimated budget, inspect stops on a map, and save or share a plan without an account.

> Portfolio project. Fees, venue hours, activity prices, accessibility and travel times are planning estimates, not official or live quotes. Confirm details with venues before traveling. Lodging and travel to Baguio are excluded from budget estimates.

## Screenshots

Add screenshots of the home page, planner, map and mobile views after deployment.

## Features

- Home with quick preferences, featured places and current Baguio weather.
- Explore 35 places across Baguio, La Trinidad and nearby Benguet with search, category filters, sorting, favorites and destination details.
- Rule-based 1–5 day planner considering interests, suitability, budget, visit windows, proximity, pace, meal break and approximate travel time.
- Remove, replace, reorder, add and regenerate stops or days. Estimated costs update with edits.
- Budget breakdown for entrance, food, local transport, optional activities and miscellaneous costs, with an over-budget warning.
- Leaflet/OpenStreetMap map with category filters, markers and numbered draft itinerary route. No routing API or paid key.
- Drag/pan, wheel and pinch zoom, explicit zoom controls and a fit-to-places button on the map.
- Open-Meteo forecast with a graceful offline/error state.
- Device-local saved trips and favorites, trip rename, duplicate, edit, delete, text copy, share link and native sharing where supported.
- Print/PDF layout containing **every** itinerary day and cost summary.
- Keyboard-friendly controls, responsive layouts and reduced-motion support.

## Stack

React 19, TypeScript, Vite 6, Tailwind CSS 4, React Router, Leaflet, OpenStreetMap, Lucide React, Open-Meteo. No server, database, login, paid key or environment variable is needed.

## Run locally

Use Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the URL printed by Vite. Build and preview production output:

```bash
npm run build
npm run preview
```

## Deployment

`npm run build` writes the static site to `dist/`. Deploy that directory on Vercel or Netlify. For GitHub Pages:

1. Extract the ZIP. Its root contains `package.json`, `src/`, `public/` and the hidden `.github/` folder.
2. Create a GitHub repository and push **the extracted files** to its `main` branch. Keep `.github/workflows/deploy.yml`.
3. In the repository, select **Settings → Pages → Build and deployment → GitHub Actions**. A push to `main` runs `npm ci`, builds, and deploys `dist/`.

No secrets or environment variables are required. Vite's relative `base: './'` supports project subpaths. React Router uses hash URLs (`/#/explore`, `/#/planner`) so deep links refresh on static hosts without a rewrite rule. Do not commit `node_modules` or `dist`; the workflow creates the deployment output.

The live Sites checkout has its own hosting configuration. The GitHub-ready ZIP does not need that configuration.

## Project structure

```text
src/
  components/  navigation, cards, weather
  data/        curated destination records
  hooks/       weather and device-local storage
  pages/       home, explore, details, planner, map, saved, about
  types/       shared TypeScript models
  utils/       dates, travel estimates, planning, cost calculations
public/       favicon
```

## How planning works

The planner scores curated destinations against selected interests and suitability flags, then prefers nearby places. It avoids duplicate stops across the generated trip and schedules a conservative daytime window with a midday meal gap. Approximate transfer minutes come from straight-line distance with a buffer; these are **not** live traffic estimates or turn-by-turn directions. Evening venues are available for manual addition. Costs use editable planning allowances in `src/data/destinations.ts` plus per-person daily food and local transport assumptions in `src/utils/planner.ts`.

## Data, image and service notes

Destination coordinates (including approximate pins for some stops), descriptions and indicative allowances are a starting dataset, not a maintained official directory. Some cards use clearly labeled illustrative area photos. Consult the [official Baguio tourism portal](https://visita.baguio.gov.ph/) for current venue information. The photos are loaded from Wikimedia Commons and each card/detail page links to the corresponding file page for credit and license information. Individual photos have different licenses; review each source page before redistributing the images as downloaded files. The site uses OpenStreetMap standard tiles with attribution and loads them only when the map page opens. Follow the [tile usage policy](https://operations.osmfoundation.org/policies/tiles/) if scaling traffic. Forecast data comes from [Open-Meteo](https://open-meteo.com/en/docs).

Trips and favorites use browser localStorage. They do not sync between devices and disappear if browser data is cleared. A share link serializes only trip preferences and destination IDs; anyone holding it can view the plan. No personal account data is collected.

## Project status

Portfolio-ready V2 with 35 destinations. Future work: verify venue pricing/hours from an updatable source, add accessible route data and traffic-aware travel times, and replace photo hotlinks with an audited licensed image set.
