// Explications et exemples ajoutés aux cartes PySpark.
export const extrasPySpark = {
  "ps-f1-1": {
    detail: "Un DataFrame pandas vit en mémoire sur une seule machine et chaque ligne de code s'exécute tout de suite. Un DataFrame Spark est réparti en partitions sur plusieurs machines ; chaque transformation ajoute une étape à un plan, et rien ne s'exécute avant une action. Cela permet à Spark d'optimiser tout le plan d'un coup.",
    example: `# pandas : calcule immédiatement
pdf = pd.read_csv("ventes.csv")
pdf = pdf[pdf.montant > 0]           # filtre exécuté ici

# Spark : construit un plan
df = spark.read.parquet("s3://data/ventes")
df = df.filter(F.col("montant") > 0)   # rien n'est lu
df.count()                            # lecture + filtre + comptage, maintenant`,
  },
  "ps-f1-2": {
    detail: ".show() n'affiche que 20 lignes, mais pour les produire Spark peut devoir exécuter tout ce qui précède : jointures, regroupements, tris. Pour inspecter, préférer un échantillon tôt dans le pipeline, ou un .limit() avant les étapes coûteuses quand c'est possible.",
    example: `df = (ventes.join(clients, "client_id")
           .groupBy("pays").agg(F.sum("montant").alias("ca"))
           .orderBy(F.desc("ca")))
df.show()      # exécute jointure + agrégation + tri complets

# Pour vérifier la logique sur un petit volume :
petit = ventes.sample(fraction=0.01, seed=42)
df_test = petit.join(clients, "client_id")...`,
  },
  "ps-f2-1": {
    detail: "Les transformations sont « paresseuses » (lazy) : elles décrivent ce qu'il faut faire. Les actions demandent un résultat concret (un nombre, des lignes à afficher, des fichiers écrits) et déclenchent un « job ». C'est l'optimiseur Catalyst qui transforme le plan en exécution efficace (filtres remontés, colonnes inutiles ignorées).",
    example: `df = spark.read.parquet("ventes")            # transformation (lecture différée)
fr = df.filter(F.col("pays") == "FR")       # transformation
fr = fr.select("date", "montant")           # transformation
n  = fr.count()                             # ACTION -> 1 job
fr.write.mode("overwrite").parquet("out")   # ACTION -> 1 autre job (tout est relu)`,
  },
  "ps-f2-2": {
    detail: "Spark ne garde pas les résultats intermédiaires en mémoire par défaut. Chaque action reconstruit son résultat depuis la source en rejouant tout le plan. Trois .count() de contrôle sur un pipeline coûteux = trois exécutions complètes. Si on doit réutiliser un résultat, on le met en cache (ou on l'écrit).",
    example: `propre = brut.dropDuplicates(["id"]).filter("montant > 0")   # coûteux
print(propre.count())                         # job 1 : relit et déduplique
print(propre.filter("pays = 'FR'").count())   # job 2 : refait TOUT
propre.write.parquet("silver/ventes")         # job 3 : refait TOUT

propre = propre.cache()
propre.count()                                # remplit le cache une fois`,
  },
  "ps-f3-1": {
    detail: "Pour deviner les types, Spark doit lire les données une première fois, puis une seconde pour les charger. En plus, le schéma deviné peut changer d'un jour à l'autre (une colonne d'entiers qui devient texte à cause d'une valeur sale). Un schéma explicite rend le chargement plus rapide et prévisible.",
    example: `from pyspark.sql.types import StructType, StructField, StringType, DoubleType, DateType

schema = StructType([
    StructField("id_commande", StringType(), False),
    StructField("date",        DateType(),   True),
    StructField("montant",     DoubleType(), True),
])
df = spark.read.csv("s3://landing/ventes/", header=True, schema=schema)
# Variante compacte : schema="id_commande STRING, date DATE, montant DOUBLE"`,
  },
  "ps-f4-1": {
    detail: "Après une jointure, deux DataFrames peuvent avoir une colonne de même nom (« id », « date »). Référencer la colonne par son DataFrame d'origine lève l'ambiguïté. col() permet aussi de construire des expressions (col(\"a\") * 2, conditions), ce qu'une simple chaîne ne permet pas.",
    example: `from pyspark.sql import functions as F

cmd.join(cli, cmd["client_id"] == cli["id"]) \\
   .select(cmd["id"].alias("id_commande"), cli["id"].alias("id_client"))
# "id" seul -> AnalysisException : Reference 'id' is ambiguous

df.filter((F.col("montant") > 100) & (F.col("pays") == "FR"))`,
  },
  "ps-f4-2": {
    detail: "Chaque withColumn crée un nouveau plan qui enveloppe le précédent. Avec des centaines d'appels en boucle, le plan devient très profond et son analyse peut prendre plus de temps que le traitement lui-même, voire saturer la mémoire du driver. Un seul select avec toutes les expressions donne un plan plat.",
    example: `colonnes = ["prix", "remise", "taxe", "frais"]

# Lent sur des dizaines de colonnes :
for c in colonnes:
    df = df.withColumn(c, F.round(F.col(c), 2))

# Un seul select :
df = df.select(*[F.round(F.col(c), 2).alias(c) if c in colonnes else F.col(c)
                 for c in df.columns])
# Spark 3.3+ : df.withColumns({c: F.round(F.col(c), 2) for c in colonnes})`,
  },
  "ps-i1-1": {
    detail: "Une jointure classique (shuffle join) redistribue les DEUX tables sur le réseau pour regrouper les lignes de même clé. Si l'une est petite (une dimension), il est bien moins coûteux de l'envoyer entière à chaque exécuteur : la grande table ne bouge pas. Le seuil par défaut est de 10 Mo.",
    example: `spark.conf.get("spark.sql.autoBroadcastJoinThreshold")   # '10485760' (10 Mo)

ventes.join(pays, "code_pays").explain()
# == Physical Plan ==
# BroadcastHashJoin [code_pays], [code_pays], Inner, BuildRight
#   +- BroadcastExchange ...   <- la petite table "pays" est diffusée`,
  },
  "ps-i1-2": {
    detail: "La décision automatique repose sur une estimation de taille qui peut être fausse (après un filtre, Spark ne sait pas toujours que la table est devenue petite). broadcast() force le choix. À ne faire que si la table tient vraiment en mémoire sur chaque exécuteur, sinon on obtient un OutOfMemoryError.",
    example: `from pyspark.sql.functions import broadcast

produits_actifs = produits.filter("actif = true")     # 5 000 lignes, mais taille estimée inconnue
resultat = ventes.join(broadcast(produits_actifs), "produit_id", "left")

# Équivalent en SQL :
# SELECT /*+ BROADCAST(p) */ * FROM ventes v LEFT JOIN produits_actifs p USING (produit_id)`,
  },
  "ps-i2-1": {
    detail: "Les fonctions fenêtrées existent en PySpark exactement comme en SQL : on définit une fenêtre (partition et ordre), puis on applique row_number, rank, lag, sum… La version la plus récente de chaque clé se garde avec row_number() == 1.",
    example: `from pyspark.sql import Window, functions as F

w = Window.partitionBy("client_id").orderBy(F.col("maj_le").desc(), F.col("id").desc())

derniers = (clients_versions
            .withColumn("rn", F.row_number().over(w))
            .filter(F.col("rn") == 1)
            .drop("rn"))`,
  },
  "ps-i2-2": {
    detail: "Une fenêtre partitionnée est calculée en parallèle, une partition par tâche. Sans partitionBy, l'ordre doit être global : Spark envoie toutes les lignes sur une seule partition. Le log affiche alors « No Partition Defined for Window operation! Moving all data to a single partition ».",
    example: `# Goulot : toutes les lignes sur une seule tâche
w = Window.orderBy("date")
df.withColumn("cumul", F.sum("montant").over(w))

# Parallèle : un cumul par client
w = Window.partitionBy("client_id").orderBy("date") \\
          .rowsBetween(Window.unboundedPreceding, Window.currentRow)
df.withColumn("cumul_client", F.sum("montant").over(w))`,
  },
  "ps-i3-1": {
    detail: "repartition(n) redistribue toutes les lignes en n partitions équilibrées (shuffle complet) ; on peut aussi répartir par colonne. coalesce(n) se contente de regrouper des partitions existantes sur place : c'est rapide, mais les partitions peuvent rester déséquilibrées. Typiquement, on utilise coalesce avant d'écrire pour éviter trop de petits fichiers.",
    example: `df.rdd.getNumPartitions()          # 200

df.coalesce(10).write.parquet("out")       # 10 fichiers, sans shuffle complet
df.repartition(50, "pays").write.parquet("out2")   # 50 partitions, regroupées par pays

# coalesce ne peut pas augmenter : df.coalesce(400) reste à 200 partitions`,
  },
  "ps-i3-2": {
    detail: "partitionBy à l'écriture crée un dossier par valeur de la colonne. Partitionner par date (quelques centaines de valeurs) permet de ne lire que les jours utiles. Partitionner par identifiant client (des millions de valeurs) crée des millions de minuscules fichiers : lister et ouvrir ces fichiers devient plus long que lire les données.",
    example: `# Bon : un dossier par jour
df.write.partitionBy("date_vente").parquet("s3://gold/ventes")
#   gold/ventes/date_vente=2025-03-01/part-0000.parquet

# Mauvais : 2 millions de dossiers
df.write.partitionBy("client_id").parquet("s3://gold/ventes")
#   gold/ventes/client_id=000001/...  (fichiers de quelques Ko)`,
  },
  "ps-i4-1": {
    detail: "Les données Spark vivent dans la JVM. Une UDF Python oblige à sérialiser chaque ligne, l'envoyer à un processus Python, exécuter la fonction, puis renvoyer le résultat. Une fonction native (pyspark.sql.functions) s'exécute directement dans la JVM, et l'optimiseur la comprend.",
    example: `# UDF Python : lente
@F.udf("string")
def nettoyer(s):
    return s.strip().upper() if s else None
df.withColumn("nom", nettoyer("nom"))

# Fonctions natives : même résultat, bien plus rapide
df.withColumn("nom", F.upper(F.trim(F.col("nom"))))`,
  },
  "ps-i4-2": {
    detail: "Une pandas UDF reçoit des lots de lignes sous forme de Series pandas, transférés via le format colonnaire Apache Arrow. On peut donc écrire du code vectorisé (pandas, numpy) qui traite des milliers de valeurs d'un coup. C'est le bon outil quand aucune fonction native n'existe (calcul scientifique, bibliothèque Python).",
    example: `import pandas as pd
from pyspark.sql.functions import pandas_udf

@pandas_udf("double")
def zscore(v: pd.Series) -> pd.Series:
    return (v - v.mean()) / v.std()      # vectorisé sur le lot

df.withColumn("z", zscore("montant"))
# Attention : la moyenne est celle du LOT, pas de toute la colonne :
# pour un vrai z-score global, calculer mean/std avec F.mean / F.stddev.`,
  },
  "ps-a1-1": {
    detail: "Avec un format comme Parquet, Spark peut transmettre les filtres au lecteur de fichiers, qui saute alors les blocs dont les statistiques min/max excluent la condition. Dans le plan, la ligne du scan liste les filtres poussés. Les filtres sur une colonne de partition apparaissent dans PartitionFilters.",
    example: `df = spark.read.parquet("ventes").filter((F.col("montant") > 1000) & (F.col("annee") == 2025))
df.explain(True)
# == Physical Plan ==
# FileScan parquet [id,montant,annee]
#   PartitionFilters: [isnotnull(annee), (annee = 2025)]
#   PushedFilters: [IsNotNull(montant), GreaterThan(montant,1000.0)]`,
  },
  "ps-a1-2": {
    detail: "Catalyst optimise en raisonnant sur des expressions qu'il comprend : il peut déplacer un filtre avant une jointure, supprimer une colonne inutile, simplifier une condition. Une UDF Python est une boîte noire : il ne peut ni la déplacer, ni savoir ce qu'elle lit, ni la pousser vers la source. Un filtre sur le résultat d'une UDF ne sera jamais poussé dans le scan Parquet.",
    example: `@F.udf("boolean")
def est_fr(pays): return pays == "FR"

df.filter(est_fr("pays")).explain()
# Pas de PushedFilters sur "pays" : tout le fichier est lu,
# puis chaque ligne passe par Python.

df.filter(F.col("pays") == "FR").explain()
# PushedFilters: [EqualTo(pays,FR)]`,
  },
  "ps-a2-1": {
    detail: "Un shuffle déplace des données sur le réseau pour regrouper les lignes de même clé sur la même tâche. Il implique écriture sur disque, transfert réseau et relecture : c'est l'opération la plus coûteuse d'un job. filter, select et withColumn n'en provoquent pas (transformations « étroites »).",
    example: `df.filter("montant > 0")             # étroite : pas de shuffle
  .withColumn("ttc", F.col("ht") * 1.2) # étroite
  .groupBy("pays").sum("ttc")           # LARGE : shuffle par pays
  .orderBy("pays")                      # LARGE : shuffle pour le tri global
# Dans explain() : chaque "Exchange" correspond à un shuffle.`,
  },
  "ps-a2-2": {
    detail: "Un job est découpé en stages : à l'intérieur d'un stage, les tâches s'enchaînent sans échanger de données ; entre deux stages, il faut un shuffle. La Spark UI montre pour chaque stage la durée, le nombre de tâches et les volumes échangés : c'est là qu'on voit où le temps passe.",
    example: `Spark UI > Jobs > Job 3 :
  Stage 7 : lecture + filtre             200 tâches   Shuffle Write : 45 Go
  Stage 8 : agrégation par client        200 tâches   Shuffle Read  : 45 Go  (18 min)
  Stage 9 : écriture                      10 tâches
-> 45 Go échangés : filtrer ou réduire les colonnes AVANT le groupBy.`,
  },
  "ps-a3-1": {
    detail: "Dans la Spark UI, ouvrir le stage lent et regarder les statistiques des tâches (Summary Metrics) : si le maximum est très supérieur à la médiane (durée, Shuffle Read), une clé concentre les données. On confirme ensuite en comptant les lignes par clé.",
    example: `Summary Metrics (stage 8, 200 tâches) :
              Min     Médiane   Max
  Durée       2 s     3 s       14 min      <- une tâche fait tout le travail
  Shuffle Read 40 Mo  45 Mo     38 Go

ventes.groupBy("client_id").count().orderBy(F.desc("count")).show(5)
# client_id = NULL : 210 000 000 lignes`,
  },
  "ps-a3-2": {
    detail: "On ajoute à la clé un « sel » aléatoire de 0 à N-1 côté grande table, et on duplique N fois chaque ligne de la petite table (une par valeur de sel). La clé chaude est ainsi répartie sur N tâches. Sur Spark 3+, essayer d'abord l'AQE (skewJoin), qui fait souvent ce travail automatiquement.",
    example: `N = 16
grande = ventes.withColumn("sel", (F.rand() * N).cast("int"))
petite = clients.crossJoin(spark.range(N).withColumnRenamed("id", "sel"))

jointure = grande.join(petite, ["client_id", "sel"]).drop("sel")
# La clé chaude est maintenant traitée par 16 tâches au lieu d'une.`,
  },
  "ps-a4-1": {
    detail: "Le cache garde un DataFrame en mémoire (et sur disque si besoin) après sa première exécution. Il est rentable si le DataFrame est coûteux à produire ET réutilisé plusieurs fois. Sinon il consomme de la mémoire qui manque aux autres opérations. Penser à unpersist() quand on n'en a plus besoin.",
    example: `base = (brut.join(clients, "client_id").dropDuplicates(["id"])).cache()

base.groupBy("pays").sum("montant").write.parquet("gold/ca_pays")    # remplit le cache
base.groupBy("produit").sum("montant").write.parquet("gold/ca_prod") # lit le cache
base.unpersist()

# Inutile : df.cache().write.parquet(...) si df n'est utilisé qu'une fois`,
  },
  "ps-a4-2": {
    detail: "cache() ne fait que marquer le DataFrame : rien n'est calculé à ce moment-là. Le cache se remplit pendant la première action. Si les branches suivantes démarrent avant, elles ne profitent pas encore du cache. Forcer la matérialisation avec un count() rend aussi les mesures de temps plus lisibles.",
    example: `base = transformations_couteuses(df).cache()   # rien n'est encore en mémoire
base.count()                                  # calcule et remplit le cache
# Spark UI > Storage : base, 100 % en cache, 12 Go

rapport_1 = base.filter(...).collect()        # lit le cache
rapport_2 = base.groupBy(...).count()         # lit le cache`,
  },
  "ps-p1-1": {
    detail: "Le driver exécute ton programme Python, construit le plan et le découpe en tâches. Les exécuteurs sont des processus JVM répartis sur les machines du cluster ; chacun traite des partitions. Le cluster manager attribue les machines et les ressources. Un .collect() rapatrie tout le résultat sur le driver : à réserver aux petits résultats.",
    example: `spark-submit --master yarn \\
  --driver-memory 4g \\
  --num-executors 10 --executor-cores 4 --executor-memory 16g \\
  job.py
# 10 exécuteurs x 4 cœurs = 40 tâches en parallèle

df.collect()   # tout vers le driver (4 Go) -> OutOfMemoryError si df est gros`,
  },
  "ps-p1-2": {
    detail: "Sans AQE, le plan est figé avant l'exécution, à partir d'estimations. Avec AQE (activée par défaut depuis Spark 3.2), Spark mesure la taille réelle des données après chaque shuffle et adapte la suite : il fusionne les petites partitions, passe en broadcast si une table s'avère petite, découpe les partitions déséquilibrées d'une jointure.",
    example: `spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")
spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")
# Dans la Spark UI, le plan final affiche "AdaptiveSparkPlan isFinalPlan=true"
# et des nœuds comme "AQEShuffleRead coalesced" ou "skew".`,
  },
  "ps-p2-1": {
    detail: "Delta Lake ajoute à côté des fichiers Parquet un journal de transactions (_delta_log) qui liste les fichiers valides de chaque version. Les écritures deviennent atomiques (une écriture ratée n'est jamais visible), on peut faire des MERGE/UPDATE/DELETE et relire une version passée.",
    example: `from delta.tables import DeltaTable

cible = DeltaTable.forPath(spark, "s3://silver/clients")
(cible.alias("c")
      .merge(maj.alias("m"), "c.id = m.id")
      .whenMatchedUpdateAll()
      .whenNotMatchedInsertAll()
      .execute())

spark.read.format("delta").option("versionAsOf", 12).load("s3://silver/clients")`,
  },
  "ps-p2-2": {
    detail: "Bronze garde la donnée brute telle quelle, ce qui permet de tout rejouer. Silver nettoie et conforme (types, doublons, clés communes). Gold expose des tables prêtes à l'emploi pour la BI et la data science. En cas de bug dans une règle, on corrige le code et on reconstruit silver et gold depuis bronze.",
    example: `bronze = spark.read.json("s3://landing/commandes/2025-03-02/")
bronze.withColumn("_charge_le", F.current_timestamp()) \\
      .write.mode("append").format("delta").save("s3://bronze/commandes")

silver = (spark.read.format("delta").load("s3://bronze/commandes")
          .dropDuplicates(["id"]).filter("montant IS NOT NULL"))
gold = silver.groupBy("date", "pays").agg(F.sum("montant").alias("ca"))`,
  },
};
