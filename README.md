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
| `VITE_CONTACT_FORM_MODE` | Yes | `internal` or `demo`. Controls contact form behavior. |

Only `VITE_CONTACT_FORM_*` variables are exposed to the browser. `VITE_BASE_PATH` is build-time only.

## Contact Form with Supabase (Production)

The contact form submits to a Vercel Serverless Function at `/api/contact`, which inserts submissions into a Supabase database.

### Supabase Table Setup

Run the migration in `handyman-services-ui/supabase/contact_submissions.sql` in your Supabase SQL editor:

```sql
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  service_needed text not null,
  property_type text,
  preferred_timing text,
  message text not null,
  source text default 'website',
  status text default 'new',
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;
```

**Do not create public insert policies.** Inserts happen from the serverless function using the service role key, which bypasses RLS.

### Vercel Environment Variables

Configure these in **Vercel Project Settings → Environment Variables** (do not add them to `.env` or `.env.local`):

| Variable | Secret | Purpose |
|---|---|---|
| `SUPABASE_URL` | No | Your Supabase project URL (e.g. `https://xxxxx.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Supabase service_role key — must stay server-side only |
| `VITE_CONTACT_FORM_MODE` | No | Set to `internal` for production |

**Security notes:**
- `SUPABASE_SERVICE_ROLE_KEY` must **never** be exposed in frontend code.
- Do **not** prefix server-side secrets with `VITE_`.
- The service role key bypasses Row Level Security — it must stay server-side only.

### How It Works

1. Visitor fills out `/contact.html` and clicks submit.
2. Frontend validates required fields, then POSTs JSON to `/api/contact`.
3. The Vercel Function (`api/contact.js`) validates again, creates a Supabase client with the service role key, and inserts a row into `contact_submissions`.
4. The function returns a JSON success or error response.
5. The frontend shows the success message or field-level validation errors.

### Testing After Deployment

1. Deploy to Vercel with the environment variables above.
2. Open the live site's `/contact.html` page.
3. Fill out and submit the form.
4. Confirm the green success message appears.
5. Open your Supabase dashboard → Table Editor → `contact_submissions`.
6. Confirm the new row appears with all submitted data.

To test the API directly:

```bash
curl -X POST https://your-project.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"555-0000","email":"test@example.com","service":"repairs","message":"Testing the API."}'
```

### Local Development

During development, set `VITE_CONTACT_FORM_MODE=demo` in `.env.local` to validate without sending data.

The Vercel Function does **not** run with `vite dev` (plain Vite does not serve `/api/*`). To test the full flow locally, use the [Vercel CLI](https://vercel.com/docs/cli):

```bash
npx vercel dev
```

This simulates the production environment including serverless functions.

## Launch Checklist

- [ ] Test Vercel live URL: https://nolasco-constructor-llc.vercel.app/
- [ ] Test all page navigation
- [ ] Test light and dark mode
- [ ] Test Call Now button: tel:+19292476158
- [ ] Test email link: mailto:nolascoantonio057@gmail.com
- [ ] Test demo contact form
- [ ] Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel
- [ ] Deploy and test contact form submission
- [ ] Confirm row appears in Supabase contact_submissions table
- [ ] Confirm no service role key exposed in browser code

## Contact

- Phone: [+1 (929) 247-6158](tel:+19292476158)
- Email: [nolascoantonio057@gmail.com](mailto:nolascoantonio057@gmail.com)
- Hours: Mon-Sat, 8:00 AM - 6:00 PM
