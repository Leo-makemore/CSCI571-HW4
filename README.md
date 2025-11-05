Events Around — CSCI 571 HW3
=================================

Beginner-friendly guide for running, developing, and extending this project.

Overview
--------
Events Around is a full‑stack web app built with React (Vite) and Node.js (Express). It lets users:
- Search Ticketmaster events with autocomplete
- View event details (Info, Artists/Teams with Spotify, Venue)
- Save events to Favorites (MongoDB Atlas)
- Share to Facebook and Twitter

Tech Stack
---------
- Frontend: React + Vite, TypeScript, custom CSS (light Tailwind-like utilities)
- Backend: Node.js + Express
- APIs: Ticketmaster Discovery, Spotify Web API, Google Geocoding, IPinfo
- Database: MongoDB Atlas (Database: Ticketmaster, Collection: favourites)

Repository Structure
--------------------
- client/ — React front-end (Vite)
  - src/
    - components/ — Navbar, Autocomplete, UI primitives
    - pages/ — SearchPage, EventDetailsPage, FavoritesPage
    - contexts/ — SearchContext (preserve form + results + scroll)
    - index.css — global styles (black/white theme, rounded, soft shadows)
  - vite.config.ts — local dev proxy (optional)

- server/ — Express API server
  - index.js — API routes: /api/suggest, /api/events, /api/events/:id,
               /api/spotify/search, /api/spotify/albums/:artistId,
               /api/favorites (GET/POST/DELETE)
  - .env — secrets for local dev (not committed)

- app.yaml — GAE deployment config (if deploying to App Engine)

Prerequisites
-------------
- Node.js 18+
- A MongoDB Atlas cluster (or compatible MongoDB)
- API keys/tokens
  - Ticketmaster: required (server-side)
  - Spotify client id/secret: required (server-side)
  - Google Maps Geocoding key: required (client-side)
  - IPinfo token: required (client-side)

Environment Variables
---------------------
Create server/.env with your values (example):

```
TICKETMASTER_API_KEY=your_ticketmaster_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/?retryWrites=true&w=majority&appName=Cluster0
CORS_ORIGIN=http://localhost:5176
PORT=8080
```

Frontend .env (optional) — create client/.env.local if you want to expose keys on the client:
```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_IPINFO_TOKEN=your_ipinfo_token
```

Important: Ticketmaster API must be called from the server (to keep the key secret). Google Geocoding + IPinfo are called from the client by design.

Install & Run Locally
---------------------
1) Install dependencies
```
cd server && npm install
cd ../client && npm install
```

2) Start backend
```
cd server
npm start
# expect: Server listening on http://localhost:8080
```

3) Start frontend
```
cd client
npm run dev
# Vite shows Local: http://localhost:5176/
```

4) Open the app
- Frontend: http://localhost:5176/
- Backend health: http://localhost:8080/api/health

Vite Dev Proxy (optional)
-------------------------
To avoid CORS and not hardcode ports in the frontend, you can proxy all /api calls to the backend during development. In `client/vite.config.ts` add:

```ts
server: {
  proxy: {
    '/api': 'http://localhost:8080'
  }
}
```
Then, in the frontend always `fetch('/api/...')` (no hostname).

How Favorites Work (MongoDB)
----------------------------
- Database: Ticketmaster
- Collection: favourites
- Endpoints
  - GET /api/favorites — returns all favorites
  - POST /api/favorites — add one favorite
  - DELETE /api/favorites/:eventId — remove favorite by eventId

Verify persistence:
1) In UI, open an event details page and click “Add to Favorites”.
2) Visit http://localhost:8080/api/favorites — you should see records.
3) In MongoDB Atlas, database Ticketmaster, collection favourites — refresh and check documents.

Frontend Features
-----------------
- Search Page
  - One-line form: Keyword (autocomplete), Category, Distance (miles), Location, Auto-detect
  - Keyword autocomplete: Ticketmaster Suggest (debounced, keyboard nav, clear/toggle buttons)
  - Auto Detect uses IPinfo; Location (manual) uses Google Geocoding (lat/lng for search)
  - Results grid: up to 20 cards, click to open Event Details
  - Search state + scroll position preserved when navigating back

- Event Details Page
  - Title, Buy Tickets, Favorite button
  - Tabs (full-width, three equal segments): Info, Artists/Teams, Venue
  - Info: date/time, category, price range, event info, pleaseNote, social share
  - Seat Map: renders Ticketmaster seatmap.staticUrl if available
  - Artists: Spotify data (name, followers, popularity, link, albums grid)
  - Venue: name, address, city/state/country, coordinates

- Favorites Page
  - Shows saved events, remove favorites, open Ticketmaster links
  - Persists across reloads via MongoDB Atlas

Code Conventions
----------------
- TypeScript for front-end pages/components
- High readability code, descriptive names, minimal nested logic
- Comments only for non-obvious rationale

Common Tasks for Development
----------------------------
- Adjust styling (global): edit `client/src/index.css` (black/white, rounded corners, soft shadows)
- Tune Autocomplete look/feel: `client/src/components/Autocomplete.tsx`
- Modify Search state persistence: `client/src/contexts/SearchContext.tsx`
- Edit backend API: `server/index.js`

Troubleshooting
---------------
- Frontend launches but “no styles”: ensure `client/src/index.css` is imported in `main.tsx`
- “This site can’t be reached” for /api endpoints:
  - Ensure backend is running on 8080 and health returns ok
  - Access the right port (don’t call /api on 5176 directly unless Vite proxy is configured)
