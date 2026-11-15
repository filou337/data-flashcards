# Data Flashcards

App de flashcards à répétition espacée (SM-2, façon Anki) pour réviser SQL, Power Query M, DAX, PySpark, Scala, les statistiques (tests, A/B tests), la régression / modélisation et l'analyse de données — 287 cartes couvrant les fondamentaux jusqu'au niveau pro, plus les deux cas pratiques bout-en-bout (SCD2, tarification promotionnelle).

Aucune dépendance, aucun build : HTML/CSS/JS pur, données en `localStorage`, installable comme app sur téléphone (PWA).

## Lancer en local

Les modules ES (`import`/`export`) ont besoin d'un serveur — ouvrir `index.html` directement (`file://`) ne fonctionnera pas.

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Déployer sur GitHub Pages (accès depuis ton téléphone, partout)

1. Crée un dépôt sur [github.com/new](https://github.com/new) (public, sans README ni .gitignore — ils existent déjà ici).
2. Depuis ce dossier :
   ```bash
   git remote add origin https://github.com/<ton-utilisateur>/<nom-du-repo>.git
   git branch -M main
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Build and deployment → Source : Deploy from a branch**, branche `main`, dossier `/ (root)`. Enregistrer.
4. Après 1-2 minutes, l'app est en ligne à `https://<ton-utilisateur>.github.io/<nom-du-repo>/`.

## Installer sur ton téléphone

Ouvre l'URL ci-dessus dans le navigateur de ton téléphone, puis :
- **Android (Chrome)** : menu ⋮ → « Ajouter à l'écran d'accueil » / « Installer l'application ».
- **iPhone (Safari)** : bouton Partager → « Sur l'écran d'accueil ».

L'app s'ouvre alors comme une app native, fonctionne hors-ligne (service worker), avec sa propre icône.

## Progression et synchronisation entre appareils

La progression (état de répétition espacée de chaque carte, streak, historique) est stockée en `localStorage`, **propre à chaque appareil/navigateur** — pas de compte, pas de serveur. Pour transférer ta progression d'un appareil à l'autre : écran Statistiques → **Exporter ma progression** (fichier JSON), puis **Importer** sur l'autre appareil.

## Structure du projet

```
index.html            structure de l'app (3 écrans : accueil, session, stats)
css/style.css          design, thème clair/sombre automatique
js/srs.js              algorithme de répétition espacée (SM-2 simplifié)
js/db.js                persistance localStorage (états des cartes, stats, export/import)
js/app.js               logique d'interface, filtres, session, gamification
data/cards-*.js        banque de cartes par langage
data/index.js           agrégation de toutes les cartes
manifest.webmanifest   métadonnées PWA (icône, nom, couleurs)
sw.js                    service worker (cache hors-ligne)
```

## Ajouter des cartes

Chaque fichier `data/cards-*.js` exporte un tableau d'objets. Trois formats :

```js
// Recto/verso
{ id: "sql-x", langue: "sql", niveau: "fondamentaux", type: "flip", front: "Question", back: "Réponse" }

// QCM
{ id: "sql-y", langue: "sql", niveau: "avance", type: "qcm",
  front: "Question", choices: ["A", "B", "C", "D"], answer: 1, explain: "Pourquoi B est correct" }

// Exercice de code
{ id: "sql-z", langue: "sql", niveau: "pro", type: "code",
  front: "Trouve le bug", code: "SELECT ...", back: "Explication + code corrigé" }
```

`langue` doit correspondre à un id de `LANGUES` dans `data/index.js` ; `niveau` à `fondamentaux | intermediaire | avance | pro`.
