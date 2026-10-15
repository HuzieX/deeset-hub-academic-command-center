FROM node:18-alpine
WORKDIR /app

# Install frontend
COPY package.json package-lock.json ./
RUN npm install --production

# Copy app
COPY . .

# Build Next.js app
RUN npm install
RUN npm run build || true

EXPOSE 3000 4000

# Start both frontend and backend using a simple script
CMD ["/bin/sh","-c","node server/index.js & npm run start"]
