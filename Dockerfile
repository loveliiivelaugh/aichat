FROM node:18-alpine

# Set working directory
WORKDIR /src

# Copy package.json and yarn.lock/npm package.json to the container
# COPY ./bun.lockb . 
COPY ./package.json .

# Install dependencies
RUN npm i

# Copy the rest of the application code to the container
COPY . .

# Command to run the application
CMD ["npm", "run", "dev"]

# Expose port (if your application listens on a different port, update it here)
EXPOSE 3002
