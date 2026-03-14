# Image de base Node.js légère
FROM node:24-alpine

#Dossier de travail
WORKDIR /app

#Copie les fichiers de dépendances
COPY package*.json ./

#Install les dépendances
RUN npm install

#Copie tout le code
COPY . .

#Build Next.js
RUN npm run build

#Expose le port
EXPOSE 3000

#Lance le frontend
CMD [ "npm", "run", "start" ]