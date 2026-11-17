// Note de cours générée par le skill /notes-de-cours à partir de docs_divers/ScalaByExample-fr_FR.pdf
export const note = {
  id: "scala-par-exemple",
  titre: "Scala par l'exemple",
  source: "Scala by Example · Martin Odersky, traduction française · 101 pages (Scala 2)",
  deck: "scala",
  resume: "Le livre du créateur de Scala, qui apprend le langage par des exemples : évaluation des expressions, récursion, fonctions d'ordre supérieur, classes, généricité et variance, listes, évaluation paresseuse, implicites et concurrence.\n\nCette note garde ce qui complète ton deck Scala ; les bases déjà connues (val/var, lambdas, currification, case classes, pattern matching, Option, traits, for-comprehensions) sont des renvois. Le livre date de Scala 2 : les évolutions de Scala 3 sont signalées.",
  prerequis: ["scala"],
  concepts: [
    "style impératif vs fonctionnel", "tri rapide", "modèle de substitution", "appel par valeur", "appel par nom", "paramètre => T", "expression conditionnelle",
    "méthode de Newton", "fonctions imbriquées", "récursion terminale", "@tailrec", "pile d'appels", "fonction d'ordre supérieur", "type fonction A => B",
    "point fixe", "amortissement", "classe", "constructeur", "require", "méthode-opérateur", "override", "object singleton", "classe abstraite", "hiérarchie Any/AnyRef/Nothing",
    "type générique", "borne supérieure <:", "borne inférieure >:", "variance", "covariance +A", "contravariance -A", "invariance", "Nothing", "tuple",
    "List", "cons ::", "Nil", "head", "tail", "tri par insertion", "tri par fusion", "map", "filter", "flatMap", "foldLeft", "foldRight", "reduceLeft", "zip",
    "N reines", "objets avec état", "flux paresseux Stream / LazyList", "itérateur", "lazy val", "paramètre implicite", "conversion implicite", "given / using", "inférence de type Hindley-Milner", "Future", "acteur",
  ],
  chapitres: [
    {
      id: "styles",
      titre: "1. Deux façons d'écrire le même programme",
      objectif: "Voir pourquoi Scala permet à la fois le style impératif et le style fonctionnel.",
      blocs: [
        { type: "texte", contenu: "Le livre ouvre sur le **tri rapide** écrit deux fois. La version impérative ressemble à du Java (tableau modifié en place, boucles `while`, `var`). La version fonctionnelle décrit le résultat : choisir un pivot, trier ce qui est plus petit, garder ce qui est égal, trier ce qui est plus grand, et concaténer." },
        { type: "exemple", titre: "Tri rapide, version fonctionnelle", code: `def sort(xs: Array[Int]): Array[Int] =
  if (xs.length <= 1) xs
  else {
    val pivot = xs(xs.length / 2)
    Array.concat(
      sort(xs filter (pivot > _)),
      xs filter (pivot == _),
      sort(xs filter (pivot < _)))
  }

sort(Array(5, 3, 8, 1, 4))   // Array(1, 3, 4, 5, 8)` },
        { type: "liste", items: [
          "Le **type** se place après le nom : `xs: Array[Int]`, et peut souvent être omis (inféré).",
          "`def` définit une fonction, `val` une valeur, `var` une variable.",
          "Les fonctions peuvent être **imbriquées** et voir les paramètres de la fonction englobante.",
          "`xs filter (pivot > _)` est un appel de méthode écrit en notation infixe : `xs.filter(x => pivot > x)`.",
        ] },
        { type: "attention", contenu: "La version fonctionnelle est plus lisible mais crée de nouveaux tableaux à chaque appel : plus de mémoire que le tri en place. Le choix du style est un compromis entre clarté et performance, que Scala laisse ouvert." },
        { type: "renvoi", vers: "scala", contenu: "val vs var, immuabilité, fonctions anonymes : voir les cartes « Fondamentaux » du deck Scala." },
      ],
    },
    {
      id: "evaluation",
      titre: "2. Comment Scala évalue une expression",
      objectif: "Savoir quand un argument est calculé : avant l'appel ou à chaque utilisation.",
      blocs: [
        { type: "texte", contenu: "Le **modèle de substitution** décrit l'évaluation : on remplace chaque nom par sa définition et chaque appel de fonction par son corps, où les paramètres sont remplacés par les arguments, jusqu'à obtenir une valeur." },
        { type: "exemple", titre: "Réécriture pas à pas", code: `def carre(x: Double) = x * x
def sommeDesCarres(x: Double, y: Double) = carre(x) + carre(y)

sommeDesCarres(3, 2 + 2)
→ sommeDesCarres(3, 4)        // appel par valeur : l'argument est calculé d'abord
→ carre(3) + carre(4)
→ 3 * 3 + carre(4)
→ 9 + 16
→ 25` },
        { type: "tableau", entetes: ["", "Appel par valeur (défaut)", "Appel par nom (`y: => T`)"], lignes: [
          ["Quand l'argument est calculé", "Une fois, **avant** l'appel", "À **chaque** utilisation dans le corps, jamais s'il n'est pas utilisé"],
          ["Avantage", "Pas de calcul répété", "Évite un calcul inutile ou infini"],
          ["Syntaxe", "`def f(x: Int)`", "`def f(x: => Int)`"],
        ] },
        { type: "exemple", titre: "Une boucle infinie évitée par l'appel par nom", code: `def loop: Int = loop                     // ne termine jamais

def constOne(x: Int, y: => Int) = 1      // y passé par nom

constOne(1, loop)    // 1 : y n'est jamais utilisé, donc jamais calculé
constOne(loop, 2)    // boucle infinie : x est passé par valeur` },
        { type: "application", titre: "Écrire sa propre structure de contrôle", contenu: "Grâce à l'appel par nom, on peut écrire des fonctions qui se comportent comme des mots du langage, par exemple une mesure de durée :", code: `def chrono[T](bloc: => T): T = {
  val debut = System.nanoTime()
  val resultat = bloc                       // le bloc n'est exécuté qu'ici
  println(s"\${(System.nanoTime() - debut) / 1e6} ms")
  resultat
}

chrono { (1 to 1000000).sum }` },
        { type: "texte", contenu: "En Scala, `if` est une **expression** qui renvoie une valeur (comme `CASE WHEN` en SQL) : `def abs(x: Double) = if (x >= 0) x else -x`. Il n'y a donc pas besoin de l'opérateur ternaire `? :`." },
      ],
    },
    {
      id: "recursion",
      titre: "3. Récursion et récursion terminale",
      objectif: "Écrire des boucles sans variable mutable, sans faire exploser la pile.",
      blocs: [
        { type: "exemple", titre: "Racine carrée par la méthode de Newton", contenu: "On améliore une estimation jusqu'à ce qu'elle soit assez bonne. Les fonctions auxiliaires sont **imbriquées** : elles voient `x` sans le recevoir en paramètre.", code: `def sqrt(x: Double): Double = {
  def assezBon(g: Double) = math.abs(g * g - x) < 0.001
  def ameliore(g: Double) = (g + x / g) / 2
  def iter(g: Double): Double = if (assezBon(g)) g else iter(ameliore(g))
  iter(1.0)
}
sqrt(2)`, resultat: "Estimations : 1.0 → 1.5 → 1.4166666666666665 → 1.4142156862745097 (écart au carré < 0,001)" },
        { type: "definition", terme: "Récursion terminale", contenu: "L'appel récursif est la **dernière** opération de la fonction : il n'y a plus rien à faire après son retour. Le compilateur peut alors réutiliser le même cadre de pile, comme une boucle. Sinon, chaque appel empile un cadre et une récursion profonde provoque un `StackOverflowError`." },
        { type: "schema", svg: `<svg viewBox="0 0 360 222" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pile d'appels : factorielle vs PGCD">
  <text x="6" y="16" class="s-bold">fact(4) : non terminale</text>
  <rect x="6" y="26" width="168" height="26" rx="4" class="s-warn"/><text x="14" y="44" class="s-txt">4 * fact(3)</text>
  <rect x="16" y="56" width="158" height="26" rx="4" class="s-warn"/><text x="24" y="74" class="s-txt">3 * fact(2)</text>
  <rect x="26" y="86" width="148" height="26" rx="4" class="s-warn"/><text x="34" y="104" class="s-txt">2 * fact(1)</text>
  <rect x="36" y="116" width="138" height="26" rx="4" class="s-warn"/><text x="44" y="134" class="s-txt">1 * fact(0)</text>
  <text x="6" y="164" class="s-sub">la pile grandit avec n,</text>
  <text x="6" y="180" class="s-sub">la multiplication attend le retour</text>
  <text x="190" y="16" class="s-bold">pgcd(14, 21) : terminale</text>
  <rect x="190" y="26" width="164" height="26" rx="4" class="s-ok"/><text x="198" y="44" class="s-txt">pgcd(14, 21)</text>
  <text x="198" y="70" class="s-sub">↓ remplacé par</text>
  <rect x="190" y="78" width="164" height="26" rx="4" class="s-ok"/><text x="198" y="96" class="s-txt">pgcd(21, 14)</text>
  <text x="198" y="122" class="s-sub">↓ remplacé par</text>
  <rect x="190" y="130" width="164" height="26" rx="4" class="s-ok"/><text x="198" y="148" class="s-txt">pgcd(14, 7) → pgcd(7, 0)</text>
  <text x="190" y="180" class="s-sub">un seul cadre réutilisé : 7</text>
  <text x="6" y="212" class="s-sub">Gauche : 4 cadres empilés. Droite : comme une boucle.</text>
</svg>`, legende: "Une récursion non terminale empile un cadre par appel ; une récursion terminale se transforme en boucle." },
        { type: "exemple", titre: "Rendre factorielle terminale avec un accumulateur", code: `import scala.annotation.tailrec

def factorielle(n: Int): BigInt = {
  @tailrec
  def boucle(n: Int, acc: BigInt): BigInt =
    if (n == 0) acc else boucle(n - 1, acc * n)   // l'appel est la dernière opération
  boucle(n, 1)
}
factorielle(20)   // 2432902008176640000` },
        { type: "attention", contenu: "Précision : l'annotation `@tailrec` (absente du livre) fait échouer la **compilation** si la fonction n'est pas réellement terminale. Sans elle, une récursion qu'on croyait terminale peut planter en production sur une grande entrée." },
      ],
    },
    {
      id: "ordre-superieur",
      titre: "4. Fonctions d'ordre supérieur",
      objectif: "Factoriser un schéma de calcul en passant des fonctions en paramètre.",
      blocs: [
        { type: "texte", contenu: "Une fonction d'**ordre supérieur** prend une fonction en paramètre ou en renvoie une. Le livre part de trois fonctions presque identiques (somme des entiers, des carrés, des puissances de 2 entre a et b) et en extrait le schéma commun." },
        { type: "exemple", titre: "Une seule fonction de somme", code: `def sum(f: Int => Int, a: Int, b: Int): Int =
  if (a > b) 0 else f(a) + sum(f, a + 1, b)

sum(x => x, 1, 10)          // 55   somme des entiers
sum(x => x * x * x, 1, 3)   // 36   somme des cubes : 1 + 8 + 27` },
        { type: "texte", contenu: "`Int => Int` est le **type** des fonctions d'un entier vers un entier. Avec la currification, `sum` peut renvoyer une fonction : `def sum(f: Int => Int)(a: Int, b: Int): Int`, puis `val sommeCubes = sum(x => x * x * x) _`." },
        { type: "renvoi", vers: "scala", contenu: "La currification et les fonctions anonymes sont déjà dans le deck Scala (cartes sur `def f(x)(y)` et `x => x * 2`)." },
        { type: "definition", terme: "Point fixe", contenu: "Un point fixe de f est un x tel que f(x) = x. On le trouve en itérant x, f(x), f(f(x))… jusqu'à ce que deux valeurs successives soient assez proches." },
        { type: "exemple", titre: "La racine carrée comme point fixe", contenu: "√x est un point fixe de `y => x / y`, mais l'itération oscille (1, 2, 1, 2… pour x = 2). On **amortit** en prenant la moyenne de y et de f(y) :", code: `def fixedPoint(f: Double => Double)(first: Double): Double = {
  def proche(a: Double, b: Double) = math.abs((a - b) / a) < 0.0001
  def iter(g: Double): Double = { val n = f(g); if (proche(g, n)) n else iter(n) }
  iter(first)
}
def amortir(f: Double => Double)(x: Double) = (x + f(x)) / 2

def sqrt(x: Double) = fixedPoint(amortir(y => x / y))(1.0)
sqrt(2)   // 1.4142135623746899` },
        { type: "application", titre: "En data engineering", contenu: "C'est exactement ce qu'on fait avec Spark : `map`, `filter` et `reduce` sont des fonctions d'ordre supérieur auxquelles on passe la logique métier sous forme de fonction." },
      ],
    },
    {
      id: "classes",
      titre: "5. Classes, objets et hiérarchie des types",
      objectif: "Écrire une classe immuable avec validation et opérateurs.",
      blocs: [
        { type: "exemple", titre: "Les nombres rationnels du livre", code: `class Rational(n: Int, d: Int) {
  require(d != 0, "dénominateur nul")             // précondition : lève une exception
  private def pgcd(a: Int, b: Int): Int = if (b == 0) a else pgcd(b, a % b)
  private val g = pgcd(n.abs, d.abs)
  val numer = n / g
  val denom = d / g

  def +(that: Rational) =
    new Rational(numer * that.denom + that.numer * denom, denom * that.denom)
  def *(that: Rational) = new Rational(numer * that.numer, denom * that.denom)
  override def toString = s"$numer/$denom"
}

val x = new Rational(1, 3)
val y = new Rational(5, 7)
x + y    // 22/21
x * y    // 5/21` },
        { type: "liste", items: [
          "Les paramètres de classe (`n`, `d`) forment le **constructeur principal**.",
          "`+` et `*` sont des **méthodes** comme les autres : `x + y` s'écrit aussi `x.+(y)`.",
          "`override` est obligatoire pour redéfinir une méthode héritée (`toString`).",
          "`require` vérifie une précondition à la construction.",
        ] },
        { type: "definition", terme: "object", contenu: "Un **singleton** : une classe qui n'a qu'une seule instance, créée au premier accès. Il remplace les membres `static` de Java et sert de point d'entrée (`object Main { def main(args: Array[String]) = … }`) ou de « compagnon » d'une classe (fabriques)." },
        { type: "texte", contenu: "Hiérarchie : tout hérite de **Any** ; `AnyVal` regroupe les types valeur (Int, Double, Boolean…), `AnyRef` les types référence (équivalent de `Object` en Java). **Nothing** est sous-type de tout : c'est le type d'une exception levée ou d'une liste vide `Nil`, ce qui permet de la placer partout." },
        { type: "renvoi", vers: "scala", contenu: "Case classes, `copy`, traits et pattern matching : deck Scala." },
      ],
    },
    {
      id: "genericite",
      titre: "6. Généricité, bornes et variance",
      objectif: "Comprendre ce que signifient `List[+A]`, `<:` et `>:`.",
      blocs: [
        { type: "texte", contenu: "Une classe ou une méthode **générique** prend des types en paramètre : `class Pile[A]`, `def premier[A](xs: List[A]): A`. On peut contraindre ce paramètre :" },
        { type: "tableau", entetes: ["Notation", "Signification", "Exemple"], lignes: [
          ["`A <: T`", "Borne supérieure : A est un sous-type de T", "`def max[A <: Ordered[A]](xs: List[A])` : les éléments savent se comparer"],
          ["`B >: A`", "Borne inférieure : B est un super-type de A", "`def prepend[B >: A](x: B): List[B]` : ajouter un Animal à une liste de Chats donne une liste d'Animaux"],
        ] },
        { type: "definition", terme: "Variance", contenu: "Elle dit comment le sous-typage d'un paramètre se propage au type générique. Si `Chat <: Animal` : **covariant** `+A` ⇒ `List[Chat] <: List[Animal]` ; **contravariant** `-A` ⇒ `Traiteur[Animal] <: Traiteur[Chat]` ; **invariant** (par défaut) ⇒ aucune relation." },
        { type: "schema", svg: `<svg viewBox="0 0 360 214" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Covariance et contravariance">
  <defs><marker id="fl-sc-var" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="s-arrow"/></marker></defs>
  <text x="6" y="16" class="s-sub">flèche = « est un sous-type de »</text>
  <rect x="122" y="26" width="116" height="30" rx="6" class="s-acc"/><text x="180" y="46" text-anchor="middle" class="s-bold">Chat → Animal</text>
  <rect x="6" y="80" width="168" height="74" rx="8" class="s-ok"/>
  <text x="90" y="100" text-anchor="middle" class="s-bold">Covariant +A</text>
  <text x="90" y="120" text-anchor="middle" class="s-txt">List[Chat] →</text>
  <text x="90" y="138" text-anchor="middle" class="s-txt">List[Animal]</text>
  <rect x="186" y="80" width="168" height="74" rx="8" class="s-warn"/>
  <text x="270" y="100" text-anchor="middle" class="s-bold">Contravariant -A</text>
  <text x="270" y="120" text-anchor="middle" class="s-txt">Soigneur[Animal] →</text>
  <text x="270" y="138" text-anchor="middle" class="s-txt">Soigneur[Chat]</text>
  <path d="M150 56L110 76" class="s-line" marker-end="url(#fl-sc-var)"/>
  <path d="M210 56L250 76" class="s-line" marker-end="url(#fl-sc-var)"/>
  <text x="90" y="178" text-anchor="middle" class="s-sub">même sens : on lit des A</text>
  <text x="270" y="178" text-anchor="middle" class="s-sub">sens inversé : on consomme des A</text>
  <text x="180" y="204" text-anchor="middle" class="s-sub">Fonction : A => B est -A (entrée) et +B (sortie)</text>
</svg>`, legende: "Une collection qu'on lit est covariante ; quelque chose qui consomme des valeurs est contravariant." },
        { type: "exemple", titre: "Pourquoi un tableau modifiable ne peut pas être covariant", code: `val chats: Array[Chat] = Array(new Chat)
val animaux: Array[Animal] = chats      // refusé par le compilateur : Array est invariant
animaux(0) = new Chien                  // sinon, on mettrait un Chien dans un tableau de Chats !

val liste: List[Animal] = List(new Chat)  // OK : List est immuable et covariante` },
        { type: "attention", contenu: "Règle à retenir : un type **immuable** qu'on ne fait que lire peut être covariant (List, Option, Vector) ; un type **modifiable** doit être invariant (Array, ListBuffer). Le compilateur vérifie ces positions et refuse une variance incohérente." },
        { type: "texte", contenu: "Les **tuples** regroupent des valeurs de types différents sans définir de classe : `val (nom, age) = (\"Ana\", 34)` ; `t._1`, `t._2` pour y accéder." },
      ],
    },
    {
      id: "listes",
      titre: "7. Les listes en profondeur",
      objectif: "Comprendre la structure d'une List et ses opérations principales.",
      blocs: [
        { type: "texte", contenu: "Une `List` est soit vide (`Nil`), soit une cellule **cons** `tete :: queue`. `List(1, 2, 3)` est un raccourci pour `1 :: 2 :: 3 :: Nil` (l'opérateur `::` s'associe à droite)." },
        { type: "schema", svg: `<svg viewBox="0 0 360 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Liste chaînée 1 :: 2 :: 3 :: Nil">
  <defs><marker id="fl-sc-cons" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="s-arrow"/></marker></defs>
  <rect x="6" y="30" width="44" height="34" rx="4" class="s-acc"/><text x="28" y="52" text-anchor="middle" class="s-bold">1</text>
  <rect x="50" y="30" width="30" height="34" rx="4" class="s-box"/>
  <rect x="104" y="30" width="44" height="34" rx="4" class="s-acc"/><text x="126" y="52" text-anchor="middle" class="s-bold">2</text>
  <rect x="148" y="30" width="30" height="34" rx="4" class="s-box"/>
  <rect x="202" y="30" width="44" height="34" rx="4" class="s-acc"/><text x="224" y="52" text-anchor="middle" class="s-bold">3</text>
  <rect x="246" y="30" width="30" height="34" rx="4" class="s-box"/>
  <rect x="300" y="30" width="54" height="34" rx="4" class="s-box"/><text x="327" y="52" text-anchor="middle" class="s-txt">Nil</text>
  <path d="M65 47H100" class="s-line" marker-end="url(#fl-sc-cons)"/>
  <path d="M163 47H198" class="s-line" marker-end="url(#fl-sc-cons)"/>
  <path d="M261 47H296" class="s-line" marker-end="url(#fl-sc-cons)"/>
  <text x="28" y="88" text-anchor="middle" class="s-sub">head</text>
  <text x="180" y="88" text-anchor="middle" class="s-sub">tail = 2 :: 3 :: Nil</text>
  <text x="6" y="112" class="s-sub">Ajouter en tête : O(1). Accéder au n-ième : O(n).</text>
</svg>`, legende: "Chaque cellule contient une valeur et un lien vers la suite ; ajouter un élément en tête ne recopie rien." },
        { type: "exemple", titre: "Tri par fusion avec du pattern matching sur les listes", code: `def msort(xs: List[Int]): List[Int] = {
  val n = xs.length / 2
  if (n == 0) xs
  else {
    def fusion(a: List[Int], b: List[Int]): List[Int] = (a, b) match {
      case (Nil, _) => b
      case (_, Nil) => a
      case (x :: xs1, y :: ys1) =>
        if (x <= y) x :: fusion(xs1, b) else y :: fusion(a, ys1)
    }
    val (gauche, droite) = xs splitAt n
    fusion(msort(gauche), msort(droite))
  }
}
msort(List(5, 3, 8, 1, 4, 2))`, resultat: "List(1, 2, 3, 4, 5, 8) — en O(n log n), quel que soit l'ordre de départ" },
        { type: "tableau", entetes: ["Méthode", "Effet", "Exemple sur List(1, 2, 3)"], lignes: [
          ["`map(f)`", "transforme chaque élément", "`map(_ * 10)` → List(10, 20, 30)"],
          ["`filter(p)`", "garde ceux qui vérifient p", "`filter(_ > 1)` → List(2, 3)"],
          ["`flatMap(f)`", "map puis aplatit", "`flatMap(x => List(x, x))` → List(1, 1, 2, 2, 3, 3)"],
          ["`foldLeft(z)(op)`", "combine de gauche à droite à partir de z", "`foldLeft(0)(_ - _)` → ((0 − 1) − 2) − 3 = **−6**"],
          ["`foldRight(z)(op)`", "combine de droite à gauche", "`foldRight(0)(_ - _)` → 1 − (2 − (3 − 0)) = **2**"],
          ["`reduceLeft(op)`", "comme foldLeft, sans valeur initiale", "`reduceLeft(_ + _)` → 6 (erreur sur une liste vide)"],
          ["`zip(autre)`", "associe deux à deux", "`zip(List(\"a\", \"b\"))` → List((1,a), (2,b))"],
        ] },
        { type: "attention", contenu: "foldLeft et foldRight ne donnent le même résultat que pour une opération **associative** (+, ×, max). Pour la soustraction, ils diffèrent. De plus, foldRight sur une très longue liste peut saturer la pile ; foldLeft est récursif terminal." },
        { type: "renvoi", vers: "scala", contenu: "La traduction d'un for-comprehension en map / flatMap / withFilter est dans le deck Scala. Le livre l'illustre avec le problème des **N reines** : placer N reines sur un échiquier sans qu'elles se menacent, en générant les placements ligne par ligne avec un `for … yield`." },
      ],
    },
    {
      id: "paresse",
      titre: "8. État modifiable, flux paresseux et itérateurs",
      objectif: "Ne calculer que ce qui est nécessaire, et savoir quand l'état modifiable est utile.",
      blocs: [
        { type: "texte", contenu: "Un objet **avec état** voit son comportement dépendre de son historique, comme un compte bancaire dont le solde change. Le livre l'utilise pour une simulation d'événements discrets (des portes logiques). Dès qu'il y a de l'état modifiable, le modèle de substitution ne suffit plus : l'ordre des opérations compte." },
        { type: "exemple", titre: "Un compte bancaire avec état", code: `class Compte {
  private var solde = 0
  def deposer(montant: Int): Unit = if (montant > 0) solde += montant
  def retirer(montant: Int): Int =
    if (0 < montant && montant <= solde) { solde -= montant; solde }
    else throw new Error("fonds insuffisants")
}
val c = new Compte
c.deposer(50)
c.retirer(20)   // 30
c.retirer(20)   // 10 : le même appel donne un autre résultat` },
        { type: "definition", terme: "Flux paresseux (Stream, aujourd'hui LazyList)", contenu: "Une liste dont la queue n'est calculée **qu'au moment où on la demande**. On peut donc décrire une suite infinie et n'en consommer que le début." },
        { type: "exemple", titre: "Les nombres premiers, en flux infini", code: `def entiersDepuis(n: Int): LazyList[Int] = n #:: entiersDepuis(n + 1)

def premiers(s: LazyList[Int]): LazyList[Int] =
  s.head #:: premiers(s.tail.filter(_ % s.head != 0))   // crible d'Ératosthène

premiers(entiersDepuis(2)).take(6).toList`, resultat: "List(2, 3, 5, 7, 11, 13) : seuls les éléments nécessaires sont calculés" },
        { type: "attention", contenu: "Précision : le livre utilise `Stream` et l'opérateur `cons`. Depuis Scala 2.13, `Stream` est déprécié au profit de **LazyList**, dont la tête est aussi paresseuse ; on construit avec `#::`." },
        { type: "tableau", entetes: ["", "Itérateur", "LazyList", "lazy val"], lignes: [
          ["Principe", "Curseur `hasNext` / `next()`", "Liste dont les éléments sont calculés à la demande", "Valeur calculée au premier accès, puis mémorisée"],
          ["Relecture", "Non : consommé une seule fois", "Oui : les éléments calculés sont mémorisés", "Oui"],
          ["Usage", "Parcourir un gros fichier ligne par ligne", "Suites infinies, calculs à la demande", "Initialisation coûteuse et parfois inutile"],
        ] },
        { type: "exemple", titre: "lazy val et itérateur", code: `lazy val config = chargerConfiguration()   // lue seulement si on s'en sert

val lignes = scala.io.Source.fromFile("ventes.csv").getLines()   // Iterator[String]
val total = lignes.drop(1).map(_.split(";")(2).toDouble).sum
// lignes est maintenant épuisé : un second parcours ne renverrait rien` },
        { type: "application", titre: "Le lien avec Spark", contenu: "L'évaluation paresseuse de Spark (transformations construites puis exécutées à la première action) applique la même idée que LazyList à l'échelle d'un cluster." },
        { type: "renvoi", vers: "pyspark", contenu: "Transformations, actions et évaluation paresseuse dans Spark : deck PySpark." },
      ],
    },
    {
      id: "implicites",
      titre: "9. Implicites, inférence de types et concurrence",
      objectif: "Lire du code Scala 2 qui utilise des implicites et savoir ce qu'ils deviennent en Scala 3.",
      blocs: [
        { type: "definition", terme: "Paramètre implicite", contenu: "Un paramètre que le compilateur remplit tout seul avec une valeur `implicit` du bon type disponible dans la portée. Il sert à passer un « contexte » (ordre de tri, configuration, encodeur) sans l'écrire à chaque appel." },
        { type: "exemple", titre: "Un ordre de tri passé implicitement", code: `// Scala 2 (le livre)
def maximum[A](xs: List[A])(implicit ord: Ordering[A]): A = xs.reduceLeft(ord.max)
maximum(List(3, 9, 4))          // 9 : Ordering[Int] est trouvé automatiquement

// Scala 3
def maximum[A](xs: List[A])(using ord: Ordering[A]): A = xs.reduceLeft(ord.max)
given Ordering[Client] = Ordering.by(_.ca)   // définir l'ordre par défaut des clients` },
        { type: "texte", contenu: "Une **conversion implicite** transforme automatiquement une valeur d'un type en un autre quand le code ne compile pas autrement (par exemple pour ajouter des méthodes à une classe existante). Les **bornes vues** (`A <% B`) en dépendaient." },
        { type: "attention", contenu: "Précision : les conversions implicites rendent le code difficile à lire (« d'où vient cette méthode ? »). Les bornes vues sont supprimées en Scala 3, et les conversions demandent un import explicite ; on préfère les méthodes d'extension (`extension (s: String) def …`)." },
        { type: "renvoi", vers: "scala", contenu: "Les encodeurs Spark apportés par `import spark.implicits._` sont un usage direct des implicites : voir la carte du deck Scala." },
        { type: "texte", contenu: "L'**inférence de types** de Scala (inspirée de l'algorithme de Hindley-Milner) déduit les types des valeurs et des résultats à partir de leur usage. En pratique, on annote toujours les paramètres et souvent le type de retour des fonctions publiques (obligatoire pour une fonction récursive)." },
        { type: "texte", contenu: "Le dernier chapitre présente des abstractions de **concurrence** : moniteurs, sémaphores, canaux, futures et acteurs (des objets qui échangent des messages et traitent leur boîte aux lettres un message à la fois)." },
        { type: "exemple", titre: "Une Future en Scala moderne", code: `import scala.concurrent.{Future, Await}
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

val ca: Future[Double]  = Future(calculerCA())       // s'exécute en parallèle
val nb: Future[Int]     = Future(compterClients())
val panier = for { c <- ca; n <- nb } yield c / n    // combine sans bloquer
Await.result(panier, 10.seconds)` },
        { type: "attention", contenu: "Précision : les acteurs de la bibliothèque standard décrits dans le livre ont été retirés de Scala ; on utilise aujourd'hui Akka ou Apache Pekko. Les primitives de bas niveau (sémaphores, moniteurs) restent utiles à comprendre mais sont rarement écrites à la main." },
      ],
    },
  ],
  synthese: [
    { svg: `<svg viewBox="0 0 360 286" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Scala en une image : quatre piliers">
  <defs><marker id="fl-syn-scala" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="s-arrow"/></marker></defs>
  <rect x="6" y="6" width="168" height="96" rx="8" class="s-box"/><text x="90" y="35.5" text-anchor="middle" class="s-bold">Expressions</text><text x="90" y="50.5" text-anchor="middle" class="s-sub">tout renvoie une valeur</text><text x="90" y="65.5" text-anchor="middle" class="s-sub">modèle de substitution</text><text x="90" y="80.5" text-anchor="middle" class="s-sub">val / def / lazy val</text><rect x="186" y="6" width="168" height="96" rx="8" class="s-box"/><text x="270" y="35.5" text-anchor="middle" class="s-bold">Fonctions</text><text x="270" y="50.5" text-anchor="middle" class="s-sub">fonctions = valeurs</text><text x="270" y="65.5" text-anchor="middle" class="s-sub">map, filter, foldLeft</text><text x="270" y="80.5" text-anchor="middle" class="s-sub">@tailrec : pile constante</text><rect x="6" y="150" width="168" height="96" rx="8" class="s-box"/><text x="90" y="179.5" text-anchor="middle" class="s-bold">Types</text><text x="90" y="194.5" text-anchor="middle" class="s-sub">class, object, trait</text><text x="90" y="209.5" text-anchor="middle" class="s-sub">génériques, bornes</text><text x="90" y="224.5" text-anchor="middle" class="s-sub">variance +A / −A</text><rect x="186" y="150" width="168" height="96" rx="8" class="s-box"/><text x="270" y="179.5" text-anchor="middle" class="s-bold">Données et effets</text><text x="270" y="194.5" text-anchor="middle" class="s-sub">List : x :: xs, Nil</text><text x="270" y="209.5" text-anchor="middle" class="s-sub">LazyList, itérateurs</text><text x="270" y="224.5" text-anchor="middle" class="s-sub">implicites, Future</text><rect x="60" y="110" width="240" height="32" rx="8" class="s-acc"/><text x="180" y="130" text-anchor="middle" class="s-bold">Scala : objet + fonctionnel</text><text x="180" y="274" text-anchor="middle" class="s-sub">Préférer val, l'immuabilité et la récursion terminale</text>
</svg>`,
      legende: "Les quatre piliers du cours autour de l'idée centrale : Scala mélange objets et fonctions." },
  ],
  aRetenir: [
    "Scala permet le style impératif et le style fonctionnel ; le livre pousse vers le fonctionnel (valeurs immuables, expressions, récursion).",
    "Appel par valeur : l'argument est calculé une fois avant l'appel. Appel par nom (`=> T`) : à chaque usage, jamais s'il n'est pas utilisé.",
    "Une récursion terminale (appel en dernière position) devient une boucle ; `@tailrec` le vérifie à la compilation.",
    "Les fonctions d'ordre supérieur factorisent un schéma de calcul ; le point fixe et l'amortissement en sont un exemple classique.",
    "Variance : immuable et lu = covariant (+A), consommateur = contravariant (-A), modifiable = invariant.",
    "Une List est `tête :: queue` : ajout en tête en O(1), accès au n-ième en O(n). foldLeft ≠ foldRight si l'opération n'est pas associative.",
    "LazyList, itérateurs et lazy val ne calculent que ce qui est demandé ; Spark applique la même idée à grande échelle.",
    "Implicites Scala 2 → `given` / `using` et méthodes d'extension en Scala 3 ; acteurs → Akka / Pekko.",
  ],
};
