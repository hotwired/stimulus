FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Install Chrome and Firefox
RUN apt-get update && apt-get install -y firefox-esr chromium \
 && apt-get clean && rm -rf /var/lib/apt/lists/*