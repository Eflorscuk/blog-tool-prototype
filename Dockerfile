FROM mongo:latest
WORKDIR /usr/src/app
COPY package*.json ./
#RUN npm install
COPY . .
EXPOSE 27017
#CMD ["npm", "start"]