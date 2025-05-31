# Rapport de Développement - Application Web SecureAccess

## Résumé du Projet

Ce rapport présente le développement d'une application web pour la visualisation et la gestion des données d'enregistrement et de surveillance du système SecureAccess, conformément à la section 3.4 du cahier des charges.

## Fonctionnalités Implémentées

L'application web développée permet de répondre à toutes les exigences spécifiées dans la section 3.4 du cahier des charges :

### 1. Enregistrement des tentatives d'authentification
- Consultation des logs d'accès (autorisés/refusés)
- Affichage des détails (timestamp, identifiant RFID utilisé)
- Visualisation des images capturées en cas d'échec d'authentification
- Filtrage des logs par date, statut et identifiant RFID

### 2. Surveillance des capteurs
- Affichage en temps réel des valeurs de température et d'humidité
- Visualisation graphique de l'historique des données
- Indication du statut des capteurs (activé/non activé)
- Suivi de l'historique des états de la porte (ouverte/fermée)

### 3. Tableau de bord général
- Vue d'ensemble des derniers événements
- Statistiques rapides sur les accès et l'activité
- Indicateurs visuels de l'état du système

## Architecture Technique

L'application a été développée selon une architecture moderne et modulaire :

- **Backend** : Flask (Python) avec API REST
- **Frontend** : HTML5, CSS3 (Bootstrap), JavaScript
- **Visualisation** : Chart.js pour les graphiques
- **Données** : Format JSON (simulées pour la démonstration)

## Tests et Validation

Toutes les fonctionnalités ont été testées localement pour garantir :
- L'affichage correct des logs d'authentification
- La visualisation précise des données des capteurs
- L'affichage des images capturées lors des échecs d'authentification
- La réactivité et l'ergonomie de l'interface utilisateur

## Déploiement

L'application est prête pour un déploiement cloud. Les instructions détaillées sont disponibles dans le fichier README.md, avec plusieurs options de déploiement :
- PythonAnywhere
- Heroku
- AWS Elastic Beanstalk

## Perspectives d'Évolution

L'application pourrait être améliorée avec :
- Une authentification pour les administrateurs
- Des notifications en temps réel (WebSockets)
- Une intégration avec des systèmes d'alerte externes
- Des fonctionnalités d'exportation de données

## Conclusion

Cette application web répond pleinement aux exigences de la section 3.4 du cahier des charges, offrant une interface intuitive et complète pour la surveillance du système SecureAccess. Sa conception modulaire permettra des évolutions futures selon les besoins.
