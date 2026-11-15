export const cardsTests = [
  // ======================================================================
  // ---- Fondamentaux : pourquoi et quoi tester ----
  // ======================================================================
  {
    id: "tq-f1-1", langue: "tests", niveau: "fondamentaux", type: "flip",
    front: "Tester le CODE vs tester les DONNÉES : quelle différence en data ?",
    back: "• Tests de code (logiciels) : vérifient que la LOGIQUE fait ce qui est prévu, sur des données d'entrée maîtrisées (petits jeux d'exemple). Exécutés AVANT la mise en production, en CI. Ex. « la fonction de calcul de TVA renvoie 120 pour 100 HT ».\n• Tests de données : vérifient que les données RÉELLES qui traversent le pipeline respectent des attentes. Exécutés à CHAQUE exécution, en production. Ex. « id_commande est unique », « aucun montant négatif ».\n\nIl faut les deux : un code parfait peut recevoir des données sources cassées, et des données parfaites peuvent être abîmées par un bug de code."
  },
  {
    id: "tq-f1-2", langue: "tests", niveau: "fondamentaux", type: "flip",
    front: "La pyramide des tests : de quoi s'agit-il ?",
    back: "De la base au sommet :\n• Tests UNITAIRES (nombreux) : une fonction ou une transformation isolée, quelques lignes en entrée. Rapides (millisecondes), précis pour localiser un bug.\n• Tests d'INTÉGRATION (moins nombreux) : plusieurs composants ensemble (lecture d'une vraie table de test, écriture, jointure de plusieurs étapes).\n• Tests de BOUT EN BOUT (peu) : le pipeline complet, de la source au tableau de bord, sur un environnement proche de la production. Lents, fragiles, mais réalistes.\n\nPrincipe : beaucoup de tests rapides en bas, quelques tests lents en haut. Une pyramide inversée (surtout du bout en bout) donne une CI lente et des échecs difficiles à diagnostiquer."
  },
  {
    id: "tq-f1-3", langue: "tests", niveau: "fondamentaux", type: "flip",
    front: "Qu'est-ce qu'un test de non-régression ?",
    back: "Un test qui vérifie qu'une MODIFICATION (nouvelle fonctionnalité, refactorisation, montée de version, correction de bug) n'a pas cassé ce qui fonctionnait déjà.\n\nEn data, deux formes principales :\n• Rejouer la suite de tests existante (unitaires, intégration) à chaque changement, automatiquement en CI.\n• Comparer les SORTIES : exécuter l'ancienne et la nouvelle version du pipeline sur les mêmes données d'entrée et vérifier que les résultats sont identiques (ou que les écarts sont exactement ceux attendus).\n\nRègle d'or : chaque bug corrigé donne naissance à un test qui le reproduit, pour qu'il ne revienne jamais."
  },
  {
    id: "tq-f1-4", langue: "tests", niveau: "fondamentaux", type: "qcm",
    front: "Vous refactorisez une requête SQL de 300 lignes pour la rendre lisible, sans changer le résultat voulu. Quel est le meilleur moyen de prouver qu'il n'y a pas de régression ?",
    choices: [
      "Relire attentivement le nouveau code",
      "Vérifier que le nombre de lignes est identique",
      "Exécuter les deux versions sur les mêmes données et comparer les résultats ligne à ligne (différence dans les deux sens), en plus du nombre de lignes et des totaux",
      "Demander à un utilisateur si le tableau de bord lui semble correct"
    ],
    answer: 2,
    explain: "Le même nombre de lignes peut cacher des valeurs différentes, et les mêmes totaux peuvent cacher des lignes échangées. La comparaison exhaustive (ancien EXCEPT nouveau, et nouveau EXCEPT ancien, tous deux vides) est la preuve la plus solide. La relecture est utile mais ne suffit pas."
  },
  {
    id: "tq-f1-5", langue: "tests", niveau: "fondamentaux", type: "flip",
    front: "Les tests de données de base à mettre sur presque toutes les tables ?",
    back: "• Unicité de la clé primaire (ou de la combinaison de colonnes qui forme le grain).\n• Non-nullité des colonnes obligatoires (clés, dates, montants).\n• Intégrité référentielle : chaque id_client de la table de faits existe dans dim_client.\n• Valeurs acceptées : statut ∈ {créée, payée, expédiée, annulée}.\n• Plages valides : montant ≥ 0, date ≤ aujourd'hui, âge entre 0 et 120.\n• Fraîcheur : la donnée la plus récente date de moins de N heures.\n• Volume : nombre de lignes dans une fourchette attendue.\n\nCe socle attrape la grande majorité des incidents de données courants."
  },
  {
    id: "tq-f1-6", langue: "tests", niveau: "fondamentaux", type: "code",
    front: "Écris un test unitaire pytest pour cette fonction. Quels cas tester ?",
    code: "def taux_conversion(commandes: int, visites: int) -> float:\n    if visites == 0:\n        return 0.0\n    return commandes / visites",
    back: "import pytest\nfrom metriques import taux_conversion\n\ndef test_cas_nominal():\n    assert taux_conversion(5, 100) == pytest.approx(0.05)\n\ndef test_zero_visite_ne_plante_pas():\n    assert taux_conversion(0, 0) == 0.0\n\ndef test_aucune_commande():\n    assert taux_conversion(0, 50) == 0.0\n\nCas à couvrir : le cas nominal, les cas limites (0, valeurs extrêmes), les cas d'erreur (commandes > visites : faut-il lever une erreur ? le test force à se poser la question).\npytest.approx évite les faux échecs liés à l'arrondi des flottants. Lancer : pytest -q."
  },
  {
    id: "tq-f1-7", langue: "tests", niveau: "fondamentaux", type: "flip",
    front: "Qu'est-ce qu'un bon test unitaire ? (critères)",
    back: "• Rapide : millisecondes, pour pouvoir lancer toute la suite en permanence.\n• Isolé : ne dépend ni du réseau, ni d'une vraie base, ni de l'ordre d'exécution des autres tests.\n• Déterministe : même résultat à chaque exécution (fixer les graines aléatoires, ne pas dépendre de la date du jour).\n• Lisible : un nom qui décrit le comportement (test_remise_plafonnee_a_50_pourcent), une structure Arrange / Act / Assert.\n• Ciblé : une seule raison d'échouer ; quand il échoue, on sait tout de suite ce qui est cassé.\n• Teste le comportement, pas l'implémentation : on doit pouvoir refactoriser sans réécrire les tests."
  },
  {
    id: "tq-f1-8", langue: "tests", niveau: "fondamentaux", type: "qcm",
    front: "La suite de tests atteint 95 % de couverture de code. Que peut-on en conclure ?",
    choices: [
      "Le code ne contient quasiment plus de bugs",
      "95 % des lignes sont exécutées par au moins un test, mais cela ne garantit pas que les résultats sont vérifiés correctement ni que les cas limites sont couverts",
      "Il est inutile d'écrire d'autres tests",
      "Les données de production seront correctes"
    ],
    answer: 1,
    explain: "La couverture mesure ce qui est EXÉCUTÉ, pas ce qui est VÉRIFIÉ : un test sans assert couvre des lignes sans rien tester. C'est un bon indicateur des zones NON testées, un mauvais objectif en soi (loi de Goodhart). Et elle ne dit rien de la qualité des données réelles."
  },
  {
    id: "tq-f1-9", langue: "tests", niveau: "fondamentaux", type: "flip",
    front: "Environnements dev, recette (staging) et production : pourquoi les séparer ?",
    back: "• Dev : chaque développeur expérimente sur des données d'échantillon ou un schéma personnel, sans risque.\n• Recette / staging : réplique de la production (mêmes outils, mêmes configurations, données réalistes ou anonymisées) où l'on valide les changements, y compris les tests de non-régression et la validation métier.\n• Production : ce que les utilisateurs consomment ; on n'y modifie rien à la main.\n\nObjectif : qu'un changement ne touche la production qu'après avoir été testé dans un environnement représentatif. Piège classique : un staging trop différent de la production (volumes, données, versions) qui laisse passer les bugs."
  },
  {
    id: "tq-f1-10", langue: "tests", niveau: "fondamentaux", type: "flip",
    front: "Contrôle qualité « bloquant » vs « avertissement » : quand utiliser lequel ?",
    back: "• Bloquant (error) : le pipeline S'ARRÊTE et ne publie pas la donnée. Pour ce qui rendrait les chiffres faux : doublons sur la clé, montants nuls sur une table financière, table source vide.\n• Avertissement (warn) : le pipeline continue mais alerte. Pour ce qui mérite une enquête sans fausser l'essentiel : quelques valeurs hors plage, légère baisse de volume, nouvelle modalité inconnue.\n\nPrincipe : mieux vaut une donnée en retard qu'une donnée fausse que personne ne remarque. Mais trop de contrôles bloquants sur des détails rendent le pipeline fragile, et trop d'alertes finissent ignorées."
  },

  // ======================================================================
  // ---- Intermédiaire : outils et pratiques ----
  // ======================================================================
  {
    id: "tq-i1-1", langue: "tests", niveau: "intermediaire", type: "code",
    front: "Tester une transformation pandas : complète le test et explique le choix de la comparaison.",
    code: "import pandas as pd\nfrom transformations import ajouter_ttc  # ajoute une colonne ttc = ht * (1 + tva)\n\ndef test_ajouter_ttc():\n    entree = pd.DataFrame({\"ht\": [100.0, 50.0], \"tva\": [0.2, 0.055]})\n    attendu = ...",
    back: "    attendu = pd.DataFrame({\n        \"ht\": [100.0, 50.0],\n        \"tva\": [0.2, 0.055],\n        \"ttc\": [120.0, 52.75],\n    })\n    resultat = ajouter_ttc(entree)\n    pd.testing.assert_frame_equal(resultat, attendu, check_like=True)\n\n• assert_frame_equal compare valeurs, types, index et noms de colonnes, avec une tolérance sur les flottants (rtol) ; le message d'erreur indique précisément la différence.\n• check_like=True ignore l'ordre des colonnes et des lignes d'index.\n• Ne jamais comparer avec == entre DataFrames dans un assert (renvoie un DataFrame de booléens)."
  },
  {
    id: "tq-i1-2", langue: "tests", niveau: "intermediaire", type: "flip",
    front: "pytest : fixtures et parametrize, à quoi servent-ils ?",
    back: "• Fixture : prépare une ressource réutilisable et l'injecte dans les tests qui la demandent en paramètre (un DataFrame d'exemple, une SparkSession, un dossier temporaire).\n  @pytest.fixture\n  def commandes():\n      return pd.DataFrame({...})\n  def test_total(commandes): ...\n  Portée réglable (scope=\"session\" pour une SparkSession créée une seule fois). Fixtures intégrées utiles : tmp_path, monkeypatch.\n\n• parametrize : exécute le même test avec plusieurs jeux de données.\n  @pytest.mark.parametrize(\"ht, tva, attendu\", [(100, 0.2, 120), (0, 0.2, 0), (50, 0, 50)])\n  def test_ttc(ht, tva, attendu): ...\n  Chaque cas apparaît comme un test séparé dans le rapport."
  },
  {
    id: "tq-i1-3", langue: "tests", niveau: "intermediaire", type: "flip",
    front: "Mock (simulacre) : quand et comment l'utiliser dans un test ?",
    back: "Remplacer une dépendance externe (API, base de données, horloge, envoi d'e-mail) par un faux objet contrôlé, pour que le test soit rapide, déterministe et ne touche pas de vrais systèmes.\n\nOutils : unittest.mock (patch, MagicMock), fixture monkeypatch de pytest.\nEx. simuler une API de taux de change qui renvoie toujours 1,08, ou une API en erreur pour tester la logique de relance.\n\nPièges : trop de mocks → on teste les mocks et non le vrai comportement ; un mock qui ne ressemble plus à la vraie API laisse passer des bugs. Pour les bases de données, préférer souvent une vraie base légère (DuckDB, SQLite, conteneur PostgreSQL) dans les tests d'intégration."
  },
  {
    id: "tq-i1-4", langue: "tests", niveau: "intermediaire", type: "code",
    front: "Rendre cette fonction testable : quel est le problème et comment le corriger ?",
    code: "from datetime import date, timedelta\n\ndef commandes_d_hier(df):\n    hier = date.today() - timedelta(days=1)\n    return df[df[\"date\"] == hier]",
    back: "La fonction dépend de l'horloge système : le résultat change chaque jour, le test serait non déterministe (et le backfill impossible).\n\nCorrection : injecter la date en paramètre.\n\ndef commandes_du_jour(df, jour):\n    return df[df[\"date\"] == jour]\n\ndef test_commandes_du_jour():\n    df = pd.DataFrame({\"date\": [date(2025, 3, 1), date(2025, 3, 2)], \"id\": [1, 2]})\n    res = commandes_du_jour(df, date(2025, 3, 2))\n    assert res[\"id\"].tolist() == [2]\n\nPrincipe général : sortir les effets de bord (date, aléatoire, lecture/écriture, réseau) aux bords du programme, garder le cœur de la logique en fonctions PURES, faciles à tester."
  },
  {
    id: "tq-i1-5", langue: "tests", niveau: "intermediaire", type: "code",
    front: "Comparer la sortie de l'ancienne et de la nouvelle version d'une table (test de non-régression SQL).",
    code: "-- ventes_v1 : table produite par l'ancien code\n-- ventes_v2 : table produite par le nouveau code, mêmes données d'entrée",
    back: "-- Lignes présentes dans v1 mais pas dans v2\nSELECT * FROM ventes_v1\nEXCEPT\nSELECT * FROM ventes_v2;\n\n-- Lignes présentes dans v2 mais pas dans v1\nSELECT * FROM ventes_v2\nEXCEPT\nSELECT * FROM ventes_v1;\n\n-- Contrôles de synthèse\nSELECT COUNT(*), COUNT(DISTINCT id_vente), SUM(montant) FROM ventes_v1;\nSELECT COUNT(*), COUNT(DISTINCT id_vente), SUM(montant) FROM ventes_v2;\n\nLes deux EXCEPT doivent être vides. Attention : EXCEPT supprime les doublons (un doublon en plus passe inaperçu) → d'où le COUNT(*) vs COUNT(DISTINCT). Les flottants peuvent différer à la 10e décimale : arrondir avant de comparer. Outils : datacompy (Python), data-diff, audit_helper (dbt)."
  },
  {
    id: "tq-i1-6", langue: "tests", niveau: "intermediaire", type: "flip",
    front: "Jeu de données de référence (golden dataset) pour les tests de non-régression : principe ?",
    back: "Un petit jeu d'entrée FIGÉ et versionné avec le code, qui couvre les cas importants (cas nominal, NULL, doublons, dates limites, clients inconnus, remboursements…), accompagné de la sortie ATTENDUE validée une fois pour toutes (par calcul manuel ou par le métier).\n\nÀ chaque modification, la CI exécute le pipeline sur cette entrée et compare à la sortie attendue. Tout écart fait échouer le build.\n\nQuand un écart est VOULU (nouvelle règle métier), on met à jour la sortie attendue dans le même commit, ce qui rend le changement visible et relu en revue de code.\n\nVariante : snapshot testing (on enregistre automatiquement la sortie actuelle comme référence, puis on détecte tout changement)."
  },
  {
    id: "tq-i1-7", langue: "tests", niveau: "intermediaire", type: "code",
    front: "Que vérifient ces tests dbt et où les déclare-t-on ?",
    code: "models:\n  - name: fait_ventes\n    columns:\n      - name: id_vente\n        tests: [unique, not_null]\n      - name: id_client\n        tests:\n          - relationships:\n              to: ref('dim_client')\n              field: id_client\n      - name: statut\n        tests:\n          - accepted_values:\n              values: ['payee', 'expediee', 'annulee']\n              config: {severity: warn}",
    back: "Déclarés dans un fichier YAML à côté des modèles (schema.yml) :\n• unique + not_null sur id_vente : c'est bien une clé primaire.\n• relationships : chaque id_client de fait_ventes existe dans dim_client (intégrité référentielle, pas de vente orpheline).\n• accepted_values sur statut : aucune valeur inattendue ; ici en severity: warn → alerte sans bloquer.\n\nChaque test est compilé en une requête SQL qui renvoie les lignes en défaut ; 0 ligne = succès. dbt build exécute modèles et tests dans l'ordre du graphe et arrête les modèles en aval si un test bloquant échoue. Les paquets dbt-utils et dbt-expectations ajoutent des dizaines de tests prêts à l'emploi."
  },
  {
    id: "tq-i1-8", langue: "tests", niveau: "intermediaire", type: "flip",
    front: "Tests unitaires dbt vs tests de données dbt : quelle différence ?",
    back: "• Tests de données (data tests : unique, not_null, relationships…) : s'exécutent sur les données RÉELLES à chaque exécution. Ils détectent des problèmes de données.\n• Tests unitaires (depuis dbt 1.8) : on fournit des lignes d'entrée fictives (given) et le résultat attendu (expect) pour UN modèle, déclarés en YAML. Ils vérifient la LOGIQUE SQL (un CASE WHEN, un calcul de fenêtre, une règle de gestion), indépendamment des données du jour. S'exécutent en CI, avant la production.\n\nLes tests unitaires sont utiles sur la logique complexe ou critique (calcul de commissions, règles de dédoublonnage), pas sur chaque SELECT trivial."
  },
  {
    id: "tq-i1-9", langue: "tests", niveau: "intermediaire", type: "flip",
    front: "Tester du code PySpark : comment s'y prendre ?",
    back: "• Une SparkSession locale partagée en fixture pytest (scope=\"session\") : SparkSession.builder.master(\"local[1]\").getOrCreate(), avec peu de partitions de shuffle (spark.sql.shuffle.partitions=1) pour aller vite.\n• Construire de petits DataFrames d'entrée avec un schéma explicite (spark.createDataFrame(lignes, schema)).\n• Comparer : pyspark.testing.assertDataFrameEqual (Spark 3.5+) ou la bibliothèque chispa ; ignorer l'ordre des lignes, car Spark ne garantit aucun ordre.\n• Écrire les transformations comme des fonctions DataFrame → DataFrame, sans lecture ni écriture à l'intérieur : elles deviennent testables unitairement.\n\nLes tests Spark sont lents à démarrer : en garder un nombre raisonnable et tester la logique pure en Python quand c'est possible."
  },
  {
    id: "tq-i1-10", langue: "tests", niveau: "intermediaire", type: "flip",
    front: "Intégration continue (CI) pour un projet data : que doit faire le pipeline de CI ?",
    back: "À chaque pull request, automatiquement (GitHub Actions, GitLab CI…) :\n1. Linting et formatage : ruff (Python), sqlfluff (SQL) → style homogène, erreurs évidentes.\n2. Tests unitaires (pytest, tests unitaires dbt).\n3. Construction des modèles modifiés et de leurs dépendants dans un schéma de CI isolé, sur un échantillon de données (dbt build --select state:modified+).\n4. Tests de données sur ces modèles.\n5. Comparaison avec la production (non-régression : diff de lignes et d'agrégats) pour rendre visibles les impacts.\n\nLa fusion n'est possible que si tout est vert. Le déploiement en production (CD) se fait ensuite automatiquement depuis la branche principale, jamais à la main depuis un poste."
  },
  {
    id: "tq-i1-11", langue: "tests", niveau: "intermediaire", type: "flip",
    front: "Tests de réconciliation : de quoi s'agit-il ?",
    back: "Vérifier que les données n'ont été ni perdues, ni dupliquées, ni altérées entre deux points du pipeline, en comparant des agrégats :\n• nombre de lignes source vs cible (en tenant compte des rejets attendus, comptés à part) ;\n• sommes de contrôle sur les montants (CA du jour dans la base de commandes = CA du jour dans la table gold) ;\n• nombre de clés distinctes ;\n• comparaison avec un référentiel externe (comptabilité, système de paiement).\n\nTrès apprécié des équipes finance : « le CA du tableau de bord est égal, à l'euro près, au CA comptable » donne confiance dans tout le reste."
  },

  // ======================================================================
  // ---- Avancé : stratégies de qualité, modèles, déploiement ----
  // ======================================================================
  {
    id: "tq-a1-1", langue: "tests", niveau: "avance", type: "flip",
    front: "Le motif Write-Audit-Publish (WAP) : principe ?",
    back: "1. WRITE : le pipeline écrit le résultat dans une zone intermédiaire invisible des utilisateurs (table de staging, branche Iceberg / Nessie, version Delta non publiée).\n2. AUDIT : on exécute les contrôles qualité sur ce résultat (unicité, volumes, réconciliation, comparaison avec la veille).\n3. PUBLISH : seulement si tout est vert, on publie de façon atomique (échange de table, fusion de branche, vue qui pointe vers la nouvelle version).\n\nAvantage : les utilisateurs ne voient JAMAIS une donnée fausse ou à moitié écrite ; en cas d'échec, ils gardent la version de la veille (un peu ancienne mais juste), et l'équipe est alertée."
  },
  {
    id: "tq-a1-2", langue: "tests", niveau: "avance", type: "flip",
    front: "Données en échec : bloquer tout le lot, ou mettre les lignes en quarantaine ?",
    back: "• Bloquer le lot : si l'erreur rend l'ensemble suspect (fichier tronqué, schéma changé, volume anormal). Personne ne consomme de donnée douteuse.\n• Quarantaine : si quelques lignes isolées sont invalides (date impossible, client inconnu), on les écarte dans une table de rejets avec la raison du rejet, on publie le reste et on alerte.\n\nRègles : compter et surveiller le taux de rejet (un seuil au-delà duquel on bloque tout, ex. > 1 %), rendre les rejets rejouables une fois corrigés, et ne jamais rejeter EN SILENCE : une ligne qui disparaît sans trace est le pire scénario."
  },
  {
    id: "tq-a1-3", langue: "tests", niveau: "avance", type: "flip",
    front: "Contrat de données (data contract) : qu'est-ce que c'est et que contient-il ?",
    back: "Un accord formel, idéalement versionné et vérifié automatiquement, entre le PRODUCTEUR d'une donnée (équipe applicative, domaine) et ses CONSOMMATEURS (data, BI, data science).\n\nContenu typique :\n• schéma : colonnes, types, nullabilité, clés ;\n• sémantique : définition métier de chaque champ (« montant TTC en euros, remises déduites ») ;\n• qualité attendue : unicité, plages, taux de NULL maximal ;\n• niveau de service : fraîcheur, disponibilité ;\n• gestion des changements : versionnement, préavis avant un changement cassant, propriétaire à contacter.\n\nIntérêt : détecter les changements cassants à la SOURCE (en CI de l'application) plutôt que dans les tableaux de bord, trois jours plus tard."
  },
  {
    id: "tq-a1-4", langue: "tests", niveau: "avance", type: "flip",
    front: "Tests statiques vs détection d'anomalies (tests dynamiques) sur les données ?",
    back: "• Tests à seuils fixes : « montant ≥ 0 », « volume entre 10 000 et 50 000 lignes ». Simples et explicables, mais les seuils vieillissent (croissance, saisonnalité) et ne couvrent que ce qu'on a imaginé.\n• Détection d'anomalies : on apprend le comportement normal de chaque métrique (volume, taux de NULL, moyenne d'une colonne) à partir de l'historique, avec la saisonnalité, et on alerte en cas d'écart inhabituel. Couvre les « inconnus inconnus », mais peut produire des faux positifs et est moins explicable.\n\nCombinaison recommandée : tests fixes sur les règles métier certaines (unicité, intégrité), détection d'anomalies sur les volumes et les distributions."
  },
  {
    id: "tq-a1-5", langue: "tests", niveau: "avance", type: "qcm",
    front: "Un test d'intégration échoue une fois sur dix, sans changement de code. Que faire ?",
    choices: [
      "Ajouter une relance automatique jusqu'à ce qu'il passe",
      "Le désactiver définitivement",
      "Le traiter comme un vrai bug : identifier la source du non-déterminisme (ordre des lignes non garanti, dépendance à l'heure, état partagé entre tests, appel réseau, timeout trop court) et la supprimer",
      "Ignorer les échecs de ce test dans la CI"
    ],
    answer: 2,
    explain: "Un test instable (flaky) détruit la confiance : l'équipe finit par ignorer les échecs, y compris les vrais. On peut le mettre temporairement en quarantaine (marqué, suivi dans un ticket), mais il faut corriger la cause. En data, la cause la plus fréquente est de comparer des résultats sans ORDER BY ou sans trier, alors que l'ordre n'est pas garanti."
  },
  {
    id: "tq-a1-6", langue: "tests", niveau: "avance", type: "flip",
    front: "Tests basés sur les propriétés (property-based testing) : principe et exemple en data ?",
    back: "Au lieu d'écrire quelques exemples à la main, on énonce une PROPRIÉTÉ toujours vraie, et un outil (Hypothesis en Python) génère des centaines d'entrées aléatoires, y compris des cas limites auxquels on n'aurait pas pensé (listes vides, NaN, valeurs énormes, caractères spéciaux). En cas d'échec, il réduit l'exemple au cas minimal qui casse.\n\nPropriétés utiles en data :\n• dédupliquer deux fois = dédupliquer une fois (idempotence) ;\n• la somme des montants est conservée après un pivot ou un regroupement ;\n• le nombre de lignes après un LEFT JOIN many-to-one = nombre de lignes de gauche ;\n• sérialiser puis relire un fichier redonne les mêmes données."
  },
  {
    id: "tq-a1-7", langue: "tests", niveau: "avance", type: "code",
    front: "Écris un test qui vérifie qu'un pipeline est idempotent.",
    code: "# charger_jour(con, jour) : traite la journée `jour` et écrit dans la table ventes_jour\n# con : connexion DuckDB de test, avec des données brutes d'exemple déjà chargées",
    back: "from datetime import date\n\ndef etat_table(con):\n    return con.execute(\n        \"SELECT * FROM ventes_jour ORDER BY id_vente\"\n    ).fetchall()\n\ndef test_charger_jour_idempotent(con):\n    jour = date(2025, 3, 2)\n    charger_jour(con, jour)\n    apres_1 = etat_table(con)\n    charger_jour(con, jour)      # relance identique (retry, backfill)\n    apres_2 = etat_table(con)\n    assert apres_1 == apres_2\n    assert len(apres_1) > 0      # le test ne doit pas passer sur une table vide\n\nL'ORDER BY rend la comparaison déterministe. Variante utile : charger le jour J, puis J+1, puis rejouer J, et vérifier que J+1 n'a pas été touché."
  },
  {
    id: "tq-a1-8", langue: "tests", niveau: "avance", type: "flip",
    front: "Non-régression d'un modèle de machine learning : que faut-il vérifier avant de remplacer le modèle en production ?",
    back: "• Performance sur un jeu de test FIGÉ commun : le nouveau modèle (challenger) doit faire au moins aussi bien que l'actuel (champion), avec un écart supérieur au bruit (IC par bootstrap ou validation croisée).\n• Performance PAR SEGMENT (pays, type de client, nouveaux clients) : une amélioration globale peut cacher une forte dégradation sur un segment.\n• Backtesting temporel pour les séries : performance sur plusieurs périodes passées successives.\n• Calibration des probabilités, si elles sont utilisées.\n• Tests de comportement : invariance (changer le prénom ne change pas le score), monotonie attendue (plus de retards de paiement → risque plus élevé).\n• Contraintes de production : temps de réponse, mémoire, mêmes variables disponibles.\n\nPuis déploiement progressif : shadow mode ou A/B test sur une partie du trafic."
  },
  {
    id: "tq-a1-9", langue: "tests", niveau: "avance", type: "flip",
    front: "Déploiement progressif : shadow mode, canary, blue/green ?",
    back: "• Shadow mode : la nouvelle version tourne en parallèle sur les vraies données, mais ses résultats ne sont pas utilisés ; on compare avec la version actuelle. Idéal pour la non-régression d'un pipeline ou d'un modèle sans aucun risque.\n• Canary : la nouvelle version sert d'abord une petite part du trafic ou des utilisateurs (5 %), puis on élargit si les indicateurs restent bons.\n• Blue/green : deux environnements complets ; on bascule tout le trafic de l'ancien (blue) au nouveau (green) d'un coup, avec retour arrière immédiat possible.\n\nPoint commun : pouvoir revenir en arrière rapidement (rollback) et définir à l'avance les critères qui déclenchent ce retour."
  },
  {
    id: "tq-a1-10", langue: "tests", niveau: "avance", type: "flip",
    front: "Comment gérer les données de test (volume, réalisme, confidentialité) ?",
    back: "• Données synthétiques écrites à la main : petites, maîtrisées, idéales pour les tests unitaires et les cas limites.\n• Générateurs (Faker, Hypothesis) : volume et variété sans donnée réelle.\n• Échantillon de production : réaliste pour l'intégration et la non-régression, mais à ANONYMISER ou pseudonymiser (RGPD) : jamais de données personnelles en clair dans les environnements de dev ou de test, ni dans le dépôt git.\n• Échantillonnage cohérent : prendre un échantillon de CLIENTS puis toutes leurs commandes, sinon les jointures sont vides.\n\nVersionner les petits jeux de test avec le code pour que chaque test soit reproductible."
  },

  // ======================================================================
  // ---- Pro : culture qualité, incidents, gouvernance ----
  // ======================================================================
  {
    id: "tq-p1-1", langue: "tests", niveau: "pro", type: "flip",
    front: "Où placer les contrôles qualité le long d'un pipeline ? (« shift left »)",
    back: "• À la source (le plus tôt possible) : contrats de données vérifiés dans la CI de l'application productrice ; validation à l'ingestion (schéma, format). Un problème bloqué ici ne contamine rien.\n• À l'entrée de chaque couche : bronze → silver (types, doublons, valeurs obligatoires), silver → gold (règles métier, réconciliation).\n• Avant publication : audit final (Write-Audit-Publish), comparaison avec la veille.\n• En aval : surveillance des tableaux de bord et des modèles (fraîcheur, dérive).\n\n« Shift left » : plus un défaut est détecté tôt, moins il coûte. Corriger une erreur de saisie à la source coûte peu ; la corriger après qu'elle a alimenté 30 rapports et une décision coûte cher."
  },
  {
    id: "tq-p1-2", langue: "tests", niveau: "pro", type: "flip",
    front: "Les dimensions de la qualité des données ?",
    back: "• Exactitude : la valeur correspond à la réalité (la bonne adresse).\n• Complétude : les valeurs obligatoires sont présentes, toutes les lignes attendues sont là.\n• Cohérence : pas de contradiction entre systèmes ou entre champs (date de livraison avant la commande).\n• Validité : format et règles respectés (code postal à 5 chiffres, e-mail valide).\n• Unicité : pas de doublons.\n• Fraîcheur / actualité : la donnée est assez récente pour l'usage.\n\nChaque dimension se traduit en tests mesurables, et en indicateurs de qualité suivis dans le temps (taux de complétude d'une colonne, % de doublons) plutôt qu'en ressenti."
  },
  {
    id: "tq-p1-3", langue: "tests", niveau: "pro", type: "flip",
    front: "Un incident de données a touché un tableau de bord de direction. Comment le gérer, puis éviter qu'il se reproduise ?",
    back: "Pendant l'incident :\n1. Évaluer l'impact (quelles tables, quels tableaux de bord, quels utilisateurs, depuis quand) grâce au lignage.\n2. Prévenir les utilisateurs touchés AVANT qu'ils ne décident sur des chiffres faux (bandeau sur le tableau de bord).\n3. Contenir : stopper la propagation, revenir à la dernière version saine (time travel).\n4. Corriger et rejouer (backfill), vérifier par réconciliation.\n\nAprès : un post-mortem SANS RECHERCHE DE COUPABLE : chronologie, cause racine (les « 5 pourquoi »), pourquoi les contrôles ne l'ont pas détecté. Actions : ajouter le test qui aurait attrapé le problème (non-régression), améliorer les alertes, traiter la cause à la source."
  },
  {
    id: "tq-p1-4", langue: "tests", niveau: "pro", type: "code",
    front: "Revue de la stratégie de tests d'une équipe. Liste les faiblesses et propose des améliorations.",
    code: "# - Pas de tests automatisés : « on vérifie le tableau de bord le matin »\n# - 1 seul test dbt : not_null sur fait_ventes.id_vente\n# - Les modifications SQL sont poussées directement sur main puis en prod\n# - Données de prod complètes (noms, e-mails) copiées sur les postes des devs\n# - Les alertes Slack de qualité (~40 par jour) sont mises en sourdine",
    back: "1. Contrôle manuel du matin : lent, non reproductible, dépend d'une personne → tests automatisés à chaque exécution.\n2. Un seul not_null : il manque unique (doublons sur la clé), relationships, accepted_values, fraîcheur, volume, et une réconciliation avec la source.\n3. Push direct en prod : aucune revue ni CI → branches + pull requests, linting, tests unitaires, build sur un schéma de CI, diff avec la prod (non-régression), déploiement automatisé.\n4. Données personnelles en clair sur les postes : risque RGPD majeur → échantillons anonymisés ou synthétiques.\n5. Fatigue d'alerte : 40 alertes par jour ignorées = 0 alerte → revoir les seuils, supprimer les alertes inutiles, distinguer bloquant / avertissement, désigner un responsable par alerte.\nPrioriser : d'abord CI + tests de base sur les tables critiques, puis le reste."
  },
  {
    id: "tq-p1-5", langue: "tests", niveau: "pro", type: "qcm",
    front: "Par où commencer pour mettre en place des tests sur un entrepôt existant de 400 tables sans aucun test ?",
    choices: [
      "Écrire tous les tests possibles sur les 400 tables avant toute autre chose",
      "Identifier les quelques tables et KPI les plus critiques (ceux qui servent aux décisions et à la finance) et y mettre d'abord le socle : unicité, non-nullité, intégrité, fraîcheur, volume, réconciliation ; puis étendre au fil des incidents et des évolutions",
      "Attendre une refonte complète de l'entrepôt",
      "Installer un outil d'observabilité et ne plus rien faire d'autre"
    ],
    answer: 1,
    explain: "Approche par le risque, à la Pareto : quelques tables portent l'essentiel de la valeur et du risque. Chaque nouvel incident ou nouvelle modification ajoute ses tests (non-régression). Un outil d'observabilité aide à couvrir largement les volumes et la fraîcheur, mais ne remplace pas les règles métier explicites."
  },
  {
    id: "tq-p1-6", langue: "tests", niveau: "pro", type: "flip",
    front: "TDD (développement piloté par les tests) : principe, et est-ce adapté au travail data ?",
    back: "Cycle rouge → vert → refactoriser : écrire d'abord un test qui échoue (il décrit le comportement voulu), écrire le minimum de code pour le faire passer, puis améliorer le code en gardant les tests verts.\n\nEn data :\n• Très adapté aux règles métier précises et aux fonctions de transformation : écrire le cas d'exemple validé avec le métier (« un client avec un remboursement partiel donne ce CA net ») avant le code. Clarifie la règle elle-même.\n• Moins naturel pour l'exploration, où l'on ne sait pas encore ce que l'on cherche : on écrit les tests au moment de transformer l'exploration en pipeline de production.\n\nLe bénéfice principal : chaque règle métier est documentée par un exemple exécutable."
  },
  {
    id: "tq-p1-7", langue: "tests", niveau: "pro", type: "flip",
    front: "Tests vs monitoring vs observabilité : comment s'articulent-ils ?",
    back: "• Tests : vérifient des attentes CONNUES, définies à l'avance (« id unique », « la fonction renvoie 120 »). Avant la production (tests de code) et à chaque exécution (tests de données).\n• Monitoring : suit des indicateurs prédéfinis dans le temps et alerte sur des seuils (durée des jobs, taux d'échec, fraîcheur).\n• Observabilité : la capacité à COMPRENDRE un problème qu'on n'avait pas prévu, grâce aux métadonnées collectées (lignage, historique des volumes et des distributions, journaux, versions de code et de schéma). Elle répond à « pourquoi ? » et « qu'est-ce qui est impacté ? ».\n\nLes trois sont complémentaires : les tests empêchent les erreurs connues, le monitoring signale les dérives, l'observabilité accélère le diagnostic des inconnues."
  },
];
