FROM ghcr.io/puppeteer/puppeteer:22.0.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /.

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000

# Install specific Chrome version
RUN apk add --no-cache chromium

# Optional: set environment variables
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

CMD [ "node", "index.js" ]