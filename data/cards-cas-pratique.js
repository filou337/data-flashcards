export const cardsCasPratique = [
  {
    id: "cas-1", langue: "cas-pratique", niveau: "avance", type: "flip",
    front: "Pourquoi ne jamais appliquer de logique métier dès la couche bronze d'un pipeline ?",
    back: "La couche brute doit rester un journal immuable rejouable. Corriger un bug se fait toujours en aval (silver/gold), jamais en réécrivant l'historique brut."
  },
  {
    id: "cas-2", langue: "cas-pratique", niveau: "avance", type: "flip",
    front: "Pourquoi write.mode(\"append\") et jamais \"overwrite\" pour la couche bronze ?",
    back: "Bronze est un journal immuable : chaque exécution ajoute les nouvelles données brutes sans jamais effacer l'historique déjà capturé."
  },
  {
    id: "cas-3", langue: "cas-pratique", niveau: "pro", type: "qcm",
    front: "Incident : le CA affiché dans Power BI est 1,8x trop élevé. Quelle est la bonne première étape de diagnostic ?",
    choices: [
      "Éplucher toutes les mesures DAX en premier",
      "Calculer un total simple directement en SQL sur la couche gold, sans passer par DAX",
      "Redémarrer Power BI et réactualiser",
      "Réécrire tout le pipeline depuis zéro"
    ],
    answer: 1,
    explain: "Isoler avant de soupçonner : si le chiffre est déjà faux en SQL brut sur l'entrepôt, DAX est hors de cause — inutile d'y perdre du temps en premier."
  },
  {
    id: "cas-4", langue: "cas-pratique", niveau: "pro", type: "flip",
    front: "Quel contrôle simple révèle qu'une jointure duplique des lignes de fait ?",
    back: "Comparer COUNT(*) de la table de faits à COUNT(*) de la table source amont sur la même période — plus de lignes côté aval signale une jointure qui duplique."
  },
  {
    id: "cas-5", langue: "cas-pratique", niveau: "avance", type: "flip",
    front: "Dans l'incident SCD2 du cas pratique, quelle condition manquait dans le JOIN vers dim_client ?",
    back: "c.order_date BETWEEN dc.date_debut AND dc.date_fin (l'intervalle de validité). Sans elle, chaque commande matche TOUTES les versions historiques du client."
  },
  {
    id: "cas-6", langue: "cas-pratique", niveau: "avance", type: "flip",
    front: "Pourquoi BETWEEN peut-il dupliquer une ligne exactement le jour d'un changement d'adresse SCD2 ?",
    back: "BETWEEN est inclusif sur ses deux bornes : la version qui se termine ce jour-là ET la version qui commence ce jour-là matchent toutes les deux."
  },
  {
    id: "cas-7", langue: "cas-pratique", niveau: "avance", type: "code",
    front: "Corrige ce JOIN pour éliminer le chevauchement de bornes, SANS changer les dates stockées.",
    code: "JOIN dim_client dc\n  ON c.customer_id = dc.customer_id\n  AND c.order_date BETWEEN dc.date_debut AND dc.date_fin",
    back: "JOIN dim_client dc\n  ON c.customer_id = dc.customer_id\n  AND c.order_date >= dc.date_debut\n  AND c.order_date <  dc.date_fin\n\nIntervalle semi-ouvert : borne de début incluse, borne de fin exclue."
  },
  {
    id: "cas-8", langue: "cas-pratique", niveau: "pro", type: "code",
    front: "Complète cette requête générique de détection de chevauchement entre deux intervalles [début, fin).",
    code: "WHERE a.date_debut ??? b.date_fin\n  AND b.date_debut ??? a.date_fin",
    back: "WHERE a.date_debut < b.date_fin\n  AND b.date_debut < a.date_fin\n\nDeux intervalles se chevauchent si et seulement si chacun commence avant que l'autre ne finisse."
  },
  {
    id: "cas-9", langue: "cas-pratique", niveau: "pro", type: "flip",
    front: "Dans le cas pratique 2, pourquoi une jointure semi-ouverte pourtant correcte peut-elle renvoyer deux prix pour une même commande ?",
    back: "Si les intervalles source eux-mêmes se chevauchent (deux promos qui se recoupent), ce n'est plus un bug de bornes mais un problème de qualité de donnée en amont — aucune jointure ne peut deviner quel prix retenir."
  },
  {
    id: "cas-10", langue: "cas-pratique", niveau: "intermediaire", type: "flip",
    front: "Comment appelle-t-on une jointure qui associe un événement ponctuel à la version en vigueur d'une donnée variant dans le temps ?",
    back: "Une jointure temporelle (ou « as-of join »)."
  },
  {
    id: "cas-11", langue: "cas-pratique", niveau: "avance", type: "qcm",
    front: "Pourquoi utiliser un LEFT JOIN explicite dans la jointure temporelle prix/commande en PySpark ?",
    choices: [
      "Pour que Spark l'exécute plus vite",
      "Pour que les commandes sans prix couvrant leur date restent visibles avec NULL, plutôt que de disparaître silencieusement",
      "Parce qu'un broadcast join impose toujours un LEFT JOIN",
      "Ça ne change rien au résultat"
    ],
    answer: 1,
    explain: "Un INNER JOIN par défaut ferait disparaître silencieusement toute commande dont le produit n'a pas de ligne de prix couvrant sa date — un signal de qualité de donnée qu'on veut voir, pas cacher."
  },
  {
    id: "cas-12", langue: "cas-pratique", niveau: "pro", type: "flip",
    front: "Pourquoi résoudre le calcul du « prix appliqué » en amont (SQL/PySpark) plutôt que dans une mesure DAX ?",
    back: "Une table de prix à validité temporelle n'est pas une dimension de filtrage classique. DAX recalculerait cette jointure à chaque rendu de visuel — lent et fragile. La résoudre une fois en amont est bien plus robuste et performant."
  },
  {
    id: "cas-13", langue: "cas-pratique", niveau: "pro", type: "flip",
    front: "Pourquoi le test de chevauchement d'intervalles de prix doit-il bloquer le pipeline plutôt que simplement alerter après coup ?",
    back: "Un chevauchement de tarification a un impact financier direct — mieux vaut arrêter le pipeline que laisser deux prix contradictoires cohabiter en attendant qu'un rapport de marge alerte quelqu'un, des semaines plus tard."
  },
  {
    id: "cas-14", langue: "cas-pratique", niveau: "avance", type: "flip",
    front: "Dans le cas pratique, pourquoi une UDF Python de normalisation de texte est-elle devenue le goulot du job silver à 200M lignes ?",
    back: "Le coût de sérialisation Py4J ligne par ligne entre la JVM et un processus Python. Remplacée par une UDF Scala native JVM, le temps est passé de 40 à 6 minutes."
  },
  {
    id: "cas-15", langue: "cas-pratique", niveau: "pro", type: "flip",
    front: "Quelle leçon méthodologique générale retenir de l'incident « CA x1,8 » ?",
    back: "Toujours diagnostiquer en partant de la couche la plus en amont possible (SQL brut) avant de soupçonner la couche de restitution (M puis DAX) — un chiffre faux est presque toujours plus proche de la source qu'on ne le pense."
  },
  {
    id: "cas-16", langue: "cas-pratique", niveau: "intermediaire", type: "flip",
    front: "Dans une table de dimension SCD2, que doit systématiquement documenter/vérifier l'architecture de la table de prix ou de dimension avant tout chargement ?",
    back: "Qu'aucun chevauchement d'intervalles n'existe pour une même clé (client, produit...) — un contrôle générique réutilisable partout où deux périodes ne doivent jamais se recouper (contrats, réservations, tarifs)."
  },
];
