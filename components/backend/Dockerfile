FROM node:14.17-alpine as base

# Install dependency for npm ci
RUN apk add --no-cache python make g++
RUN npm i -g @nestjs/cli

WORKDIR /usr/src

EXPOSE 5000
EXPOSE 5555

# ======================
# Dev stage
# ======================

FROM base AS dev

ARG USERID
ARG GROUPID

RUN apk --no-cache add \
  shadow \
  && usermod -u ${USERID} node \
  && groupmod -o -g ${GROUPID} node

CMD ["npm", "run", "dev"]

FROM base AS test

ARG USERID
ARG GROUPID

RUN apk --no-cache add \
  shadow \
  && usermod -u ${USERID} node \
  && groupmod -o -g ${GROUPID} node

CMD ["npm", "run", "dev"]

# ======================
# CI stage
# ======================

FROM base AS ci

COPY ./package*.json /usr/src/
RUN npm ci

COPY ./ /usr/src

ENV NODE_ENV=production
RUN npm run build

CMD ["npm", "run", "start:prod"]

FROM base AS production

ENV NODE_ENV production

USER node

COPY --from=builder --chown=node:node /usr/src/package*.json ./
COPY --from=builder --chown=node:node /usr/src/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /usr/src/dist/ ./dist/

CMD ["node", "dist/server.js"]
