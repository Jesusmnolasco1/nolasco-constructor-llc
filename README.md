# Nolasco Constructor LLC

Handyman and repair services website built with Vite, HTML, CSS, and vanilla JavaScript.

## Production URL

https://nolasco-constructor-llc.vercel.app/

## Stack

- **Build tool:** Vite
- **Language:** HTML, CSS, vanilla JavaScript
- **Hosting:** Vercel (production) / GitHub Pages (secondary)

## Local Development

```
cd handyman-services-ui
npm run dev
```

## Build

```
cd handyman-services-ui
npm run build
```

Output goes to `handyman-services-ui/dist/`.

## Vercel Deployment

Vercel is the official production deployment. It automatically detects the Vite framework.

1. Connect the repository on Vercel.
2. Vercel detects Vite and uses these defaults:
   - **Framework:** Vite
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm install` (default)
3. No `VITE_BASE_PATH` environment variable is needed on Vercel — it defaults to `/`.

### vercel.json

The project includes a `vercel.json` with:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

No additional configuration is required.

## GitHub Pages Deployment (Secondary)

GitHub Pages remains available as a secondary deployment or backup.

Build with the project repo base path:

```
cd handyman-services-ui
npm run build:gh-pages
```

Or set the `VITE_BASE_PATH` environment variable:

```
VITE_BASE_PATH=/nolasco-constructor-llc/ npm run build
```

In a GitHub Actions workflow, set the env or use `--base`:

```yaml
- run: npm run build
  env:
    VITE_BASE_PATH: /nolasco-constructor-llc/
```

Deploy the `dist/` folder to the `gh-pages` branch or configure GitHub Pages to serve from the `dist/` folder in the Actions workflow.

The secondary GitHub Pages deployment will be available at:

https://jesusmnolasco1.github.io/nolasco-constructor-llc/

## Environment Variables

| Variable | Build-time | Purpose |
|---|---|---|
| `VITE_BASE_PATH` | Yes | Controls Vite `base` path. Defaults to `/`. Set to `/nolasco-constructor-llc/` for GitHub Pages. |
| `VITE_CONTACT_FORM_MODE` | Yes | `demo` or `external`. Controls contact form behavior. |
| `VITE_CONTACT_FORM_ENDPOINT` | Yes | URL for external form submission endpoint. |

Only `VITE_CONTACT_FORM_*` variables are exposed to the browser. `VITE_BASE_PATH` is build-time only.

## Contact Form Configuration

See `.env.example` for details. Copy it to `.env.local` to configure:

```
cp .env.example .env.local
```

Keep demo mode during development. Set `VITE_CONTACT_FORM_MODE=external` and `VITE_CONTACT_FORM_ENDPOINT` to a real endpoint for production.

## Launch Checklist

- [ ] Test Vercel live URL: https://nolasco-constructor-llc.vercel.app/
- [ ] Test all page navigation
- [ ] Test light and dark mode
- [ ] Test Call Now button: tel:+19292476158
- [ ] Test email link: mailto:nolascoantonio057@gmail.com
- [ ] Test demo contact form
- [ ] Connect real contact form endpoint (`VITE_CONTACT_FORM_MODE=external`)
- [ ] Replace placeholder service areas with real coverage info
- [ ] Add real project photos if available
- [ ] Replace Vercel URL with custom domain if one is added later

## Contact

- Phone: [+1 (929) 247-6158](tel:+19292476158)
- Email: [nolascoantonio057@gmail.com](mailto:nolascoantonio057@gmail.com)
- Hours: Mon-Sat, 8:00 AM - 6:00 PM
