# DeeSET HUB — Academic Command Center

A dark-mode academic dashboard built with Vite + React + Tailwind CSS + Lucide Icons.

## Features
- Admin-aware dashboard with auto-bypass logic for `mastadee01@gmail.com` or `MastaDee`
- Collapsible sidebar, bento dashboard, live class hero with countdown
- Live class schedule and embedded video mockup with chat
- Kanban task board with localStorage persistence
- CBT simulator access flow with admin-only code generation via WhatsApp
- Admin upload tools for past questions, CBT questions, news, and live sessions

## Admin login
- Email: `mastadee01@gmail.com`
- Password: `MastaDee`

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy
This project is ready for Vercel or Netlify deployment.

## Notes
- Data persists in browser `localStorage`.
- Admin-only features are gated automatically for the admin account.
