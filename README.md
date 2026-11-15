# Data Flashcards

**▶ Ouvrir l'app : [filou337.github.io/data-flashcards](https://filou337.github.io/data-flashcards/)**

<img src="icons/qr-app.png" alt="QR code vers l'app Data Flashcards" width="180">

*Scanne le QR code avec l'appareil photo du téléphone, puis « Ajouter à l'écran d'accueil ».*

App de flashcards à répétition espacée (SM-2, façon Anki) pour réviser SQL, Power Query M, DAX, PySpark, Scala, les statistiques (tests, A/B tests), la régression / modélisation, l'analyse de données, le data engineering et les tests & la qualité des données, plus le Big Data, le Data Mining, Python et les Transformers — 536 cartes couvrant les fondamentaux jusqu'au niveau pro, plus les deux cas pratiques bout-en-bout (SCD2, tarification promotionnelle).

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

## Notes de cours (agent `/notes-de-cours`)

Un skill Claude Code transforme un cours PDF en **note de cours** (écran « Notes de cours » de l'app : synthèse, schémas, exemples, applications, pièges, « à retenir ») et en **deck de flashcards**, sans dupliquer ce qui existe déjà :

```
/notes-de-cours docs_divers/mon-cours.pdf
```

1. Il extrait le PDF (`pdftotext`, et les pages à schémas en images).
2. Il fait l'inventaire de l'existant (`node scripts/inventaire.mjs --cherche "…"`) et classe chaque notion : nouvelle, déjà couverte (simple renvoi vers le deck ou la note existante) ou partiellement couverte (seulement le complément).
3. Il écrit `data/notes/<id>.js` et `data/cards-<id>.js`, les enregistre (`data/notes/index.js`, `data/index.js`, `sw.js`).
4. Il vérifie avec `node scripts/verifier.mjs` (format, schémas SVG sûrs, fichiers pré-cachés, quasi-doublons entre decks) puis contrôle le rendu.

Instructions de l'agent : `.claude/skills/notes-de-cours/SKILL.md` ; format des notes et des schémas : `.claude/skills/notes-de-cours/format.md`.

| Note | Source | Cartes |
|---|---|---|
| Big Data : concepts et technologies | `BigDataASR2022.pdf` (146 diapos) | 35 (deck Big Data) |
| DAX dans Excel Power Pivot | `ExcDAX-99-99-…v4.4-qs.pdf` (85 pages) | 19 (ajoutées au deck DAX) |
| Scala par l'exemple | `ScalaByExample-fr_FR.pdf` (101 pages) | 23 (ajoutées au deck Scala) |
| PySpark pratique : l'aide-mémoire du data engineer | `MPRA_paper_113562.pdf` (183 pages) | 22 (ajoutées au deck PySpark) |
| Comprendre les Transformers | `Transformers_Presentation.pdf` (22 diapos, projet M2) | 18 (deck Transformers & LLM) |
| Data Mining : clustering, classification, règles d'association | `Cours-Data-Mining.pdf` (325 diapos) | 26 (deck Data Mining) |
| Python : les bases solides pour la data | `cours-python.pdf` (402 pages) | 30 (deck Python) |

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

Deux champs optionnels enrichissent le verso : `detail` (bloc « Pour comprendre ») et `example` (bloc « Exemple », affiché comme du code). Pour les decks d'origine, ils sont rangés à part dans `data/extras-*.js` (un objet `{ id: { detail, example } }` par deck) et fusionnés aux cartes dans `data/index.js`.

## Raccourcis clavier (session)

| Touche | Action |
|---|---|
| Espace / Entrée | Voir la réponse |
| 1 à 4 ou A à D | Choisir une réponse de QCM |
| 1 / 2 / 3 / 4 | Noter : Encore / Difficile / Bien / Facile |
