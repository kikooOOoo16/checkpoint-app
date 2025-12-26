ARG IMAGE_VERSION=20.13.1-slim

FROM node:${IMAGE_VERSION}

# Switch to app directory
WORKDIR /usr/src/app

COPY /dist /usr/src/app

RUN ls -la

# Run app
CMD ["node", "."]
