# DeeSET HUB Backend

A self-contained Node.js + Express backend for the DeeSET HUB academic dashboard.

## Features
- JWT auth with seeded admin account
- Admin-only endpoints for meetings, CBT codes, and uploads
- SQLite-free simple file-based DB object store (easy to run anywhere)
- Handles CBT validation and resource uploads with secure local storage

## Admin account
- Email: mastadee01@gmail.com
- Password: MastaDee

## Run locally
```bash
npm install
npm run server
```

## API quick examples
### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"mastadee01@gmail.com","password":"MastaDee"}'
```

### Get meetings (requires token)
```bash
curl http://localhost:4000/api/meetings \
  -H 'Authorization: Bearer <token>'
```

### Generate CBT code (admin only)
```bash
curl -X POST http://localhost:4000/api/cbt/generate \
  -H 'Authorization: Bearer <token>'
```

### Validate CBT code
```bash
curl -X POST http://localhost:4000/api/cbt/validate \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{"code":"CBT-XXXXXX"}'
```

## Notes
- This is a tutorial-friendly backend reference implementation.
- For production, move the in-memory JSON store to Postgres or SQLite with migrations, and add a proper file storage provider.
