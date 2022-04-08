# Image source
FROM node:14

# Docker working directory
WORKDIR /app

# Copying file into APP directory of docker
COPY ./package.json ./package-lock.json /app/

# Then install the NPM module
RUN npm install

# Copy current directory to APP folder
COPY . /app

RUN npm run build

EXPOSE 8000
CMD ["npm", "run", "start:prod"]