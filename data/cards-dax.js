export const cardsDAX = [
  // ---- Fondamentaux ----
  {
    id: "dax-f1-1", langue: "dax", niveau: "fondamentaux", type: "flip",
    front: "Règle simple pour choisir entre mesure et colonne calculée ?",
    back: "Si le résultat dépend du filtrage courant (ex. total par région) → mesure. Si c'est une caractéristique fixe de chaque ligne → colonne calculée."
  },
  {
    id: "dax-f1-2", langue: "dax", niveau: "fondamentaux", type: "flip",
    front: "Pourquoi une colonne calculée à forte cardinalité est-elle problématique ?",
    back: "Elle est stockée physiquement dans le modèle et dégrade fortement la compression VertiPaq — souvent invisible tant que le volume reste petit."
  },
  {
    id: "dax-f2-1", langue: "dax", niveau: "fondamentaux", type: "flip",
    front: "Contexte de ligne vs contexte de filtre : où existe chacun ?",
    back: "Contexte de ligne : dans une colonne calculée ou un itérateur (« la ligne courante » est connue). Contexte de filtre : pour une mesure affichée dans un visuel (l'ensemble des filtres actifs)."
  },
  {
    id: "dax-f2-2", langue: "dax", niveau: "fondamentaux", type: "flip",
    front: "Pourquoi = Ventes[Montant] seul, sans agrégat, n'a pas de sens dans une mesure ?",
    back: "Une mesure n'a pas de « ligne courante », seul un contexte de filtre existe — il faut systématiquement un agrégat (SUM, AVERAGE...) ou un itérateur."
  },
  {
    id: "dax-f3-1", langue: "dax", niveau: "fondamentaux", type: "flip",
    front: "Que fait CALCULATE, fondamentalement ?",
    back: "Il évalue une expression dans un contexte de filtre modifié par les arguments fournis — le seul moyen standard de changer le contexte de filtre depuis une mesure."
  },
  {
    id: "dax-f3-2", langue: "dax", niveau: "fondamentaux", type: "qcm",
    front: "CALCULATE(SUM(V[M]), V[Region]=\"EMEA\", V[Region]=\"APAC\") renvoie...",
    choices: [
      "La somme pour EMEA OU APAC (OR implicite)",
      "La somme pour EMEA ET APAC simultanément",
      "0 ou vide : le second filtre remplace le premier sur la même colonne, aucune ligne n'a Region = \"APAC\" ET \"EMEA\" à la fois",
      "Une erreur de syntaxe"
    ],
    answer: 2,
    explain: "Empiler deux conditions CALCULATE sur la même colonne ne les combine pas en OR — chaque argument remplace le contexte de filtre existant sur cette colonne. Pour un OR explicite, il faut FILTER ou une table de valeurs."
  },
  {
    id: "dax-f4-1", langue: "dax", niveau: "fondamentaux", type: "flip",
    front: "Différence entre SUM et un itérateur comme SUMX ?",
    back: "SUM agrège directement une colonne. SUMX évalue une expression ligne par ligne (contexte de ligne créé pour chaque ligne), puis agrège le résultat — indispensable pour combiner plusieurs colonnes avant d'agréger."
  },

  // ---- Intermédiaire ----
  {
    id: "dax-i1-1", langue: "dax", niveau: "intermediaire", type: "flip",
    front: "Quel est le squelette DAX du calcul « % du total » ?",
    back: "DIVIDE([Mesure], CALCULATE([Mesure], ALL(table))) — à connaître par cœur."
  },
  {
    id: "dax-i1-2", langue: "dax", niveau: "intermediaire", type: "qcm",
    front: "Différence entre ALL et ALLSELECTED ?",
    choices: [
      "Elles sont strictement identiques",
      "ALL ignore toute interaction utilisateur (total absolu), ALLSELECTED respecte les filtres externes (segments) mais ignore le contexte du visuel",
      "ALLSELECTED est plus rapide mais fait la même chose qu'ALL",
      "ALL ne fonctionne que sur des colonnes numériques"
    ],
    answer: 1,
    explain: "Un mauvais choix entre les deux donne un pourcentage juste en apparence — jusqu'à ce qu'un segment soit appliqué et que le résultat devienne incohérent."
  },
  {
    id: "dax-i1-3", langue: "dax", niveau: "intermediaire", type: "flip",
    front: "À quoi sert ALLEXCEPT(table, colonne) par rapport à ALL ?",
    back: "Il retire tous les filtres de la table SAUF ceux précisés sur la colonne donnée — pratique pour ne garder qu'un seul niveau de filtre."
  },
  {
    id: "dax-i2-1", langue: "dax", niveau: "intermediaire", type: "flip",
    front: "Deux bénéfices concrets d'utiliser VAR plutôt que répéter une sous-expression ?",
    back: "Lisibilité (nommer chaque étape métier) et performance (la variable n'est évaluée qu'une seule fois même si réutilisée plusieurs fois)."
  },
  {
    id: "dax-i2-2", langue: "dax", niveau: "intermediaire", type: "flip",
    front: "Une VAR est évaluée dans quel contexte : celui de sa définition, ou celui de son usage dans RETURN ?",
    back: "Celui de sa définition. Un changement de contexte de filtre après coup (via un CALCULATE plus loin) n'affecte pas rétroactivement sa valeur déjà figée."
  },
  {
    id: "dax-i3-1", langue: "dax", niveau: "intermediaire", type: "flip",
    front: "Que nécessitent structurellement les fonctions Time Intelligence (SAMEPERIODLASTYEAR, DATESYTD...) ?",
    back: "Une vraie table de dates continue (une ligne par jour, sans trou), marquée comme table de dates, avec une relation active vers la table de faits."
  },
  {
    id: "dax-i3-2", langue: "dax", niveau: "intermediaire", type: "flip",
    front: "Pourquoi une table de dates avec des trous fausse-t-elle les cumuls YTD ?",
    back: "Les fonctions Time Intelligence supposent une séquence continue — un jour manquant (ex. sans vente) peut fausser silencieusement le cumul et les comparaisons d'une période à l'autre."
  },
  {
    id: "dax-i4-1", langue: "dax", niveau: "intermediaire", type: "flip",
    front: "Comment activer temporairement une relation inactive dans une mesure ?",
    back: "USERELATIONSHIP(colonne1, colonne2) dans un CALCULATE, sans changer le modèle global."
  },
  {
    id: "dax-i4-2", langue: "dax", niveau: "intermediaire", type: "flip",
    front: "Pourquoi une table ne peut-elle avoir qu'une seule relation active vers une même table de dates ?",
    back: "Pour éviter l'ambiguïté du moteur : plusieurs relations vers la même table de dates (ex. date commande / date livraison) coexistent, mais une seule est active à la fois, les autres nécessitant USERELATIONSHIP."
  },

  // ---- Avancé ----
  {
    id: "dax-a1-1", langue: "dax", niveau: "avance", type: "flip",
    front: "Que retourne FILTER(table, condition) — et pourquoi est-ce différent d'un filtre simple dans CALCULATE ?",
    back: "Une table virtuelle. FILTER permet une logique arbitrairement complexe (comparaisons entre colonnes), alors qu'un filtre simple dans CALCULATE ne gère qu'une condition directe sur une colonne."
  },
  {
    id: "dax-a1-2", langue: "dax", niveau: "avance", type: "flip",
    front: "Pourquoi préférer un filtre simple dans CALCULATE à un FILTER équivalent quand c'est possible ?",
    back: "Le moteur peut l'optimiser plus facilement. FILTER parcourt logiquement la table entière ligne par ligne — coûteux si mal ciblé sur une grosse table de faits."
  },
  {
    id: "dax-a2-1", langue: "dax", niveau: "avance", type: "flip",
    front: "Qu'est-ce que la « transition de contexte » ?",
    back: "Quand CALCULATE (ou une mesure appelée depuis un itérateur) s'exécute dans un contexte de ligne, chaque colonne de la ligne courante est convertie en un filtre équivalent dans le contexte de filtre."
  },
  {
    id: "dax-a2-2", langue: "dax", niveau: "avance", type: "flip",
    front: "Quelle est la cause la plus fréquente de double comptage en DAX avancé ?",
    back: "La transition de contexte non anticipée — typiquement une mesure appelée à l'intérieur d'un itérateur (ex. AVERAGEX(Clients, [Total Ventes]))."
  },
  {
    id: "dax-a3-1", langue: "dax", niveau: "avance", type: "flip",
    front: "Quelles fonctions DAX gèrent nativement les hiérarchies parent-enfant de profondeur variable ?",
    back: "PATH (chaîne des identifiants parents jusqu'à la racine), PATHITEM (extrait un niveau précis), PATHLENGTH (profondeur)."
  },
  {
    id: "dax-a4-1", langue: "dax", niveau: "avance", type: "flip",
    front: "Pourquoi RANKX(ALL(table), ...) plutôt que RANKX(table, ...) pour un classement stable ?",
    back: "Sans le ALL, le rang serait recalculé sur un ensemble déjà réduit par le contexte de filtre courant, faussant le classement affiché."
  },
  {
    id: "dax-a4-2", langue: "dax", niveau: "avance", type: "code",
    front: "Complète cette mesure « Top 10 Clients » à partir d'un rang déjà calculé (mesure [Rang Client]).",
    code: "Top 10 Clients = IF([Rang Client] ??? 10, [Total Ventes])",
    back: "IF([Rang Client] <= 10, [Total Ventes])\n\nLe rang doit être calculé avec RANKX(ALL(dim_client), [Total Ventes]) pour rester stable quel que soit le contexte du visuel."
  },

  // ---- Pro ----
  {
    id: "dax-p1-1", langue: "dax", niveau: "pro", type: "flip",
    front: "Pourquoi une colonne à forte cardinalité grossit-elle beaucoup plus le modèle VertiPaq qu'une colonne à faible cardinalité ?",
    back: "VertiPaq compresse chaque colonne avec un dictionnaire de valeurs uniques — plus il y a de valeurs distinctes, moins la compression est efficace."
  },
  {
    id: "dax-p1-2", langue: "dax", niveau: "pro", type: "flip",
    front: "Formula engine vs storage engine : qui fait quoi ?",
    back: "Formula engine : interprète le DAX, mono-thread. Storage engine : scanne les données compressées, multi-thread, très rapide."
  },
  {
    id: "dax-p1-3", langue: "dax", niveau: "pro", type: "qcm",
    front: "Pour réduire la taille d'un modèle sans perdre d'information utile, on peut...",
    choices: [
      "Ajouter plus de colonnes calculées",
      "Arrondir un timestamp à la minute plutôt qu'à la milliseconde, ou séparer date et heure",
      "Toujours garder les GUID techniques dans le modèle « au cas où »",
      "Désactiver la compression VertiPaq"
    ],
    answer: 1,
    explain: "Réduire la cardinalité avant chargement peut diviser la taille du modèle par un facteur important."
  },
  {
    id: "dax-p2-1", langue: "dax", niveau: "pro", type: "flip",
    front: "Que révèle un signal « CallbackDataID » élevé dans un plan de requête DAX Studio ?",
    back: "Le storage engine a dû rappeler le formula engine ligne par ligne (perte de parallélisme) — souvent causé par une logique conditionnelle complexe qui pourrait être restructurée avec des variables."
  },
];
