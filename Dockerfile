ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS base

ENV NODE_ENV=development

WORKDIR /app

# Add curl for Coolify healthcheck
RUN apk --no-cache add curl

# Enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install dependencies
FROM base AS install-deps

COPY --link package.json pnpm-lock.yaml /app/

RUN pnpm install --frozen-lockfile

# Build
FROM install-deps AS build

COPY --link . /app

RUN pnpm run build

# Prod
FROM base AS prod

ENV NODE_ENV=production

COPY --link package.json /app/
COPY --from=build /app/.output /app/.output

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["pnpm", "run", "start"]
