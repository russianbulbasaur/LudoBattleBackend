FROM archlinux:latest
RUN pacman --noconfirm -Syu && pacman --noconfirm -S npm unzip 
WORKDIR ludo
COPY app.zip app.zip
RUN unzip app.zip
WORKDIR app
RUN npm install
CMD node ./app.js
