# Emmaüs - Site Web Église Chrétienne

## 1. Description du Projet
Site web moderne pour l'église chrétienne "Emmaüs". Design spirituel, chaleureux, minimaliste et professionnel. Le site présente les activités de l'église, les programmes, les événements, la galerie, les vidéos et permet le contact. Inclut un dashboard administrateur sécurisé pour gérer tout le contenu.

Langues supportées : Français (fr), Anglais (en), Allemand (de), Chinois (zh), Espagnol (es), Italien (it), Portugais (pt).

## 2. Structure des Pages

### Pages Publiques
- `/` - Accueil (hero, message, programmes, événements, vidéos, galerie, pastoral, footer)
- `/about` - À propos (histoire, vision, mission, valeurs, pasteur, objectifs)
- `/communities` - Communautés (jeunesse, femmes, hommes, enfants, chorale, intercession, évangélisation)
- `/programs` - Programmes (culte, prière, étude biblique, évangélisation, chorale)
- `/events` - Événements (liste + calendrier)
- `/events/:id` - Détail d'un événement
- `/gallery` - Galerie photos (dossiers : baptême, culte, concert, conférence, jeunesse)
- `/gallery/:folder` - Photos d'un dossier
- `/videos` - Vidéos (lecteur React)
- `/contact` - Contact (formulaire + infos)

### Pages Admin (protégées par auth)
- `/admin` - Dashboard (stats globales)
- `/admin/messages` - Messages de contact
- `/admin/events` - Gestion des événements
- `/admin/programs` - Gestion des programmes
- `/admin/communities` - Gestion des communautés
- `/admin/gallery` - Gestion de la galerie
- `/admin/videos` - Gestion des vidéos
- `/admin/users` - Gestion des utilisateurs
- `/admin/settings` - Paramètres du site

### Auth
- `/login` - Page de connexion admin
- `/register` - Page d'inscription (admin)

## 3. Fonctionnalités Clés

### Publique
- [x] Navigation responsive avec sélecteur de langue
- [x] Hero section moderne avec image de fond
- [x] Affichage des programmes récents (données Supabase avec fallback mock)
- [x] Affichage des événements à venir (données Supabase avec fallback mock)
- [x] Galerie photos par dossiers (données Supabase avec fallback mock)
- [x] Lecteur vidéo intégré (données Supabase avec fallback mock)
- [x] Formulaire de contact fonctionnel (sauvegarde dans Supabase)
- [x] Footer moderne avec infos et réseaux sociaux
- [x] Système de traduction multilingue (7 langues)

### Administration
- [x] Authentification email/mot de passe (Supabase Auth)
- [x] Dashboard avec statistiques
- [x] CRUD complet pour événements, programmes, communautés, vidéos
- [x] Gestion de la galerie par dossiers et photos
- [x] Gestion des messages de contact + réponse admin
- [ ] Gestion des utilisateurs avec rôles (ADMIN, EDITOR, VISITOR)
- [x] Paramètres du site modifiables (logo, couleurs, contact, footer)

## 4. Modèle de Données (Supabase)

### Table: events
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | Clé primaire |
| title | text | Titre de l'événement |
| image | text | URL de l'image |
| date | date | Date de l'événement |
| start_time | time | Heure de début |
| end_time | time | Heure de fin |
| location | text | Lieu |
| description | text | Description |
| program | text | Programme détaillé |
| created_at | timestamp | Date de création |

### Table: programs
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | Clé primaire |
| title | text | Titre du programme |
| day | text | Jour |
| start_time | time | Heure de début |
| end_time | time | Heure de fin |
| location | text | Lieu |
| description | text | Description |
| category | text | Catégorie |
| created_at | timestamp | Date de création |

### Table: communities
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | Clé primaire |
| name | text | Nom de la communauté |
| image | text | URL de l'image |
| description | text | Description |
| leader | text | Responsable |
| day | text | Jour de réunion |
| time | text | Heure de réunion |
| created_at | timestamp | Date de création |

### Table: gallery_folders
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | Clé primaire |
| name | text | Nom du dossier |
| cover_image | text | Image de couverture |
| description | text | Description |
| created_at | timestamp | Date de création |

### Table: gallery_images
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | Clé primaire |
| folder_id | uuid | Référence dossier |
| image_url | text | URL de l'image |
| created_at | timestamp | Date de création |

### Table: videos
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | Clé primaire |
| title | text | Titre |
| video_url | text | URL de la vidéo |
| description | text | Description |
| category | text | Catégorie |
| date | date | Date de publication |
| created_at | timestamp | Date de création |

### Table: contact_messages
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | Clé primaire |
| name | text | Nom |
| email | text | Email |
| phone | text | Téléphone |
| subject | text | Sujet |
| message | text | Message |
| image_url | text | URL image (optionnel) |
| status | text | Statut (new, replied, archived) |
| admin_reply | text | Réponse admin |
| created_at | timestamp | Date de création |

### Table: site_settings
| Champ | Type | Description |
|-------|------|-------------|
| id | uuid | Clé primaire |
| site_name | text | Nom du site |
| logo | text | URL du logo |
| primary_color | text | Couleur principale |
| secondary_color | text | Couleur secondaire |
| phone | text | Téléphone |
| email | text | Email |
| address | text | Adresse |
| whatsapp | text | WhatsApp |
| facebook | text | Facebook |
| instagram | text | Instagram |
| youtube | text | YouTube |
| footer_text | text | Texte du footer |
| created_at | timestamp | Date de création |

## 5. Intégrations Backend / Tiers
- **Supabase** : Base de données PostgreSQL, Authentification, Storage (images)
- **Stripe** : Non nécessaire (pas de paiement)
- **Shopify** : Non nécessaire

## 6. Plan de Développement par Phases

### Phase 1 : Setup et Fondations
- **Objectif** : Convertir le projet en JS/JSX, configurer la structure, créer le système de traduction, le layout global (Navbar + Footer), et la page d'accueil.
- **Livrables** :
  - Conversion de tous les fichiers src en .js/.jsx
  - Système de traduction objet pour 7 langues
  - Configuration globale du site (objet settings)
  - Navbar responsive avec sélecteur de langue
  - Footer moderne
  - Page d'accueil complète avec hero, sections dynamiques

### Phase 2 : Pages Publiques (Contenu)
- **Objectif** : Créer toutes les pages publiques avec données mockées.
- **Livrables** :
  - Page À propos
  - Page Communautés
  - Page Programmes
  - Page Événements
  - Page Détail Événement
  - Page Galerie
  - Page Détail Galerie
  - Page Vidéos
  - Page Contact avec formulaire

### Phase 3 : Connexion Supabase et Authentification
- **Objectif** : Connecter Supabase, ajouter l'authentification, et remplacer les données mockées par des données réelles.
- **Livrables** :
  - Connexion Supabase
  - Tables créées dans la base de données
  - Authentification (login/register)
  - Pages protégées par auth
  - Récupération des données depuis Supabase

### Phase 4 : Dashboard Admin
- **Objectif** : Créer l'interface d'administration complète.
- **Livrables** :
  - Layout admin avec sidebar
  - Dashboard avec stats
  - CRUD Événements
  - CRUD Programmes
  - CRUD Communautés
  - CRUD Galerie
  - CRUD Vidéos
  - Gestion des Messages
  - Gestion des Utilisateurs
  - Paramètres du site

### Phase 5 : Finalisation et Tests
- **Objectif** : Polissage, animations, responsive, tests.
- **Livrables** :
  - Animations et transitions
  - Vérification responsive mobile/tablette/desktop
  - Optimisation des images
  - Tests de navigation
  - Tests admin