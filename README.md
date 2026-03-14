# AdTech Campaign Manager

Système de geston et diffusion de campagnes publicitaires vidéo.

## Lancer le projet

## Prérequis
- Node.js 24+
- MongoDB local ou Atlas
- npm

### Installation manuelle
```bash
#Cloner le projet
git clone https://github.com/sitrakaher/Test.git
cd Test

#Backend
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev

#Frontend (nouveau terminal)
cd frontend
npm install
npm run dev
```

**`backend/.env`:**
```env
DATABASE_URL="mongodb://localhost:27017/TestAdtech?replicaSet=rs0"
PORT=4000
FRONTEND_URL=http://localhost:3000
```

**`frontend/.env.local` :**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Lancer avec Docker
```bash
docker-compose up --build
```

**URLs :**
```
Frontend  → http://localhost:3000
Backend   → http://localhost:4000
MongoDB   → mongodb://localhost:27017

```

---

### Choix technique

### Backend
- **Node.js + Express** — léger et rapide pour une API REST
- **TypeScript** — typage fort, détection d'erreurs à la compilation
- **Prisma ORM** — requêtes lisibles, compatible MongoDB, typage automatique
- **MongoDB** — flexible pour les tableaux comme `targetCountries`
- **express-rate-limit** — protection contre les abus sur `/serve-ad`

### Frontend
- **Next.js 15 + TypeScript** — App Router, Server Components, routing automatique
- **Axios** — gestion des erreurs plus claire que fetch natif
- **React Toastify** — notifications utilisateur simples

---

## Endpoints API

Méthode | Endpoint     | Description
Get     |`/campaigns`  | Lister les campagnes
POST    |`/campaigns`  | Créer une campagne
POST    |`/serve-ad`   | Simuler une impression
GET     |`/stats`      | Statistiques globales

### Filtres sur GET /campaigns
```
GET /campaigns?status=active
GET /campaigns?advertiser=Nike
GET /campaigns?country=FR
GET /campaigns?status=active&advertiser=Nike&country=FR
```

### Logique serve-ad
```
1. Trouver une campagne active
2. Vérifier date valide + pays ciblé + budget > 0
3. Incrémenter impressionsServed
4. Décrémenter budget de 0.01€
5. Si budget <= 0 → status = ended
6. Retourner la campagne servie
```

### Logique statut automatique
```
now < startDate             -> paused
startDate <= now <= endDate -> active
now > endDate               -> ended
budget <= 0                 -> ended
```

---

## Comment scaler à 1 million de requêtes/minutes

### 1. Cache Redis
```
POST /serve-ad -> lire depuis Redis (TTL 60s) au lieu de requêter MongoDB à chaque fois
-> 10x plus rapide

### 2. Load Balancer + plusieurs instances
```
Nginx
    -Instance 1 -> traite 400 000 requêtes
    -Instance 2 -> traite 400 000 requêtes
    -Instance 3 -> traite 400 000 requêtes
```

### 3. Inex MongoDB
```
db.campaigns.createIndex({ status: 1, targetCountries: 1 })
db.campaigns.createIndex({ endDate: 1, startDate: 1 })
```

### 4. Queue pour les impressions
```
POST /serve-ad -> Bull/RabbitMQ queue
-> Worker traite les incréments en batch
-> Evite les écritures MongoDB simultanées
```

## Gestion du capping d'impressions
```
1. Identifier l'utilisateur (IP ou cookie)
2. Stocker dans Redis : "cap:IP:campaingId" -> count
3. Vérifier avant de servir : si count >= max  -> skip
4. TTL Redis = durée du capping (ex: 24h)
```

---