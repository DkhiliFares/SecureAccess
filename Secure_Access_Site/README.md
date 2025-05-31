# SecureAccess - Application Web de Surveillance

Cette application web permet de visualiser et gérer les données d'enregistrement et de surveillance du système SecureAccess, conformément à la section 3.4 du cahier des charges.

## Fonctionnalités

- **Tableau de bord** : Vue d'ensemble des dernières tentatives d'authentification, état actuel des capteurs et statistiques
- **Logs d'authentification** : Consultation des tentatives d'accès (autorisées/refusées) avec détails et images
- **Surveillance des capteurs** : Affichage en temps réel des données de température, humidité et statut des capteurs
- **Historique de la porte** : Suivi des événements d'ouverture/fermeture avec graphiques statistiques

## Prérequis

- Python 3.6 ou supérieur
- Pip (gestionnaire de paquets Python)

## Installation locale

1. Cloner le dépôt ou décompresser l'archive
2. Créer un environnement virtuel (recommandé) :
   ```
   python -m venv venv
   source venv/bin/activate  # Sur Linux/Mac
   venv\Scripts\activate     # Sur Windows
   ```
3. Installer les dépendances :
   ```
   pip install -r requirements.txt
   ```
4. Lancer l'application :
   ```
   python src/main.py
   ```
5. Accéder à l'application dans votre navigateur à l'adresse : http://localhost:5000

## Déploiement sur le cloud

### Option 1 : Déploiement sur PythonAnywhere

1. Créer un compte sur [PythonAnywhere](https://www.pythonanywhere.com/)
2. Aller dans la section "Web" et créer une nouvelle application web
3. Choisir Flask comme framework et Python 3.x
4. Dans la console, cloner le dépôt ou uploader les fichiers
5. Créer un environnement virtuel et installer les dépendances :
   ```
   mkvirtualenv --python=/usr/bin/python3.x myenv
   pip install -r requirements.txt
   ```
6. Configurer le fichier WSGI pour pointer vers l'application :
   ```python
   import sys
   path = '/home/votre_username/secure_access_web'
   if path not in sys.path:
       sys.path.append(path)
   
   from src.main import app as application
   ```
7. Redémarrer l'application web

### Option 2 : Déploiement sur Heroku

1. Créer un compte sur [Heroku](https://www.heroku.com/)
2. Installer le CLI Heroku et se connecter
3. Créer un fichier `Procfile` à la racine du projet avec le contenu :
   ```
   web: gunicorn src.main:app
   ```
4. Ajouter gunicorn aux dépendances :
   ```
   pip install gunicorn
   pip freeze > requirements.txt
   ```
5. Initialiser un dépôt Git et déployer :
   ```
   git init
   git add .
   git commit -m "Initial commit"
   heroku create
   git push heroku master
   ```

### Option 3 : Déploiement sur AWS Elastic Beanstalk

1. Créer un compte AWS et installer l'AWS CLI
2. Installer l'EB CLI : `pip install awsebcli`
3. Initialiser l'application EB :
   ```
   eb init -p python-3.x secure-access
   ```
4. Créer un environnement et déployer :
   ```
   eb create secure-access-env
   ```
5. Ouvrir l'application dans le navigateur :
   ```
   eb open
   ```

## Structure du projet

```
secure_access_web/
├── data/                  # Données simulées (JSON)
├── static/                # Fichiers statiques
│   ├── css/               # Feuilles de style
│   ├── js/                # Scripts JavaScript
│   └── img/               # Images (captures d'authentification, etc.)
├── templates/             # Templates HTML
├── src/                   # Code source Python
│   └── main.py            # Point d'entrée de l'application
├── venv/                  # Environnement virtuel (à créer)
├── requirements.txt       # Dépendances Python
└── README.md              # Ce fichier
```

## Personnalisation

Pour connecter l'application à un système réel :

1. Modifier les routes API dans `src/main.py` pour se connecter à une base de données réelle
2. Adapter les modèles de données selon les besoins spécifiques
3. Configurer les paramètres d'authentification si nécessaire

## Maintenance

- Mettre à jour régulièrement les dépendances
- Sauvegarder les données importantes
- Surveiller les performances de l'application en production
