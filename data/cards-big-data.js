// Deck généré par le skill /notes-de-cours à partir de docs_divers/BigDataASR2022.pdf (note : data/notes/big-data.js).
// Seules les notions absentes des autres decks sont couvertes (voir les renvois dans la note).
export const cardsBigData = [
  // ---- Fondamentaux ----
  {
    id: "bd-f1-1", langue: "big-data", niveau: "fondamentaux", type: "flip",
    front: "Quels sont les 3 V du big data, et quels V ajoute-t-on souvent ?",
    back: "Volume (trop de données pour une machine), Variété (formats hétérogènes : tables, texte, images, JSON…), Vélocité (données continues à traiter vite). On ajoute souvent la Véracité (les données ont-elles du sens ?), la Validité (cohérence, précision) et la Volatilité (durée d'utilité).",
    detail: "Un seul V suffit à justifier une architecture big data : 50 Go de capteurs à traiter à la seconde (vélocité) peuvent poser plus de problèmes que 5 To de tables stables traitées une fois par nuit.",
  },
  {
    id: "bd-f1-2", langue: "big-data", niveau: "fondamentaux", type: "qcm",
    front: "« Si nous corrigeons le bug de paiement Android, nous récupérerons environ 40 k€ par mois. » De quel type d'analyse s'agit-il ?",
    choices: ["Descriptive", "Diagnostique", "Prédictive", "Prescriptive"],
    answer: 3,
    explain: "Elle recommande une action et en chiffre l'effet : c'est prescriptif. Descriptif = « le CA a baissé de 8 % » ; diagnostique = « la baisse vient du mobile Android » ; prédictif = « sans action, avril baissera de 5 % ».",
  },
  {
    id: "bd-f1-3", langue: "big-data", niveau: "fondamentaux", type: "flip",
    front: "Anonymisation vs pseudonymisation : quelle différence, et laquelle reste soumise au RGPD ?",
    back: "La pseudonymisation remplace les identifiants directs (nom, e-mail) par un alias : elle est réversible avec la table de correspondance, et les données restent PERSONNELLES (RGPD applicable). L'anonymisation rend l'identification impossible, de façon irréversible : les données ne sont plus personnelles.",
    example: "Pseudonymisé : client_8F3A | 34 ans | 69003 | asthme  -> encore personnel\nAnonymisé (k = 2) : 30-39 ans | 69*** | asthme   -> au moins 2 personnes partagent ce profil",
  },
  {
    id: "bd-f1-4", langue: "big-data", niveau: "fondamentaux", type: "flip",
    front: "Quelles sont les quatre familles de bases NoSQL et un usage typique de chacune ?",
    back: "Clé-valeur (Redis, DynamoDB) : sessions, paniers, cache. Document (MongoDB) : catalogues produits, contenus à schéma variable. Colonnes (Cassandra, HBase) : séries temporelles, IoT, écritures massives. Graphe (Neo4j) : réseaux sociaux, recommandation, plus courts chemins.",
  },
  {
    id: "bd-f1-5", langue: "big-data", niveau: "fondamentaux", type: "flip",
    front: "Qu'est-ce que le sharding ?",
    back: "Un partitionnement horizontal : les lignes d'une base sont réparties entre plusieurs nœuds selon une clé (par exemple hash(client_id) mod N). Chaque nœud ne stocke et ne sert qu'une partie des données, ce qui permet de monter en charge en ajoutant des machines.",
    example: "hash(1042) mod 3 = 1  ->  le client 1042 est stocké (et lu) sur le nœud 1 uniquement",
  },
  {
    id: "bd-f1-6", langue: "big-data", niveau: "fondamentaux", type: "flip",
    front: "Que dit le théorème CAP ?",
    back: "Un système distribué ne peut pas garantir simultanément la Cohérence (tous voient les mêmes données), la Disponibilité (toute requête reçoit une réponse) et la tolérance au Partitionnement (le système continue malgré une coupure réseau). Il faut en sacrifier une.",
    detail: "Comme les coupures réseau finissent toujours par arriver dans un système réparti, le choix réel se fait pendant une partition : refuser de répondre (CP) ou répondre avec une donnée peut-être périmée (AP).",
  },
  {
    id: "bd-f1-7", langue: "big-data", niveau: "fondamentaux", type: "flip",
    front: "Pourquoi HDFS découpe-t-il les fichiers en gros blocs répliqués ?",
    back: "Les blocs (128 Mo par défaut) sont répartis sur les machines pour que plusieurs tâches lisent un fichier en parallèle, chacune près de son bloc. Chaque bloc est copié 3 fois sur des machines différentes : une panne ne fait perdre aucune donnée, et le système recrée automatiquement la copie manquante.",
    example: "Fichier de 1 Go : 1024 / 128 = 8 blocs -> 24 copies -> 3 Go occupés sur le cluster",
  },
  {
    id: "bd-f1-8", langue: "big-data", niveau: "fondamentaux", type: "flip",
    front: "Quelles sont les trois étapes de MapReduce, et lesquelles écrit le programmeur ?",
    back: "1) Map : sur chaque bloc en parallèle, émettre des paires (clé, valeur). 2) Shuffle / group by key : le framework trie et regroupe toutes les paires de même clé sur le même reducer. 3) Reduce : agréger les valeurs de chaque clé. Le programmeur n'écrit que map et reduce ; le framework gère le découpage, la planification, le shuffle et les pannes.",
    example: "Entrée : « le chat voit le chien » | « le chien dort »\nMap     : (le,1) (chat,1) (voit,1) (le,1) (chien,1) | (le,1) (chien,1) (dort,1)\nShuffle : le:[1,1,1]  chien:[1,1]  chat:[1]  voit:[1]  dort:[1]\nReduce  : le 3 · chien 2 · chat 1 · voit 1 · dort 1",
  },
  {
    id: "bd-f1-9", langue: "big-data", niveau: "fondamentaux", type: "qcm",
    front: "Pourquoi Spark est-il beaucoup plus rapide que MapReduce sur un algorithme itératif comme k-means ?",
    choices: [
      "Parce qu'il utilise un autre système de fichiers que HDFS",
      "Parce qu'il garde les données en mémoire entre les itérations au lieu de les relire et réécrire sur disque à chaque job",
      "Parce qu'il n'a pas besoin de shuffle",
      "Parce qu'il compresse mieux les données",
    ],
    answer: 1,
    explain: "MapReduce écrit ses résultats intermédiaires sur disque et enchaîne un job par itération. Spark lit les données une fois puis itère en mémoire (cache). Le cours cite k-means : 155 s par itération sous Hadoop contre 4,1 s sous Spark. Spark fait aussi des shuffles (groupBy, join).",
  },
  {
    id: "bd-f1-10", langue: "big-data", niveau: "fondamentaux", type: "flip",
    front: "Qu'est-ce qu'un RDD et que veut dire « résilient » ?",
    back: "Resilient Distributed Dataset : une collection immuable, répartie en partitions sur le cluster, gardée en mémoire quand c'est possible. Résilient : si une partition est perdue (panne d'un exécuteur), Spark la recalcule à partir de sa lignée, la suite de transformations qui l'a produite, au lieu de stocker des copies des données.",
  },

  // ---- Intermédiaire ----
  {
    id: "bd-i1-1", langue: "big-data", niveau: "intermediaire", type: "flip",
    front: "Qu'est-ce que le k-anonymat, et quelle est sa principale faiblesse ?",
    back: "On généralise les attributs quasi-identifiants (âge → tranche, code postal → département) jusqu'à ce que chaque combinaison soit partagée par au moins k personnes. Faiblesse : si toutes les personnes d'un groupe ont la même valeur sensible (même diagnostic), on l'apprend quand même (attaque par homogénéité) ; d'où la l-diversité.",
    example: "Après généralisation (k = 2) :\n30-39 | 69*** | asthme\n30-39 | 69*** | diabète\n50-59 | 75*** | asthme\n50-59 | 75*** | grippe",
  },
  {
    id: "bd-i1-2", langue: "big-data", niveau: "intermediaire", type: "flip",
    front: "Pourquoi un jeu de données où l'on a seulement supprimé les noms reste-t-il risqué ?",
    back: "Les autres colonnes (date de naissance, code postal, sexe…) forment souvent une combinaison unique. En les croisant avec une source publique ou externe (liste électorale, réseaux sociaux, connaissance d'un voisin), on retrouve la personne. Plus on corrèle de sources, plus le risque de ré-identification augmente.",
    detail: "Autre attaque fréquente : un e-mail haché sans « sel » se retrouve en hachant une liste d'e-mails connus et en comparant les résultats.",
  },
  {
    id: "bd-i1-3", langue: "big-data", niveau: "intermediaire", type: "qcm",
    front: "Une application stocke des fiches produits très différentes les unes des autres (un livre, un téléviseur, un vêtement) et doit filtrer sur n'importe quel attribut. Quelle famille NoSQL convient le mieux ?",
    choices: ["Clé-valeur", "Document", "Graphe", "Aucune : seul le relationnel le permet"],
    answer: 1,
    explain: "Une base document stocke des objets JSON au schéma libre et permet d'indexer et d'interroger n'importe quel champ. Une base clé-valeur ne sait chercher que par la clé (la valeur est opaque) ; une base graphe sert aux relations entre entités.",
  },
  {
    id: "bd-i1-4", langue: "big-data", niveau: "intermediaire", type: "flip",
    front: "Pourquoi dit-on qu'avec Cassandra (orientée colonnes) il faut modéliser « à partir des requêtes » ?",
    back: "Sans jointure et avec un accès efficace seulement par la clé de partition, chaque requête importante doit trouver ses données dans une seule table, rangées dans le bon ordre. On crée donc une table par motif d'accès, quitte à dupliquer les données (dénormalisation), au lieu d'un schéma normalisé unique.",
    example: "Requête « messages d'un utilisateur, du plus récent au plus ancien » :\nCREATE TABLE messages_par_user (user_id uuid, ts timestamp, texte text,\n  PRIMARY KEY (user_id, ts)) WITH CLUSTERING ORDER BY (ts DESC);",
  },
  {
    id: "bd-i1-5", langue: "big-data", niveau: "intermediaire", type: "flip",
    front: "Sharding par hachage vs par intervalles : avantages et inconvénients ?",
    back: "Hachage : répartition uniforme et équilibrée, mais une requête « entre deux clés » doit interroger tous les nœuds. Intervalles (A–F sur un nœud, G–M sur un autre…) : requêtes d'intervalle efficaces, mais risque de points chauds (toutes les nouvelles commandes datées d'aujourd'hui sur le même nœud).",
  },
  {
    id: "bd-i1-6", langue: "big-data", niveau: "intermediaire", type: "code",
    front: "Clés 0 à 11 réparties avec clé mod N. On passe de 3 à 4 nœuds. Combien de clés restent sur le même nœud, et quelle technique évite ce problème ?",
    code: "clé   : 0 1 2 3 4 5 6 7 8 9 10 11\nmod 3 : 0 1 2 0 1 2 0 1 2 0  1  2\nmod 4 : 0 1 2 3 0 1 2 3 0 1  2  3",
    back: "Seules 3 clés sur 12 (0, 1, 2) gardent le même nœud : 75 % des données devraient migrer. Le consistent hashing place nœuds et clés sur un anneau de hachage : ajouter un nœud ne déplace qu'environ 1/N des clés (celles qui tombent dans le segment récupéré par le nouveau nœud).",
  },
  {
    id: "bd-i1-7", langue: "big-data", niveau: "intermediaire", type: "flip",
    front: "Cohérence forte vs cohérence à terme (eventual consistency) ?",
    back: "Forte : après une écriture, toute lecture, quelle que soit la copie interrogée, voit la nouvelle valeur. À terme : si les écritures cessent, toutes les copies finissent par converger ; entre-temps, deux lecteurs peuvent voir des valeurs différentes. La cohérence à terme permet plus de disponibilité et moins de latence.",
    example: "Like sur un post : afficher 1 203 au lieu de 1 204 pendant une seconde est acceptable (à terme).\nSolde d'un compte avant un retrait : il faut la valeur exacte (forte).",
  },
  {
    id: "bd-i1-8", langue: "big-data", niveau: "intermediaire", type: "flip",
    front: "Dans le monde NoSQL, que désigne l'acronyme BASE et quelle philosophie traduit-il ?",
    back: "Basically Available (toujours répondre), Soft state (l'état peut évoluer sans nouvelle écriture, pendant la convergence des copies), Eventually consistent (cohérent à terme). BASE est optimiste et privilégie disponibilité et passage à l'échelle ; ACID est pessimiste et privilégie la cohérence des transactions.",
  },
  {
    id: "bd-i1-9", langue: "big-data", niveau: "intermediaire", type: "flip",
    front: "Pourquoi Hadoop envoie-t-il le calcul vers les données plutôt que l'inverse ?",
    back: "Le code d'une tâche pèse quelques Ko, les données des To : les déplacer sur le réseau serait le goulot d'étranglement. Le planificateur lance donc chaque tâche map sur une machine qui possède déjà une copie du bloc à traiter (localité des données).",
  },
  {
    id: "bd-i1-10", langue: "big-data", niveau: "intermediaire", type: "flip",
    front: "Avec 1 000 serveurs ayant chacun un MTBF de 1 000 jours, combien de pannes attendre ? Qu'en conclure ?",
    back: "Environ 1 000 / 1 000 = 1 panne par jour (et ~1 000 par jour pour le million de machines de Google en 2011). La panne est l'état normal d'un grand cluster : la réplication des données et la relance automatique des tâches doivent être intégrées au système, pas gérées à la main.",
  },
  {
    id: "bd-i1-11", langue: "big-data", niveau: "intermediaire", type: "qcm",
    front: "Quel rôle joue le NameNode dans HDFS ?",
    choices: [
      "Il stocke les blocs de données des fichiers",
      "Il conserve les métadonnées : l'arborescence des fichiers et l'emplacement de chaque bloc et de ses copies",
      "Il exécute les tâches map et reduce",
      "Il compresse les fichiers avant écriture",
    ],
    answer: 1,
    explain: "Les DataNodes stockent les blocs ; le NameNode sait quel fichier est découpé en quels blocs et où se trouve chaque copie. Il garde ces métadonnées en mémoire : c'est pourquoi des millions de petits fichiers le saturent.",
  },
  {
    id: "bd-i1-12", langue: "big-data", niveau: "intermediaire", type: "flip",
    front: "Hive, Pig, Sqoop, Flume, HBase : à quoi sert chacun dans l'écosystème Hadoop ?",
    back: "Hive : interroger des fichiers HDFS en SQL (HiveQL). Pig : écrire des flux de transformation (Pig Latin) compilés en MapReduce. Sqoop : copier des tables relationnelles vers HDFS et retour. Flume : collecter des flux de logs vers HDFS. HBase : base NoSQL orientée colonnes au-dessus de HDFS, avec accès aléatoire rapide.",
  },

  // ---- Avancé ----
  {
    id: "bd-a1-1", langue: "big-data", niveau: "avance", type: "code",
    front: "Écris le map et le reduce qui trouvent les anagrammes d'un dictionnaire (un mot par ligne). Quelle est la clé ?",
    code: "Entrée : chien, niche, chine, rage, gare, nuit",
    back: "map(mot):\n    emit(trier_lettres(mot), mot)      # chien -> (\"cehin\", \"chien\")\n\nreduce(signature, mots):\n    if len(mots) > 1:\n        emit(signature, mots)\n\nRésultat : cehin -> [chien, chine, niche] ; aegr -> [gare, rage] ; nuit est écarté.\nLa clé (les lettres triées) est identique pour tous les anagrammes : le shuffle les réunit sur le même reducer.",
  },
  {
    id: "bd-a1-2", langue: "big-data", niveau: "avance", type: "code",
    front: "Calculer le maximum d'un très gros fichier de nombres avec MapReduce. Que font map et reduce, et comment réduire le trafic réseau ?",
    code: "Bloc 1 : 3 41 7\nBloc 2 : 12 99 5\nBloc 3 : 64 2",
    back: "Map : émettre (\"max\", n) pour chaque nombre, ou mieux le maximum local du bloc. Reduce (une seule clé) : prendre le max des valeurs.\nMaxima locaux 41, 99, 64 -> reduce -> 99.\nÉmettre le max local (ou utiliser un combiner) envoie 1 valeur par bloc au lieu de tous les nombres. Limite : une seule clé = un seul reducer.",
  },
  {
    id: "bd-a1-3", langue: "big-data", niveau: "avance", type: "flip",
    front: "Qu'est-ce qu'un combiner en MapReduce, et quand ne peut-on pas l'utiliser ?",
    back: "Un « mini-reduce » exécuté sur chaque machine après le map, avant le shuffle : (le,1)(le,1)(le,1) devient (le,3) localement, ce qui réduit fortement le volume envoyé sur le réseau. Il n'est valable que pour une opération associative et commutative (somme, max, min) ; pour une moyenne, il faut combiner des paires (somme, nombre), pas des moyennes.",
    example: "Moyenne de [2, 4] et [6] :\nmoyenne des moyennes = (3 + 6) / 2 = 4,5  ✗\npaires (6, 2) + (6, 1) = (12, 3) -> 12 / 3 = 4  ✓",
  },
  {
    id: "bd-a1-4", langue: "big-data", niveau: "avance", type: "flip",
    front: "Quelles faiblesses de MapReduce Spark corrige-t-il ?",
    back: "Résultats intermédiaires sur disque → mémoire. Modèle figé en deux étapes (une suite de jobs) → DAG libre d'étapes. Lancement de tâches coûteux → tâches légères à faible latence. Pas d'optimisation → optimiseur Catalyst (avec les DataFrames). Inadapté à l'itératif → cache en mémoire réutilisé à chaque itération.",
  },
  {
    id: "bd-a1-5", langue: "big-data", niveau: "avance", type: "qcm",
    front: "Dans un pipeline MLlib, que se passe-t-il quand on appelle pipeline.fit(train) ?",
    choices: [
      "Chaque étape est appliquée à train et on obtient directement les prédictions",
      "Les transformers transforment train, chaque estimator apprend sur le résultat, et on obtient un PipelineModel composé uniquement de transformers",
      "Seul le dernier estimator est entraîné, les autres étapes sont ignorées",
      "Le pipeline est sauvegardé sur HDFS",
    ],
    answer: 1,
    explain: "fit() parcourt les étapes dans l'ordre : un transformer appelle transform(), un estimator appelle fit() et devient un modèle (lui-même un transformer). Le PipelineModel obtenu s'applique ensuite avec transform(test) pour produire la colonne prediction.",
  },
  {
    id: "bd-a1-6", langue: "big-data", niveau: "avance", type: "flip",
    front: "Fenêtre glissante sur un DStream : longueur 3, intervalle de glissement 2. Quels micro-batches couvre chaque fenêtre ?",
    back: "Fenêtre 1 : t1–t3, fenêtre 2 : t3–t5, fenêtre 3 : t5–t7. Chaque fenêtre couvre 3 micro-batches et une nouvelle démarre tous les 2 ; un micro-batch sur deux (t3, t5) est compté dans deux fenêtres. Glissement = longueur donnerait des fenêtres sans chevauchement (tumbling).",
  },
  {
    id: "bd-a1-7", langue: "big-data", niveau: "avance", type: "flip",
    front: "DStreams vs Structured Streaming : qu'est-ce qui a changé dans Spark ?",
    back: "Un DStream est une suite de RDD (un par micro-batch), manipulée avec l'API RDD et fenêtrée sur l'heure de RÉCEPTION. Structured Streaming traite le flux comme une table qui grandit, avec l'API DataFrame/SQL, l'optimiseur Catalyst, le fenêtrage sur l'heure d'ÉVÉNEMENT et le watermark pour les retardataires. Les DStreams sont dépréciés.",
    example: "flux.withWatermark(\"ts\", \"2 minutes\")\n    .groupBy(F.window(\"ts\", \"60 seconds\", \"10 seconds\"), \"mot\")\n    .count()",
  },
  {
    id: "bd-a1-8", langue: "big-data", niveau: "avance", type: "flip",
    front: "DBMS vs DSMS : en quoi une requête sur un flux diffère-t-elle d'une requête SQL classique ?",
    back: "Une requête SQL est ponctuelle : elle lit des relations finies et persistantes, puis renvoie un résultat. Une requête sur flux est continue : elle tourne en permanence sur des données non bornées, lues une seule fois dans l'ordre d'arrivée, et met à jour son résultat ; elle doit donc travailler sur des fenêtres pour agréger.",
  },

  // ---- Pro ----
  {
    id: "bd-p1-1", langue: "big-data", niveau: "pro", type: "flip",
    front: "Panier d'un site marchand vs vente de places numérotées : quel compromis CAP choisir pour chacun ?",
    back: "Panier : AP. Mieux vaut que le client puisse toujours ajouter un article, quitte à fusionner deux versions du panier après une coupure (c'est le choix historique d'Amazon Dynamo). Places numérotées : CP. Mieux vaut refuser temporairement une vente que vendre deux fois la même place.",
  },
  {
    id: "bd-p1-2", langue: "big-data", niveau: "pro", type: "flip",
    front: "Pourquoi CAP est-il souvent présenté de façon trompeuse, et que précise PACELC ?",
    back: "Dans un système réparti, les partitions réseau sont inévitables : on ne « choisit » pas CA. Le vrai arbitrage se fait PENDANT une partition, entre cohérence et disponibilité. PACELC ajoute : Else (en fonctionnement normal), on arbitre entre Latence et Cohérence. Beaucoup de bases sont réglables : Cassandra fixe le niveau de cohérence requête par requête (ONE, QUORUM, ALL).",
  },
  {
    id: "bd-p1-3", langue: "big-data", niveau: "pro", type: "qcm",
    front: "Une équipe veut calculer le chiffre d'affaires mensuel par catégorie sur 200 millions de ventes stockées dans une base graphe Neo4j. Ton avis ?",
    choices: [
      "Parfait : les bases graphes sont optimisées pour tout type de requête",
      "Mauvais choix pour cet usage : les grosses agrégations sont lentes en base graphe ; un entrepôt colonne (ou Spark SQL) est adapté, la base graphe restant utile pour les parcours de relations",
      "Il faut migrer tout le système vers une base clé-valeur",
      "Il suffit d'ajouter des index sur les nœuds",
    ],
    answer: 1,
    explain: "Chaque famille de base a son terrain. Les bases graphes excellent sur les parcours (amis d'amis, chemins), pas sur les agrégations massives. La bonne architecture combine souvent plusieurs bases (persistance polyglotte), alimentées depuis la même source.",
  },
  {
    id: "bd-p1-4", langue: "big-data", niveau: "pro", type: "flip",
    front: "Entretien : « Faut-il encore apprendre MapReduce alors que tout le monde utilise Spark ? »",
    back: "Plus besoin de l'écrire, mais il faut le comprendre : map, shuffle, reduce est exactement ce que fait Spark sous le capot (groupBy et join déclenchent un shuffle, reduceByKey combine localement avant le shuffle). Comprendre MapReduce, c'est comprendre où un job distribué passe son temps : lecture, transfert réseau du shuffle, déséquilibre des clés.",
  },
  {
    id: "bd-p1-5", langue: "big-data", niveau: "pro", type: "flip",
    front: "Data lake : pourquoi la qualité « traitée en aval » est-elle un risque, et comment le limiter ?",
    back: "Dans un lac, on charge tout sans contrôle (EL) : sans gouvernance, chaque équipe nettoie à sa façon, les chiffres divergent et le lac devient un « marécage ». On limite le risque en organisant le lac en zones (brute → nettoyée → exposée, l'architecture médaillon), avec un catalogue, des propriétaires de données et des contrôles qualité avant l'exposition.",
  },
];
