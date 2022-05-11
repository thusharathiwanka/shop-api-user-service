# get node base image form dockerhub
FROM node:16-alpine

# setting up the work directory
WORKDIR /app

# copying package.json to work directory
COPY package.json .

# installing dependencies
RUN npm install

# copy current directory files to work directory (files/directories added to .dockerignore will be ignored)
COPY . .

# setting up the port
ENV PORT 5002

# exposeing port
EXPOSE $PORT

# running the app
CMD ["npm", "start",]