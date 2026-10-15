# Production Deploy Guide (Render-friendly)

This repository includes Docker configuration and a production compose file to run the app with Postgres.

Files added:
- docker-compose.prod.yml - production compose with Postgres, backend, frontend
- Dockerfile.backend - production Dockerfile for backend
- Dockerfile.frontend - production Dockerfile for Next.js frontend
- .env.example - environment variables example
- README-prod.md - quick production run instructions
- package.json updated with backend start script

IMPORTANT
- Replace values in a real .env file before starting. Never commit real secrets.

Quick start (Linux/macOS):

1) Copy .env.example to .env and edit values (especially JWT_SECRET and DATABASE_URL)

2) Build and run with docker-compose:

```bash
# Build and run in detached mode
cp .env.example .env
# Edit .env to set real values BEFORE running in production
# (the default DATABASE_URL uses the `db` service in the compose below)

docker-compose -f docker-compose.prod.yml up --build -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

3) If you use Prisma (recommended), run migrations & seed (from host with prisma cli installed):

```bash
# Ensure DATABASE_URL is set and points to the postgres container
npx prisma migrate deploy
# seed (if you have scripts/seed-prisma.js)
ADMIN_EMAIL=you@domain.com ADMIN_PASSWORD=yourpassword node scripts/seed-prisma.js
```

4) Frontend will be available on port 3000 and backend on port 4000 (see compose file)

Notes:
- Use a proper secret for JWT_SECRET in production and set NODE_ENV=production.
- For S3 uploads, set the S3_* env vars. Current server supports local uploads by default.
- Update firewall / reverse proxy to expose only the frontend behind TLS. You can add nginx/proxy in front of the frontend and backend if desired.
