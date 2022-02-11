FROM node:14.17-alpine as base

# Install dependency for npm ci
RUN apk add --no-cache python make g++

WORKDIR /usr/src

EXPOSE 5000

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

# ======================
# CI stage
# ======================

FROM base AS ci

COPY ./package*.json /usr/src/
RUN npm ci

COPY ./ /usr/src

ENV NODE_ENV=production
RUN npm run build

CMD ["npm", "run", "start"]

# ======================
# Production stage
# ======================

FROM base AS production

ENV NODE_ENV=production

# Install production packages
COPY ./package*.json /usr/src/
RUN npm install --production

# Copy nessasary files
COPY ./ /usr/src
COPY --from=ci /usr/src/build /usr/src/build

# Remove dev folders
RUN rm -rf /usr/src/tests /usr/src/dev

USER node

CMD ["npm", "run", "start"]
