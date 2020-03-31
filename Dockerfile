FROM node:10.13.0
# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json ./
RUN npm install -g yarn
RUN yarn
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .


# Building app
RUN npm run build

# Running the app
CMD [ "npm", "start" ]