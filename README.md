# DeeSET HUB — Next.js + Supabase (production-ready template)

This repo contains a Next.js frontend and server API placeholders ready to be wired to Supabase.

.env.example
- NEXT_PUBLIC_SUPABASE_URL=
- NEXT_PUBLIC_SUPABASE_ANON_KEY=
- SUPABASE_URL=
- SUPABASE_SERVICE_ROLE_KEY=
- ADMIN_EMAIL=mastadee01@gmail.com
- ADMIN_PASSWORD=MastaDee

Quick start (local, demo fallback)
1. Install
   npm install
2. Dev
   npm run dev

Seeding real admin into Supabase (when you have a Supabase project)
1. Create a Supabase project and copy the project URL and service_role key.
2. Add the required env vars to your shell or Vercel.
3. Run the seed script locally to upsert the admin user (this uses the Supabase Admin API or a fallback table):
   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/seed-admin.js

Deploy to Vercel
- Push to GitHub and set environment variables in Vercel (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD) and deploy.

Security notes
- Do NOT commit your SUPABASE_SERVICE_ROLE_KEY into source control. Use Vercel environment variables.
- The demo fallback stores data in Supabase tables; ensure you create the necessary tables (meetings, cbt_codes, deeset_users) or use Supabase Auth.

