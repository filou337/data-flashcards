# Format des notes et des cartes

## 1. Fichier de note : `data/notes/<id>.js`

Le nom du fichier est l'`id` de la note. Il exporte une constante `note` :

```js
export const note = {
  id: "big-data",                       // kebab-case, = nom du fichier
  titre: "Big Data et Hadoop",
  source: "BigDataASR2022.pdf · 146 diapositives",
  deck: "big-data",                     // id du deck de cartes associé (dans LANGUES)
  resume: "Deux ou trois phrases : de quoi parle le cours et ce qu'on saura faire après.",
  prerequis: ["pyspark", "note:autre-note"],   // decks ou notes à connaître avant (facultatif)
  concepts: ["HDFS", "MapReduce", "YARN", "réplication", "localité des données"],   // pour l'anti-doublon
  chapitres: [
    {
      id: "hdfs",                       // unique dans la note
      titre: "HDFS : stocker des fichiers géants",
      objectif: "Comprendre comment un fichier de 1 To est découpé et protégé.",   // facultatif
      blocs: [ /* voir la liste des blocs */ ],
    },
  ],
  synthese: [                              // schéma(s) de synthèse affichés en fin de note (« Synthèse visuelle »)
    { svg: "<svg …>…</svg>", legende: "Comment lire le schéma." },
  ],
  aRetenir: ["Une phrase par idée clé, 5 à 10 au total."],
};
```

`synthese` est **obligatoire en pratique** : un schéma qui résume toute la note en une image (le processus ou la carte des notions), pour que l'utilisateur travaille sa mémoire visuelle en le redessinant. Il ne recopie pas un schéma d'un chapitre : il les relie. Mêmes règles SVG que les blocs `schema` (section 3).

Dans tous les champs texte : `**gras**`, `*italique*` et `` `code` `` sont rendus ; une ligne vide sépare deux paragraphes. Pas de HTML (il est échappé).

## 2. Les blocs

