# monCine

> [!TIP]
> Projet pour le module 1WEBD de SUPINFO.

## Description 
Un cinéma d'un petit village isolé souhaite proposer des films à l'affiche pour attirer plus de jeunes des villages alentours.
Pour atteindre cet objectif, les gérants du cinéma décident de vous missionner pour créer une application permettant aux clients de visualiser les films disponibles.


## Installation
Installer les modules 
`npm install`

Configurer votre api key de l'api OMBD:
./env : 
```
OMDB_API_KEY=VOTRE_API_KEY
```


Lancer le serveur
`npm run start`

## Stack
- Node.js // serveur
- Express // framework pour le serveur (gestion des routes)
- Axios // pour faire les requêtes HTTP (API OMBD)
- HTML // pages
- CSS // styles des pages
- Javascript // dynamisme des pages
- Jest // pour les tests unitaires de l'API OMBD

## Tests
Utiliser les tests utilitaires (via jest et contenu dans ./tests/)
> [!TIP]
> Pour lancer les tests, il faut configurer votre api key de l'api OMBD dans le fichier .env
> 
> Enfin executer `npm test`

## Documentation
- [Documentation de l'api OMBD](https://www.omdbapi.com/)
- Documentation du projet disponible via fichiers `README.md`.

## Conventions d'écriture
- Code en anglais et commentaires en français.