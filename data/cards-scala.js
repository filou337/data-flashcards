export const cardsScala = [
  // ---- Fondamentaux ----
  {
    id: "sc-f1-1", langue: "scala", niveau: "fondamentaux", type: "flip",
    front: "val vs var en Scala : lequel est le défaut idiomatique ?",
    back: "val (immuable, ne peut pas être réassigné). var (mutable) est réservé aux cas qui l'exigent réellement."
  },
  {
    id: "sc-f1-2", langue: "scala", niveau: "fondamentaux", type: "flip",
    front: "Quelle philosophie Scala partage avec les DataFrames Spark eux-mêmes ?",
    back: "L'immuabilité par défaut : chaque transformation produit une nouvelle valeur, jamais une modification en place."
  },
  {
    id: "sc-f2-1", langue: "scala", niveau: "fondamentaux", type: "flip",
    front: "Qu'est-ce que la currification en Scala ?",
    back: "Transformer une fonction à plusieurs arguments en une chaîne de fonctions à un seul argument chacune : def f(x)(y) au lieu de def f(x, y)."
  },
  {
    id: "sc-f2-2", langue: "scala", niveau: "fondamentaux", type: "flip",
    front: "À quoi correspond exactement (x) => x * 2 dans le monde PySpark que tu connais déjà ?",
    back: "À une lambda Python (lambda x: x * 2) — même concept de fonction anonyme de première classe, syntaxe différente."
  },
  {
    id: "sc-f3-1", langue: "scala", niveau: "fondamentaux", type: "flip",
    front: "Les collections Scala (List, Map, Set) sont-elles mutables par défaut ?",
    back: "Non, immuables par défaut : map/filter produisent une nouvelle collection plutôt que de modifier l'existante — le socle direct de l'API DataFrame Spark."
  },
  {
    id: "sc-f4-1", langue: "scala", niveau: "fondamentaux", type: "flip",
    front: "En quoi le pattern matching Scala (match/case) va-t-il plus loin qu'un switch classique ?",
    back: "Il peut déstructurer des types complexes (tuples, listes, case classes), matcher sur un type, et capturer une valeur dans un motif — pas juste comparer une valeur simple."
  },
  {
    id: "sc-f4-2", langue: "scala", niveau: "fondamentaux", type: "flip",
    front: "À quoi sert le motif « case _ => » en fin de match ?",
    back: "C'est le cas « attrape-tout », l'équivalent du ELSE en SQL CASE WHEN ou du otherwise en M — évite qu'un cas non couvert plante silencieusement."
  },

  // ---- Intermédiaire ----
  {
    id: "sc-i1-1", langue: "scala", niveau: "intermediaire", type: "flip",
    front: "Que génère automatiquement une case class en Scala ?",
    back: "Un constructeur, des accesseurs immuables, equals/hashCode/toString, et le support natif du pattern matching."
  },
  {
    id: "sc-i1-2", langue: "scala", niveau: "intermediaire", type: "flip",
    front: "À quoi sert .copy(champ = nouvelleValeur) sur une case class ?",
    back: "Produire une variante d'une instance sans tout réécrire, en cohérence avec l'immuabilité par défaut du langage."
  },
  {
    id: "sc-i2-1", langue: "scala", niveau: "intermediaire", type: "flip",
    front: "Que remplace Option[T] (Some/None) en Scala, et pourquoi ?",
    back: "null — en forçant le compilateur à vérifier que le cas d'absence est traité, ça élimine toute une classe de NullPointerException."
  },
  {
    id: "sc-i2-2", langue: "scala", niveau: "intermediaire", type: "flip",
    front: "Quel est l'équivalent Scala direct de COALESCE en SQL ?",
    back: ".getOrElse(valeurParDéfaut) sur une Option — même intention, portée dans le système de types."
  },
  {
    id: "sc-i3-1", langue: "scala", niveau: "intermediaire", type: "flip",
    front: "En quoi un trait diffère-t-il d'une interface classique ?",
    back: "Il peut définir des méthodes avec une implémentation par défaut, et une classe peut composer plusieurs traits (mixin) plutôt que d'hériter d'une seule classe."
  },
  {
    id: "sc-i4-1", langue: "scala", niveau: "intermediaire", type: "flip",
    front: "Un for-comprehension Scala (for {...} yield ...) est-il une vraie boucle impérative ?",
    back: "Non — c'est du sucre syntaxique traduit par le compilateur en appels chaînés à map/flatMap/filter."
  },

  // ---- Avancé ----
  {
    id: "sc-a1-1", langue: "scala", niveau: "avance", type: "flip",
    front: "Avantage clé d'un Dataset[T] Scala typé par rapport à un DataFrame classique ?",
    back: "Les erreurs de schéma (ex. faute de frappe sur un nom de colonne) sont détectées à la COMPILATION, avant même de lancer le job — un filet de sécurité absent en PySpark."
  },
  {
    id: "sc-a2-1", langue: "scala", niveau: "avance", type: "flip",
    front: "Pourquoi une UDF Scala est-elle en général bien plus rapide qu'une UDF Python équivalente ?",
    back: "Elle s'exécute nativement dans la JVM, sans le passage par Py4J qui pénalise une UDF Python (pas de sérialisation ligne par ligne vers un processus séparé)."
  },
  {
    id: "sc-a2-2", langue: "scala", niveau: "avance", type: "flip",
    front: "Avant d'investir dans une UDF Scala, quelle vérification faire en premier ?",
    back: "S'assurer qu'aucune fonction native ni pandas UDF (Arrow) ne couvre déjà le besoin — c'est un dernier recours de performance, pas un premier réflexe."
  },
  {
    id: "sc-a3-1", langue: "scala", niveau: "avance", type: "flip",
    front: "À quoi sert Either[Erreur, Résultat] en Scala ?",
    back: "Propager une erreur métier comme une valeur normale (Left/Right) plutôt que via une exception — utile pour traiter chaque cas d'échec explicitement sans planter tout un job de validation."
  },
  {
    id: "sc-a3-2", langue: "scala", niveau: "avance", type: "qcm",
    front: "Le motif « séparer les lignes valides des lignes en erreur sans planter le job », vu en Scala avec Either, existe aussi...",
    choices: [
      "Uniquement en Scala, aucun équivalent ailleurs",
      "En M (try...otherwise) et en SQL (TRY_CAST) — même principe, trois syntaxes",
      "Uniquement en PySpark",
      "Uniquement en DAX"
    ],
    answer: 1,
    explain: "Trois langages, un seul principe de robustesse des données face à des lignes potentiellement invalides."
  },
  {
    id: "sc-a4-1", langue: "scala", niveau: "avance", type: "flip",
    front: "À quoi servent les Encoders activés par import spark.implicits._ ?",
    back: "Ils permettent à .as[MaCaseClass] de convertir automatiquement les lignes d'un DataFrame vers un Dataset typé, sans code de conversion explicite."
  },

  // ---- Pro ----
  {
    id: "sc-p1-1", langue: "scala", niveau: "pro", type: "flip",
    front: "Dans une stack trace Py4JJavaError, où chercher la vraie cause de l'erreur ?",
    back: "Tout en bas, après le ou les derniers « Caused by: » — le message tout en haut n'est souvent qu'un symptôme générique (« Job aborted due to stage failure »)."
  },
  {
    id: "sc-p1-2", langue: "scala", niveau: "pro", type: "flip",
    front: "Un OutOfMemoryError tout en bas d'une stack trace Spark signifie-t-il toujours « il faut plus de mémoire » ?",
    back: "Non — c'est très souvent le symptôme d'un data skew ou d'un broadcast forcé sur une table trop grosse. Traiter uniquement le symptôme ne fait que repousser le problème."
  },
  {
    id: "sc-p2-1", langue: "scala", niveau: "pro", type: "flip",
    front: "Par quel mécanisme le driver Python communique-t-il avec la JVM en PySpark ?",
    back: "Py4J — pour orchestrer les appels (construire le plan, déclencher les actions). Les données des DataFrames, elles, restent dans la JVM sauf UDF classique ou .collect()."
  },
  {
    id: "sc-p2-2", langue: "scala", niveau: "pro", type: "flip",
    front: "Quelle technologie les pandas UDF utilisent-elles pour transférer des données efficacement entre JVM et Python ?",
    back: "Apache Arrow — transfert vectorisé par lot, bien plus efficace qu'une sérialisation ligne par ligne."
  },
];
