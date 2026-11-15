// Note de cours générée par le skill /notes-de-cours à partir de docs_divers/MPRA_paper_113562.pdf
export const note = {
  id: "pyspark-pratique",
  titre: "PySpark pratique : l'aide-mémoire du data engineer",
  source: "Guide pratique de PySpark pour Data Engineer · M. Keita (MPRA, 2022) · 183 pages",
  deck: "pyspark",
  resume: "Le guide passe en revue les fonctions PySpark d'usage courant, chacune avec un exemple. Cette note en fait un **aide-mémoire par tâche** : démarrer une session, manipuler des RDD, créer et lire des DataFrames, transformer des colonnes, filtrer, agréger, fenêtrer, joindre, traiter dates et JSON, écrire, optimiser et lancer un job avec spark-submit.\n\nLe fonctionnement interne de Spark (évaluation paresseuse, shuffle, broadcast join, skew, cache, AQE) est déjà dans le deck PySpark : la note y renvoie au lieu de le répéter.",
  prerequis: ["pyspark", "note:big-data#spark"],
  concepts: [
    "SparkSession", "builder", "enableHiveSupport", "spark.conf.set", "sparkContext", "parallelize", "textFile", "wholeTextFiles", "map", "flatMap", "pair RDD",
    "reduceByKey", "groupByKey", "sortByKey", "jointure de RDD", "createDataFrame", "StructType", "StructField", "schéma imbriqué", "StructType.fromJson",
    "read.csv", "read.json multiLine", "read.parquet", "table Hive", "spark.sql", "lecture Kafka en batch", "printSchema", "dtypes",
    "withColumn", "select alias", "withColumnRenamed", "toDF", "cast", "drop", "when otherwise", "contains", "startswith", "rlike", "substring", "concat_ws", "split getItem", "regexp_replace",
    "isNull", "isin", "coalesce", "na.fill", "filter where", "opérateurs & | ~", "orderBy", "distinct", "dropDuplicates", "groupBy agg", "countDistinct",
    "fenêtre cumulative", "rowsBetween", "greatest", "pivot", "explode", "left_semi", "left_anti", "union vs unionByName", "subtract", "exceptAll",
    "to_date", "date_format", "unix_timestamp", "from_unixtime", "datediff", "months_between", "add_months", "from_json", "to_json", "createOrReplaceTempView", "expr",
    "mode d'écriture", "partitionBy", "saveAsTable", "toPandas", "persist", "StorageLevel", "variable broadcast", "accumulateur", "spark-submit", "venv-pack", "deploy-mode",
  ],
  chapitres: [
    {
      id: "session",
      titre: "1. Démarrer une session Spark",
      objectif: "Le squelette de tout script PySpark.",
      blocs: [
        { type: "code", contenu: `from pyspark.sql import SparkSession, Window
from pyspark.sql import functions as F
from pyspark.sql import types as T

spark = (SparkSession.builder
         .appName("chargement_ventes")
         .master("yarn")                          # local[*] sur un poste
         .config("spark.sql.shuffle.partitions", "200")
         .enableHiveSupport()                     # pour lire / écrire des tables Hive
         .getOrCreate())                          # réutilise la session si elle existe

spark.conf.set("spark.sql.session.timeZone", "Europe/Paris")   # réglage à chaud
sc = spark.sparkContext                                         # accès à l'API RDD` },
        { type: "liste", items: [
          "`SparkSession` est le point d'entrée unique depuis Spark 2 (il remplace SQLContext et HiveContext).",
          "`getOrCreate()` évite de créer deux sessions dans un même programme.",
          "Convention répandue : importer les fonctions sous l'alias `F` et les types sous `T`, pour ne pas masquer `sum`, `max`, `round` de Python.",
        ] },
        { type: "attention", contenu: "`from pyspark.sql.functions import *` remplace silencieusement les fonctions Python `sum`, `min`, `max`, `round` par celles de Spark : `sum([1, 2, 3])` lève alors une erreur incompréhensible. D'où l'alias `F`." },
        { type: "renvoi", vers: "pyspark", contenu: "Le rôle du driver, des exécuteurs et du cluster manager : deck PySpark." },
      ],
    },
    {
      id: "rdd",
      titre: "2. L'API RDD en pratique",
      objectif: "Lire du code RDD et savoir quand il reste utile.",
      blocs: [
        { type: "renvoi", vers: "note:big-data#spark", contenu: "Ce qu'est un RDD (collection répartie, immuable, résiliente par sa lignée) est expliqué dans la note Big Data." },
        { type: "tableau", entetes: ["Besoin", "Fonction", "Exemple"], lignes: [
          ["Créer depuis une liste", "`sc.parallelize(liste)`", "`sc.parallelize([1, 2, 3])`"],
          ["Lire un fichier texte (1 ligne = 1 élément)", "`sc.textFile(chemin)`", "`sc.textFile(\"hdfs:///logs/*.txt\")`"],
          ["Lire des fichiers entiers (nom, contenu)", "`sc.wholeTextFiles(dossier)`", "Petits fichiers JSON ou XML"],
          ["Transformer chaque élément", "`map`", "`rdd.map(lambda x: x * 2)`"],
          ["Un élément → plusieurs", "`flatMap`", "`lignes.flatMap(lambda l: l.split())`"],
          ["Paires (clé, valeur)", "`map(lambda x: (cle, valeur))`", "`mots.map(lambda m: (m, 1))`"],
          ["Agréger par clé", "`reduceByKey(op)`", "`paires.reduceByKey(lambda a, b: a + b)`"],
          ["Trier", "`sortBy(f)`, `sortByKey()`", "`compte.sortBy(lambda kv: -kv[1])`"],
          ["Joindre deux pair RDD", "`join`, `leftOuterJoin`", "`(k, v1) join (k, v2)` → `(k, (v1, v2))`"],
          ["Actions", "`count`, `first`, `take(n)`, `collect`, `saveAsTextFile`", "`rdd.take(5)`"],
        ] },
        { type: "schema", svg: `<svg viewBox="0 0 360 236" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="reduceByKey combine avant le shuffle, groupByKey non">
  <defs><marker id="fl-ps-rbk" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="s-arrow"/></marker></defs>
  <text x="6" y="16" class="s-bold">groupByKey</text>
  <rect x="6" y="24" width="168" height="44" rx="6" class="s-box"/>
  <text x="90" y="42" text-anchor="middle" class="s-sub">partition 1 : (a,1) (a,1) (a,1)</text>
  <text x="90" y="59" text-anchor="middle" class="s-sub">partition 2 : (a,1) (a,1)</text>
  <path d="M90 68V84" class="s-line" marker-end="url(#fl-ps-rbk)"/>
  <rect x="6" y="88" width="168" height="34" rx="6" class="s-warn"/>
  <text x="90" y="110" text-anchor="middle" class="s-txt">5 paires sur le réseau</text>
  <text x="90" y="146" text-anchor="middle" class="s-sub">a : [1,1,1,1,1] → 5</text>
  <text x="186" y="16" class="s-bold">reduceByKey</text>
  <rect x="186" y="24" width="168" height="44" rx="6" class="s-box"/>
  <text x="270" y="42" text-anchor="middle" class="s-sub">partition 1 : (a,3)</text>
  <text x="270" y="59" text-anchor="middle" class="s-sub">partition 2 : (a,2)</text>
  <path d="M270 68V84" class="s-line" marker-end="url(#fl-ps-rbk)"/>
  <rect x="186" y="88" width="168" height="34" rx="6" class="s-ok"/>
  <text x="270" y="110" text-anchor="middle" class="s-txt">2 paires sur le réseau</text>
  <text x="270" y="146" text-anchor="middle" class="s-sub">a : 3 + 2 → 5</text>
  <text x="180" y="190" text-anchor="middle" class="s-txt">reduceByKey combine d'abord sur chaque partition</text>
  <text x="180" y="210" text-anchor="middle" class="s-txt">(comme un combiner MapReduce), puis envoie</text>
  <text x="180" y="230" text-anchor="middle" class="s-txt">les résultats partiels.</text>
</svg>`, legende: "Sur de gros volumes, groupByKey envoie toutes les valeurs à travers le réseau et peut saturer la mémoire d'un exécuteur." },
        { type: "exemple", titre: "Le chiffre d'affaires par ville en RDD", code: `ventes = sc.parallelize([("Paris", 120.0), ("Lyon", 80.0), ("Paris", 40.0), ("Lille", 15.0)])
ca = ventes.reduceByKey(lambda a, b: a + b).sortBy(lambda kv: -kv[1])
ca.collect()`, resultat: "[('Paris', 160.0), ('Lyon', 80.0), ('Lille', 15.0)]" },
        { type: "attention", contenu: "Précision : pour des données tabulaires, préférer les **DataFrames**. Le code RDD en Python passe chaque élément par l'interpréteur Python (comme une UDF) et échappe à l'optimiseur Catalyst. Les RDD restent utiles pour du texte brut ou des structures très irrégulières." },
      ],
    },
    {
      id: "lire",
      titre: "3. Créer et lire des DataFrames",
      objectif: "Charger des données avec le bon schéma, quelle que soit la source.",
      blocs: [
        { type: "exemple", titre: "Depuis des données en mémoire, avec un schéma imbriqué", code: `schema = T.StructType([
    T.StructField("id", T.StringType(), False),
    T.StructField("nom", T.StructType([                      # colonne imbriquée
        T.StructField("prenom", T.StringType()),
        T.StructField("famille", T.StringType())])),
    T.StructField("salaire", T.IntegerType()),
])
df = spark.createDataFrame([("01", ("Pascal", "Martin"), 4500)], schema)
df.select("nom.prenom", "salaire").show()      # accès à un champ imbriqué par un point` },
        { type: "texte", contenu: "Le schéma peut aussi être stocké dans un fichier JSON de métadonnées et rechargé avec `T.StructType.fromJson(json.load(f))` : pratique pour versionner les schémas à côté du code." },
        { type: "tableau", entetes: ["Source", "Lecture", "Options utiles"], lignes: [
          ["CSV", "`spark.read.csv(chemin, schema=…, header=True)`", "`sep=\";\"`, `dateFormat`, `nullValue=\"NA\"`, `mode=\"FAILFAST\"`"],
          ["JSON", "`spark.read.json(chemin)`", "`multiLine=True` si un objet JSON tient sur plusieurs lignes"],
          ["Parquet / ORC", "`spark.read.parquet(chemin)`", "Schéma stocké dans le fichier ; filtres poussés au lecteur"],
          ["Table Hive", "`spark.table(\"db.t\")` ou `spark.sql(\"SELECT …\")`", "Session créée avec `enableHiveSupport()`"],
          ["Topic Kafka (en batch)", "`spark.read.format(\"kafka\")`", "`kafka.bootstrap.servers`, `subscribe`, `startingOffsets`"],
        ] },
        { type: "exemple", titre: "Lire un topic Kafka en batch", code: `brut = (spark.read.format("kafka")
        .option("kafka.bootstrap.servers", "broker1:9092")
        .option("subscribe", "commandes")
        .option("startingOffsets", "earliest")
        .load())
commandes = brut.select(F.col("value").cast("string").alias("json"), "offset", "timestamp")` },
        { type: "attention", contenu: "Le message Kafka arrive en **binaire** dans la colonne `value` : il faut le convertir (`cast(\"string\")`) puis le décoder (`from_json`, voir chapitre 8). Et c'est à l'application de mémoriser les offsets déjà traités pour ne pas relire tout le topic." },
        { type: "tableau", entetes: ["Inspecter", "Renvoie"], lignes: [
          ["`df.printSchema()`", "L'arbre des colonnes et de leurs types"],
          ["`df.columns`", "La liste des noms de colonnes (`\"id\" in df.columns` pour tester)"],
          ["`df.dtypes`", "Une liste de couples (nom, type) : `[('id', 'string'), …]`"],
          ["`df.schema.fields`", "Les StructField, pour filtrer les colonnes par type"],
          ["`df.show(5, truncate=False)`", "Les 5 premières lignes sans couper les textes"],
        ] },
        { type: "renvoi", vers: "pyspark", contenu: "Pourquoi éviter `inferSchema=True` sur de gros fichiers : deck PySpark." },
      ],
    },
    {
      id: "colonnes",
      titre: "4. Transformer des colonnes",
      objectif: "Les recettes de transformation les plus fréquentes.",
      blocs: [
        { type: "tableau", entetes: ["Besoin", "Code"], lignes: [
          ["Ajouter / remplacer une colonne", "`df.withColumn(\"ttc\", F.col(\"ht\") * 1.2)`"],
          ["Sélectionner et renommer", "`df.select(F.col(\"id\").alias(\"client_id\"), \"nom\")`"],
          ["Renommer une colonne", "`df.withColumnRenamed(\"nom\", \"nom_client\")`"],
          ["Renommer toutes les colonnes", "`df.toDF(*[c.lower() for c in df.columns])`"],
          ["Ajouter un préfixe partout", "`df.select([F.col(c).alias(\"src_\" + c) for c in df.columns])`"],
          ["Changer de type", "`df.withColumn(\"montant\", F.col(\"montant\").cast(\"double\"))`"],
          ["Supprimer des colonnes", "`df.drop(\"tmp\", \"debug\")`"],
          ["Condition", "`F.when(F.col(\"ca\") > 1000, \"gros\").when(F.col(\"ca\") > 100, \"moyen\").otherwise(\"petit\")`"],
          ["Constante", "`F.lit(\"FR\")`"],
          ["Première valeur non nulle", "`F.coalesce(\"tel_mobile\", \"tel_fixe\", F.lit(\"inconnu\"))`"],
          ["Remplacer les nulls", "`df.na.fill({\"remise\": 0, \"pays\": \"inconnu\"})`"],
        ] },
        { type: "tableau", entetes: ["Texte", "Code", "Résultat"], lignes: [
          ["Contient", "`F.col(\"email\").contains(\"@gmail\")`", "booléen"],
          ["Commence / finit par", "`.startswith(\"FR\")`, `.endswith(\".pdf\")`", "booléen"],
          ["Expression régulière", "`.rlike(\"^[0-9]{5}$\")`", "booléen (code postal valide)"],
          ["Sous-chaîne", "`F.substring(\"cp\", 1, 2)`", "\"75\" pour \"75011\" (position 1 = 1er caractère)"],
          ["Concaténer", "`F.concat_ws(\" \", \"prenom\", \"nom\")`", "\"Ana Martin\" (ignore les nulls, contrairement à `concat`)"],
          ["Découper", "`F.split(\"date\", \"-\").getItem(0)`", "\"2025\" pour \"2025-03-02\""],
          ["Remplacer", "`F.regexp_replace(\"tel\", \"[^0-9]\", \"\")`", "garde uniquement les chiffres"],
        ] },
        { type: "attention", contenu: "`F.concat(\"prenom\", \"nom\")` renvoie **null** dès qu'une des colonnes est nulle. `concat_ws` ignore les valeurs nulles : c'est presque toujours celui qu'on veut." },
        { type: "renvoi", vers: "pyspark", contenu: "Pourquoi utiliser `F.col()` et pourquoi éviter des dizaines de `withColumn` dans une boucle : deck PySpark." },
      ],
    },
    {
      id: "filtrer",
      titre: "5. Filtrer, trier, dédupliquer",
      objectif: "Écrire des filtres corrects et dédupliquer de façon déterministe.",
      blocs: [
        { type: "exemple", titre: "Combiner des conditions", code: `df.filter((F.col("pays") == "FR") & (F.col("ca") > 1000))       # ET
df.filter((F.col("statut") == "annulee") | F.col("remise").isNull())  # OU
df.filter(~F.col("pays").isin("FR", "BE"))                        # NON + dans une liste
df.where("ca > 1000 AND pays = 'FR'")                             # même chose en SQL` },
        { type: "attention", contenu: "Les parenthèses sont **obligatoires** autour de chaque condition : en Python, `&` est prioritaire sur `==`. `F.col(\"pays\") == \"FR\" & F.col(\"ca\") > 1000` lève une erreur ou filtre n'importe quoi. Et on utilise `&`, `|`, `~`, jamais `and`, `or`, `not`." },
        { type: "tableau", entetes: ["Besoin", "Code"], lignes: [
          ["Tester la nullité", "`F.col(\"x\").isNull()`, `.isNotNull()` (jamais `== None`)"],
          ["Trier", "`df.orderBy(F.col(\"ca\").desc(), \"nom\")`"],
          ["Nulls en dernier", "`F.col(\"ca\").desc_nulls_last()`"],
          ["Lignes strictement identiques", "`df.distinct()`"],
          ["Doublons sur une clé", "`df.dropDuplicates([\"client_id\"])`"],
        ] },
        { type: "attention", contenu: "`dropDuplicates([\"client_id\"])` garde **une ligne quelconque** par client, pas forcément la plus récente, et pas forcément la même d'une exécution à l'autre. Pour garder la dernière version, utiliser `row_number()` sur une fenêtre ordonnée (voir le deck PySpark)." },
        { type: "renvoi", vers: "pyspark", contenu: "La déduplication déterministe avec `row_number()` : deck PySpark, carte « ROW_NUMBER() = 1 pour dédupliquer »." },
      ],
    },
    {
      id: "agreger",
      titre: "6. Agréger, fenêtrer, pivoter, éclater",
      objectif: "Calculer des agrégats sans perdre le détail quand il le faut.",
      blocs: [
        { type: "exemple", titre: "Données d'exemple", code: `ventes = spark.createDataFrame(
    [("Ana", 1, 100), ("Ana", 2, 150), ("Ana", 3, 50), ("Bob", 1, 80), ("Bob", 2, 120)],
    ["vendeur", "mois", "montant"])` },
        { type: "exemple", titre: "Agréger par groupe", code: `(ventes.groupBy("vendeur")
       .agg(F.sum("montant").alias("ca"),
            F.count("*").alias("nb_ventes"),
            F.round(F.avg("montant"), 1).alias("moyenne"))
       .show())`, resultat: "vendeur | ca  | nb_ventes | moyenne\nAna     | 300 | 3         | 100.0\nBob     | 200 | 2         | 100.0" },
        { type: "exemple", titre: "Garder le détail et ajouter un cumul et un total (fenêtres)", code: `par_vendeur = Window.partitionBy("vendeur")
cumulatif = par_vendeur.orderBy("mois").rowsBetween(Window.unboundedPreceding, Window.currentRow)

(ventes.withColumn("cumul", F.sum("montant").over(cumulatif))     # avec orderBy : cumul
       .withColumn("total", F.sum("montant").over(par_vendeur))    # sans orderBy : total du groupe
       .withColumn("part", F.round(F.col("montant") / F.col("total"), 2))
       .show())`, resultat: "vendeur | mois | montant | cumul | total | part\nAna     | 1    | 100     | 100   | 300   | 0.33\nAna     | 2    | 150     | 250   | 300   | 0.5\nAna     | 3    | 50      | 300   | 300   | 0.17\nBob     | 1    | 80      | 80    | 200   | 0.4\nBob     | 2    | 120     | 200   | 200   | 0.6" },
        { type: "attention", contenu: "Une fenêtre **avec** `orderBy` calcule par défaut un cumul (du début jusqu'à la ligne courante) ; **sans** `orderBy`, elle porte sur tout le groupe. Oublier `orderBy` transforme un cumul en total, et l'inverse. Préciser `rowsBetween` lève l'ambiguïté." },
        { type: "exemple", titre: "Pivoter (une colonne par mois)", code: `ventes.groupBy("vendeur").pivot("mois", [1, 2, 3]).sum("montant").show()`, resultat: "vendeur | 1   | 2   | 3\nAna     | 100 | 150 | 50\nBob     | 80  | 120 | null" },
        { type: "texte", contenu: "Lister les valeurs du pivot (`[1, 2, 3]`) évite à Spark un passage supplémentaire sur les données pour les découvrir, et fige les colonnes de sortie." },
        { type: "exemple", titre: "Éclater une liste en lignes", code: `cmd = spark.createDataFrame([("C1", "stylo,cahier"), ("C2", "gomme")], ["cmd", "articles"])
cmd.withColumn("article", F.explode(F.split("articles", ","))).select("cmd", "article").show()`, resultat: "cmd | article\nC1  | stylo\nC1  | cahier\nC2  | gomme" },
        { type: "tableau", entetes: ["Calcul ligne par ligne sur plusieurs colonnes", "Code"], lignes: [
          ["Somme de colonnes", "`F.col(\"t1\") + F.col(\"t2\") + F.col(\"t3\")` (null si une colonne est nulle)"],
          ["Plus grande / plus petite valeur", "`F.greatest(\"t1\", \"t2\", \"t3\")`, `F.least(…)` (ignorent les nulls)"],
          ["Première non nulle", "`F.coalesce(\"t1\", \"t2\", \"t3\")`"],
        ] },
        { type: "renvoi", vers: "pyspark", contenu: "Pourquoi une fenêtre sans `partitionBy` rapatrie toutes les données sur une seule tâche : deck PySpark." },
      ],
    },
    {
      id: "combiner",
      titre: "7. Joindre, empiler, soustraire",
      objectif: "Choisir le bon type de jointure et empiler sans mélanger les colonnes.",
      blocs: [
        { type: "tableau", entetes: ["Type (`how=`)", "Garde", "Usage"], lignes: [
          ["`inner`", "les lignes qui correspondent des deux côtés", "Cas courant"],
          ["`left`", "toutes les lignes de gauche, null à droite si absent", "Enrichir sans perdre de lignes"],
          ["`full`", "tout, des deux côtés", "Réconcilier deux sources"],
          ["`left_semi`", "les lignes de gauche **qui ont** une correspondance, sans les colonnes de droite", "« Clients qui ont commandé »"],
          ["`left_anti`", "les lignes de gauche **sans** correspondance", "« Clients qui n'ont jamais commandé », clés orphelines"],
          ["`cross`", "toutes les combinaisons", "Produit cartésien, à éviter sur de gros volumes"],
        ] },
        { type: "exemple", titre: "Jointures courantes", code: `# Joindre sur un nom de colonne commun : une seule colonne client_id en sortie
ventes.join(clients, on="client_id", how="left")

# Joindre sur des noms différents : préciser les DataFrames
ventes.join(clients, ventes.client_id == clients.id, "left").drop(clients.id)

# Ventes dont le client est inconnu (contrôle qualité)
orphelines = ventes.join(clients, on="client_id", how="left_anti")` },
        { type: "attention", contenu: "`union` empile les colonnes **par position**, pas par nom. Si les deux DataFrames n'ont pas les colonnes dans le même ordre, les valeurs se retrouvent dans la mauvaise colonne sans aucune erreur. Utiliser `unionByName` (avec `allowMissingColumns=True` si une colonne manque d'un côté)." },
        { type: "tableau", entetes: ["Opération", "Code", "Doublons"], lignes: [
          ["Empiler par nom", "`df1.unionByName(df2)`", "conservés (comme UNION ALL)"],
          ["Lignes de df1 absentes de df2", "`df1.subtract(df2)`", "supprimés (comme EXCEPT)"],
          ["Idem en gardant les doublons", "`df1.exceptAll(df2)`", "conservés"],
        ] },
        { type: "renvoi", vers: "pyspark", contenu: "Broadcast join et choix automatique de la stratégie de jointure : deck PySpark." },
      ],
    },
    {
      id: "dates-json",
      titre: "8. Dates, JSON et SQL",
      objectif: "Convertir et calculer sur des dates, décoder du JSON, mélanger API et SQL.",
      blocs: [
        { type: "tableau", entetes: ["Besoin", "Code", "Exemple"], lignes: [
          ["Texte → date", "`F.to_date(\"d\", \"dd/MM/yyyy\")`", "\"02/03/2025\" → 2025-03-02"],
          ["Texte → horodatage", "`F.to_timestamp(\"t\", \"yyyy-MM-dd HH:mm:ss\")`", ""],
          ["Date → texte", "`F.date_format(\"d\", \"yyyy-MM\")`", "→ \"2025-03\""],
          ["Horodatage → secondes epoch", "`F.unix_timestamp(\"t\")`", ""],
          ["Epoch → horodatage", "`F.from_unixtime(\"epoch\")`", "texte \"yyyy-MM-dd HH:mm:ss\""],
          ["Écart en jours / mois", "`F.datediff(fin, debut)`, `F.months_between(fin, debut)`", "datediff(2025-03-02, 2025-02-01) = 29"],
          ["Ajouter des jours / mois", "`F.date_add(\"d\", 7)`, `F.add_months(\"d\", 1)`", ""],
          ["Début de mois", "`F.trunc(\"d\", \"month\")` ou `F.date_trunc(\"month\", \"t\")`", "→ 2025-03-01"],
          ["Aujourd'hui", "`F.current_date()`, `F.current_timestamp()`", ""],
        ] },
        { type: "attention", contenu: "Les motifs de format suivent Java : `MM` = mois, `mm` = minutes, `yyyy` = année. `dd/mm/yyyy` lit donc des minutes à la place du mois. Une date qui ne correspond pas au motif devient **null** sans erreur : compter les nulls après conversion." },
        { type: "exemple", titre: "Décoder une colonne JSON", code: `schema_cmd = T.StructType([
    T.StructField("id", T.StringType()),
    T.StructField("montant", T.DoubleType()),
    T.StructField("articles", T.ArrayType(T.StringType())),
])
cmd = (commandes
       .withColumn("c", F.from_json("json", schema_cmd))     # texte JSON → structure
       .select("c.id", "c.montant", F.explode("c.articles").alias("article")))

cmd.select(F.to_json(F.struct("id", "montant")).alias("payload"))   # structure → texte JSON` },
        { type: "exemple", titre: "Passer du DataFrame au SQL et inversement", code: `ventes.createOrReplaceTempView("ventes")        # vue temporaire, visible dans la session
top = spark.sql("""
    SELECT vendeur, SUM(montant) AS ca FROM ventes GROUP BY vendeur ORDER BY ca DESC
""")
ventes.withColumn("ht", F.expr("montant / 1.2"))   # une expression SQL dans l'API` },
      ],
    },
    {
      id: "ecrire",
      titre: "9. Écrire, optimiser, partager des variables",
      objectif: "Écrire de façon sûre et utiliser cache, broadcast et accumulateurs à bon escient.",
      blocs: [
        { type: "tableau", entetes: ["Mode d'écriture", "Si la destination existe"], lignes: [
          ["`overwrite`", "Remplace tout (ou seulement les partitions écrites, avec `partitionOverwriteMode=dynamic`)"],
          ["`append`", "Ajoute les lignes"],
          ["`ignore`", "Ne fait rien"],
          ["`error` / `errorifexists` (défaut)", "Échoue"],
        ] },
        { type: "exemple", titre: "Écritures courantes", code: `(ventes.write.mode("overwrite")
       .partitionBy("annee", "mois")
       .parquet("s3://gold/ventes"))

ventes.write.mode("append").saveAsTable("gold.ventes")                       # table Hive
ventes.coalesce(1).write.mode("overwrite").option("header", True).csv("/tmp/export")   # un seul fichier

spark.conf.set("spark.sql.sources.partitionOverwriteMode", "dynamic")        # n'écrase que les partitions présentes` },
        { type: "attention", contenu: "Sans `partitionOverwriteMode=dynamic`, un `overwrite` partitionné **efface toutes les partitions** de la table, y compris celles que le job n'a pas recalculées. Pour un rechargement idempotent d'un seul jour, activer le mode dynamique." },
        { type: "attention", contenu: "`toPandas()` et `collect()` rapatrient tout le DataFrame dans la mémoire du **driver**. À réserver aux petits résultats (agrégats, échantillons)." },
        { type: "tableau", entetes: ["Niveau de persistance", "Où", "Quand"], lignes: [
          ["`MEMORY_ONLY`", "RAM ; ce qui ne tient pas est recalculé", "Données petites et rapides à recalculer"],
          ["`MEMORY_AND_DISK`", "RAM puis disque pour l'excédent", "Défaut de `cache()` pour un DataFrame : le choix sûr"],
          ["`DISK_ONLY`", "Disque", "Données énormes et très coûteuses à recalculer"],
          ["`…_2`", "Même chose, répliqué sur 2 exécuteurs", "Tolérance aux pannes d'exécuteur"],
        ] },
        { type: "definition", terme: "Variable broadcast", contenu: "Une valeur en lecture seule (petite table de correspondance, liste, dictionnaire) envoyée **une fois** à chaque exécuteur, au lieu d'être sérialisée avec chaque tâche : `bc = sc.broadcast(dict_taux)` puis `bc.value` dans les fonctions." },
        { type: "definition", terme: "Accumulateur", contenu: "Une variable que les tâches peuvent seulement **incrémenter** et que seul le driver lit : compter des lignes rejetées, sommer une valeur, pendant un traitement." },
        { type: "exemple", titre: "Compter et sommer avec des accumulateurs", code: `scores = sc.parallelize([45, 30, 30, 25, 35])
nb = sc.accumulator(0)
somme = sc.accumulator(0)
scores.foreach(lambda x: (nb.add(1), somme.add(x)))   # foreach est une ACTION
print(nb.value, somme.value)`, resultat: "5 165" },
        { type: "attention", contenu: "Correction du cours : un accumulateur ne donne **pas** un résultat « sans action ». Il n'est mis à jour que lorsqu'une action s'exécute (ici `foreach`). Et s'il est incrémenté dans une **transformation** (`map`), une tâche relancée après une panne ou une branche recalculée l'incrémente plusieurs fois : ne s'y fier que dans les actions." },
        { type: "renvoi", vers: "pyspark", contenu: "Quand le cache est utile ou nuisible, repartition vs coalesce, partitionner l'écriture sur une colonne de forte cardinalité : deck PySpark." },
      ],
    },
    {
      id: "production",
      titre: "10. Lancer un job en production",
      objectif: "Empaqueter les dépendances Python et soumettre le job au cluster.",
      blocs: [
        { type: "texte", contenu: "Sur un cluster, les exécuteurs doivent disposer des mêmes bibliothèques Python que le code (pandas, numpy, pyarrow…). On empaquette donc un **environnement virtuel** et on l'envoie avec le job. PySpark lui-même est fourni par le cluster : inutile de l'installer dans l'environnement." },
        { type: "exemple", titre: "Construire et empaqueter l'environnement", code: `python3 -m venv venv_job
source venv_job/bin/activate
pip install pandas numpy pyarrow venv-pack
venv-pack -o venv_job.tar.gz          # archive relocalisable de l'environnement` },
        { type: "exemple", titre: "Soumettre le job", code: `export PYSPARK_PYTHON=./environment/bin/python
spark-submit \\
  --master yarn \\
  --deploy-mode cluster \\
  --archives venv_job.tar.gz#environment \\
  --num-executors 10 --executor-cores 4 --executor-memory 8g \\
  --driver-memory 4g \\
  --conf spark.sql.shuffle.partitions=400 \\
  --py-files utils.zip \\
  job_ventes.py --date 2025-03-02` },
        { type: "tableau", entetes: ["Option", "Rôle"], lignes: [
          ["`--deploy-mode cluster`", "Le driver tourne sur le cluster (le job survit à la fermeture du terminal) ; `client` le garde sur la machine qui lance"],
          ["`--archives x.tar.gz#environment`", "Décompresse l'environnement sous le nom `environment` sur chaque nœud"],
          ["`--num-executors`, `--executor-cores`, `--executor-memory`", "Taille du job : ici 10 × 4 = 40 tâches en parallèle"],
          ["`--py-files`", "Modules Python du projet à distribuer"],
          ["Arguments après le script", "Paramètres du job, comme la date logique traitée"],
        ] },
        { type: "application", titre: "Paramétrer le job par sa date", contenu: "Passer la date traitée en argument (plutôt que d'utiliser la date du jour dans le code) rend le job rejouable : on peut relancer le 2 mars sans attendre, ou rattraper un historique." },
        { type: "renvoi", vers: "dataeng", contenu: "Idempotence, date logique d'exécution et orchestration (Airflow) : deck Data engineering." },
      ],
    },
  ],
  aRetenir: [
    "Toujours `from pyspark.sql import functions as F` : l'import étoile masque sum, max, round de Python.",
    "reduceByKey combine avant le shuffle ; groupByKey envoie toutes les valeurs : à éviter sur de gros volumes.",
    "Lire avec un schéma explicite ; un message Kafka arrive en binaire (cast puis from_json).",
    "Filtres : parenthèses autour de chaque condition et &, |, ~ ; isNull() et jamais == None.",
    "dropDuplicates garde une ligne quelconque ; pour la plus récente, row_number sur une fenêtre ordonnée.",
    "Fenêtre avec orderBy = cumul, sans orderBy = total du groupe.",
    "union empile par position, unionByName par nom ; left_anti trouve les clés orphelines.",
    "concat renvoie null si une colonne est nulle, concat_ws non ; MM = mois, mm = minutes.",
    "overwrite partitionné sans mode dynamique efface toutes les partitions ; accumulateurs fiables seulement dans les actions.",
    "En production : environnement Python empaqueté (venv-pack), spark-submit en mode cluster, date traitée passée en argument.",
  ],
};
