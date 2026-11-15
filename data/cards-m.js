export const cardsM = [
  // ---- Fondamentaux ----
  {
    id: "m-f1-1", langue: "m", niveau: "fondamentaux", type: "flip",
    front: "Que produit chaque étape d'une requête Power Query M ?",
    back: "Une nouvelle valeur immuable calculée à partir de la précédente — rien n'est jamais modifié « en place »."
  },
  {
    id: "m-f1-2", langue: "m", niveau: "fondamentaux", type: "flip",
    front: "Où voir le code M brut généré par tes clics dans l'interface graphique de Power Query ?",
    back: "Accueil → Éditeur avancé."
  },
  {
    id: "m-f2-1", langue: "m", niveau: "fondamentaux", type: "flip",
    front: "En M : comment accéder à un champ d'un record, à un élément d'une liste, à une colonne d'une table ?",
    back: "[Champ] pour un record, {n} pour un élément de liste (index base 0), Table[Colonne] pour extraire une colonne entière en liste."
  },
  {
    id: "m-f2-2", langue: "m", niveau: "fondamentaux", type: "qcm",
    front: "Après un regroupement (Group By), une colonne affichant « Table » cliquable dans chaque cellule signifie...",
    choices: [
      "Une erreur de calcul",
      "Une colonne contenant des tables imbriquées, à développer",
      "Un type de donnée non supporté",
      "Le résultat d'un Merge uniquement"
    ],
    answer: 1,
    explain: "Le bouton avec deux flèches à côté du nom de colonne permet de « Développer » cette structure imbriquée."
  },
  {
    id: "m-f3-1", langue: "m", niveau: "fondamentaux", type: "flip",
    front: "Quelle syntaxe faut-il utiliser en M pour un nom d'étape contenant un espace ?",
    back: "L'entourer de #\"...\" — ex. #\"Table filtrée\". Oublier cette syntaxe après un renommage manuel casse la requête."
  },
  {
    id: "m-f4-1", langue: "m", niveau: "fondamentaux", type: "flip",
    front: "Pourquoi insérer une étape au milieu d'une chaîne M peut-il casser les étapes suivantes ?",
    back: "Les étapes suivantes dépendent souvent d'une structure (colonnes, types) que la nouvelle étape modifie — Power Query ne « recalcule » pas intelligemment la suite."
  },

  // ---- Intermédiaire ----
  {
    id: "m-i1-1", langue: "m", niveau: "intermediaire", type: "flip",
    front: "Quel pattern M permet d'ingérer automatiquement tous les fichiers similaires d'un dossier ?",
    back: "Une requête-fonction (ex. (cheminFichier) => ...) invoquée sur chaque fichier via « Combiner les fichiers d'un dossier »."
  },
  {
    id: "m-i1-2", langue: "m", niveau: "intermediaire", type: "flip",
    front: "Pourquoi une fonction personnalisée invoquée ligne par ligne est-elle risquée en performance ?",
    back: "Elle casse quasi systématiquement le query folding — coûteux dès que le volume de données grossit."
  },
  {
    id: "m-i2-1", langue: "m", niveau: "intermediaire", type: "flip",
    front: "Que fait try ... otherwise ... en M ?",
    back: "Capture une erreur au niveau d'une expression et fournit une valeur de repli, plutôt que de faire planter toute la requête."
  },
  {
    id: "m-i2-2", langue: "m", niveau: "intermediaire", type: "flip",
    front: "Pourquoi une erreur sur une seule cellule peut-elle faire planter toute la requête plus tard ?",
    back: "L'erreur reste « dans la cellule » sans interrompre l'aperçu, jusqu'à ce qu'une étape en aval l'agrège ou la traite globalement (ex. un Group By)."
  },
  {
    id: "m-i3-1", langue: "m", niveau: "intermediaire", type: "flip",
    front: "Append vs Merge en Power Query — l'équivalent SQL de chacun ?",
    back: "Append (Table.Combine) empile des tables de même structure = UNION ALL. Merge (Table.NestedJoin) associe deux tables par clé = JOIN."
  },
  {
    id: "m-i3-2", langue: "m", niveau: "intermediaire", type: "flip",
    front: "Un Merge avec une clé non unique côté droit produit quel effet, déjà vu côté SQL ?",
    back: "Duplication des lignes — exactement le piège du LEFT JOIN SQL mal maîtrisé (fiche SQL-F2), avec les mêmes conséquences sur les agrégats en aval."
  },
  {
    id: "m-i4-1", langue: "m", niveau: "intermediaire", type: "flip",
    front: "Pourquoi Table.UnpivotOtherColumns est-il plus robuste qu'un unpivot listant explicitement les colonnes ?",
    back: "Il s'adapte automatiquement si de nouvelles colonnes apparaissent dans la source (ex. un nouveau mois ajouté chaque année)."
  },

  // ---- Avancé ----
  {
    id: "m-a1-1", langue: "m", niveau: "avance", type: "flip",
    front: "Qu'est-ce que le query folding ?",
    back: "La traduction des étapes M en une requête native exécutée côté source (ex. SQL), au lieu de rapatrier toutes les données puis de filtrer/transformer en local."
  },
  {
    id: "m-a1-2", langue: "m", niveau: "avance", type: "flip",
    front: "Comment vérifier si le folding est encore actif à une étape donnée ?",
    back: "Clic droit sur l'étape → « Afficher la requête native » (option grisée si le folding est cassé)."
  },
  {
    id: "m-a1-3", langue: "m", niveau: "avance", type: "qcm",
    front: "Une fois le query folding cassé à une étape...",
    choices: [
      "Il revient automatiquement à l'étape suivante",
      "Il ne revient jamais dans les étapes suivantes",
      "Cela n'affecte que l'aperçu, pas l'actualisation complète",
      "Power Query le répare automatiquement au chargement"
    ],
    answer: 1,
    explain: "D'où l'astuce : place les étapes qui préservent le folding (filtres, sélection de colonnes) le plus tôt possible, et repousse les transformations complexes le plus tard possible."
  },
  {
    id: "m-a2-1", langue: "m", niveau: "avance", type: "flip",
    front: "À quoi sert un paramètre M pour l'environnement (dev/prod) ?",
    back: "Basculer toute la logique de connexion en un clic au moment de publier vers Power BI Service, sans retoucher aucune étape des requêtes."
  },
  {
    id: "m-a3-1", langue: "m", niveau: "avance", type: "flip",
    front: "Pourquoi décocher « Activer le chargement » sur les requêtes intermédiaires (staging) ?",
    back: "Elles restent utilisables par les requêtes qui les référencent, sans alourdir le modèle final avec des tables inutiles."
  },
  {
    id: "m-a3-2", langue: "m", niveau: "avance", type: "flip",
    front: "Quel est l'effet de bord de Table.Buffer sur le query folding ?",
    back: "Il force la matérialisation en mémoire et casse le folding à partir de cet endroit — à utiliser en connaissance de cause, jamais comme réflexe « anti-lenteur »."
  },

  // ---- Pro ----
  {
    id: "m-p1-1", langue: "m", niveau: "pro", type: "flip",
    front: "Quels deux paramètres spéciaux pilotent l'actualisation incrémentielle dans Power BI ?",
    back: "RangeStart et RangeEnd, utilisés dans un filtre de date en M — seule la tranche récente définie est rechargée, l'historique reste intact."
  },
  {
    id: "m-p2-1", langue: "m", niveau: "pro", type: "flip",
    front: "Pourquoi nommer explicitement chaque étape M plutôt que garder « Étape 12 » ?",
    back: "Ça permet d'isoler un problème en cliquant sur chaque étape dans « Étapes appliquées » pour voir l'état intermédiaire des données."
  },
  {
    id: "m-p2-2", langue: "m", niveau: "pro", type: "code",
    front: "Ce filtre d'actualisation incrémentielle contient une erreur de comparaison. Corrige-le.",
    code: "Table.SelectRows(#\"Source\",\n  each [DateVente] > RangeStart and [DateVente] > RangeEnd)",
    back: "Table.SelectRows(#\"Source\",\n  each [DateVente] >= RangeStart and [DateVente] < RangeEnd)\n\nLa deuxième condition doit être une borne supérieure exclusive (<), pas un second > — sinon la plage n'est jamais bornée correctement."
  },
];
