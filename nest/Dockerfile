# nest production Dockerfile
FROM node:22-alpine AS builder
USER node
WORKDIR /home/node/app
COPY --chown=node:node . .
RUN npm install --production && \
    npm cache clean --force && \
    rm -rf node_modules/.cache && \
    npm prune --production && \
    npm run build

# nest production Dockerfile - final stage
FROM node:22-alpine AS runner
USER node
WORKDIR /home/node/app
COPY --chown=node:node --from=builder /home/node/app/dist ./dist
COPY --chown=node:node --from=builder /home/node/app/node_modules ./node_modules
EXPOSE 3001
CMD ["npm", "run", "start:prod"]