# Examen-2024: Eurosong-Project

Dit project demonstreert hoe je DevOps-principes toepast in een Node.js + Vue-applicatie, met Docker, GitHub Actions en gestructureerde logging.

## Inhoudsopgave
1. [Overzicht](#overzicht)  
2. [Setup instructies](#setup-instructies)  
3. [Ontwikkel workflow](#ontwikkel-workflow)  
4. [DevOps-praktijken](#devops-praktijken)  
   1. [Docker & Lokale Ontwikkeling](#docker--lokale-ontwikkeling)  
   2. [Continuous Integration/Continuous Delivery](#continuous-integrationcontinuous-delivery)  
   3. [Monitoring & Observability](#monitoring--observability)  
5. [Extra Configuratie Instructies](#extra-configuratie-instructies)  
6. [Licentie](#licentie)  

---

## Overzicht

In deze repository vind je:
- **Backend**: Een Node.js + Express-app (map `backend`)
- **Frontend**: Een Vue.js-app (map `frontend`)
- **Database**: MySQL (in Docker)
- **CI/CD**: GitHub Actions workflows (in `.github/workflows/`)
- **Docker Compose**: Zowel een productieversie als een ontwikkelversie

Het project demonstreert:
- **Automated Testing en Linting** met Jest, Supertest, ESLint  
- **Container Building & Publishing** naar GitHub Container Registry  
- **Pull Request Workflow** met verplichte reviews  
- **Gestructureerde Logging** met Winston + Morgan  

---

## Setup Instructies

### 1. Repository Clonen
```bash
git clone git@github.com:thomas-more-devops/moad-touhafi-examen-2024.git
cd moad-touhafi-examen-2024
```

### 2. .env
`.env` file in de root van de environment variables:
```env
# Frontend
VUE_APP_BACKEND_API_URL=http://backend:3000

# Backend
db_host=database
db_user=root
db_pass=root
db_name=eurosong
db_port=3306
cors_origin=http://localhost:8080
HOST=0.0.0.0
PORT=3000
```

### 3. Productie Starten met Docker Compose
Dit gebruikt `docker-compose.yml` (production-like):

```bash
docker compose up --build
```
Na het builden:
- Frontend draait op [http://localhost:8080](http://localhost:8080).
- Backend draait op [http://localhost:3000](http://localhost:3000).
- MySQL draait op poort 3306 met user=root/password=root.

### 4. Lokale Ontwikkeling
Gebruik het speciale `docker-compose.dev.yml`:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Hierdoor kun je je code live aanpassen:
- **backend**: map `./backend` gemount in de container.  
- **frontend**: map `./frontend` gemount in de container.  
Zodra je bestanden wijzigt, herstart/hot-reload de containers.

---

## Ontwikkel Workflow

1. **Maak een feature branch**:  
   ```bash
   git checkout -b feature/my-new-feature
   ```
2. **Bouw en test lokaal** (development):
   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```
3. **Commit & Push**:
   ```bash
   git add .
   git commit -m "Implement my new feature"
   git push origin feature/my-new-feature
   ```
4. **Open een Pull Request** op GitHub:
   - Let op verplichte reviewers en CI-checks.  
5. **Laat CI** (linting, testing, build) slagen.  
6. **Krijg review** van teamleden.  
7. **Merge** naar `main` (indien alles groen en goedgekeurd is).

---

## DevOps Praktijken

### Docker & Lokale Ontwikkeling
- **docker-compose.yml**: productieversie, build en gebruik van images (ghcr.io).  
- **docker-compose.dev.yml**: lokale ontwikkeling met volume mounts en live reload.  
- Één command (`docker compose up --build`) start de hele stack: database, backend, frontend.

### Continuous Integration/Continuous Delivery
- **CI (CI.yml)**:  
  - Lint + Test voor backend en frontend.  
  - Draait bij elke push en pull_request op `main`.
- **Build (build.yml)**:  
  - Buildt Docker images voor backend en frontend  
  - Push naar GitHub Container Registry.  
- **Pull Request Workflow**:
  - Verplichte reviews + branch protection rules in GitHub.  
  - CI-checks moeten slagen voordat er gemerged kan worden.

### Monitoring & Observability
- **Gestructureerde logging** met Winston + Morgan.
- **Relevante app events** (e.g. `ServerStart`, `FailedToFetchArtists`) en errors worden gelogd in JSON-formaat.
- Log messages bevatten duidelijke context (timestamp, event, stack trace, etc.).
---

## Licentie
<<<<<<< HEAD
Dit project is gemaakt in het kader van de DevOps-opleiding.
---
=======
Dit project is gemaakt in het kader van hat vak DevOps.
---
>>>>>>> e123b64847ccc0c00d7214faec584d467d7c536e
