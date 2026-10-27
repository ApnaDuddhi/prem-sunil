# Sunil weds Prema 💍

A beautiful wedding invitation website with a live countdown, built with React + Vite and hosted on GitHub Pages.

**Live site:** https://ApnaDuddhi.github.io/prem-sunil/

## Wedding

**Shubh Vivah — 24 November 2026** · Sonbhadra, Uttar Pradesh

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

## Deploy

Deployment is automatic. Every push to `main` triggers the GitHub Actions
workflow in `.github/workflows/deploy.yml`, which builds the site and publishes
it to GitHub Pages.

**One-time setup:** In the GitHub repo, go to **Settings → Pages → Build and
deployment → Source** and choose **GitHub Actions**.

## Editing the details

All wedding content (names, dates, ceremonies, phone numbers, photos) lives in
[`src/weddingData.js`](src/weddingData.js). Edit that one file to update the site.

Photos are served from [`public/photos/`](public/photos/).
