FROM node:17-alpine AS base

RUN apk add --no-cache \
		python3 \
		make \
		automake \
		autoconf \
		g++ \
		ffmpeg \
		libtool

WORKDIR /app

ENV NODE_ENV=production

COPY ["package.json", "yarn.lock", "./"]

# Installing packages
RUN yarn install --production --frozen-lockfile

COPY . .

# Build ./dist
RUN yarn build