FROM node:lts-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:lts-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/prisma ./prisma/

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

USER nextjs

EXPOSE 4000

# ✅ Ejecutar estas migraciones en el contenedor solo si hay problemas con la neon DDBB 
#CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
CMD ["npm", "run", "start:prod"]
