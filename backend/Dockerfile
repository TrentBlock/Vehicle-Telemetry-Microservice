# Basic Node.js backend Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Environment and port
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Start the app (expects "start" script in package.json)
CMD ["npm", "start"]