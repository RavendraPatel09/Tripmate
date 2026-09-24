# --- deps: install dependencies (native modules like argon2 need build tools) ---
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json* ./
RUN npm install

# --- build: compile TypeScript + generate Prisma client ---
FROM node:20-alpine AS build
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# --- runtime: minimal image, prod deps only ---
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache python3 make g++ \
  && addgroup -S nodejs && adduser -S tripmate -G nodejs

COPY package.json package-lock.json* ./
RUN npm install --omit=dev && npm cache clean --force
# Build tools were only needed to compile native deps above; drop them from
# the final image to reduce attack surface.
RUN apk del python3 make g++

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma

USER tripmate

EXPOSE 4000

CMD ["node", "dist/server.js"]
