// Cartes ajoutées au deck Scala par le skill /notes-de-cours
// (cours « Scala by Example », M. Odersky ; note : data/notes/scala-par-exemple.js).
export const cardsScalaParExemple = [
  {
    id: "sbe-f1-1", langue: "scala", niveau: "fondamentaux", type: "flip",
    front: "En Scala, `if` est-il une instruction ou une expression ? Quelle conséquence ?",
    back: "Une expression : elle renvoie une valeur, comme CASE WHEN en SQL. On écrit `val signe = if (x >= 0) \"positif\" else \"négatif\"` : pas besoin d'opérateur ternaire ni de variable modifiée dans chaque branche.",
  },
  {
    id: "sbe-f1-2", langue: "scala", niveau: "fondamentaux", type: "flip",
    front: "Appel par valeur vs appel par nom : quelle différence ?",
    back: "Par valeur (défaut, `x: Int`) : l'argument est calculé une fois, avant l'appel. Par nom (`x: => Int`) : il est recalculé à chaque utilisation dans le corps, et jamais s'il n'est pas utilisé.",
    example: "def loop: Int = loop\ndef constOne(x: Int, y: => Int) = 1\nconstOne(1, loop)   // 1 : y n'est jamais évalué\nconstOne(loop, 2)   // boucle infinie : x est évalué avant l'appel",
  },
  {
    id: "sbe-f1-3", langue: "scala", niveau: "fondamentaux", type: "flip",
    front: "Qu'est-ce qu'une récursion terminale et pourquoi est-ce important ?",
    back: "L'appel récursif est la dernière opération de la fonction : rien ne reste à faire après son retour. Le compilateur la transforme en boucle et réutilise le même cadre de pile. Sinon, chaque appel empile un cadre et une grande entrée provoque un StackOverflowError.",
    example: "def pgcd(a: Int, b: Int): Int = if (b == 0) a else pgcd(b, a % b)   // terminale\ndef fact(n: Int): Int = if (n == 0) 1 else n * fact(n - 1)        // non terminale : n * … attend le retour",
  },
  {
    id: "sbe-f1-4", langue: "scala", niveau: "fondamentaux", type: "flip",
    front: "Que représente le type `Int => Int` ?",
    back: "Le type des fonctions qui prennent un Int et renvoient un Int. Les fonctions sont des valeurs : on peut les passer en paramètre (`def sum(f: Int => Int, a: Int, b: Int)`), les renvoyer et les stocker dans une val.",
    example: "def sum(f: Int => Int, a: Int, b: Int): Int = if (a > b) 0 else f(a) + sum(f, a + 1, b)\nsum(x => x * x * x, 1, 3)   // 36",
  },
  {
    id: "sbe-f1-5", langue: "scala", niveau: "fondamentaux", type: "flip",
    front: "À quoi sert un `object` en Scala ?",
    back: "C'est un singleton : une classe avec une seule instance, créée au premier accès. Il remplace les membres static de Java, sert de point d'entrée d'un programme (main) et d'objet compagnon d'une classe (méthodes de fabrique, constantes).",
  },
  {
    id: "sbe-f1-6", langue: "scala", niveau: "fondamentaux", type: "qcm",
    front: "Que vaut `List(1, 2, 3).foldLeft(0)(_ - _)` ?",
    choices: ["6", "2", "-6", "0"],
    answer: 2,
    explain: "foldLeft combine de gauche à droite à partir de 0 : ((0 − 1) − 2) − 3 = −6. foldRight donnerait 1 − (2 − (3 − 0)) = 2. Les deux ne coïncident que pour une opération associative.",
  },
  {
    id: "sbe-f1-7", langue: "scala", niveau: "fondamentaux", type: "flip",
    front: "Comment est construite une `List` en Scala, et quel est le coût des opérations courantes ?",
    back: "Une liste est soit Nil (vide), soit une cellule tête :: queue. `List(1, 2, 3)` vaut `1 :: 2 :: 3 :: Nil`. Ajouter en tête est en O(1) (aucune copie), mais accéder au n-ième élément ou ajouter en fin est en O(n). Pour un accès indexé fréquent, préférer Vector.",
  },
  {
    id: "sbe-i1-1", langue: "scala", niveau: "intermediaire", type: "code",
    front: "Cette factorielle plante sur de grandes valeurs. Rends-la récursive terminale et fais vérifier ce point par le compilateur.",
    code: "def fact(n: Int): BigInt = if (n == 0) 1 else n * fact(n - 1)",
    back: "import scala.annotation.tailrec\n\ndef fact(n: Int): BigInt = {\n  @tailrec\n  def boucle(n: Int, acc: BigInt): BigInt =\n    if (n == 0) acc else boucle(n - 1, acc * n)\n  boucle(n, 1)\n}\nL'accumulateur porte le résultat partiel ; @tailrec fait échouer la compilation si l'appel n'est pas en position terminale.",
  },
  {
    id: "sbe-i1-2", langue: "scala", niveau: "intermediaire", type: "flip",
    front: "Comment l'appel par nom permet-il d'écrire ses propres structures de contrôle ?",
    back: "Un paramètre `=> T` reçoit un bloc de code non évalué, que la fonction exécute quand elle le décide. On peut ainsi écrire chrono { … }, retry(3) { … } ou unless(cond) { … } qui se lisent comme des mots du langage.",
    example: "def chrono[T](bloc: => T): T = {\n  val t0 = System.nanoTime(); val r = bloc\n  println((System.nanoTime() - t0) / 1e6 + \" ms\"); r\n}\nchrono { (1 to 1000000).sum }",
  },
  {
    id: "sbe-i1-3", langue: "scala", niveau: "intermediaire", type: "flip",
    front: "Pourquoi trouver √x comme point fixe de `y => x / y` ne marche-t-il pas directement, et comment le corriger ?",
    back: "L'itération oscille sans converger : pour x = 2, y passe de 1 à 2, puis 1, puis 2… On amortit en prenant la moyenne de y et de f(y) : y => (y + x / y) / 2, qui converge vite vers √2 ≈ 1.41421.",
  },
  {
    id: "sbe-i1-4", langue: "scala", niveau: "intermediaire", type: "flip",
    front: "Que signifient les bornes de type `A <: T` et `B >: A` ?",
    back: "`A <: T` (borne supérieure) : A doit être un sous-type de T, par exemple des éléments comparables (`A <: Ordered[A]`). `B >: A` (borne inférieure) : B doit être un super-type de A ; c'est ce qui permet d'ajouter un Animal à une List[Chat] et d'obtenir une List[Animal] (`def prepend[B >: A](x: B): List[B]`).",
  },
  {
    id: "sbe-i1-5", langue: "scala", niveau: "intermediaire", type: "qcm",
    front: "Si Chat est un sous-type d'Animal, laquelle de ces affirmations est vraie en Scala ?",
    choices: [
      "Array[Chat] est un sous-type d'Array[Animal]",
      "List[Chat] est un sous-type de List[Animal], car List est covariante (List[+A])",
      "List[Animal] est un sous-type de List[Chat]",
      "Aucun type générique ne peut hériter du sous-typage de son paramètre",
    ],
    answer: 1,
    explain: "List est immuable et déclarée covariante (+A). Array est modifiable donc invariant : sinon on pourrait ranger un Chien dans un tableau de Chats via une référence Array[Animal].",
  },
  {
    id: "sbe-i1-6", langue: "scala", niveau: "intermediaire", type: "flip",
    front: "Pourquoi le type d'une fonction `A => B` est-il contravariant en A et covariant en B ?",
    back: "Une fonction qui accepte n'importe quel Animal peut remplacer une fonction qui accepte seulement des Chats (elle accepte plus) : contravariance de l'entrée. Une fonction qui renvoie un Chat peut remplacer une fonction qui renvoie un Animal (elle promet plus) : covariance de la sortie. D'où Function1[-A, +B].",
  },
  {
    id: "sbe-i1-7", langue: "scala", niveau: "intermediaire", type: "code",
    front: "Complète la fusion du tri par fusion.",
    code: "def fusion(a: List[Int], b: List[Int]): List[Int] = (a, b) match {\n  case (Nil, _) => b\n  case (_, Nil) => a\n  case (x :: xs1, y :: ys1) => ???\n}",
    back: "if (x <= y) x :: fusion(xs1, b) else y :: fusion(a, ys1)\n\nOn prend la plus petite des deux têtes et on fusionne le reste. Avec msort(gauche) et msort(droite) sur les deux moitiés (splitAt), le tri est en O(n log n) : List(5, 3, 8, 1, 4, 2) → List(1, 2, 3, 4, 5, 8).",
  },
  {
    id: "sbe-i1-8", langue: "scala", niveau: "intermediaire", type: "flip",
    front: "map, flatMap, filter, zip sur `List(1, 2, 3)` : que renvoient-ils ?",
    back: "map(_ * 10) → List(10, 20, 30)\nfilter(_ > 1) → List(2, 3)\nflatMap(x => List(x, x)) → List(1, 1, 2, 2, 3, 3)\nzip(List(\"a\", \"b\")) → List((1, a), (2, b)), la liste la plus courte fixe la longueur.",
  },
  {
    id: "sbe-i1-9", langue: "scala", niveau: "intermediaire", type: "flip",
    front: "Pourquoi `Nil` peut-il être utilisé comme une List[Int] aussi bien qu'une List[String] ?",
    back: "Nil est de type List[Nothing]. Nothing est un sous-type de tous les types, et List est covariante : List[Nothing] est donc un sous-type de List[Int], de List[String], etc. Même raison pour laquelle `throw` peut apparaître dans n'importe quelle branche d'un if.",
  },
  {
    id: "sbe-a1-1", langue: "scala", niveau: "avance", type: "flip",
    front: "Stream / LazyList : qu'est-ce que c'est et à quoi ça sert ?",
    back: "Une liste dont les éléments ne sont calculés qu'au moment où on les demande, puis mémorisés. On peut décrire une suite infinie et n'en prendre que le début. Stream est déprécié depuis Scala 2.13 au profit de LazyList (construite avec #::).",
    example: "def depuis(n: Int): LazyList[Int] = n #:: depuis(n + 1)\ndef premiers(s: LazyList[Int]): LazyList[Int] =\n  s.head #:: premiers(s.tail.filter(_ % s.head != 0))\npremiers(depuis(2)).take(6).toList   // List(2, 3, 5, 7, 11, 13)",
  },
  {
    id: "sbe-a1-2", langue: "scala", niveau: "avance", type: "flip",
    front: "Itérateur, LazyList, lazy val : quelle différence ?",
    back: "Un itérateur est un curseur (hasNext / next) consommé une seule fois : idéal pour lire un gros fichier ligne par ligne. Une LazyList calcule ses éléments à la demande et les mémorise : on peut la relire. Une lazy val est une valeur calculée au premier accès puis gardée : utile pour une initialisation coûteuse et parfois inutile.",
  },
  {
    id: "sbe-a1-3", langue: "scala", niveau: "avance", type: "code",
    front: "Pourquoi le second total vaut-il 0 ?",
    code: "val lignes = scala.io.Source.fromFile(\"ventes.csv\").getLines()\nval total1 = lignes.map(_.length).sum\nval total2 = lignes.map(_.length).sum   // 0 !",
    back: "getLines() renvoie un Iterator, consommé par le premier parcours : il est épuisé. Pour parcourir deux fois, matérialiser (`.toList` si le fichier tient en mémoire) ou rouvrir la source.",
  },
  {
    id: "sbe-a1-4", langue: "scala", niveau: "avance", type: "flip",
    front: "Qu'est-ce qu'un paramètre implicite, et comment s'écrit-il en Scala 3 ?",
    back: "Un paramètre que le compilateur remplit automatiquement avec une valeur du bon type marquée implicit dans la portée (un ordre de tri, une configuration, un encodeur). Scala 2 : `(implicit ord: Ordering[A])` et `implicit val`. Scala 3 : `(using ord: Ordering[A])` et `given Ordering[A] = …`.",
    example: "def maximum[A](xs: List[A])(using ord: Ordering[A]): A = xs.reduceLeft(ord.max)\nmaximum(List(3, 9, 4))   // 9",
  },
  {
    id: "sbe-a1-5", langue: "scala", niveau: "avance", type: "qcm",
    front: "Pourquoi un tableau modifiable (Array) est-il invariant en Scala ?",
    choices: [
      "Pour des raisons de performance uniquement",
      "Parce que s'il était covariant, on pourrait écrire un Chien dans un Array[Chat] via une référence Array[Animal], ce qui casserait la sûreté des types",
      "Parce que la JVM ne supporte pas les génériques",
      "Il est covariant comme List",
    ],
    answer: 1,
    explain: "Un type qu'on peut à la fois lire et écrire doit être invariant. Java a fait le choix inverse pour ses tableaux, ce qui provoque des ArrayStoreException à l'exécution ; Scala le refuse dès la compilation.",
  },
  {
    id: "sbe-p1-1", langue: "scala", niveau: "pro", type: "flip",
    front: "Le livre utilise des conversions implicites et des acteurs de la bibliothèque standard. Que deviennent-ils en Scala moderne ?",
    back: "Les conversions implicites sont découragées (difficiles à lire) : en Scala 3, elles demandent un import explicite et on leur préfère les méthodes d'extension ; les bornes vues (A <% B) sont supprimées. Les acteurs de la bibliothèque standard ont été retirés : on utilise Akka ou Apache Pekko, et scala.concurrent.Future pour le parallélisme simple.",
  },
  {
    id: "sbe-p1-2", langue: "scala", niveau: "pro", type: "flip",
    front: "Quel lien entre l'évaluation paresseuse de Scala et le fonctionnement de Spark ?",
    back: "Spark applique la même idée que LazyList : les transformations (map, filter, join) construisent un plan sans rien calculer ; seule une action (count, write, collect) déclenche le calcul, ce qui permet à Spark d'optimiser l'ensemble du plan. L'API RDD est d'ailleurs calquée sur les collections Scala (map, flatMap, filter, reduce, fold).",
  },
];
