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

ENV DATABASE_URL="mongodb://localhost:27017/TestAdTech"

#Génère le client Prisma
RUN npx prisma generate

#Compile TypeScript
RUN npm run build

#Expose le port
EXPOSE 4000

#Lance le serveur
CMD [ "npm", "run", "start" ]
