export const cardsPySpark = [
  // ---- Fondamentaux ----
  {
    id: "ps-f1-1", langue: "pyspark", niveau: "fondamentaux", type: "flip",
    front: "Quelle est LA différence structurante entre un DataFrame Spark et un DataFrame pandas ?",
    back: "Spark est distribué sur plusieurs machines et évalué paresseusement (lazy) — pandas exécute chaque instruction immédiatement (eager)."
  },
  {
    id: "ps-f1-2", langue: "pyspark", niveau: "fondamentaux", type: "flip",
    front: "Pourquoi appeler .show() par réflexe sur un DataFrame issu d'un pipeline complexe peut coûter cher ?",
    back: "C'est une action : elle déclenche l'exécution complète du plan accumulé — sur un gros volume, même un simple test de lecture peut coûter des minutes."
  },
  {
    id: "ps-f2-1", langue: "pyspark", niveau: "fondamentaux", type: "flip",
    front: "Transformations vs actions : lesquelles s'exécutent immédiatement ?",
    back: "Aucune transformation (select, filter, withColumn, join) ne s'exécute immédiatement — elles construisent un plan. Seule une action (show, count, collect, write) déclenche l'exécution réelle."
  },
  {
    id: "ps-f2-2", langue: "pyspark", niveau: "fondamentaux", type: "qcm",
    front: "Chaîner plusieurs .count() de contrôle dans un pipeline, sans .cache(), a pour effet de...",
    choices: [
      "Ne rien recalculer, Spark mémorise automatiquement",
      "Réexécuter tout le plan depuis le début à chaque .count()",
      "Accélérer le pipeline",
      "Ne fonctionner qu'une seule fois puis lever une erreur"
    ],
    answer: 1,
    explain: "Sans cache explicite, chaque action réexécute le plan accumulé en amont — un anti-pattern fréquent chez les débutants venant de pandas."
  },
  {
    id: "ps-f3-1", langue: "pyspark", niveau: "fondamentaux", type: "flip",
    front: "Pourquoi éviter inferSchema=True en production sur de gros fichiers ?",
    back: "L'inférence automatique du schéma coûte une lecture supplémentaire complète du fichier — à éviter au profit d'un schéma explicite (StructType) sur des fichiers volumineux ou répétés."
  },
  {
    id: "ps-f4-1", langue: "pyspark", niveau: "fondamentaux", type: "flip",
    front: "Pourquoi utiliser col(\"nom\") plutôt qu'une chaîne brute dans une expression PySpark ?",
    back: "col() crée un objet Column représentant une expression optimisable par Spark, et évite des ambiguïtés quand plusieurs DataFrames aux colonnes homonymes sont manipulés ensemble (avant un join)."
  },
  {
    id: "ps-f4-2", langue: "pyspark", niveau: "fondamentaux", type: "flip",
    front: "Pourquoi chaîner des dizaines de .withColumn() en boucle Python est-il un anti-pattern ?",
    back: "Ça génère un plan logique très profond, ralentissant l'analyse par Catalyst — préférer une seule expression select combinant toutes les colonnes en une fois."
  },

  // ---- Intermédiaire ----
  {
    id: "ps-i1-1", langue: "pyspark", niveau: "intermediaire", type: "flip",
    front: "Broadcast join vs shuffle join : quand Spark choisit-il un broadcast automatiquement ?",
    back: "Quand une table est sous le seuil spark.sql.autoBroadcastJoinThreshold — elle est alors copiée entière sur chaque exécuteur, sans réseau ni tri coûteux."
  },
  {
    id: "ps-i1-2", langue: "pyspark", niveau: "intermediaire", type: "code",
    front: "Force un broadcast explicite sur petite_table_dimension dans cette jointure.",
    code: "resultat = grosse_table.join(petite_table_dimension, \"id\")",
    back: "from pyspark.sql.functions import broadcast\n\nresultat = grosse_table.join(broadcast(petite_table_dimension), \"id\")\n\nÉlimine le risque que Spark bascule en shuffle join après une légère croissance de la table."
  },
  {
    id: "ps-i2-1", langue: "pyspark", niveau: "intermediaire", type: "flip",
    front: "Le motif SQL « ROW_NUMBER() = 1 pour dédupliquer » se transpose-t-il tel quel en PySpark ?",
    back: "Oui : Window.partitionBy(...).orderBy(...) + row_number().over(w), puis filter(col(\"rn\") == 1) — même concept, autre syntaxe."
  },
  {
    id: "ps-i2-2", langue: "pyspark", niveau: "intermediaire", type: "flip",
    front: "Pourquoi une window function sans partitionBy est-elle un goulot de performance sévère ?",
    back: "Spark doit rapatrier toutes les données sur un seul exécuteur pour respecter un ordre global — invisible dans le code, visible dans la Spark UI (une seule tâche qui dure très longtemps)."
  },
  {
    id: "ps-i3-1", langue: "pyspark", niveau: "intermediaire", type: "flip",
    front: "repartition(n) vs coalesce(n) : lequel fait un shuffle complet ?",
    back: "repartition(n) — coûteux mais équilibre vraiment la charge. coalesce(n) fusionne des partitions existantes sans shuffle complet, mais ne peut que réduire le nombre de partitions."
  },
  {
    id: "ps-i3-2", langue: "pyspark", niveau: "intermediaire", type: "flip",
    front: "Pourquoi partitionner un fichier de sortie sur une colonne à très forte cardinalité (ex. un ID client) est-il contre-productif ?",
    back: "Ça crée des milliers de petits dossiers/fichiers — l'inverse de l'effet recherché, catastrophique pour les performances de lecture ultérieures."
  },
  {
    id: "ps-i4-1", langue: "pyspark", niveau: "intermediaire", type: "flip",
    front: "Pourquoi une UDF Python classique est-elle lente comparée à une fonction native pyspark.sql.functions ?",
    back: "Elle oblige Spark à sérialiser chaque ligne, l'envoyer à un processus Python via Py4J, exécuter, puis rapatrier le résultat — non vectorisé, coûteux. Les fonctions natives restent dans la JVM."
  },
  {
    id: "ps-i4-2", langue: "pyspark", niveau: "intermediaire", type: "flip",
    front: "Qu'apportent les pandas UDF (basées sur Apache Arrow) par rapport à une UDF Python classique ?",
    back: "Elles sont vectorisées par lot plutôt que traitées ligne par ligne — bien plus rapides qu'une UDF classique, un bon compromis quand aucune fonction native ne convient."
  },

  // ---- Avancé ----
  {
    id: "ps-a1-1", langue: "pyspark", niveau: "avance", type: "flip",
    front: "Que faut-il chercher dans un plan physique .explain(True) pour confirmer un predicate pushdown efficace ?",
    back: "La présence de « PushedFilters » — ça confirme que Spark ne lit que les blocs de données réellement nécessaires, pas l'intégralité du dataset."
  },
  {
    id: "ps-a1-2", langue: "pyspark", niveau: "avance", type: "flip",
    front: "Pourquoi une UDF Python dans un plan Spark bloque-t-elle des optimisations en amont/aval ?",
    back: "Catalyst ne peut pas « voir à travers » une fonction Python opaque pour optimiser ce qui la précède ou la suit."
  },
  {
    id: "ps-a2-1", langue: "pyspark", niveau: "avance", type: "flip",
    front: "Quelles opérations déclenchent un shuffle en Spark ?",
    back: "groupBy, join non broadcast, repartition, distinct — toute opération nécessitant de redistribuer les données sur le réseau entre exécuteurs."
  },
  {
    id: "ps-a2-2", langue: "pyspark", niveau: "avance", type: "flip",
    front: "Dans la Spark UI, à quoi correspond systématiquement une frontière de stage ?",
    back: "À un shuffle. Regarder le volume de « Shuffle Read/Write » par stage est le premier réflexe pour localiser où un job passe réellement son temps."
  },
  {
    id: "ps-a3-1", langue: "pyspark", niveau: "avance", type: "flip",
    front: "Comment repérer un data skew dans la Spark UI ?",
    back: "Une tâche dont la durée et le volume traité dépassent très largement la médiane des autres tâches du même stage."
  },
  {
    id: "ps-a3-2", langue: "pyspark", niveau: "avance", type: "flip",
    front: "Qu'est-ce que le « salting » pour corriger un data skew ?",
    back: "Disperser artificiellement une clé skewée en lui ajoutant un suffixe aléatoire avant jointure, pour répartir la charge sur plusieurs tâches plutôt qu'une seule."
  },
  {
    id: "ps-a4-1", langue: "pyspark", niveau: "avance", type: "flip",
    front: "Quand .cache() est-il utile — et quand est-il nuisible ?",
    back: "Utile si le DataFrame est réutilisé plusieurs fois dans des branches différentes. Nuisible (mémoire gaspillée) s'il n'est utilisé qu'une seule fois."
  },
  {
    id: "ps-a4-2", langue: "pyspark", niveau: "avance", type: "flip",
    front: "Pourquoi appeler une action légère juste après un .cache() ?",
    back: "À cause de l'évaluation paresseuse, le cache ne se remplit qu'au moment de la première action réelle — un .count() force sa matérialisation immédiate."
  },

  // ---- Pro ----
  {
    id: "ps-p1-1", langue: "pyspark", niveau: "pro", type: "flip",
    front: "Driver, exécuteurs, cluster manager : rôle de chacun ?",
    back: "Driver : orchestre, construit le plan. Exécuteurs : exécutent les tâches sur les partitions de données. Cluster manager (YARN, Kubernetes...) : coordonne l'allocation des ressources."
  },
  {
    id: "ps-p1-2", langue: "pyspark", niveau: "pro", type: "flip",
    front: "Que corrige l'Adaptive Query Execution (AQE) sur Spark 3+ ?",
    back: "Elle réajuste le plan d'exécution en cours de route selon les statistiques réelles observées : nombre de partitions de shuffle, stratégie de jointure, gestion du skew."
  },
  {
    id: "ps-p2-1", langue: "pyspark", niveau: "pro", type: "flip",
    front: "Que garantit Delta Lake par-dessus de simples fichiers Parquet ?",
    back: "Des propriétés ACID (via un journal de transactions), le time travel (interroger une version antérieure) et MERGE INTO (upsert idempotent)."
  },
  {
    id: "ps-p2-2", langue: "pyspark", niveau: "pro", type: "flip",
    front: "En PySpark + Delta, quelles opérations typiques à chaque couche bronze → silver → gold ?",
    back: "Bronze : spark.read brut + colonne technique (_charge_le, fichier source), écriture en mode append, rien n'est filtré. Silver : relecture du bronze, cast des types, dropDuplicates sur la clé, filtres de validité, jointures de référentiels (souvent un MERGE pour l'incrémental). Gold : groupBy / agg et modèles en étoile, écrits en overwrite ou par partition, prêts pour la BI/DAX."
  },
];
