FROM node:18-alpine as base
RUN apk add --no-cache libc6-compat

WORKDIR /src
COPY package*.json ./
EXPOSE 3000
#RUN npm install

FROM base AS development
ENV NODE_ENV=development
COPY . /src
RUN npm install
CMD npm run dev

FROM base AS builder
COPY . .
RUN npm install && npm run build

FROM base AS production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /src/node_modules ./node_modules
COPY --from=builder /src/public ./public
COPY --from=builder /src/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /src/.next ./.next
USER nextjs
EXPOSE 3000
CMD npm run start