- Favorites don’t show in Atlas:
  - Confirm you added via UI first; then check `Ticketmaster.favourites`
  - Ensure Atlas Network Access allows your IP; verify `MONGODB_URI`
- Spotify returning empty:
  - Double-check client id/secret; ensure token is obtained on the server

API Reference (Server)
----------------------

- GET `/api/health`
  - Returns server status `{ ok: true }`.

- GET `/api/suggest?keyword=<q>`
  - Proxies Ticketmaster Suggest.

- GET `/api/events?keyword=<q>&category=<name|All>&distance=<miles>&lat=<lat>&lng=<lng>`
  - Proxies Ticketmaster events; returns first page (≤20), sorted by date asc.

- GET `/api/events/:id`
  - Proxies Ticketmaster event details; includes `seatmap.staticUrl` when available.

- GET `/api/spotify/search?q=<artist>&type=artist`
  - Server obtains OAuth token and queries Spotify.

- GET `/api/spotify/albums/:artistId`
  - Returns the artist's albums (limit 8).

- Favorites (MongoDB Atlas — DB: `Ticketmaster`, Collection: `favourites`)
  - GET `/api/favorites`
  - POST `/api/favorites` (JSON body)
  - DELETE `/api/favorites/:eventId`

Data Model (Favorites)
----------------------
```json
{
  "eventId": "string",
  "eventName": "string",
  "eventDate": "YYYY-MM-DD",
  "eventTime": "HH:mm:ss",
  "eventVenue": "string",
  "eventImage": "https://...",
  "eventUrl": "https://...",
  "createdAt": "ISODate"
}
```

Frontend Architecture
---------------------
- Routing: `/` → Search, `/search` → Search, `/event/:id` → Details, `/favorites` → Favorites
- Global State: `SearchContext` preserves form inputs, last results, and scroll position
- Components:
  - `Autocomplete`: debounced suggest, keyboard nav, clear/toggle, click‑outside close
  - Result Card: date, venue, segment badge, buy button, favorite toggle
  - Details Tabs: full‑width 3 columns (Info, Artists/Teams, Venue)

Styling Principles
------------------
- Black/white palette, soft shadows, generous rounded corners
- Subtle hover and focus rings; avoid heavy borders
- Consistent spacing scale (4/8/12/16px)

Quality Checklist
-----------------
- [ ] Search validation: keyword required; location disabled when auto‑detect
- [ ] Autocomplete: debounced requests; close on outside click; keyboard navigation
- [ ] Results: max 20; click card to navigate; back preserves state + scroll
- [ ] Details: title prominent; buy + favorite aligned; tabs full‑width equal parts
- [ ] Info: date/time, category, price (when present), info/pleaseNote
- [ ] Seat Map: show `seatmap.staticUrl` when present; otherwise friendly placeholder
- [ ] Artists: name, followers (formatted), popularity, Spotify link, albums grid
- [ ] Venue: address and coordinates shown when present
- [ ] Favorites: add/remove works; state consistent across pages; persists in MongoDB

Roadmap & Extensions
--------------------
- Pagination and server‑side filters (date range, city)
- Caching (LRU) to reduce API calls and speed up suggest
- Google Maps embed on Venue tab; directions deep links
- User accounts and per‑user favorites

FAQ
---
Q: Why not call Ticketmaster from the client?
A: It would expose your secret API key. The server proxies these calls.

Q: I can’t see favorites in Atlas.
A: Ensure you actually added at least one favorite, check database/collection names, and confirm your IP is allow‑listed.

Q: Seat map says “not available”.
A: Many events don’t provide a `seatmap.staticUrl`. We show the image when available.

GitHub — Create and Push Repository
-----------------------------------
Initialize in project root (one time):
```
git init
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
```

Recommended .gitignore (already provided below — create if missing):
```
node_modules/
client/node_modules/
server/node_modules/
client/dist/
.env
server/.env
.DS_Store
```

Commit and push:
```
git add .
git commit -m "feat: initial commit (client + server)"
git push -u origin main
```

Branch workflow (suggested):
```
git checkout -b feat/autocomplete-polish
# ...code...
git add -A && git commit -m "feat(autocomplete): softer hover and spacing"
git push -u origin feat/autocomplete-polish
# Open a Pull Request on GitHub
```

Deploy (High‑level)
-------------------
See also DEPLOYMENT notes in this repo. Typical steps:
1) `cd client && npm run build` → produces `client/dist`
2) Ensure `server/index.js` serves `client/dist` (already configured)
3) Set env vars in the cloud environment (Ticketmaster/Spotify/Mongo/Origins)
4) Deploy (App Engine: `gcloud app deploy`, or Cloud Run via container)

Change Log
----------
See `process_log.md` and `ai-conversation-index-html.md` for a history of decisions and UI work.

Deploying to Google Cloud (High-level)
--------------------------------------
1) Build frontend: `cd client && npm run build` (generates client/dist)
2) Ensure server serves client/dist (already configured)
3) App Engine: set env vars in app.yaml or GCP console; deploy with `gcloud app deploy`
4) Cloud Run: containerize server + bundled dist, set env vars, deploy and map custom domain if needed

Extending the Project
---------------------
- Add caching (e.g., LRU) to reduce API calls
- Add pagination for search results beyond 20
- Add map view for venues using Google Maps JS SDK
- Add user accounts and per-user favorites

License
-------
For academic use in CSCI 571—Fall 2025.


