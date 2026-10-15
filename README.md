# Prisma + SQLite

If you want to enable Prisma/SQLite persistence, do the following locally:

1. Install dependencies:
   npm install prisma @prisma/client

2. Generate client & run migration:
   npx prisma generate
   npx prisma migrate dev --name init

3. Seed admin user:
   ADMIN_EMAIL=your@admin.email ADMIN_PASSWORD=yourpassword node scripts/seed-prisma.js

The server will automatically use Prisma if @prisma/client is installed. If not installed, the server falls back to file-based persistence (server/data.json).
