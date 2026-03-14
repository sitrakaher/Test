# DECISIONS.md — Arbitrages techniques et erreurs rencontrées

## Erreurs rencontrées

### 1. Import CampaignStatus incorrect
**Erreur :**
```ts
const CampaignStatus = require("@prisma/client")
```
**Problème :** Retournait l'objet entier PrismaClient au lieu de l'enum.
`CampaignStatus.active` était `undefined` — toutes les requêtes plantaient.

**Correction :**
```ts
import { CampaignStatus } from "@prisma/client";

```

---

### 2. `require` au lieu de `import` dans app.ts
**Erreur :**
```ts
app.use('/', require("./routes/campaign.routes"));
```
**Problème :** Avec `export default` en TypeScript, le `require` retourne
`{ default: router }` et non le router directement -> erreur
`argument handler must be a function`.

**Correction :**
```ts
import campaignRoutes from "./routes/campaign.routes";
app.use("/", campaignRoutes);
```

---

### 3. `express.json()` manquant
**Erreur :** `req.body` était `undefined` sur tous les endpoints POST.

**Correction :** Ajout de `app.use(express.json())` avant les routes dans `app.ts`

---

### 4. Rate limiting dans `app.ts` au lieu des routes
**Erreur :** Ajout du `serveAdLimiter` directement dans `app.ts`.

**Problème :** Mauvaise séparation des responsabilités.

**Correction :** Déplacement dans `campaign.routes.ts` directement
sur la route `/serve-ad`.
```

---

### 5. `useState` tableau au lieu d'objet pour les stats
**Erreur :**
```ts
const [statsCampaigns, setStatsCampaigns] = useState<StatsCampaigns[]>([]);
```
**Problème :** Le backend retourne un objet unique, pas un tableau.
`.map()` sur un objet provoquait une erreur runtime.

**Correction :**
```ts
const [statsCampaigns, setStatsCampaigns] = useState<StatsCampaigns | null>(null);
```

---

### 6. `useEffect` sans tableau de dépendances
**Erreur :**
```ts
useEffect(() => { loadStatistique(); })
```
**Problème :** Se déclenchait à chaque re-render -> boucle infinie.

**Correction :**
```ts
useEffect(() => { loadStatistique(); }, [])
```

---

### 7. Prisma 7 non compatible avec MongoDB
**Problème :** Prisma 7 ne supporte pas encore MongoDB.

**Correction :** Utilisation de Prisma 6 :
```bash
npm install prisma@6 @prisma/client@6
```

### 8. Gestion du statut à la création de campagne
**Problème initial :** Le statut était toujours mis à `active` par défaut
à la création, même si la campagne n'avait pas encore commencé.

**Réflexion :** On voulait d'abord une fonction `syncCampaignStatus()`
qui tourne toutes les minutes pour mettre à jour les statuts.
Mais c'est inutilement complexe pour ce cas.

**Solution retenue :** Calculer le bon statut directement
au moment de la création selon les dates :
```ts
const now = new Date();

if (now < start) {
    status = CampaignStatus.paused;  // pas encore commencé
} else if (now >= start && now <= end) {
    status = CampaignStatus.active;  // en cours
} else {
    status = CampaignStatus.ended;   // date dépassée
}
```
**Avantage :** Simple, pas de cron job, pas de complexité inutile.

## Arbitrages

```

---

### 1. Express plutôt que NestJS
NestJS est plus structuré mais plus complexe à mettre en place rapidement.
Express permet d'aller plus vite tout en gardant une architecture propre
avec la séparation controllers / services / routes.

### 2. Prisma plutôt que Mongoose
Prisma offre un typage fort et des requêtes lisibles.
Avec TypeScript côté frontend, avoir un ORM typé côté backend
assure une cohérence dans tout le projet.

### 3. Statut calculé automatiquement à la création
Au lieu de toujours mettre `active` par défaut, on calcule
le bon statut selon les dates :
```
now < startDate  -> paused
now >= startDate -> active
now > endDate    -> ended
```
Cela évite d'avoir des campagnes actives avant leur date de début.

### 4. Budget décrémenté de 0.01€ par impression
Chaque impression coûte 0.01€ à l'annonceur.
Une campagne à 200€ peut servir 20 000 impressions.
Quand budget = 0 -> status = ended automatiquement.

### 5. Rate limiting à 2 niveaux
- Limite globale : 100 req/15min sur toutes les routes
- Limite stricte : 30 req/min sur `/serve-ad` uniquement
Car `/serve-ad` est l'endpoint le plus sollicité et vulnérable aux abus.

### 6. `targetCountries` en `String[]`
Pour ce projet, stocker les pays directement dans la campagne
est plus simple. Pour un système plus large, une collection
séparée avec une relation serait plus adaptée.

### 7. Next.js plutôt que React simple
Next.js offre le routing automatique via les dossiers,
les Server Components, et une meilleure structure de projet.

### 8. React Toastify pour les notifications
Plus rapide à implémenter qu'un système de notifications custom.
Suffisant pour ce projet — avec plus de temps j'aurais créé
des composants de feedback plus intégrés au design.

---

### Ce que j'aurais amélioré avec plus de temps

- Tests unitaires avec Jest sur les services
- Authentification JWT pour sécuriser les endpoints
- Cache Redis pour `/serve-ad`
- Pagination sur `GET /campaigns`
- Validation avec Zod côté backend
- Interface Tailwind CSS complète et responsive
- CI/CD avec GitHub Actions
- Gestion du capping par utilisateur via Redis