# get node base image form dockerhub
FROM node:16-alpine

# setting up the work directory
WORKDIR /app

# copying package.json to work directory
COPY package.json .

# setting arguments for npm install (passed from docker-compose.dev.yml, docker-compose.prod.yml)
ARG NODE_ENV

# running dependency installation based on node environment
RUN if [ "$NODE_ENV" = "development" ]; \ 
    then npm install; \
    else npm install --only=production; \
  fi

# copy current directory files to work directory (files/directories added to .dockerignore will be ignored)
COPY . .

# setting up the port
ENV PORT 5001

# exposeing port
EXPOSE $PORT

# running the app
CMD ["npm", "start",]