| type | champs | rendu |
|---|---|---|
| `texte` | `contenu` | paragraphe(s) |
| `liste` | `items: []`, `ordonnee: true` (facultatif) | liste à puces ou numérotée |
| `definition` | `terme`, `contenu` | encadré « Définition » |
| `formule` | `contenu` (formule en texte, ex. `σ = √( Σ(xᵢ − x̄)² / (n − 1) )`), `explication` | encadré centré |
| `exemple` | `titre`?, `contenu`?, `code`?, `resultat`? | encadré « Exemple » |
| `application` | `titre`?, `contenu`?, `code`?, `resultat`? | encadré vert « Application » (cas métier réel) |
| `attention` | `contenu` | encadré rouge (piège, erreur classique) |
| `code` | `contenu` | bloc de code seul |
| `tableau` | `entetes: []`, `lignes: [[]]` (autant de cellules que d'entêtes) | tableau défilant |
| `schema` | `svg`, `legende` | figure SVG |
| `renvoi` | `vers` (`"<deck>"` ou `"note:<id>"` ou `"note:<id>#<chapitre>"`), `contenu` | encadré « Déjà vu ailleurs » avec un bouton vers la cible |

Exemple de chapitre complet :

```js
blocs: [
  { type: "texte", contenu: "HDFS découpe chaque fichier en **blocs** de 128 Mo, répartis sur les machines du cluster." },
  { type: "definition", terme: "Facteur de réplication", contenu: "Nombre de copies de chaque bloc (3 par défaut), placées sur des machines différentes." },
  { type: "schema", svg: "<svg …>…</svg>", legende: "Un fichier de 300 Mo = 3 blocs, chacun copié 3 fois." },
  { type: "exemple", titre: "Combien de blocs ?", contenu: "Un fichier de 1 Go avec des blocs de 128 Mo :", resultat: "1024 / 128 = 8 blocs → 24 copies avec une réplication de 3 (3 Go sur disque)." },
  { type: "application", titre: "Perte d'un disque", contenu: "Quand une machine tombe, le NameNode recrée automatiquement les copies manquantes à partir des deux autres." },
  { type: "attention", contenu: "Des millions de petits fichiers saturent la mémoire du NameNode : regrouper les petits fichiers." },
  { type: "renvoi", vers: "pyspark", contenu: "La logique des partitions et du shuffle côté calcul est déjà dans le deck PySpark." },
]
```

## 3. Schémas SVG

Le SVG est injecté tel quel : il doit être autonome, sûr et suivre le thème clair/sombre.

- Commence par `<svg viewBox="0 0 L H" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="description">` et finis par `</svg>`. **Pas de width/height fixes** : le schéma s'adapte à la largeur.
- **Pensé pour le téléphone** : viewBox de **360 de large** (420 au maximum), pour un affichage presque 1:1 sur un écran de 360 px. Les classes de texte font 13 / 11 unités : avec une viewBox plus large, le texte devient illisible sur mobile (vérifié : à 480 de large, le texte tombe sous 10 px). Au plus 3 boîtes par ligne ; un schéma plus riche s'empile verticalement (la hauteur est libre).
- Interdit : `<script>`, attributs `on…=`, `<foreignObject>`, liens externes, images. Le vérificateur refuse ces contenus.
- **Couleurs : uniquement via ces classes** (définies dans `css/style.css`, elles suivent le thème) :

| classe | usage |
|---|---|
| `s-box` | boîte neutre (fond + bordure) |
| `s-acc` | boîte mise en avant (couleur d'accent) |
| `s-ok` / `s-warn` | boîte verte (correct, succès) / rouge (erreur, rejet) |
| `s-line` | trait ou flèche |
| `s-dash` | trait pointillé (relation faible, optionnel) |
| `s-txt` / `s-bold` / `s-sub` | texte normal / gras / petit texte grisé |
| `s-arrow` | remplissage d'une pointe de flèche (dans un `<marker>`) |

- Flèches : définis un marqueur avec un id **propre au schéma** (plusieurs schémas cohabitent dans la page) :

```svg
<svg viewBox="0 0 360 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pipeline en trois couches">
  <defs><marker id="fl-medaillon" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="s-arrow"/></marker></defs>
  <rect x="4" y="27" width="100" height="56" rx="8" class="s-box"/>
  <text x="54" y="52" text-anchor="middle" class="s-bold">Bronze</text>
  <text x="54" y="70" text-anchor="middle" class="s-sub">brut</text>
  <rect x="130" y="27" width="100" height="56" rx="8" class="s-box"/>
  <text x="180" y="52" text-anchor="middle" class="s-bold">Silver</text>
  <text x="180" y="70" text-anchor="middle" class="s-sub">nettoyé</text>
  <rect x="256" y="27" width="100" height="56" rx="8" class="s-acc"/>
  <text x="306" y="52" text-anchor="middle" class="s-bold">Gold</text>
  <text x="306" y="70" text-anchor="middle" class="s-sub">agrégé</text>
  <path d="M104 55H126" class="s-line" marker-end="url(#fl-medaillon)"/>
  <path d="M230 55H252" class="s-line" marker-end="url(#fl-medaillon)"/>
</svg>
```

- Dans un fichier `.js`, écris le SVG dans une chaîne entre backticks (`` `…` ``) pour garder les guillemets doubles et les retours à la ligne.
- Mesure le texte avant de dessiner la boîte : environ 0,6 × taille de police par caractère. Une étiquette qui dépasse de sa boîte est le défaut le plus fréquent ; vérifie chaque schéma sur une capture.

Bons sujets de schéma : architecture (qui parle à qui), flux de données de bout en bout, étapes d'un algorithme (avant / après), arbre de décision, matrice de confusion, courbe annotée (tracée en `path`), comparaison de deux approches côte à côte.

## 4. Fichier de cartes : `data/cards-<id>.js`

```js
export const cardsBigData = [
  { id: "bd-f1-1", langue: "big-data", niveau: "fondamentaux", type: "flip",
    front: "Pourquoi HDFS utilise-t-il des blocs de 128 Mo et pas de 4 Ko comme un disque ?",
    back: "Pour lire de gros volumes en continu : moins de blocs = moins de métadonnées pour le NameNode et moins de déplacements de tête…",
    detail: "Facultatif : le mécanisme, le pourquoi.",
    example: "Facultatif : code ou calcul concret, affiché en police à chasse fixe." },
  { id: "bd-i1-1", langue: "big-data", niveau: "intermediaire", type: "qcm",
    front: "…", choices: ["…", "…", "…", "…"], answer: 2, explain: "Pourquoi la bonne réponse, et pourquoi les autres sont fausses." },
  { id: "bd-a1-1", langue: "big-data", niveau: "avance", type: "code",
    front: "Trouve le bug.", code: "…", back: "…" },
];
```

- Ids : `<préfixe>-<f|i|a|p><n>-<m>` (f = fondamentaux, i = intermédiaire, a = avancé, p = pro), uniques dans toute l'app.
- `niveau` ∈ `fondamentaux | intermediaire | avance | pro`.
- Nom de l'export : `cards` + nom en PascalCase (`cardsBigData`), à importer dans `data/index.js`.
