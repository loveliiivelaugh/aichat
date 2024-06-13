FROM node:18-alpine

# Set working directory
WORKDIR /src
# ENV PATH=/usr/local/aichat/node_modules/.bin:$PATH
# WORKDIR /usr/local/apps/aichat/dev

EXPOSE 3000

COPY package.json ./

RUN npm install --silent

COPY . ./

CMD ["npm", "run", "dev"]
