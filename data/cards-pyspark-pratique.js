// Cartes ajoutées au deck PySpark par le skill /notes-de-cours
// (« Guide pratique de PySpark pour Data Engineer », M. Keita ; note : data/notes/pyspark-pratique.js).
export const cardsPysparkPratique = [
  {
    id: "psg-f1-1", langue: "pyspark", niveau: "fondamentaux", type: "flip",
    front: "Pourquoi importer `from pyspark.sql import functions as F` plutôt que `from pyspark.sql.functions import *` ?",
    back: "L'import étoile remplace silencieusement les fonctions Python sum, min, max, round, abs… par celles de Spark. Un `sum([1, 2, 3])` plus loin dans le script lève alors une erreur incompréhensible. Avec l'alias F, on écrit F.sum(\"ca\") et Python reste intact.",
  },
  {
    id: "psg-f1-2", langue: "pyspark", niveau: "fondamentaux", type: "code",
    front: "Ce filtre lève une erreur. Corrige-le.",
    code: "df.filter(F.col(\"pays\") == \"FR\" & F.col(\"ca\") > 1000)",
    back: "df.filter((F.col(\"pays\") == \"FR\") & (F.col(\"ca\") > 1000))\n\nEn Python, & est prioritaire sur == et > : sans parenthèses, Spark tente \"FR\" & F.col(\"ca\"). Chaque condition doit être entre parenthèses, et on utilise &, |, ~ (jamais and, or, not).",
  },
  {
    id: "psg-f1-3", langue: "pyspark", niveau: "fondamentaux", type: "flip",
    front: "Comment tester si une colonne est nulle en PySpark ?",
    back: "F.col(\"x\").isNull() ou .isNotNull(). Jamais F.col(\"x\") == None : comme en SQL, une comparaison avec null donne null, et le filtre ne garde aucune ligne.",
    example: "df.filter(F.col(\"remise\").isNull())\ndf.na.fill({\"remise\": 0})          # remplacer les nulls",
  },
  {
    id: "psg-f1-4", langue: "pyspark", niveau: "fondamentaux", type: "flip",
    front: "Comment créer une colonne selon plusieurs conditions (équivalent de CASE WHEN) ?",
    back: "Avec F.when(...).when(...).otherwise(...). Les conditions sont testées dans l'ordre ; sans otherwise, les lignes qui ne vérifient aucune condition reçoivent null.",
    example: "df.withColumn(\"segment\",\n  F.when(F.col(\"ca\") > 1000, \"gros\")\n   .when(F.col(\"ca\") > 100, \"moyen\")\n   .otherwise(\"petit\"))",
  },
  {
    id: "psg-f1-5", langue: "pyspark", niveau: "fondamentaux", type: "qcm",
    front: "prenom = \"Ana\", nom = null. Que renvoient F.concat(\"prenom\", \"nom\") et F.concat_ws(\" \", \"prenom\", \"nom\") ?",
    choices: ["\"Ana\" et \"Ana\"", "null et \"Ana\"", "\"Ana null\" et \"Ana\"", "null et null"],
    answer: 1,
    explain: "concat renvoie null dès qu'une colonne est nulle ; concat_ws (with separator) ignore les valeurs nulles. C'est presque toujours concat_ws qu'on veut pour assembler un libellé.",
  },
  {
    id: "psg-f1-6", langue: "pyspark", niveau: "fondamentaux", type: "flip",
    front: "Comment inspecter rapidement la structure d'un DataFrame ?",
    back: "df.printSchema() : l'arbre des colonnes et des types. df.columns : la liste des noms (\"id\" in df.columns pour tester). df.dtypes : couples (nom, type). df.show(5, truncate=False) : 5 lignes sans couper les textes. Aucune ne demande de parcourir tout le jeu, sauf show qui lance un petit calcul.",
  },
  {
    id: "psg-i1-1", langue: "pyspark", niveau: "intermediaire", type: "flip",
    front: "reduceByKey vs groupByKey : pourquoi préférer reduceByKey ?",
    back: "reduceByKey combine d'abord les valeurs sur chaque partition (comme un combiner MapReduce) puis n'envoie que les résultats partiels sur le réseau. groupByKey envoie toutes les valeurs de chaque clé, ce qui gonfle le shuffle et peut saturer la mémoire d'un exécuteur sur une clé fréquente.",
    example: "Partition 1 : (a,1)(a,1)(a,1)   Partition 2 : (a,1)(a,1)\ngroupByKey  : 5 paires transférées\nreduceByKey : (a,3) et (a,2), 2 paires transférées",
  },
  {
    id: "psg-i1-2", langue: "pyspark", niveau: "intermediaire", type: "qcm",
    front: "df1 a les colonnes (id, nom) et df2 (nom, id). Que fait df1.union(df2) ?",
    choices: [
      "Il aligne les colonnes par nom",
      "Il empile par position : les noms de df2 se retrouvent dans la colonne id, sans erreur",
      "Il lève une erreur car l'ordre diffère",
      "Il supprime les doublons",
    ],
    answer: 1,
    explain: "union est positionnel (comme UNION ALL en SQL) et ne déduplique pas. unionByName aligne par nom ; allowMissingColumns=True complète les colonnes manquantes avec null.",
  },
  {
    id: "psg-i1-3", langue: "pyspark", niveau: "intermediaire", type: "flip",
    front: "left_semi et left_anti : que renvoient ces jointures ?",
    back: "left_semi : les lignes de gauche qui ont une correspondance à droite, sans ajouter les colonnes de droite ni dupliquer les lignes (équivalent de WHERE EXISTS). left_anti : les lignes de gauche SANS correspondance (équivalent de NOT EXISTS). Idéal pour trouver les clés orphelines ou les clients sans commande.",
    example: "orphelines = ventes.join(clients, on=\"client_id\", how=\"left_anti\")",
  },
  {
    id: "psg-i1-4", langue: "pyspark", niveau: "intermediaire", type: "code",
    front: "Que vaut la colonne cumul ? Et si on retire orderBy de la fenêtre ?",
    code: "# Ana : mois 1 → 100, mois 2 → 150, mois 3 → 50\nw = Window.partitionBy(\"vendeur\").orderBy(\"mois\")\nventes.withColumn(\"cumul\", F.sum(\"montant\").over(w))",
    back: "Avec orderBy : cumul = 100, 250, 300 (somme du début jusqu'à la ligne courante).\nSans orderBy : 300, 300, 300 (total du groupe sur chaque ligne).\nPréciser .rowsBetween(Window.unboundedPreceding, Window.currentRow) rend l'intention explicite et évite le piège des ex æquo du cadre RANGE.",
  },
  {
    id: "psg-i1-5", langue: "pyspark", niveau: "intermediaire", type: "flip",
    front: "Comment transformer une colonne « stylo,cahier » en une ligne par article ?",
    back: "F.explode(F.split(\"articles\", \",\")) : split produit un tableau, explode génère une ligne par élément (les autres colonnes sont répétées). explode supprime les lignes dont le tableau est vide ou null ; explode_outer les garde avec null.",
    example: "C1 | stylo,cahier   →   C1 | stylo\n                        C1 | cahier",
  },
  {
    id: "psg-i1-6", langue: "pyspark", niveau: "intermediaire", type: "flip",
    front: "Pourquoi lister les valeurs dans pivot(\"mois\", [1, 2, 3]) ?",
    back: "Sans liste, Spark doit d'abord parcourir les données pour découvrir les valeurs distinctes (un job supplémentaire), et les colonnes de sortie changent selon les données présentes. La liste évite ce passage et fige le schéma de sortie.",
  },
  {
    id: "psg-i1-7", langue: "pyspark", niveau: "intermediaire", type: "code",
    front: "Toutes les dates converties sont nulles. Pourquoi ?",
    code: "# valeurs : \"02/03/2025\", \"15/04/2025\"\ndf.withColumn(\"d\", F.to_date(\"date_txt\", \"dd/mm/yyyy\"))",
    back: "Dans les motifs Java, mm = minutes et MM = mois : il faut \"dd/MM/yyyy\". Une valeur qui ne correspond pas au motif devient null sans erreur ; après toute conversion de date, compter les nulls produits.",
  },
  {
    id: "psg-i1-8", langue: "pyspark", niveau: "intermediaire", type: "flip",
    front: "Comment décoder une colonne contenant du JSON en texte ?",
    back: "F.from_json(\"col\", schema) transforme le texte en structure (StructType, ArrayType, MapType), dont on lit les champs avec un point (c.montant) ; F.to_json fait l'inverse. Un JSON qui ne respecte pas le schéma donne null.",
    example: "df.withColumn(\"c\", F.from_json(\"json\", schema_cmd)).select(\"c.id\", \"c.montant\")",
  },
  {
    id: "psg-i1-9", langue: "pyspark", niveau: "intermediaire", type: "flip",
    front: "Comment mélanger l'API DataFrame et le SQL dans un même traitement ?",
    back: "df.createOrReplaceTempView(\"ventes\") rend le DataFrame interrogeable par spark.sql(\"SELECT …\") pendant la session ; le résultat est un DataFrame. Dans l'autre sens, F.expr(\"montant / 1.2\") ou df.selectExpr(...) insèrent une expression SQL dans l'API. Les deux passent par le même optimiseur.",
  },
  {
    id: "psg-a1-1", langue: "pyspark", niveau: "avance", type: "flip",
    front: "Qu'est-ce qu'une variable broadcast et quand l'utiliser ?",
    back: "Une valeur en lecture seule (dictionnaire de correspondance, petite liste) envoyée une fois à chaque exécuteur au lieu d'être sérialisée avec chaque tâche. On la crée avec sc.broadcast(valeur) et on la lit avec .value dans les fonctions (RDD, UDF). Pour joindre une petite table DataFrame, on utilise plutôt F.broadcast(df) dans la jointure.",
  },
  {
    id: "psg-a1-2", langue: "pyspark", niveau: "avance", type: "flip",
    front: "Un accumulateur donne-t-il un résultat « sans action » ? Où peut-on s'y fier ?",
    back: "Non : il n'est mis à jour que lorsqu'une action s'exécute (foreach, count, write…). S'il est incrémenté dans une transformation (map, filter), une tâche relancée après une panne, ou une branche recalculée faute de cache, l'incrémente plusieurs fois. On ne s'y fie que pour des mises à jour faites dans une action.",
    example: "nb = sc.accumulator(0)\nsc.parallelize([45, 30, 30, 25, 35]).foreach(lambda x: nb.add(1))\nnb.value   # 5",
  },
  {
    id: "psg-a1-3", langue: "pyspark", niveau: "avance", type: "qcm",
    front: "Une table est partitionnée par date. Un job réécrit seulement la journée du 2 mars avec mode(\"overwrite\").partitionBy(\"date\"). Que se passe-t-il par défaut ?",
    choices: [
      "Seule la partition du 2 mars est remplacée",
      "Toutes les partitions de la table sont supprimées, seule celle du 2 mars subsiste",
      "Le job échoue car la table existe",
      "Les lignes sont ajoutées à la partition existante",
    ],
    answer: 1,
    explain: "Par défaut, partitionOverwriteMode=static : overwrite vide toute la destination. Avec spark.conf.set(\"spark.sql.sources.partitionOverwriteMode\", \"dynamic\"), seules les partitions présentes dans les données écrites sont remplacées : c'est ce qui rend un rechargement journalier idempotent.",
  },
  {
    id: "psg-a1-4", langue: "pyspark", niveau: "avance", type: "flip",
    front: "MEMORY_ONLY, MEMORY_AND_DISK, DISK_ONLY, suffixe _2 : comment choisir un niveau de persist() ?",
    back: "MEMORY_ONLY : rapide, mais ce qui ne tient pas en RAM est recalculé. MEMORY_AND_DISK (défaut de cache() pour un DataFrame) : l'excédent va sur disque, le choix sûr. DISK_ONLY : pour des données énormes et très coûteuses à recalculer. _2 : chaque partition est répliquée sur deux exécuteurs, pour survivre à la perte d'un exécuteur. Libérer avec unpersist().",
  },
  {
    id: "psg-a1-5", langue: "pyspark", niveau: "avance", type: "flip",
    front: "dropDuplicates([\"client_id\"]) garde-t-il la version la plus récente de chaque client ?",
    back: "Non : il garde une ligne quelconque par clé, qui peut changer d'une exécution à l'autre. Pour une déduplication déterministe, row_number() sur une fenêtre partitionnée par client et ordonnée par date décroissante, puis filtre rn == 1.",
  },
  {
    id: "psg-p1-1", langue: "pyspark", niveau: "pro", type: "flip",
    front: "Comment fournir pandas ou numpy aux exécuteurs d'un cluster YARN pour un job PySpark ?",
    back: "Créer un environnement virtuel avec les bibliothèques (pas besoin d'y installer pyspark, fourni par le cluster), l'empaqueter avec venv-pack, puis l'envoyer avec --archives venv_job.tar.gz#environment et PYSPARK_PYTHON=./environment/bin/python. Les modules du projet passent par --py-files.",
  },
  {
    id: "psg-p1-2", langue: "pyspark", niveau: "pro", type: "code",
    front: "Explique les options de cette commande.",
    code: "spark-submit --master yarn --deploy-mode cluster \\\n  --num-executors 10 --executor-cores 4 --executor-memory 8g \\\n  --conf spark.sql.shuffle.partitions=400 \\\n  job_ventes.py --date 2025-03-02",
    back: "--deploy-mode cluster : le driver tourne sur le cluster (le job survit à la fermeture du terminal). 10 exécuteurs × 4 cœurs = 40 tâches en parallèle, 8 Go par exécuteur. 400 partitions après chaque shuffle. --date : la date logique traitée, passée en argument pour pouvoir relancer ou rattraper un jour précis (job idempotent).",
  },
];
