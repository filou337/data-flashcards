// Explications et exemples ajoutés aux cartes Scala.
export const extrasScala = {
  "sc-f1-1": {
    detail: "Une val ne peut pas être réaffectée, ce qui rend le code plus facile à suivre (la valeur ne change jamais après sa définition) et sûr en parallèle. On utilise var surtout pour un compteur local ou un accumulateur, et encore : map, filter et foldLeft évitent souvent d'en avoir besoin.",
    example: `val taux = 0.2
// taux = 0.3        // erreur de compilation : reassignment to val

var total = 0
for (x <- List(1, 2, 3)) total += x   // possible mais impératif

val total2 = List(1, 2, 3).sum        // idiomatique : 6`,
  },
  "sc-f1-2": {
    detail: "En Scala comme en Spark, on ne modifie pas une donnée : on en dérive une nouvelle. Un DataFrame filtré est un nouveau DataFrame ; l'original existe toujours. Cette immuabilité permet à Spark de recalculer une partition perdue à partir de son lignage.",
    example: `val prix  = List(10, 20, 30)
val ttc   = prix.map(_ * 1.2)        // nouvelle liste ; prix est inchangé

val ventes = spark.read.parquet("ventes")
val fr     = ventes.filter($"pays" === "FR")   // nouveau DataFrame
// ventes contient toujours tous les pays`,
  },
  "sc-f2-1": {
    detail: "Une fonction curryfiée prend ses arguments par groupes. Intérêt : on peut fournir le premier groupe et obtenir une fonction spécialisée, réutilisable. En Spark, c'est le principe des transformations paramétrées passées à .transform().",
    example: `def appliquerRemise(taux: Double)(prix: Double): Double = prix * (1 - taux)

val soldes   = appliquerRemise(0.3) _       // fonction Double => Double
soldes(100)                                // 70.0
List(100.0, 50.0).map(appliquerRemise(0.1)) // List(90.0, 45.0)

// Avec Spark :
def filtrerPays(pays: String)(df: DataFrame): DataFrame = df.filter($"pays" === pays)
ventes.transform(filtrerPays("FR"))`,
  },
  "sc-f2-2": {
    detail: "Une fonction anonyme (lambda) est une valeur : on peut la passer à map, filter, sortBy… La syntaxe abrégée _ remplace un paramètre utilisé une seule fois. Les fonctions sont « de première classe » : on peut les stocker dans une val et les renvoyer.",
    example: `val doubler = (x: Int) => x * 2
List(1, 2, 3).map(doubler)            // List(2, 4, 6)
List(1, 2, 3).map(x => x * 2)         // idem
List(1, 2, 3).map(_ * 2)              // idem, syntaxe courte

// Python :
// list(map(lambda x: x * 2, [1, 2, 3]))`,
  },
  "sc-f3-1": {
    detail: "Par défaut, List, Map, Set et Vector sont dans scala.collection.immutable : « ajouter » un élément renvoie une nouvelle collection qui partage l'essentiel de sa structure avec l'ancienne, donc sans recopie coûteuse. Les versions modifiables existent dans scala.collection.mutable, à importer explicitement.",
    example: `val a = List(1, 2, 3)
val b = 0 :: a                 // List(0, 1, 2, 3) ; a reste List(1, 2, 3)

val stock = Map("stylo" -> 10)
val stock2 = stock + ("cahier" -> 5)   // nouvelle Map

import scala.collection.mutable
val buf = mutable.ListBuffer(1, 2); buf += 3   // modification en place`,
  },
  "sc-f4-1": {
    detail: "match compare une valeur à des motifs, du haut vers le bas, et exécute la branche du premier motif qui correspond. Un motif peut extraire des morceaux (les champs d'une case class, la tête d'une liste), vérifier un type et ajouter une condition (garde if).",
    example: `case class Commande(id: String, montant: Double, pays: String)

def categorie(c: Commande): String = c match {
  case Commande(_, m, "FR") if m > 1000 => "gros client FR"
  case Commande(_, m, _)    if m > 1000 => "gros client"
  case Commande(_, _, "FR")             => "client FR"
  case _                                => "autre"
}

List(1, 2, 3) match { case tete :: reste => tete; case Nil => 0 }   // 1`,
  },
  "sc-f4-2": {
    detail: "Si aucun motif ne correspond, Scala lève une MatchError à l'exécution. Le compilateur avertit quand un match sur un type « scellé » (sealed) n'est pas exhaustif. Le joker _ capture tout ce qui reste, comme ELSE.",
    example: `def libelle(code: Int): String = code match {
  case 1 => "créée"
  case 2 => "payée"
  case 3 => "expédiée"
  case _ => "inconnu"      // sans cette ligne : libelle(9) -> scala.MatchError: 9
}

-- SQL : CASE statut WHEN 1 THEN 'créée' ... ELSE 'inconnu' END`,
  },
  "sc-i1-1": {
    detail: "Une case class est une classe de données : on la déclare en une ligne et le compilateur génère le reste. Deux instances avec les mêmes valeurs sont égales (comparaison par valeur, pas par référence), ce qui est essentiel pour les tests et les collections. En Spark, une case class décrit le schéma d'un Dataset.",
    example: `case class Client(id: Int, nom: String, ville: String)

val a = Client(1, "Ana", "Lyon")          // pas besoin de "new"
a.nom                                      // "Ana"
a == Client(1, "Ana", "Lyon")              // true (égalité par valeur)
println(a)                                 // Client(1,Ana,Lyon)
val Client(_, n, _) = a                    // déstructuration : n = "Ana"`,
  },
  "sc-i1-2": {
    detail: "Comme les champs d'une case class ne sont pas modifiables, on crée une copie en changeant seulement les champs voulus. L'objet d'origine reste intact : on peut donc garder l'ancienne et la nouvelle version, ce qui ressemble beaucoup à l'historisation SCD2.",
    example: `case class Client(id: Int, nom: String, ville: String)

val avant = Client(7, "Ana", "Lille")
val apres = avant.copy(ville = "Lyon")
// avant : Client(7,Ana,Lille)
// apres : Client(7,Ana,Lyon)`,
  },
  "sc-i2-1": {
    detail: "Option[T] rend l'absence explicite dans le type : une fonction qui renvoie Option[Client] dit clairement « il peut ne pas y avoir de client ». Le code appelant doit traiter les deux cas (Some, None), ce qui évite d'oublier un null. map et flatMap permettent d'enchaîner des opérations sans tester à chaque étape.",
    example: `def trouverClient(id: Int): Option[Client] = clients.find(_.id == id)

trouverClient(7) match {
  case Some(c) => s"Bonjour \${c.nom}"
  case None    => "client inconnu"
}

trouverClient(7).map(_.ville)             // Some("Lyon") ou None
Option(valeurPouvantEtreNull)             // transforme un null Java en None`,
  },
  "sc-i2-2": {
    detail: "getOrElse renvoie la valeur si elle est présente, sinon la valeur par défaut. orElse permet d'essayer une autre Option, comme COALESCE(a, b, c). On peut chaîner pour exprimer « la première valeur disponible ».",
    example: `val remise: Option[Double] = None
remise.getOrElse(0.0)                          // 0.0

val ville = adresseLivraison.orElse(adresseFacturation).getOrElse("inconnue")
// SQL : COALESCE(adresse_livraison, adresse_facturation, 'inconnue')`,
  },
  "sc-i3-1": {
    detail: "Un trait déclare des méthodes (abstraites ou avec un code par défaut) qu'on peut combiner : une classe peut « mélanger » plusieurs traits. On s'en sert pour partager un comportement transversal (journalisation, validation) entre des classes sans hiérarchie commune.",
    example: `trait Journalise {
  def log(msg: String): Unit = println(s"[\${getClass.getSimpleName}] \$msg")
}
trait Validable {
  def estValide: Boolean
}

case class Commande(id: String, montant: Double) extends Journalise with Validable {
  def estValide: Boolean = montant > 0
}
Commande("C1", 50).log("chargée")      // [Commande] chargée`,
  },
  "sc-i4-1": {
    detail: "Le compilateur réécrit un for … yield en chaîne de flatMap, map et withFilter. C'est donc une expression qui renvoie une valeur, et elle fonctionne avec tout type qui fournit ces méthodes : listes, Option, Future… Avec des Option, elle s'arrête au premier None.",
    example: `val r = for {
  x <- List(1, 2, 3)
  y <- List(10, 20)
  if x != 2
} yield x * y
// = List(1, 2, 3).withFilter(_ != 2).flatMap(x => List(10, 20).map(y => x * y))
// List(10, 20, 30, 60)

for { c <- trouverClient(7); v <- c.ville } yield v   // None si un maillon manque`,
  },
  "sc-a1-1": {
    detail: "Un DataFrame est un Dataset[Row] : le schéma n'est vérifié qu'à l'exécution. Avec un Dataset[Commande], chaque ligne est une instance de case class : une faute de frappe sur un champ ou une erreur de type est signalée par le compilateur. En contrepartie, les lambdas typées sont moins optimisables que les expressions de colonnes.",
    example: `case class Commande(id: String, montant: Double, pays: String)
import spark.implicits._

val ds = spark.read.parquet("commandes").as[Commande]
ds.filter(_.montnat > 100)        // erreur de COMPILATION : value montnat is not a member

val df = spark.read.parquet("commandes")
df.filter($"montnat" > 100)       // compile, mais AnalysisException à l'exécution`,
  },
  "sc-a2-1": {
    detail: "Une UDF Scala est du code JVM exécuté dans le même processus que les données : pas de sérialisation vers Python. Elle reste opaque pour l'optimiseur (pas de pushdown à travers elle), mais elle évite le coût principal des UDF Python. Une UDF Scala peut être enregistrée puis appelée depuis PySpark.",
    example: `import org.apache.spark.sql.functions.udf

val normaliser = udf((s: String) =>
  if (s == null) null else java.text.Normalizer
    .normalize(s.trim.toLowerCase, java.text.Normalizer.Form.NFD)
    .replaceAll("\\\\p{M}", ""))                 // supprime les accents

spark.udf.register("normaliser", normaliser)
// Utilisable en SQL ou PySpark : F.expr("normaliser(nom)")`,
  },
  "sc-a2-2": {
    detail: "Ordre de préférence : 1) les fonctions natives de Spark (optimisées, comprises par Catalyst) ; 2) une pandas UDF si on a besoin de Python ; 3) une UDF Scala si la performance est critique et qu'aucune fonction native n'existe. Beaucoup de besoins « exotiques » sont couverts par les fonctions natives (regexp_replace, transform sur les tableaux, expressions SQL).",
    example: `// Besoin : retirer les espaces et passer en majuscules
// Pas d'UDF nécessaire :
df.withColumn("code", upper(regexp_replace($"code", "\\\\s+", "")))

// Besoin : appliquer une fonction à chaque élément d'un tableau
df.withColumn("prix_ttc", expr("transform(prix, p -> p * 1.2)"))`,
  },
  "sc-a3-1": {
    detail: "Either a deux cas : Left (par convention l'erreur) et Right (le succès). Une fonction de validation renvoie Either[String, Commande] au lieu de lever une exception. On peut ensuite séparer proprement les lignes valides des rejets, et garder le motif de chaque rejet.",
    example: `def valider(l: Ligne): Either[String, Commande] =
  if (l.montant == null)      Left(s"\${l.id} : montant manquant")
  else if (l.montant < 0)     Left(s"\${l.id} : montant négatif")
  else                        Right(Commande(l.id, l.montant))

val resultats = lignes.map(valider)
val valides   = resultats.collect { case Right(c) => c }
val rejets    = resultats.collect { case Left(e)  => e }`,
  },
  "sc-a3-2": {
    detail: "Le principe commun : une valeur invalide ne doit pas arrêter tout le traitement ; on la convertit en une valeur « signalée » (NULL, valeur de repli, Left) qu'on peut ensuite compter et isoler dans une table de rejets. Ce qui compte est de ne jamais perdre ces lignes en silence.",
    example: `-- SQL
SELECT id, TRY_CAST(montant AS DECIMAL(10,2)) AS montant FROM brut;

// M
each try Number.From([Montant]) otherwise null

// Scala
Try(montant.toDouble).toEither.left.map(e => s"\$id : \${e.getMessage}")`,
  },
  "sc-a4-1": {
    detail: "Un Encoder sait convertir un objet Scala (case class, tuple, type simple) vers le format binaire interne de Spark et inversement. import spark.implicits._ fournit ces encoders automatiquement, ainsi que la syntaxe $\"colonne\" et .toDF / .toDS sur les collections locales.",
    example: `import spark.implicits._

case class Vente(produit: String, qte: Int)
val ds = Seq(Vente("stylo", 2), Vente("cahier", 1)).toDS()   // Dataset[Vente]
val df = ds.toDF()                                           // DataFrame
val ds2 = df.as[Vente]                                       // retour au typé

// Sans l'import : "Unable to find encoder for type Vente"`,
  },
  "sc-p1-1": {
    detail: "Une erreur dans un exécuteur remonte à travers plusieurs couches (tâche, stage, job, puis Py4J vers Python). Chaque couche enveloppe l'erreur précédente avec son propre message. La cause racine, celle qui dit vraiment ce qui s'est passé, est la plus profonde : le dernier « Caused by ».",
    example: `py4j.protocol.Py4JJavaError: An error occurred while calling o123.save.
: org.apache.spark.SparkException: Job aborted due to stage failure: Task 3 in stage 7.0 failed 4 times...
  ...
Caused by: org.apache.spark.SparkException: Failed to execute user defined function
  ...
Caused by: java.lang.NumberFormatException: For input string: "12,5"
-> la vraie cause : une virgule décimale dans une colonne convertie en nombre.`,
  },
  "sc-p1-2": {
    detail: "Un OutOfMemoryError sur UN exécuteur alors que les autres vont bien indique souvent qu'une tâche reçoit trop de données : clé déséquilibrée, broadcast d'une table trop grosse, collect() d'un gros résultat sur le driver. Doubler la mémoire peut masquer le problème jusqu'à ce que les données grossissent encore.",
    example: `java.lang.OutOfMemoryError: Java heap space   (exécuteur 14, stage 8)
Diagnostic dans la Spark UI : tâche max 38 Go de Shuffle Read, médiane 45 Mo
-> data skew sur client_id = NULL

Correctif : traiter les NULL à part, activer spark.sql.adaptive.skewJoin.enabled,
plutôt que spark.executor.memory=64g.`,
  },
  "sc-p2-1": {
    detail: "En PySpark, ton code Python ne manipule pas les données : il pilote, via Py4J, des objets qui vivent dans la JVM du driver. Les données restent dans les exécuteurs JVM. Elles ne passent par Python que si on le demande : UDF Python, collect(), toPandas().",
    example: `df = spark.read.parquet("ventes")          # objet Python qui référence un DataFrame JVM
df.groupBy("pays").count().show()         # tout se passe dans la JVM

df.toPandas()                             # données JVM -> driver Python (attention au volume)
df.withColumn("x", mon_udf_python("y"))   # chaque ligne va vers un processus Python`,
  },
  "sc-p2-2": {
    detail: "Apache Arrow est un format de données en colonnes, partagé par la JVM et Python : un lot de milliers de lignes est transféré d'un bloc, sans conversion valeur par valeur. Il accélère les pandas UDF, et aussi toPandas() / createDataFrame(pandas) quand l'option Arrow est activée.",
    example: `spark.conf.set("spark.sql.execution.arrow.pyspark.enabled", "true")

pdf = df.limit(1_000_000).toPandas()     # transfert via Arrow : bien plus rapide
sdf = spark.createDataFrame(pdf)         # idem dans l'autre sens`,
  },
};
