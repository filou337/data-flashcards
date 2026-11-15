export const cardsSQL = [
  // ---- Fondamentaux ----
  {
    id: "sql-f1-1", langue: "sql", niveau: "fondamentaux", type: "flip",
    front: "Quel est l'ordre logique d'exécution d'une requête SQL (pas l'ordre où on l'écrit) ?",
    back: "FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. C'est pourquoi un alias défini dans le SELECT n'est pas utilisable dans le WHERE (il n'existe pas encore), mais l'est dans ORDER BY (exécuté après)."
  },
  {
    id: "sql-f1-2", langue: "sql", niveau: "fondamentaux", type: "flip",
    front: "Pourquoi WHERE bonus <> 500 ne renvoie-t-il jamais les lignes où bonus est NULL ?",
    back: "NULL n'est ni vrai ni faux : toute comparaison avec NULL (=, <>, <...) renvoie NULL, pas FALSE. La ligne est donc silencieusement exclue du WHERE, sans erreur."
  },
  {
    id: "sql-f1-3", langue: "sql", niveau: "fondamentaux", type: "code",
    front: "Cette requête doit exclure les employés dont le bonus est différent de 500, EN INCLUANT ceux sans bonus renseigné. Trouve le bug.",
    code: "SELECT * FROM employes\nWHERE bonus <> 500;",
    back: "Il manque le cas NULL :\n\nSELECT * FROM employes\nWHERE bonus <> 500 OR bonus IS NULL;\n\nSinon les lignes à bonus NULL disparaissent silencieusement du résultat."
  },
  {
    id: "sql-f2-1", langue: "sql", niveau: "fondamentaux", type: "flip",
    front: "Que se passe-t-il si la clé de jointure côté « plusieurs » n'est pas unique ?",
    back: "Chaque ligne du côté « un » se duplique autant de fois qu'il y a de correspondances côté « plusieurs ». Un SUM() en aval devient alors faux, sans qu'aucune erreur ne se déclenche."
  },
  {
    id: "sql-f2-2", langue: "sql", niveau: "fondamentaux", type: "qcm",
    front: "Un LEFT JOIN suivi d'un WHERE sur une colonne de la table de droite se comporte comme...",
    choices: [
      "Toujours un LEFT JOIN normal",
      "Un INNER JOIN, car le WHERE élimine les lignes où la colonne de droite est NULL",
      "Un FULL OUTER JOIN",
      "Une erreur de syntaxe"
    ],
    answer: 1,
    explain: "Le WHERE s'applique après la jointure. Pour garder le comportement LEFT, il faut déplacer la condition dans le ON plutôt que le WHERE."
  },
  {
    id: "sql-f2-3", langue: "sql", niveau: "fondamentaux", type: "flip",
    front: "Comment vérifier rapidement, avant un GROUP BY après un JOIN, si une clé va dupliquer des lignes ?",
    back: "SELECT cle, COUNT(*) FROM table GROUP BY cle HAVING COUNT(*) > 1 ; si le résultat n'est pas vide, attention aux agrégats en aval."
  },
  {
    id: "sql-f3-1", langue: "sql", niveau: "fondamentaux", type: "flip",
    front: "Quelle fonction d'agrégat compte les lignes plutôt que les valeurs, et n'ignore donc pas les NULL ?",
    back: "COUNT(*). COUNT(colonne) en revanche ignore les NULL de cette colonne."
  },
  {
    id: "sql-f3-2", langue: "sql", niveau: "fondamentaux", type: "flip",
    front: "Différence entre WHERE et HAVING ?",
    back: "WHERE filtre avant l'agrégation (ligne par ligne). HAVING filtre après (sur le résultat déjà agrégé)."
  },
  {
    id: "sql-f3-3", langue: "sql", niveau: "fondamentaux", type: "code",
    front: "En MySQL non strict, cette requête ne lève pas d'erreur mais renvoie un résultat non déterministe. Quel est le problème ?",
    code: "SELECT region, nom, SUM(montant)\nFROM ventes\nGROUP BY region;",
    back: "« nom » n'est ni agrégé ni présent dans le GROUP BY. PostgreSQL/SQL Server rejettent cette requête ; MySQL non strict l'accepte et renvoie la valeur de « nom » d'un enregistrement arbitraire du groupe."
  },
  {
    id: "sql-f4-1", langue: "sql", niveau: "fondamentaux", type: "flip",
    front: "Pourquoi NOT IN est-il dangereux avec une sous-requête pouvant contenir un NULL ?",
    back: "NOT IN avec une sous-requête contenant ne serait-ce qu'un seul NULL renvoie un ensemble VIDE, silencieusement — aucune ligne ne passe le filtre."
  },
  {
    id: "sql-f4-2", langue: "sql", niveau: "fondamentaux", type: "flip",
    front: "Quelle alternative à NOT IN est insensible aux NULL de la sous-requête ?",
    back: "NOT EXISTS."
  },
  {
    id: "sql-f4-3", langue: "sql", niveau: "fondamentaux", type: "qcm",
    front: "Une sous-requête corrélée...",
    choices: [
      "S'exécute une seule fois, indépendamment de la requête externe",
      "Référence la requête externe et s'exécute conceptuellement ligne par ligne",
      "Ne peut jamais être réécrite en JOIN",
      "Est toujours plus rapide qu'un JOIN équivalent"
    ],
    answer: 1,
    explain: "Une sous-requête corrélée référence une colonne de la requête externe, donc le moteur doit conceptuellement la réévaluer pour chaque ligne — coût potentiellement élevé si le moteur ne l'optimise pas."
  },

  // ---- Intermédiaire ----
  {
    id: "sql-i1-1", langue: "sql", niveau: "intermediaire", type: "flip",
    front: "Quelle est LA technique universelle pour garder une seule ligne par clé (ex. la dernière version) ?",
    back: "ROW_NUMBER() OVER (PARTITION BY cle ORDER BY date DESC) = 1, filtré dans une CTE."
  },
  {
    id: "sql-i1-2", langue: "sql", niveau: "intermediaire", type: "flip",
    front: "Différence essentielle entre GROUP BY et une fonction fenêtrée (window function) ?",
    back: "GROUP BY réduit le nombre de lignes du résultat. Une fonction fenêtrée calcule une valeur « par-dessus » une fenêtre de lignes sans réduire le nombre de lignes."
  },
  {
    id: "sql-i1-3", langue: "sql", niveau: "intermediaire", type: "code",
    front: "Ce running total devient faux dès qu'il y a des doublons sur order_date. Pourquoi, et comment corriger ?",
    code: "SUM(montant) OVER (ORDER BY order_date)",
    back: "Sans frame explicite, le défaut est souvent RANGE (pas ROWS) : RANGE inclut toutes les lignes à valeur de tri égale (ties) dans le cumul. Corriger avec :\n\nSUM(montant) OVER (\n  ORDER BY order_date\n  ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n)"
  },
  {
    id: "sql-i2-1", langue: "sql", niveau: "intermediaire", type: "flip",
    front: "Quelles sont les 3 parties obligatoires d'une CTE récursive ?",
    back: "Un membre ancre (cas de base), un membre récursif qui référence la CTE elle-même, réunis par UNION ALL — avec une condition d'arrêt dans le membre récursif."
  },
  {
    id: "sql-i2-2", langue: "sql", niveau: "intermediaire", type: "flip",
    front: "Que se passe-t-il si on oublie la condition d'arrêt d'une CTE récursive ?",
    back: "Boucle infinie. La plupart des moteurs ont un garde-fou (ex. MAXRECURSION 100 par défaut sur SQL Server) qui stoppe brutalement avec une erreur."
  },
  {
    id: "sql-i3-1", langue: "sql", niveau: "intermediaire", type: "flip",
    front: "Qu'est-ce que le « grain » d'une table de faits ?",
    back: "Ce que représente exactement une ligne (ex. « une ligne de commande », pas « une commande »). À documenter avant d'écrire la moindre requête d'agrégation — la majorité des bugs d'agrégation viennent d'un grain mal compris."
  },
  {
    id: "sql-i3-2", langue: "sql", niveau: "intermediaire", type: "qcm",
    front: "SCD Type 1 vs Type 2, quelle différence ?",
    choices: [
      "Type 1 historise, Type 2 écrase",
      "Type 1 écrase l'ancienne valeur (pas d'historique), Type 2 crée une nouvelle ligne avec intervalle de validité",
      "Les deux historisent, seule la syntaxe change",
      "Type 2 n'existe qu'en NoSQL"
    ],
    answer: 1,
    explain: "Type 1 : correction sans besoin d'historique. Type 2 : nouvelle ligne + date_debut/date_fin pour conserver l'historique des versions."
  },
  {
    id: "sql-i4-1", langue: "sql", niveau: "intermediaire", type: "flip",
    front: "Pourquoi WHERE YEAR(date_vente) = 2026 est-il un problème de performance ?",
    back: "Envelopper une colonne indexée dans une fonction la rend non-sargable : le moteur ne peut plus utiliser l'index et bascule sur un scan complet de la table."
  },
  {
    id: "sql-i4-2", langue: "sql", niveau: "intermediaire", type: "flip",
    front: "Quelle fonction convertit un type sans faire planter tout un batch sur une seule ligne sale ?",
    back: "TRY_CAST (SQL Server), SAFE_CAST (BigQuery) — renvoie NULL au lieu de lever une erreur."
  },

  // ---- Avancé ----
  {
    id: "sql-a1-1", langue: "sql", niveau: "avance", type: "flip",
    front: "Différence entre Index Scan et Index Only Scan ?",
    back: "Index Scan lit l'index puis va chercher les lignes en table. Index Only Scan : toutes les colonnes demandées sont déjà présentes dans l'index — pas besoin d'aller chercher la ligne, c'est le plus rapide."
  },
  {
    id: "sql-a1-2", langue: "sql", niveau: "avance", type: "flip",
    front: "Que signale un grand écart entre « rows estimated » et « rows actual » dans un plan EXPLAIN ANALYZE ?",
    back: "Des statistiques obsolètes qui trompent l'optimiseur sur le choix du plan — il faut relancer ANALYZE / UPDATE STATISTICS."
  },
  {
    id: "sql-a1-3", langue: "sql", niveau: "avance", type: "qcm",
    front: "Indexer une colonne booléenne à faible cardinalité...",
    choices: [
      "Améliore toujours fortement les performances",
      "Apporte peu voire rien en lecture, et ralentit chaque écriture",
      "Est indispensable pour toute colonne utilisée en filtre",
      "Remplace le besoin d'un index composite"
    ],
    answer: 1,
    explain: "Peu de valeurs distinctes = peu de sélectivité pour l'index, alors qu'il doit être maintenu à jour à chaque écriture."
  },
  {
    id: "sql-a2-1", langue: "sql", niveau: "avance", type: "flip",
    front: "Que signifie ACID ?",
    back: "Atomicité, Cohérence, Isolation, Durabilité."
  },
  {
    id: "sql-a2-2", langue: "sql", niveau: "avance", type: "flip",
    front: "Quel niveau d'isolation suffit généralement pour du reporting BI en lecture seule ?",
    back: "READ COMMITTED. Utiliser SERIALIZABLE partout par précaution dégrade les performances sans bénéfice réel dans ce contexte."
  },
  {
    id: "sql-a3-1", langue: "sql", niveau: "avance", type: "flip",
    front: "Quelle astuce détecte des séquences de dates consécutives (gaps & islands) ?",
    back: "(date − ROW_NUMBER() OVER (PARTITION BY clé ORDER BY date)) est constant sur une séquence de dates consécutives (une « île »)."
  },
  {
    id: "sql-a3-2", langue: "sql", niveau: "avance", type: "code",
    front: "Dans cette sessionisation, quelle condition démarre une nouvelle session (plus de 30 min depuis l'événement précédent) ?",
    code: "CASE WHEN EXTRACT(EPOCH FROM (ts - LAG(ts) OVER (PARTITION BY user_id ORDER BY ts))) > ???\n     OR LAG(ts) OVER (PARTITION BY user_id ORDER BY ts) IS NULL\nTHEN 1 ELSE 0 END AS nouvelle_session",
    back: "1800 (secondes = 30 minutes). Ensuite, SUM(nouvelle_session) OVER (PARTITION BY user_id ORDER BY ts) donne l'identifiant de session cumulatif."
  },
  {
    id: "sql-a3-3", langue: "sql", niveau: "avance", type: "flip",
    front: "Pourquoi un PIVOT SQL classique ne suffit-il pas toujours ?",
    back: "Il est figé : le nombre de colonnes de sortie doit être connu à l'écriture de la requête. Si les valeurs à transformer en colonnes ne sont connues qu'à l'exécution, il faut du SQL dynamique généré côté application."
  },
  {
    id: "sql-a4-1", langue: "sql", niveau: "avance", type: "flip",
    front: "À quoi sert ROLLUP ?",
    back: "Calculer plusieurs niveaux de sous-totaux (ex. année > mois > total général) en un seul passage sur les données, au lieu d'assembler plusieurs requêtes avec UNION ALL."
  },
  {
    id: "sql-a4-2", langue: "sql", niveau: "avance", type: "flip",
    front: "Quelle fonction calcule une médiane exacte en SQL ?",
    back: "PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY colonne)."
  },

  // ---- Pro ----
  {
    id: "sql-p1-1", langue: "sql", niveau: "pro", type: "flip",
    front: "Différence de stockage entre un moteur OLTP (Postgres) et un entrepôt OLAP colonne (BigQuery/Snowflake) ?",
    back: "OLTP stocke en lignes (row-store), optimisé pour des transactions courtes. OLAP colonne stocke en colonnes et parallélise massivement (MPP) — idéal pour scanner peu de colonnes sur énormément de lignes."
  },
  {
    id: "sql-p1-2", langue: "sql", niveau: "pro", type: "flip",
    front: "Qu'est-ce que le « data skew » dans un moteur distribué ?",
    back: "Une jointure/agrégation sur une clé à cardinalité très asymétrique : une seule tâche traite l'essentiel des données pendant que les autres finissent en une seconde — le job entier attend cette tâche unique."
  },
  {
    id: "sql-p1-3", langue: "sql", niveau: "pro", type: "flip",
    front: "Qu'est-ce que le « partition pruning » ?",
    back: "Ignorer des partitions entières sans les lire, en filtrant sur la colonne de partition — réduit directement le volume scanné, donc le temps et le coût."
  },
  {
    id: "sql-p2-1", langue: "sql", niveau: "pro", type: "flip",
    front: "Pourquoi préférer MERGE à un DELETE suivi d'un INSERT pour un rechargement de table ?",
    back: "DELETE puis INSERT n'est pas atomique : une fenêtre existe où la table est vide si l'exécution échoue entre les deux. MERGE combine les deux en une opération atomique et idempotente."
  },
  {
    id: "sql-p2-2", langue: "sql", niveau: "pro", type: "qcm",
    front: "Un script SQL de production « idempotent » signifie...",
    choices: [
      "Qu'il s'exécute très vite",
      "Qu'il peut être rejoué plusieurs fois sans dupliquer ni corrompre les données",
      "Qu'il ne contient aucune jointure",
      "Qu'il fonctionne sur tous les moteurs SQL sans modification"
    ],
    answer: 1,
    explain: "L'idempotence protège contre les rejeux partiels ou les doubles exécutions accidentelles d'un pipeline — un des principaux facteurs de robustesse en production."
  },
];
