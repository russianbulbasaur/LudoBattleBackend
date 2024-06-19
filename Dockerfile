FROM node:latest 
COPY app ludo/app
WORKDIR ludo/app 
RUN npm install
CMD node app.js
