---
name: notes-de-cours
description: Transforme un cours PDF en notes de cours efficaces (synthèse, schémas SVG, exemples, applications, pièges) et en un deck de flashcards, intégrés à l'app Data Flashcards, sans dupliquer ce qui existe déjà dans les autres notes et decks. À utiliser quand l'utilisateur importe ou cite un PDF de cours, ou tape /notes-de-cours <chemin.pdf>.
---

# Notes de cours depuis un PDF

Tu transformes un cours PDF en **une note de cours** (écran « Notes de cours » de l'app) et en **un deck de flashcards**, en t'appuyant sur ce qui existe déjà pour ne rien dupliquer. L'objectif de l'utilisateur : retenir l'essentiel (les 80 % qui comptent), en théorie comme en pratique, et pouvoir réviser sur son téléphone.

Argument : le chemin du PDF (souvent dans `docs_divers/`). S'il manque, demande-le. S'il ne s'agit que d'une partie du cours (« chapitres 3 à 5 »), ne traite que cette partie.

Le format exact des fichiers est dans [format.md](format.md) : lis-le avant d'écrire quoi que ce soit.

## Étape 1 — Lire le PDF sans le recopier

1. `pdfinfo "<pdf>"` : nombre de pages, titre.
2. Extraire le texte dans le scratchpad (jamais dans le dépôt) :
   `pdftotext -layout "<pdf>" <scratchpad>/cours.txt`
   puis lire par morceaux (`sed -n` ou Read avec offset/limit). Pour un long cours, repère d'abord le plan (table des matières, titres) et travaille chapitre par chapitre.
3. Quand une page contient un schéma, une formule mise en page ou un tableau mal extrait, lis la page directement (Read avec `pages`) ou rends-la en image :
   `pdftoppm -f N -l N -r 110 -png "<pdf>" <scratchpad>/p` puis Read de l'image.
4. Texte vide ou illisible (PDF scanné) : passe par les images de pages et préviens l'utilisateur que la lecture est plus lente.

Plus de ~150 pages : annonce le découpage (par exemple 4 lots de chapitres), traite lot par lot, et tiens l'utilisateur au courant en une ligne entre deux lots.

## Étape 2 — Faire l'inventaire de l'existant (anti-doublon)

Avant de rédiger, lance :

```bash
node scripts/inventaire.mjs                               # tous les decks, notes et questions
node scripts/inventaire.mjs --cherche "mot1 mot2 mot3"   # ciblé sur les notions du cours
```

Pour chaque notion du cours, classe-la dans une de ces trois catégories et note ta décision :

| Situation | Ce que tu fais dans la note | Ce que tu fais dans les cartes |
|---|---|---|
| **Nouvelle** (absente partout) | Explication complète | Nouvelles cartes |
| **Déjà couverte** (une carte ou une note dit la même chose) | Un bloc `renvoi` d'une ou deux phrases vers le deck ou la note existante, sans réexpliquer | Aucune carte |
| **Partiellement couverte** | Seulement le complément (ce que le cours ajoute : un autre angle, un cas, une limite), puis un `renvoi` | Seulement des cartes sur le complément |

Une notion « déjà couverte » se juge sur le fond, pas sur les mots : « Qu'est-ce que le query folding ? » et « Pourquoi filtrer tôt dans Power Query ? » parlent de la même chose. En cas de doute, lis la carte existante (`grep -n "id-de-carte" data/*.js`).

## Étape 3 — Rédiger la note

Fichier : `data/notes/<id>.js` (id court en kebab-case, ex. `big-data`, `data-mining`). Règles de fond :

- **Synthétiser, pas résumer page par page.** Regroupe par notion, dans l'ordre où on les apprend. Un chapitre de la note peut couvrir plusieurs chapitres du PDF.
- **Les 80 % utiles.** Garde ce qui sert à comprendre, à pratiquer et à passer un entretien. Laisse tomber l'historique, les anecdotes, les détails de version.
- **Chaque notion importante** = une explication courte (`texte` ou `definition`) + au moins un `exemple` concret (données, code, chiffres) + quand c'est pertinent une `application` (cas métier réel) et un `attention` (le piège classique).
- **Schémas** (`schema`, SVG) quand une image vaut mieux qu'un paragraphe : architecture, flux de données, étapes d'un algorithme, comparaison visuelle. Pas de schéma décoratif. Suis les règles SVG de format.md (viewBox, classes `s-*`, texte lisible à 360 px de large).
- **Synthèse visuelle** (champ `synthese` de la note) : toujours un schéma final qui résume toute la note en une image (processus de bout en bout ou carte des notions), lisible d'un coup d'œil et facile à redessiner de mémoire.
- **Formules** : la formule (`formule`), puis ce que signifie chaque terme et un calcul numérique d'exemple.
- **Exactitude** : tout chiffre, toute sortie de code et tout calcul affichés doivent être justes. Vérifie les calculs et, quand c'est possible, exécute le code d'exemple (python3, node, sqlite3, duckdb s'il est installé) dans le scratchpad.
- **Langue** : français clair, phrases courtes, le vocabulaire technique en anglais quand c'est l'usage (shuffle, partition, overfitting), défini à sa première apparition.
- **Fidélité** : la note s'appuie sur le cours ; si tu ajoutes une précision qui n'y figure pas (bonne pratique actuelle, correction d'une erreur du cours), signale-le dans le texte (« Précision : … » ou « Attention, le cours date de 2019 : … »).
- Remplis `concepts` (toutes les notions traitées, 15 à 60 termes) : c'est ce que les prochains imports utiliseront pour éviter les doublons.

## Étape 4 — Créer le deck de cartes

Fichier : `data/cards-<id>.js`, deck `langue: "<id>"` (le même id que la note, sauf si le cours enrichit un deck existant : dans ce cas, ajoute plutôt les cartes à ce deck et indique-le). Règles :

- 20 à 60 cartes selon la taille du cours, réparties sur les 4 niveaux (fondamentaux → pro).
- Une carte = une idée, une question qu'on pourrait poser en entretien ou en examen. Pas de carte de pure définition si une carte d'application peut la remplacer.
- Mélange : environ 65 % `flip`, 20 % `qcm` (distracteurs plausibles, `explain` qui dit pourquoi), 15 % `code` (trouver le bug, compléter, interpréter une sortie).
- Les réponses sont riches : le pourquoi, le piège ; ajoute `detail` et `example` (voir format.md) quand la réponse seule serait sèche.
- Aucune carte sur une notion classée « déjà couverte » à l'étape 2.

## Étape 5 — Enregistrer dans l'app

1. `data/notes/index.js` : importer la note et l'ajouter à `NOTES`.
2. `data/index.js` : importer le deck, l'ajouter à `BASE_CARDS`, et ajouter `{ id, label, color }` dans `LANGUES` (couleur foncée lisible sur fond clair, différente des autres).
3. `sw.js` : ajouter `"data/notes/<id>.js"` et `"data/cards-<id>.js"` au `PRECACHE_URLS` et **incrémenter `CACHE_NAME`** (sinon les téléphones gardent l'ancienne version).
4. `README.md` : ajouter la note dans la section « Notes de cours » (une ligne : titre, source, nombre de cartes).

## Étape 6 — Vérifier

```bash
node scripts/verifier.mjs     # doit finir par « OK : aucune erreur »
```

Corrige toute erreur. Regarde aussi la liste des quasi-doublons : s'il en apparaît de nouveaux impliquant tes cartes, supprime ou reformule tes cartes.

Puis vérifie le rendu dans un vrai navigateur : sers le dossier (`python3 -m http.server <port>` en arrière-plan) et ouvre la note. Si le skill `anatomy` est installé, `node ~/.claude/skills/anatomy/scripts/drive.mjs http://localhost:<port>/index.html --actions steps.json --width 420` permet de cliquer sur la note et de faire des captures ; lis-les, en particulier chaque schéma (lisible ? rien ne déborde ?). Sinon, demande à l'utilisateur de vérifier sur son téléphone.

## Étape 7 — Rendre compte

Dis à l'utilisateur, en peu de lignes :
- le nombre de chapitres de la note, de schémas, et de cartes créées (par niveau) ;
- ce qui a été **écarté comme doublon** et vers quoi la note renvoie (c'est la preuve que l'anti-doublon a fonctionné) ;
- les points où le cours était daté ou faux, et ce que tu as corrigé ;
- comment y accéder : écran d'accueil → « Notes de cours ».

Ne commite et ne pousse (`git add`, `git commit`, `git push`) que si l'utilisateur le demande ; propose-le en une ligne. Le site GitHub Pages se met à jour à chaque push sur `main`.
