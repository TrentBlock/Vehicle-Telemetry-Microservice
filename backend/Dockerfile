# Use lightweight node image
FROM node:18-alpine

# Create work directory
WORKDIR /usr/src/app

# Install deps first for caching benefits
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build TypeScript → dist/
RUN npm run build

# Set env
ENV NODE_ENV=production
ENV PORT=3000

# Expose API port
EXPOSE 3000

# Run built JS, not TS
CMD ["npm", "start"]
