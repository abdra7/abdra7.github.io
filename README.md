# abdra7.github.io

Production build of [Abdulrahim Alharbi](https://abdulrahim.page)'s personal
portfolio — a Vite + React + Tailwind v4 single-page brochure showcasing the
**Darbak** logistics application and the **Visit System** project.

- **Live site (custom domain):** https://abdulrahim.page
- **Live site (Pages URL):** https://abdra7.github.io
- **Source repository:** the build is generated from a separate Vite project and
  copied here for static hosting.

## Deployment

This repository contains **only the production-built static assets** produced
by `npm run build` (Vite). Files at the root (`index.html`, `assets/`,
`favicon.svg`, `CV_Abdulrahim.pdf`, etc.) are served as-is by GitHub Pages.

The `.nojekyll` file disables Jekyll processing so Vite's hashed asset names
(which can start with `_`) are served verbatim.

The `CNAME` file binds the site to the custom domain `abdulrahim.page`.
