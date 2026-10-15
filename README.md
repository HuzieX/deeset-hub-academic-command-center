# Docker and local changes

- Persisted backend data to server/data.json so meetings, cbt codes, and uploads survive restarts.
- Added a Login component and wired the Sidebar to show login / user info using the backend auth.
- Dockerfile and docker-compose added to run frontend and backend together for easy deployment.

How to run locally (after pulling changes):

1) Install dependencies
   npm install
   npm install express cors multer jsonwebtoken bcryptjs cookie-parser --save

2) Start backend
   node server/index.js

3) Start frontend
   npm run dev

4) Open http://localhost:3000 and log in with admin credentials:
   Email: mastadee01@gmail.com
   Password: MastaDee

Notes:
- The backend persists to server/data.json. Uploaded files are saved to server/uploads.
- Docker-compose will run frontend and backend (ensure ports 3000 and 4000 free).
