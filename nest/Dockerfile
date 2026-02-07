FROM node:22-alpine
USER node
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]