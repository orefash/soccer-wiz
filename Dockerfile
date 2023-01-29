FROM --platform=linux/amd64 node:16.17.0-bullseye-slim
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN npm install --omit=dev
USER node
CMD ["dumb-init", "node", "server.js"]