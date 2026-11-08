# Artiz

**Artiz** est une plateforme web intuitive qui connecte les artisans et les clients au Bénin. Elle permet de trouver, contacter et réserver des services artisanaux en quelques clics, sans complication.

## 🎯 Fonctionnalités principales

### Pour les clients (sans inscription obligatoire)

- **Recherche d’artisans** par métier (plomberie, électricité, couture, etc.) ou par ville.
- **Consultation des profils** : description, tarifs, adresse, photo.
- **Réservation instantanée** via un formulaire simple (nom, email, téléphone, lieu d’intervention).

### Pour les artisans

- **Inscription / Connexion** sécurisée (email, mot de passe).
- **Tableau de bord** : visualisation des demandes reçues (nom du client, coordonnées, statut).
- **Gestion des réservations** : accepter ou refuser une demande.
- **Modification du profil** : métier, tarifs, description, photo, WhatsApp.

### Expérience utilisateur

- Interface moderne avec dégradés de couleurs (indigo → violet).
- Animations fluides, design responsive (mobile, tablette, desktop).
- Navigation claire : redirection automatique vers le tableau de bord pour les artisans, vers l’accueil pour les clients.

## 🛠️ Stack technique

| Couche           | Technologie                                           |
| ---------------- | ----------------------------------------------------- |
| Backend          | Django 4.x, Django REST Framework                     |
| Base de données  | SQLite (en développement) – évolutive vers PostgreSQL |
| Authentification | JWT (JSON Web Tokens)                                 |
| Frontend         | React 18, Axios, React Router, Tailwind CSS           |
| Paquets clés     | framer-motion, lucide-react, react-hot-toast          |

## 📁 Structure du projet

```
Application-Web--Recherche-d-artisans-Benin/
├── backend/
│   ├── artisans/          # App Django pour les profils artisans
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── users/             # App Django pour les utilisateurs
│   │   ├── models.py      # User personnalisé (email comme identifiant)
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── artiz/           # Configuration du projet Django
│   │   ├── settings.py
│   │   └── urls.py
│   ├── db.sqlite3         # Base de données (non versionnée)
│   ├── media/             # Photos de profil uploadées
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/    # Composants React (Header, ArtisanCard, ReservationModal, etc.)
│   │   ├── pages/         # Pages (Home, Login, DevenirArtisan, Dashboard, etc.)
│   │   ├── services/      # Appels API (auth, artisans, réservations)
│   │   └── styles/        # CSS personnalisé (complète Tailwind)
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🚀 Installation et lancement (pour développeurs)

### Backend

```bash
cd backend
python -m venv env
source env/bin/activate  # ou .\env\Scripts\activate sous Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

L’application sera accessible sur `http://localhost:3000` (frontend) et l’API sur `http://localhost:8000/api/v1/`.

## 📌 Points forts du projet

- **Sécurité** : authentification JWT, validation des formulaires.
- **Ergonomie** : formulaires multi‑étapes pour l’inscription artisan, modales fluides.
- **Réservation anonyme** : pas besoin de compte pour contacter un artisan.
- **Dashboard artisan** complet avec actions (accepter/refuser) et lien WhatsApp.
- **Code maintenable** : découpage en composants React, sérialiseurs Django propres.

## 🔮 Améliorations possibles

- Notifications par email ou SMS lors d’une nouvelle réservation.
- Géolocalisation pour afficher les artisans à proximité.
- Tests unitaires (Jest pour React, pytest pour Django).
- Passage à PostgreSQL en production.

## 🤝 Contribuer

Les contributions sont les bienvenues ! Merci de respecter la structure existante et d’ouvrir une issue avant une pull request.

## 📄 Licence

Projet réalisé dans le cadre d’une initiative locale. Libre d’utilisation et de modification.

<!-- nouveau-pc:debut -->
## Installer sur un nouveau PC

**Prérequis :** Git, Python 3.12 et Node.js 20 ou plus.

```bash
git clone git@github.com:Magloireaffokpe/Artiz_Projects.git
cd Artiz_Projects/backend
python3 -m venv env
source env/bin/activate   # Windows : env\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations artisans users   # les migrations ne sont pas dans Git
python manage.py migrate
python manage.py runserver

# Dans un autre terminal
cd frontend
npm install
echo 'VITE_API_URL=http://localhost:8000/api/v1' > .env
npm run dev                  # http://localhost:3000
```

**À recopier à la main (hors Git) :** `frontend/.env`, `frontend/.env.production` et, pour conserver les données, `backend/db.sqlite3` (dans ce cas, lancer `python manage.py migrate --fake-initial` à la place de `migrate`).
<!-- nouveau-pc:fin -->
