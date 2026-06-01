# Deploy to Vercel (GitHub → Vercel → Postgres)

Your iOS app needs a **live HTTPS** API (`/api/public-config`, `/api/auth/login`, …). Vercel runs Next.js; **Postgres** holds data (SQLite does not work on Vercel).

## 1) Create a Postgres database

Use **[Neon](https://neon.tech)** (free) or **Supabase** (free).

- Create a project → copy **`DATABASE_URL`** (often ends with `?sslmode=require`).

## 2) Push code to GitHub

Repo root: `sarakbi-patient-app` (this folder).

## 3) Import in Vercel

1. [vercel.com](https://vercel.com) → **Add New** → **Project** → Import your GitHub repo.
2. Framework: **Next.js** (auto).
3. **Environment variables** (Production — add Preview too if you want):

| Name | Example |
|------|--------|
| `DATABASE_URL` | `postgresql://user:pass@host/db?sslmode=require` |
| `SESSION_SECRET` | Long random string (32+ characters) |
| `NEXT_PUBLIC_SITE_URL` | `https://sarakbi-patient-app.vercel.app` (portal API — no trailing slash) |
| `NEXT_PUBLIC_PRACTICE_WEBSITE_URL` | `https://www.willsarakbi.com` (marketing site links) |
| `BLOB_READ_WRITE_TOKEN` | Auto-added when you connect **Vercel Blob** storage (required for patient photo uploads in production) |

4. Deploy.

## 4) Create tables (once per database)

On your Mac, with the **same** `DATABASE_URL` as Vercel:

```bash
cd /path/to/sarakbi-patient-app
export DATABASE_URL="postgresql://..."   # paste Neon URL
npx prisma generate
npx prisma db push
npm run db:seed
```

(Optional) Create a surgeon account:

```bash
npm run db:create-staff -- --email YOUR_STAFF_EMAIL --name "Your Name" --password "YourSecurePass123!"
```

## 5) Smoke test

Open in a browser (or phone):

`https://YOUR-PROJECT.vercel.app/api/public-config`

You should see **JSON**.

## 6) Point the iOS app

Xcode → target **SarakbiPatient** → **Build Settings** → **`API_BASE_URL`**

Set to: `https://YOUR-PROJECT.vercel.app` (no `/api/...`)

Clean build → run on device.

## Troubleshooting

- **Build fails on Prisma**: `package.json` runs `prisma generate` before `next build`. Redeploy after env vars are set.
- **API 500 / DB errors**: Confirm `DATABASE_URL` in Vercel matches Neon; run `db push` against that DB.
- **Neon + serverless**: If you see “too many connections”, use Neon’s **pooled** connection string and/or Prisma docs for serverless.
