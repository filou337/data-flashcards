// Note de cours générée par le skill /notes-de-cours à partir de docs_divers/BigDataASR2022.pdf
export const note = {
  id: "big-data",
  titre: "Big Data : concepts et technologies",
  source: "BigDataASR2022.pdf · B. Defude, Télécom SudParis · 146 diapositives (2022)",
  deck: "big-data",
  resume: "Ce qui rend une donnée « big », comment protéger les données personnelles, les bases **NoSQL** et les compromis de la distribution (**sharding**, cohérence, **CAP**), la pile logicielle big data, puis le calcul distribué : **HDFS** et **MapReduce**, et pourquoi **Spark** les a remplacés (RDD, flux, MLlib).\n\nLes notions déjà vues dans tes decks (OLTP/OLAP, ETL/ELT, data lake, Kafka, fenêtres de streaming, mécanique de PySpark) ne sont pas réexpliquées : un renvoi pointe vers la bonne carte.",
  prerequis: ["dataeng", "pyspark"],
  concepts: [
    "3V", "volume", "variété", "vélocité", "véracité", "types d'analyse", "analyse descriptive", "analyse diagnostique", "analyse prédictive", "analyse prescriptive",
    "cycle de vie de la donnée", "valeur par croisement", "anonymisation", "pseudonymisation", "k-anonymat", "généralisation", "randomisation", "ré-identification",
    "NoSQL", "clé-valeur", "base document", "base orientée colonnes", "famille de colonnes", "base graphe", "Cypher", "Cassandra", "MongoDB", "HBase", "Neo4j", "Redis",
    "scalabilité horizontale", "sharding", "partitionnement par hachage", "partitionnement par intervalles", "consistent hashing", "réplication",
    "cohérence forte", "cohérence à terme", "eventual consistency", "BASE", "théorème CAP", "PACELC",
    "pile logicielle big data", "Hive", "Pig", "Sqoop", "Flume", "data wrangling",
    "MTBF", "tolérance aux pannes", "localité des données", "HDFS", "bloc HDFS", "facteur de réplication", "NameNode", "DataNode",
    "MapReduce", "map", "shuffle", "reduce", "combiner", "word count",
    "RDD", "lignée (lineage)", "DAG", "calcul en mémoire", "algorithmes itératifs", "RDD vs DataFrame vs Dataset",
    "DSMS", "requête continue", "DStream", "micro-batch", "longueur de fenêtre", "intervalle de glissement", "Structured Streaming",
    "MLlib", "pipeline ML", "transformer", "estimator",
  ],
  chapitres: [
    // ------------------------------------------------------------------
    {
      id: "contexte",
      titre: "1. Big data : de quoi parle-t-on ?",
      objectif: "Savoir dire quand un problème est « big data » et quel type d'analyse on cherche à faire.",
      blocs: [
        { type: "texte", contenu: "On parle de big data quand les outils classiques (une base relationnelle sur un serveur) ne suffisent plus, à cause d'au moins un des **3 V** :" },
        { type: "tableau", entetes: ["V", "Ce que ça veut dire", "Exemple"], lignes: [
          ["**Volume**", "Trop de données pour une seule machine", "Des téraoctets de logs web par jour"],
          ["**Variété**", "Formats hétérogènes : tables, texte, images, JSON, séries temporelles", "Tickets de caisse + avis clients + photos"],
          ["**Vélocité**", "Données produites en continu, à traiter vite", "Capteurs de santé : réagir en secondes"],
        ] },
        { type: "texte", contenu: "On ajoute souvent la **véracité** (les données ont-elles du sens ?), la **validité** (sont-elles cohérentes et précises ?) et la **volatilité** (combien de temps restent-elles utiles ?)." },
        { type: "schema", svg: `<svg viewBox="0 0 360 214" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Quatre types d'analyse, du passé vers le futur">
  <defs><marker id="fl-bd-analyse" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="s-arrow"/></marker></defs>
  <path d="M10 16H346" class="s-line" marker-end="url(#fl-bd-analyse)"/>
  <text x="10" y="34" class="s-sub">passé</text>
  <text x="350" y="34" text-anchor="end" class="s-sub">futur</text>
  <rect x="6" y="44" width="170" height="74" rx="8" class="s-box"/>
  <text x="91" y="70" text-anchor="middle" class="s-bold">Descriptive</text>
  <text x="91" y="89" text-anchor="middle" class="s-sub">Que s'est-il passé ?</text>
  <text x="91" y="106" text-anchor="middle" class="s-sub">reporting, tableaux de bord</text>
  <rect x="184" y="44" width="170" height="74" rx="8" class="s-box"/>
  <text x="269" y="70" text-anchor="middle" class="s-bold">Diagnostique</text>
  <text x="269" y="89" text-anchor="middle" class="s-sub">Pourquoi ?</text>
  <text x="269" y="106" text-anchor="middle" class="s-sub">data mining, causes</text>
  <rect x="6" y="128" width="170" height="74" rx="8" class="s-box"/>
  <text x="91" y="154" text-anchor="middle" class="s-bold">Prédictive</text>
  <text x="91" y="173" text-anchor="middle" class="s-sub">Que va-t-il se passer ?</text>
  <text x="91" y="190" text-anchor="middle" class="s-sub">modèles, scores</text>
  <rect x="184" y="128" width="170" height="74" rx="8" class="s-acc"/>
  <text x="269" y="154" text-anchor="middle" class="s-bold">Prescriptive</text>
  <text x="269" y="173" text-anchor="middle" class="s-sub">Que faut-il faire ?</text>
  <text x="269" y="190" text-anchor="middle" class="s-sub">recommandation d'action</text>
</svg>`, legende: "Les quatre types d'analyse : plus on va vers la droite et le bas, plus l'analyse apporte de valeur et plus elle est difficile." },
        { type: "exemple", titre: "Les quatre questions sur un même sujet", contenu: "Ventes d'une enseigne : **descriptive** « le CA a baissé de 8 % en mars » ; **diagnostique** « la baisse vient du mobile Android » ; **prédictive** « sans action, avril baissera de 5 % » ; **prescriptive** « corriger le paiement Android rapporterait ~40 k€/mois »." },
        { type: "texte", contenu: "La valeur naît surtout du **croisement** de sources (éviter les silos) : une donnée prend de la valeur à chaque nouvel usage. Exemple du cours : *La Bonne Boîte* (Pôle emploi) croise les déclarations préalables à l'embauche et les embauches réelles pour prédire quelles entreprises vont recruter, par métier et par zone." },
        { type: "renvoi", vers: "tests", contenu: "La qualité des données (incomplètes, bruitées, incohérentes, imprécises, périmées) et le nettoyage (doublons, valeurs nulles, outliers) sont détaillés dans le deck Tests & qualité, carte « Les dimensions de la qualité des données »." },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: "vie-privee",
      titre: "2. Données personnelles : anonymiser ou pseudonymiser",
      objectif: "Distinguer les deux techniques et savoir pourquoi des données « anonymes » peuvent être ré-identifiées.",
      blocs: [
        { type: "tableau", entetes: ["", "Anonymisation", "Pseudonymisation"], lignes: [
          ["Principe", "Rendre **impossible**, en pratique, l'identification d'une personne", "Remplacer les identifiants directs (nom, e-mail) par un alias"],
          ["Réversible ?", "Non, jamais", "Oui, avec la table de correspondance"],
          ["Encore une donnée personnelle (RGPD) ?", "**Non**", "**Oui**"],
          ["Usage", "Open data, partage externe", "Analyses internes, données de test"],
        ] },
        { type: "attention", contenu: "Remplacer le nom par un numéro n'est **pas** anonymiser : c'est pseudonymiser. Les autres colonnes (âge, code postal, date de naissance) suffisent souvent à retrouver la personne en croisant avec une autre source. Plus on croise de sources, plus le risque augmente." },
        { type: "texte", contenu: "Une vraie anonymisation doit garantir trois choses : on ne peut pas **isoler** un individu, on ne peut pas **relier** deux enregistrements d'une même personne, on ne peut pas **déduire** avec forte probabilité la valeur d'un attribut à partir des autres." },
        { type: "liste", items: [
          "**Randomisation** : ajouter du bruit (dégrader la précision d'une mesure) ou permuter des valeurs entre lignes (garde la distribution, mais casse les liens entre colonnes).",
          "**Généralisation** : changer d'échelle (ville → département, âge → tranche d'âge).",
          "**k-anonymat** : généraliser jusqu'à ce que chaque combinaison d'attributs « quasi-identifiants » soit partagée par **au moins k** personnes.",
        ] },
        { type: "exemple", titre: "Rendre une table 2-anonyme", contenu: "Quasi-identifiants : âge et code postal. Avant, chaque ligne est unique, donc ré-identifiable. Après généralisation, chaque combinaison apparaît au moins 2 fois :", code: `Avant                          Après (k = 2)
âge | CP    | diagnostic       âge   | CP    | diagnostic
 34 | 69003 | asthme           30-39 | 69*** | asthme
 37 | 69007 | diabète          30-39 | 69*** | diabète
 52 | 75011 | asthme           50-59 | 75*** | asthme
 58 | 75018 | grippe           50-59 | 75*** | grippe` },
        { type: "attention", contenu: "Le k-anonymat ne suffit pas toujours : si les 2 personnes d'un groupe ont le **même** diagnostic, on l'apprend quand même (attaque par homogénéité). Précision : les variantes *l-diversité* et *t-proximité* imposent en plus de la diversité dans les attributs sensibles." },
        { type: "texte", contenu: "Attaques classiques : retrouver et **inverser** la fonction de pseudonymisation (un hash d'e-mail sans « sel » se casse par dictionnaire), **croiser** avec une source non anonymisée, utiliser des **connaissances externes** (« mon voisin a 58 ans et vit dans le 18e »)." },
        { type: "renvoi", vers: "dataeng", contenu: "Comment appliquer le RGPD dans un data lake (droit à l'effacement, crypto-shredding, pseudonymiser tôt) : deck Data engineering, carte « RGPD dans un data lake »." },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: "nosql",
      titre: "3. Bases NoSQL : quatre familles",
      objectif: "Choisir une famille de base selon la forme des données et les requêtes à servir.",
      blocs: [
        { type: "texte", contenu: "Le relationnel est mature, déclaratif (SQL) et transactionnel, mais il a été pensé « **one size fits all** » sur un serveur. Les bases **NoSQL** (« not only SQL ») sacrifient une partie de ces garanties pour autre chose :" },
        { type: "tableau", entetes: ["Ce que NoSQL privilégie", "Ce que NoSQL sacrifie souvent"], lignes: [
          ["Montée en charge horizontale sur des serveurs standards", "Langage déclaratif et SQL complet"],
          ["Écritures massives à faible latence", "Jointures (faites dans l'application)"],
          ["Haute disponibilité, réplication, reprise sur panne", "Transactions multi-enregistrements"],
          ["Schéma souple", "Cohérence forte (souvent réglable)"],
        ] },
        { type: "schema", svg: `<svg viewBox="0 0 360 226" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Les quatre familles NoSQL">
  <rect x="6" y="6" width="170" height="104" rx="8" class="s-box"/>
  <text x="91" y="28" text-anchor="middle" class="s-bold">Clé-valeur</text>
  <rect x="18" y="40" width="58" height="24" rx="4" class="s-acc"/>
  <text x="47" y="57" text-anchor="middle" class="s-sub">panier:42</text>
  <rect x="94" y="40" width="70" height="24" rx="4" class="s-box"/>
  <text x="129" y="57" text-anchor="middle" class="s-sub">(opaque)</text>
  <path d="M76 52H94" class="s-line"/>
  <text x="91" y="94" text-anchor="middle" class="s-sub">Redis, DynamoDB</text>
  <rect x="184" y="6" width="170" height="104" rx="8" class="s-box"/>
  <text x="269" y="28" text-anchor="middle" class="s-bold">Document</text>
  <text x="200" y="50" class="s-sub">{ "nom": "Ana",</text>
  <text x="208" y="65" class="s-sub">"cmd": [ {…}, {…} ] }</text>
  <text x="269" y="94" text-anchor="middle" class="s-sub">MongoDB, CouchDB</text>
  <rect x="6" y="116" width="170" height="104" rx="8" class="s-box"/>
  <text x="91" y="138" text-anchor="middle" class="s-bold">Colonnes</text>
  <text x="18" y="160" class="s-sub">ligne → (colonne, valeur,</text>
  <text x="30" y="175" class="s-sub">horodatage) × N</text>
  <text x="91" y="204" text-anchor="middle" class="s-sub">Cassandra, HBase</text>
  <rect x="184" y="116" width="170" height="104" rx="8" class="s-box"/>
  <text x="269" y="138" text-anchor="middle" class="s-bold">Graphe</text>
  <path d="M220 168L268 152M268 152L318 172M220 168L318 172" class="s-line"/>
  <circle cx="220" cy="168" r="9" class="s-acc"/>
  <circle cx="268" cy="152" r="9" class="s-acc"/>
  <circle cx="318" cy="172" r="9" class="s-acc"/>
  <text x="269" y="204" text-anchor="middle" class="s-sub">Neo4j</text>
</svg>`, legende: "Les quatre modèles de données NoSQL." },
        { type: "tableau", entetes: ["Famille", "Modèle", "Bien pour", "Limite"], lignes: [
          ["**Clé-valeur**", "Une clé → une valeur opaque. Opérations : put, get, delete", "Sessions, paniers, cache, profils", "Interrogation uniquement par la clé"],
          ["**Document**", "Une clé → un document JSON imbriqué, schéma libre", "Catalogues produits, contenus, historiques", "Données très interconnectées, transactions limitées"],
          ["**Colonnes**", "Une ligne = clé + ensemble variable de (colonne, valeur, horodatage)", "Séries temporelles, IoT, écritures massives", "Modéliser **à partir des requêtes**, pas de jointure"],
          ["**Graphe**", "Nœuds et arcs avec propriétés", "Réseaux sociaux, recommandation, chemins", "Lent pour les grosses agrégations"],
        ] },
        { type: "exemple", titre: "Le même client dans deux modèles", contenu: "En relationnel, 2 tables et une jointure. En document, un seul objet qu'on lit en une fois :", code: `-- Relationnel
clients(id, nom)            commandes(id, client_id, montant)
SELECT c.nom, SUM(o.montant) FROM clients c JOIN commandes o ON o.client_id = c.id GROUP BY c.nom;

// Document (MongoDB)
{ "_id": 7, "nom": "Ana",
  "commandes": [ { "id": "C1", "montant": 40 }, { "id": "C2", "montant": 25 } ] }
db.clients.find({ "commandes.montant": { $gt: 30 } })` },
        { type: "exemple", titre: "Requête de graphe (Cypher)", contenu: "Trouver toutes les paires ancêtre–descendant : en SQL il faut une CTE récursive ; en Cypher, un motif de chemin de longueur variable suffit :", code: `MATCH p = (d:Personne)-[:PARENT*]->(a:Personne)
RETURN a.nom AS ancetre, d.nom AS descendant, length(p) AS generations
ORDER BY ancetre, generations` },
        { type: "application", titre: "Recommandation « amis d'amis »", contenu: "Le cours cite Meetic : trouver les amis d'amis du même âge revient à parcourir 2 arcs depuis un nœud. En relationnel, c'est une auto-jointure qui explose avec la taille ; en base graphe, le coût dépend seulement du voisinage parcouru." },
        { type: "attention", contenu: "Une base graphe n'est pas faite pour compter les ventes du mois par catégorie : pour de grosses agrégations, un entrepôt relationnel ou colonne reste bien meilleur. Choisir NoSQL « parce que c'est big data » est une erreur classique ; on choisit selon la forme des données et des requêtes. En pratique, on combine souvent plusieurs bases (*persistance polyglotte*)." },
        { type: "renvoi", vers: "sql", contenu: "Le stockage colonne des entrepôts analytiques (BigQuery, Snowflake, Vertica) est un autre sujet que les bases NoSQL « orientées colonnes » : voir la carte SQL « Différence de stockage entre un moteur OLTP et un entrepôt OLAP colonne »." },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: "distribution",
      titre: "4. Distribuer les données : sharding, cohérence, CAP",
      objectif: "Comprendre ce qu'on gagne et ce qu'on perd quand une base est répartie sur plusieurs machines.",
      blocs: [
        { type: "definition", terme: "Sharding", contenu: "Partitionnement **horizontal** : les lignes sont réparties entre plusieurs nœuds selon une clé. Chaque nœud ne porte qu'une partie des données, ce qui permet une montée en charge presque linéaire." },
        { type: "schema", svg: `<svg viewBox="0 0 360 196" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sharding par hachage de la clé">
  <defs><marker id="fl-bd-shard" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="s-arrow"/></marker></defs>
  <rect x="100" y="6" width="160" height="34" rx="8" class="s-box"/>
  <text x="180" y="28" text-anchor="middle" class="s-txt">client_id = 1042</text>
  <path d="M180 40V58" class="s-line" marker-end="url(#fl-bd-shard)"/>
  <rect x="80" y="62" width="200" height="34" rx="8" class="s-acc"/>
  <text x="180" y="84" text-anchor="middle" class="s-txt">hash(1042) mod 3 = 1</text>
  <path d="M130 96L64 130" class="s-dash"/>
  <path d="M180 96V128" class="s-line" marker-end="url(#fl-bd-shard)"/>
  <path d="M230 96L296 130" class="s-dash"/>
  <rect x="6" y="134" width="108" height="54" rx="8" class="s-box"/>
  <text x="60" y="158" text-anchor="middle" class="s-bold">Nœud 0</text>
  <text x="60" y="176" text-anchor="middle" class="s-sub">1/3 des clients</text>
  <rect x="126" y="134" width="108" height="54" rx="8" class="s-ok"/>
  <text x="180" y="158" text-anchor="middle" class="s-bold">Nœud 1</text>
  <text x="180" y="176" text-anchor="middle" class="s-sub">client 1042</text>
  <rect x="246" y="134" width="108" height="54" rx="8" class="s-box"/>
  <text x="300" y="158" text-anchor="middle" class="s-bold">Nœud 2</text>
  <text x="300" y="176" text-anchor="middle" class="s-sub">1/3 des clients</text>
</svg>`, legende: "Partitionnement par hachage : la clé décide du nœud, sans coordination entre les nœuds." },
        { type: "tableau", entetes: ["", "Par hachage (hash)", "Par intervalles (range)"], lignes: [
          ["Principe", "nœud = hash(clé) mod N", "clés A–F sur le nœud 1, G–M sur le nœud 2…"],
          ["Répartition", "Uniforme, équilibrée", "Pas forcément uniforme (points chauds)"],
          ["Requête « entre deux clés »", "Coûteuse : tous les nœuds", "Efficace : un ou deux nœuds"],
        ] },
        { type: "attention", contenu: "Avec un simple `hash(clé) mod N`, ajouter un 4e nœud change le nœud de presque toutes les clés : il faudrait tout déplacer. Le **consistent hashing** place nœuds et clés sur un anneau : ajouter un nœud ne déplace qu'environ 1/N des clés (« coût de migration constant » dans le cours)." },
        { type: "exemple", titre: "Ce que coûte le mod N", contenu: "Clés 0 à 11, passage de 3 à 4 nœuds avec `clé mod N` :", code: `clé      : 0 1 2 3 4 5 6 7 8 9 10 11
mod 3    : 0 1 2 0 1 2 0 1 2 0  1  2
mod 4    : 0 1 2 3 0 1 2 3 0 1  2  3
inchangé : ✓ ✓ ✓ · · · · · · · ·  ·`, resultat: "3 clés sur 12 restent en place : 75 % des données doivent migrer." },
        { type: "texte", contenu: "Chaque partition est en général **répliquée** sur plusieurs nœuds. Se pose alors la question de la cohérence entre copies :" },
        { type: "liste", items: [
          "**Cohérence forte** : après une écriture, toute lecture, sur n'importe quelle copie, voit la nouvelle valeur.",
          "**Cohérence faible** : aucune garantie qu'une lecture voie la dernière écriture.",
          "**Cohérence à terme** (*eventual consistency*) : si les écritures s'arrêtent, toutes les copies finissent par converger. Pendant un court moment, deux lecteurs peuvent voir des valeurs différentes.",
        ] },
        { type: "renvoi", vers: "sql", contenu: "Les propriétés ACID (atomicité, cohérence, isolation, durabilité) sont dans le deck SQL, carte « Que signifie ACID ? »." },
        { type: "definition", terme: "BASE", contenu: "L'approche opposée à ACID des systèmes web à très fort trafic : **B**asically **A**vailable (toujours répondre), **S**oft state (l'état peut évoluer sans écriture, pendant la convergence), **E**ventually consistent. Optimiste, simple et rapide ; ACID est pessimiste et rigoureux." },
        { type: "definition", terme: "Théorème CAP (Brewer)", contenu: "Un système distribué ne peut pas garantir à la fois la **C**ohérence (tous voient les mêmes données), la **D**isponibilité (*Availability* : toute requête reçoit une réponse) et la tolérance au **P**artitionnement (le système continue malgré une coupure réseau entre nœuds)." },
        { type: "schema", svg: `<svg viewBox="0 0 360 236" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Triangle CAP">
  <path d="M180 30L322 196L38 196Z" class="s-line"/>
  <circle cx="180" cy="30" r="16" class="s-acc"/>
  <text x="180" y="35" text-anchor="middle" class="s-bold">C</text>
  <circle cx="38" cy="196" r="16" class="s-acc"/>
  <text x="38" y="201" text-anchor="middle" class="s-bold">A</text>
  <circle cx="322" cy="196" r="16" class="s-acc"/>
  <text x="322" y="201" text-anchor="middle" class="s-bold">P</text>
  <text x="84" y="78" text-anchor="end" class="s-bold">CA</text>
  <text x="84" y="94" text-anchor="end" class="s-sub">SGBD relationnel</text>
  <text x="84" y="108" text-anchor="end" class="s-sub">sur un seul site</text>
  <text x="272" y="78" class="s-bold">CP</text>
  <text x="272" y="94" class="s-sub">HBase,</text>
  <text x="272" y="108" class="s-sub">MongoDB</text>
  <text x="180" y="220" text-anchor="middle" class="s-bold">AP</text>
  <text x="180" y="234" text-anchor="middle" class="s-sub">Cassandra, DynamoDB, CouchDB</text>
</svg>`, legende: "Chaque côté du triangle = les deux propriétés qu'on garde (classement du cours, simplifié)." },
        { type: "exemple", titre: "Une coupure réseau, deux comportements", contenu: "Deux répliques d'un compte bancaire perdent le contact. Un client écrit sur la réplique 1. Un autre lit sur la réplique 2.", code: `Choix CP : la réplique 2 refuse de répondre (erreur / attente)
           → données toujours justes, service partiellement indisponible
Choix AP : la réplique 2 répond avec l'ancienne valeur
           → service toujours disponible, lecture périmée, réconciliation plus tard` },
        { type: "attention", contenu: "Précision (au-delà du cours) : dans un système réparti, les coupures réseau arrivent forcément, donc P n'est pas vraiment optionnel ; le vrai choix se fait **pendant une partition**, entre C et A. Le modèle **PACELC** ajoute qu'en temps normal (*Else*), on arbitre entre latence et cohérence. Et beaucoup de bases sont réglables : Cassandra permet de choisir le niveau de cohérence requête par requête." },
        { type: "application", titre: "Que prioriser ?", contenu: "Panier d'un site marchand : mieux vaut **AP** (le client peut toujours ajouter un article, on fusionne les paniers ensuite). Solde bancaire ou stock de billets numérotés : **CP** (refuser une opération plutôt que vendre deux fois la même place)." },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: "dw-lake",
      titre: "5. Entrepôt de données ou data lake",
      objectif: "Ce que le cours ajoute à la comparaison déjà connue.",
      blocs: [
        { type: "renvoi", vers: "dataeng", contenu: "Définitions de data warehouse, data lake et lakehouse, ETL vs ELT, OLTP vs OLAP : deck Data engineering (cartes « Data warehouse, data lake, lakehouse », « ETL vs ELT », « OLTP vs OLAP »)." },
        { type: "tableau", entetes: ["Critère", "Entrepôt (BI traditionnelle)", "Data lake (plateforme big data)"], lignes: [
          ["Données", "Structurées, surtout internes", "Brutes : structurées, semi- ou non structurées, sources externes"],
          ["Alimentation", "ETL", "EL (on charge, on transformera plus tard)"],
          ["Qualité", "Traitée **en amont**, avant chargement", "Traitée **en aval**, au moment de l'usage"],
          ["Schéma", "Unifié, stable", "Pas de schéma unifié (schéma à la lecture)"],
          ["Coût de stockage", "Élevé pour de gros volumes", "Faible (stockage objet)"],
          ["Agilité", "Faible : chaque nouvelle source demande du travail", "Forte : on expérimente vite"],
          ["Utilisateurs", "Métiers, rapports récurrents", "Data scientists, exploration"],
        ] },
        { type: "definition", terme: "Data wrangling", contenu: "La préparation « à la demande » des données brutes du lac pour un usage précis : sélectionner, nettoyer, croiser, anonymiser. Dans un entrepôt, ce travail est fait une fois pour toutes en amont." },
        { type: "exemple", titre: "Transformations typiques d'un ETL d'entrepôt", contenu: "Uniformiser les formats et unités (dates, devises) ; unifier les écritures d'une même valeur (`AF234` et `Air France 234`) ; homogénéiser les structures (adresse en un champ ou en rue / ville / CP) ; corriger les erreurs. Chaque nouvelle source ou modification du schéma oblige à revoir ces scripts, d'où l'intérêt des outils ETL (Talend…) puis de l'ELT." },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: "pile",
      titre: "6. La pile logicielle big data",
      objectif: "Situer chaque outil (Kafka, HDFS, Spark, Hive…) dans une architecture.",
      blocs: [
        { type: "schema", svg: `<svg viewBox="0 0 360 288" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Couches de la pile big data">
  <defs><marker id="fl-bd-pile" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="s-arrow"/></marker></defs>
  <rect x="6" y="6" width="348" height="34" rx="6" class="s-acc"/>
  <text x="16" y="28" class="s-bold">Dataviz</text>
  <text x="344" y="28" text-anchor="end" class="s-sub">Power BI, Tableau, D3.js</text>
  <rect x="6" y="54" width="348" height="34" rx="6" class="s-box"/>
  <text x="16" y="76" class="s-bold">Machine learning</text>
  <text x="344" y="76" text-anchor="end" class="s-sub">Spark MLlib</text>
  <rect x="6" y="102" width="348" height="34" rx="6" class="s-box"/>
  <text x="16" y="124" class="s-bold">Requêtage SQL</text>
  <text x="344" y="124" text-anchor="end" class="s-sub">Hive, Impala, Spark SQL</text>
  <rect x="6" y="150" width="348" height="34" rx="6" class="s-box"/>
  <text x="16" y="172" class="s-bold">Calcul parallèle</text>
  <text x="344" y="172" text-anchor="end" class="s-sub">MapReduce, Spark, Streaming</text>
  <rect x="6" y="198" width="348" height="34" rx="6" class="s-box"/>
  <text x="16" y="220" class="s-bold">Stockage</text>
  <text x="344" y="220" text-anchor="end" class="s-sub">HDFS, HBase, stockage objet</text>
  <rect x="6" y="246" width="348" height="34" rx="6" class="s-box"/>
  <text x="16" y="268" class="s-bold">Ingestion</text>
  <text x="344" y="268" text-anchor="end" class="s-sub">Sqoop, Flume, Kafka</text>
  <path d="M180 246V236" class="s-line" marker-end="url(#fl-bd-pile)"/>
  <path d="M180 198V188" class="s-line" marker-end="url(#fl-bd-pile)"/>
  <path d="M180 150V140" class="s-line" marker-end="url(#fl-bd-pile)"/>
  <path d="M180 102V92" class="s-line" marker-end="url(#fl-bd-pile)"/>
  <path d="M180 54V44" class="s-line" marker-end="url(#fl-bd-pile)"/>
</svg>`, legende: "Les données montent de l'ingestion jusqu'à la visualisation. Chaque couche a ses outils." },
        { type: "tableau", entetes: ["Outil", "Rôle en une phrase"], lignes: [
          ["**Sqoop**", "Copier des tables d'une base relationnelle vers HDFS (et retour)"],
          ["**Flume**", "Collecter des flux de logs vers HDFS"],
          ["**Kafka**", "Journal de messages distribué : transporter des flux entre producteurs et consommateurs"],
          ["**HBase**", "Base NoSQL orientée colonnes au-dessus de HDFS (accès aléatoire rapide)"],
          ["**Hive**", "Interroger en SQL (HiveQL) des fichiers HDFS ; à l'origine traduit en jobs MapReduce"],
          ["**Pig**", "Langage de flux de données (Pig Latin) compilé en MapReduce"],
          ["**Spark**", "Moteur de calcul unifié : batch, SQL, streaming, ML"],
        ] },
        { type: "exemple", titre: "Trois architectures du cours", contenu: "**Batch** : base relationnelle → Sqoop → HDFS → MapReduce / Hive → rapports. Le New York Times a converti 4 To de scans (articles de 1851 à 1980) en 1,5 To de PDF en 24 h avec 100 machines EC2 et Elastic MapReduce.\n\n**Streaming** : tweets → Kafka → Spark Streaming → tableau de bord D3.js, pour détecter en temps réel une vague d'avis négatifs sur un produit.\n\n**Machine learning** : historique des dossiers de crédit (HDFS) → modèle MLlib → score appliqué à chaque nouvelle demande." },
        { type: "renvoi", vers: "dataeng", contenu: "Batch ou streaming, comment choisir, et les architectures Lambda / Kappa : deck Data engineering." },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: "hadoop",
      titre: "7. Hadoop : HDFS et MapReduce",
      objectif: "Comprendre comment Hadoop stocke et calcule sur des milliers de machines qui tombent en panne.",
      blocs: [
        { type: "texte", contenu: "Deux constats fondent Hadoop (inspiré de GFS et MapReduce chez Google) : sur des milliers de machines standards, **les pannes sont quotidiennes**, et **déplacer les données sur le réseau coûte plus cher que les calculer**." },
        { type: "formule", contenu: "pannes par jour ≈ nombre de machines / MTBF (en jours)", explication: "MTBF = durée moyenne entre deux pannes d'une machine. Avec un MTBF de 1 000 jours (environ 3 ans) et 1 000 serveurs : 1 000 / 1 000 = **1 panne par jour**. Avec le million de machines de Google en 2011 : environ 1 000 pannes par jour. Conclusion : la tolérance aux pannes doit être automatique, pas manuelle." },
        { type: "definition", terme: "Localité des données", contenu: "Envoyer le **code** là où sont les **données** (quelques Ko) plutôt que l'inverse (des To). Le planificateur lance chaque tâche sur une machine qui possède déjà le bloc à traiter." },
        { type: "texte", contenu: "**HDFS** (Hadoop Distributed File System) est conçu pour un petit nombre de **très gros fichiers**, écrits une fois et lus de nombreuses fois. Chaque fichier est découpé en **blocs** (128 Mo par défaut) répliqués sur plusieurs machines (3 copies par défaut)." },
        { type: "schema", svg: `<svg viewBox="0 0 360 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Un fichier HDFS découpé en blocs répliqués">
  <text x="6" y="18" class="s-bold">ventes.csv · 300 Mo</text>
  <rect x="6" y="28" width="128" height="30" rx="4" class="s-acc"/>
  <text x="70" y="48" text-anchor="middle" class="s-txt">B1 · 128 Mo</text>
  <rect x="138" y="28" width="128" height="30" rx="4" class="s-acc"/>
  <text x="202" y="48" text-anchor="middle" class="s-txt">B2 · 128 Mo</text>
  <rect x="270" y="28" width="84" height="30" rx="4" class="s-acc"/>
  <text x="312" y="48" text-anchor="middle" class="s-txt">B3 · 44</text>
  <rect x="6" y="72" width="348" height="44" rx="8" class="s-box"/>
  <text x="180" y="91" text-anchor="middle" class="s-bold">NameNode</text>
  <text x="180" y="108" text-anchor="middle" class="s-sub">métadonnées : quel bloc, sur quelles machines</text>
  <rect x="6" y="132" width="81" height="108" rx="8" class="s-box"/>
  <text x="46" y="152" text-anchor="middle" class="s-bold">DN 1</text>
  <text x="46" y="180" text-anchor="middle" class="s-txt">B1</text>
  <text x="46" y="200" text-anchor="middle" class="s-txt">B3</text>
  <rect x="95" y="132" width="81" height="108" rx="8" class="s-box"/>
  <text x="135" y="152" text-anchor="middle" class="s-bold">DN 2</text>
  <text x="135" y="180" text-anchor="middle" class="s-txt">B1</text>
  <text x="135" y="200" text-anchor="middle" class="s-txt">B2</text>
  <rect x="184" y="132" width="81" height="108" rx="8" class="s-warn"/>
  <text x="224" y="152" text-anchor="middle" class="s-bold">DN 3</text>
  <text x="224" y="180" text-anchor="middle" class="s-txt">B1</text>
  <text x="224" y="200" text-anchor="middle" class="s-txt">B2</text>
  <text x="224" y="220" text-anchor="middle" class="s-txt">B3</text>
  <rect x="273" y="132" width="81" height="108" rx="8" class="s-box"/>
  <text x="313" y="152" text-anchor="middle" class="s-bold">DN 4</text>
  <text x="313" y="180" text-anchor="middle" class="s-txt">B2</text>
  <text x="313" y="200" text-anchor="middle" class="s-txt">B3</text>
</svg>`, legende: "3 blocs × 3 copies = 9 copies sur 4 DataNodes (DN). Si DN 3 tombe, chaque bloc a encore 2 copies ; le NameNode en recrée une troisième ailleurs." },
        { type: "exemple", titre: "Combien de blocs et de disque ?", contenu: "Fichier de 1 Go, blocs de 128 Mo, réplication 3 :", resultat: "1 024 / 128 = 8 blocs → 8 × 3 = 24 copies → 3 Go occupés sur le cluster.\nPour 300 Mo : 3 blocs (128 + 128 + 44 Mo) ; le dernier bloc n'occupe que 44 Mo sur disque." },
        { type: "attention", contenu: "Précision : le NameNode garde en mémoire une entrée par fichier et par bloc. Des millions de **petits fichiers** le saturent, et chacun lance une tâche de calcul presque vide. On regroupe donc les petits fichiers (c'est le « problème des petits fichiers », vu aussi côté Parquet dans le deck Data engineering)." },
        { type: "texte", contenu: "**MapReduce** est le modèle de calcul : le programmeur n'écrit que deux fonctions, le framework fait tout le reste (découper l'entrée, planifier les tâches près des données, regrouper par clé, gérer les pannes et le réseau)." },
        { type: "liste", ordonnee: true, items: [
          "**Map** (sur chaque bloc, en parallèle) : lire les enregistrements et émettre des paires (clé, valeur).",
          "**Shuffle** / *group by key* (fait par le framework) : trier et envoyer toutes les paires de même clé vers le même reducer.",
          "**Reduce** (une fois par clé) : agréger les valeurs de la clé et écrire le résultat.",
        ] },
        { type: "schema", svg: `<svg viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="MapReduce : compter les mots">
  <defs><marker id="fl-bd-mr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="s-arrow"/></marker></defs>
  <text x="6" y="16" class="s-sub">ENTRÉE (2 blocs)</text>
  <rect x="6" y="22" width="170" height="30" rx="6" class="s-box"/>
  <text x="91" y="42" text-anchor="middle" class="s-txt">le chat voit le chien</text>
  <rect x="184" y="22" width="170" height="30" rx="6" class="s-box"/>
  <text x="269" y="42" text-anchor="middle" class="s-txt">le chien dort</text>
  <path d="M91 52V68" class="s-line" marker-end="url(#fl-bd-mr)"/>
  <path d="M269 52V68" class="s-line" marker-end="url(#fl-bd-mr)"/>
  <text x="6" y="84" class="s-sub">MAP</text>
  <rect x="6" y="90" width="170" height="52" rx="6" class="s-acc"/>
  <text x="91" y="111" text-anchor="middle" class="s-txt">(le,1) (chat,1) (voit,1)</text>
  <text x="91" y="129" text-anchor="middle" class="s-txt">(le,1) (chien,1)</text>
  <rect x="184" y="90" width="170" height="52" rx="6" class="s-acc"/>
  <text x="269" y="111" text-anchor="middle" class="s-txt">(le,1) (chien,1)</text>
  <text x="269" y="129" text-anchor="middle" class="s-txt">(dort,1)</text>
  <path d="M91 142L150 166" class="s-line" marker-end="url(#fl-bd-mr)"/>
  <path d="M269 142L210 166" class="s-line" marker-end="url(#fl-bd-mr)"/>
  <text x="6" y="164" class="s-sub">SHUFFLE</text>
  <rect x="6" y="170" width="348" height="52" rx="6" class="s-box"/>
  <text x="180" y="191" text-anchor="middle" class="s-txt">le: [1,1,1]   chien: [1,1]   chat: [1]</text>
  <text x="180" y="209" text-anchor="middle" class="s-txt">voit: [1]   dort: [1]</text>
  <path d="M180 222V240" class="s-line" marker-end="url(#fl-bd-mr)"/>
  <text x="6" y="238" class="s-sub">REDUCE</text>
  <rect x="6" y="246" width="348" height="46" rx="6" class="s-ok"/>
  <text x="180" y="274" text-anchor="middle" class="s-bold">le 3 · chien 2 · chat 1 · voit 1 · dort 1</text>
</svg>`, legende: "Le comptage de mots, « hello world » de MapReduce. Seuls map et reduce sont écrits par le programmeur." },
        { type: "exemple", titre: "Le même calcul, simulé en Python", code: `from collections import defaultdict

blocs = ["le chat voit le chien", "le chien dort"]     # 2 blocs HDFS

def map_(bloc):                       # MAP : sur chaque bloc, en parallèle
    for mot in bloc.split():
        yield (mot, 1)

def reduce_(mot, valeurs):            # REDUCE : une fois par clé
    return (mot, sum(valeurs))

paires = [p for b in blocs for p in map_(b)]           # sorties des maps
groupes = defaultdict(list)                            # SHUFFLE : group by key
for mot, v in paires:
    groupes[mot].append(v)
print(sorted(reduce_(m, vs) for m, vs in groupes.items()))`, resultat: "[('chat', 1), ('chien', 2), ('dort', 1), ('le', 3), ('voit', 1)]" },
        { type: "application", titre: "Les deux exercices du cours", contenu: "**Maximum d'un très gros fichier de nombres** : chaque map calcule le max de son bloc et l'émet sous une clé unique (`\"max\"`) ; un seul reduce prend le max des max. Blocs `[3, 41, 7]`, `[12, 99, 5]`, `[64, 2]` → maps 41, 99, 64 → reduce 99.\n\n**Anagrammes d'un dictionnaire** : la clé est le mot aux lettres triées (`chien` → `cehin`). Le shuffle regroupe donc tous les anagrammes ; le reduce garde les groupes d'au moins 2 mots : `cehin → [chien, chine, niche]`, `aegr → [gare, rage]`." },
        { type: "attention", contenu: "Précision : on ajoute souvent un **combiner**, un « mini-reduce » exécuté sur chaque machine avant le shuffle. Pour le comptage de mots, `(le,1) (le,1)` devient `(le,2)` localement : beaucoup moins de données traversent le réseau. Il ne marche que pour des opérations associatives et commutatives (somme, max), pas pour une moyenne directe." },
        { type: "texte", contenu: "Les faiblesses de MapReduce, qui expliquent l'arrivée de Spark :" },
        { type: "liste", items: [
          "Résultats intermédiaires **écrits sur disque** entre chaque étape.",
          "Modèle figé en deux étapes : un traitement complexe enchaîne de nombreux jobs.",
          "Lancement et ordonnancement des tâches coûteux (latence de plusieurs secondes par job).",
          "Pas d'optimisation à partir de statistiques sur les données.",
          "Inadapté aux **algorithmes itératifs** (machine learning, PageRank) : chaque itération relit tout depuis le disque.",
        ] },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: "spark",
      titre: "8. Spark : pourquoi il a remplacé MapReduce",
      objectif: "Comprendre l'idée des RDD et ce qui rend Spark rapide sur les traitements itératifs.",
      blocs: [
        { type: "definition", terme: "RDD (Resilient Distributed Dataset)", contenu: "Collection de données répartie en partitions sur le cluster, **immuable**, gardée **en mémoire** quand c'est possible, et **résiliente** : si une partition est perdue, Spark la recalcule à partir de sa **lignée** (la suite de transformations qui l'a produite), au lieu de répliquer les données." },
        { type: "schema", svg: `<svg viewBox="0 0 360 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="MapReduce passe par le disque, Spark garde en mémoire">
  <defs><marker id="fl-bd-sp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="s-arrow"/></marker></defs>
  <text x="6" y="16" class="s-bold">MapReduce : 3 itérations</text>
  <rect x="6" y="26" width="64" height="34" rx="6" class="s-box"/><text x="38" y="48" text-anchor="middle" class="s-txt">job 1</text>
  <rect x="98" y="26" width="64" height="34" rx="6" class="s-warn"/><text x="130" y="48" text-anchor="middle" class="s-sub">disque</text>
  <rect x="190" y="26" width="64" height="34" rx="6" class="s-box"/><text x="222" y="48" text-anchor="middle" class="s-txt">job 2</text>
  <rect x="282" y="26" width="72" height="34" rx="6" class="s-warn"/><text x="318" y="48" text-anchor="middle" class="s-sub">disque…</text>
  <path d="M70 43H94" class="s-line" marker-end="url(#fl-bd-sp)"/>
  <path d="M162 43H186" class="s-line" marker-end="url(#fl-bd-sp)"/>
  <path d="M254 43H278" class="s-line" marker-end="url(#fl-bd-sp)"/>
  <text x="6" y="98" class="s-bold">Spark : 3 itérations</text>
  <rect x="6" y="108" width="80" height="34" rx="6" class="s-warn"/><text x="46" y="130" text-anchor="middle" class="s-sub">lecture 1×</text>
  <rect x="112" y="108" width="242" height="34" rx="6" class="s-ok"/><text x="233" y="130" text-anchor="middle" class="s-txt">it. 1 → it. 2 → it. 3 en mémoire</text>
  <path d="M86 125H108" class="s-line" marker-end="url(#fl-bd-sp)"/>
  <text x="6" y="176" class="s-sub">Le cours (k-means, temps par itération) :</text>
  <text x="6" y="196" class="s-txt">Hadoop 155 s · Spark 4,1 s</text>
</svg>`, legende: "Sur un algorithme itératif, MapReduce relit et réécrit le disque à chaque tour ; Spark lit une fois puis itère en mémoire." },
        { type: "liste", items: [
          "**DAG** : Spark enchaîne librement les étapes (graphe orienté sans cycle), au lieu d'imposer un couple map → reduce par job.",
          "**Mémoire** : les données intermédiaires restent en RAM (et `cache()` permet de les garder entre deux actions).",
          "**Faible latence** : capable de gérer de petites tâches rapidement.",
          "**Pile unifiée** : la même abstraction sert au batch, au SQL (Spark SQL), au streaming et au machine learning (MLlib).",
        ] },
        { type: "exemple", titre: "Le comptage de mots en PySpark (API RDD puis DataFrame)", code: `# API RDD : on retrouve map et reduce
compte = (sc.textFile("hdfs:///data/articles.txt")
            .flatMap(lambda ligne: ligne.split())
            .map(lambda mot: (mot, 1))
            .reduceByKey(lambda a, b: a + b))          # combine localement puis shuffle
compte.takeOrdered(5, key=lambda kv: -kv[1])

# API DataFrame : déclaratif, optimisé par Catalyst
from pyspark.sql import functions as F
(spark.read.text("hdfs:///data/articles.txt")
      .select(F.explode(F.split("value", r"\\s+")).alias("mot"))
      .groupBy("mot").count()
      .orderBy(F.desc("count"))
      .show(5))` },
        { type: "tableau", entetes: ["API", "Depuis", "Structure", "Quand l'utiliser"], lignes: [
          ["**RDD**", "Spark 1.0", "Objets quelconques, pas de schéma", "Traitements très bas niveau, données non structurées"],
          ["**DataFrame**", "Spark 1.3", "Colonnes nommées (comme une table)", "Par défaut : optimisé par Catalyst, en Python comme en Scala"],
          ["**Dataset**", "Spark 1.6", "DataFrame typé (Scala/Java)", "Quand on veut des erreurs de schéma à la compilation"],
        ] },
        { type: "attention", contenu: "Le cours note que Spark est « plus difficile à programmer que MapReduce » ; c'était vrai de l'API RDD. Précision : avec les DataFrames et Spark SQL, la plupart des traitements s'écrivent aujourd'hui comme des requêtes SQL, et l'API RDD est rarement nécessaire." },
        { type: "renvoi", vers: "pyspark", contenu: "La mécanique de Spark au quotidien (évaluation paresseuse, transformations et actions, shuffle et stages, cache, driver et exécuteurs, AQE) est dans le deck PySpark." },
        { type: "renvoi", vers: "scala", contenu: "Ce qu'apporte un Dataset typé (erreurs à la compilation, encoders) : deck Scala." },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: "flux",
      titre: "9. Traiter des flux de données",
      objectif: "Ce qui change quand les données n'arrêtent jamais d'arriver.",
      blocs: [
        { type: "tableau", entetes: ["SGBD classique (DBMS)", "Système de flux (DSMS)"], lignes: [
          ["Relations persistantes, finies", "Flux temporaires, non bornés"],
          ["Requêtes ponctuelles : on interroge, on obtient une réponse", "**Requêtes continues** : le résultat se met à jour à chaque arrivée"],
          ["Accès aléatoire aux données", "Accès séquentiel, chaque élément vu une fois"],
          ["Plan d'exécution fixé par l'optimiseur", "Débit et formats d'arrivée imprévisibles"],
        ] },
        { type: "texte", contenu: "Un flux étant infini, on ne peut pas « tout » agréger : une **fenêtre** extrait une portion finie du flux (définie par le temps, par un nombre d'éléments ou par des marqueurs). Une chaîne de traitement de flux se compose d'une **collecte** (Flume, Kafka comme courtier) puis d'un **traitement** (Storm, Spark Streaming)." },
        { type: "renvoi", vers: "dataeng", contenu: "Kafka (topics, partitions, offsets, garanties de livraison) et les types de fenêtres (tumbling, sliding, session) avec le watermark sont dans le deck Data engineering ; la figure interactive « Watermark en streaming » le montre en mouvement." },
        { type: "texte", contenu: "Dans Spark Streaming (première API), un **DStream** est une suite continue de petits RDD, un par intervalle de temps (**micro-batch**). Une fenêtre est définie par deux paramètres, exprimés en nombre de micro-batches dans le cours : la **longueur de fenêtre** (WL) et l'**intervalle de glissement** (SI)." },
        { type: "schema", svg: `<svg viewBox="0 0 360 178" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Fenêtre glissante sur un DStream : longueur 3, glissement 2">
  <text x="6" y="16" class="s-sub">micro-batches (1 RDD par seconde)</text>
  <rect x="6" y="26" width="44" height="30" rx="4" class="s-box"/><text x="28" y="46" text-anchor="middle" class="s-txt">t1</text>
  <rect x="56" y="26" width="44" height="30" rx="4" class="s-box"/><text x="78" y="46" text-anchor="middle" class="s-txt">t2</text>
  <rect x="106" y="26" width="44" height="30" rx="4" class="s-box"/><text x="128" y="46" text-anchor="middle" class="s-txt">t3</text>
  <rect x="156" y="26" width="44" height="30" rx="4" class="s-box"/><text x="178" y="46" text-anchor="middle" class="s-txt">t4</text>
  <rect x="206" y="26" width="44" height="30" rx="4" class="s-box"/><text x="228" y="46" text-anchor="middle" class="s-txt">t5</text>
  <rect x="256" y="26" width="44" height="30" rx="4" class="s-box"/><text x="278" y="46" text-anchor="middle" class="s-txt">t6</text>
  <rect x="306" y="26" width="44" height="30" rx="4" class="s-box"/><text x="328" y="46" text-anchor="middle" class="s-txt">t7</text>
  <rect x="6" y="70" width="144" height="26" rx="6" class="s-acc"/><text x="78" y="88" text-anchor="middle" class="s-txt">fenêtre 1 : t1–t3</text>
  <rect x="106" y="104" width="144" height="26" rx="6" class="s-acc"/><text x="178" y="122" text-anchor="middle" class="s-txt">fenêtre 2 : t3–t5</text>
  <rect x="206" y="138" width="144" height="26" rx="6" class="s-acc"/><text x="278" y="156" text-anchor="middle" class="s-txt">fenêtre 3 : t5–t7</text>
</svg>`, legende: "Longueur 3, glissement 2 : chaque fenêtre couvre 3 micro-batches et une nouvelle démarre tous les 2 ; t3 et t5 sont comptés dans deux fenêtres." },
        { type: "exemple", titre: "Hashtags les plus fréquents (exemple du cours, en Scala)", code: `val hashtags = tweets.flatMap(t => t.getHashtagEntities)
val sortie = hashtags.map(h => h.getText.toLowerCase)
                     .countByValue()        // nombre d'occurrences de chaque hashtag
sortie.print()

// Sur une fenêtre de 60 s qui glisse toutes les 10 s :
hashtags.map(h => h.getText.toLowerCase)
        .countByValueAndWindow(Seconds(60), Seconds(10))` },
        { type: "attention", contenu: "Le cours présente les DStreams, l'API historique. Précision : elle est aujourd'hui dépréciée au profit de **Structured Streaming**, où un flux est une table qui grandit et se manipule avec l'API DataFrame ; on y fenêtre sur l'**heure d'événement** avec un watermark, alors que les DStreams fenêtrent sur l'heure de réception." },
        { type: "exemple", titre: "La même idée en Structured Streaming", code: `from pyspark.sql import functions as F
flux = spark.readStream.format("kafka").option("subscribe", "tweets").load()
(flux.select(F.col("timestamp"), F.explode(F.split(F.col("value").cast("string"), " ")).alias("mot"))
     .filter(F.col("mot").startswith("#"))
     .withWatermark("timestamp", "2 minutes")
     .groupBy(F.window("timestamp", "60 seconds", "10 seconds"), "mot")
     .count()
     .writeStream.outputMode("update").format("console").start())` },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: "mllib",
      titre: "10. Machine learning distribué avec MLlib",
      objectif: "Savoir lire et écrire un pipeline MLlib.",
      blocs: [
        { type: "texte", contenu: "**MLlib** regroupe les algorithmes classiques (classification, régression, clustering, filtrage collaboratif), la préparation des variables (*features*), les **pipelines** et la sauvegarde des modèles. Avec des DataFrames, l'apprentissage est **parallélisé automatiquement** sur le cluster." },
        { type: "tableau", entetes: ["Brique", "Méthode", "Rôle", "Exemples"], lignes: [
          ["**Transformer**", "`transform(df)`", "Transforme un DataFrame en un autre", "Tokenizer, VectorAssembler, un modèle déjà entraîné"],
          ["**Estimator**", "`fit(df)`", "Apprend sur des données et renvoie un Transformer", "LogisticRegression, StandardScaler, KMeans"],
          ["**Pipeline**", "`fit` puis `transform`", "Enchaîne les étapes dans l'ordre", "Préparation + modèle en un seul objet"],
        ] },
        { type: "schema", svg: `<svg viewBox="0 0 360 214" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pipeline MLlib : apprentissage puis application">
  <defs><marker id="fl-bd-ml" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="s-arrow"/></marker></defs>
  <text x="6" y="16" class="s-sub">APPRENTISSAGE : pipeline.fit(train)</text>
  <rect x="6" y="24" width="104" height="46" rx="6" class="s-box"/>
  <text x="58" y="44" text-anchor="middle" class="s-txt">Tokenizer</text>
  <text x="58" y="61" text-anchor="middle" class="s-sub">transformer</text>
  <rect x="128" y="24" width="104" height="46" rx="6" class="s-box"/>
  <text x="180" y="44" text-anchor="middle" class="s-txt">HashingTF</text>
  <text x="180" y="61" text-anchor="middle" class="s-sub">transformer</text>
  <rect x="250" y="24" width="104" height="46" rx="6" class="s-acc"/>
  <text x="302" y="44" text-anchor="middle" class="s-txt">LogisticReg.</text>
  <text x="302" y="61" text-anchor="middle" class="s-sub">estimator</text>
  <path d="M110 47H124" class="s-line" marker-end="url(#fl-bd-ml)"/>
  <path d="M232 47H246" class="s-line" marker-end="url(#fl-bd-ml)"/>
  <path d="M302 70V96" class="s-line" marker-end="url(#fl-bd-ml)"/>
  <text x="296" y="88" text-anchor="end" class="s-sub">fit</text>
  <text x="6" y="118" class="s-sub">APPLICATION : modele.transform(test)</text>
  <rect x="6" y="126" width="104" height="46" rx="6" class="s-box"/>
  <text x="58" y="154" text-anchor="middle" class="s-txt">Tokenizer</text>
  <rect x="128" y="126" width="104" height="46" rx="6" class="s-box"/>
  <text x="180" y="154" text-anchor="middle" class="s-txt">HashingTF</text>
  <rect x="250" y="126" width="104" height="46" rx="6" class="s-ok"/>
  <text x="302" y="146" text-anchor="middle" class="s-txt">modèle</text>
  <text x="302" y="163" text-anchor="middle" class="s-sub">transformer</text>
  <path d="M110 149H124" class="s-line" marker-end="url(#fl-bd-ml)"/>
  <path d="M232 149H246" class="s-line" marker-end="url(#fl-bd-ml)"/>
  <text x="180" y="200" text-anchor="middle" class="s-txt">→ colonne prediction</text>
</svg>`, legende: "fit() entraîne l'estimator et produit un PipelineModel, entièrement composé de transformers, qu'on applique ensuite aux nouvelles données." },
        { type: "exemple", titre: "Classer des avis clients", code: `from pyspark.ml import Pipeline
from pyspark.ml.feature import Tokenizer, HashingTF
from pyspark.ml.classification import LogisticRegression

tok  = Tokenizer(inputCol="avis", outputCol="mots")
tf   = HashingTF(inputCol="mots", outputCol="features")
lr   = LogisticRegression(labelCol="negatif", maxIter=20)

train, test = avis_df.randomSplit([0.8, 0.2], seed=42)
modele = Pipeline(stages=[tok, tf, lr]).fit(train)     # apprend sur train seulement
pred   = modele.transform(test)                        # mêmes étapes sur test
pred.select("avis", "probability", "prediction").show(5)
modele.write().overwrite().save("hdfs:///modeles/avis_v1")` },
        { type: "application", titre: "Cas du cours : dossiers de crédit", contenu: "À partir de l'historique des demandes de crédit et des décisions prises (favorable, réservé, défavorable), on entraîne un modèle qui pré-classe chaque nouveau dossier. Les analystes gagnent du temps et se concentrent sur les dossiers difficiles. Le modèle doit être réévalué régulièrement : il perd en précision quand le contexte change." },
        { type: "attention", contenu: "Le pipeline protège contre la **fuite de données** : les étapes qui apprennent quelque chose (un scaler, un vocabulaire) ne voient que les données d'entraînement, puis sont réappliquées telles quelles au test." },
        { type: "renvoi", vers: "regression", contenu: "Les notions de modélisation elles-mêmes (train/test, sur-apprentissage, métriques de classification, fuite de données, dérive en production) sont dans le deck Régression & modélisation." },
      ],
    },
  ],
  aRetenir: [
    "Big data = au moins un des 3 V (volume, variété, vélocité) qui dépasse les outils classiques ; la valeur vient du croisement des sources.",
    "Pseudonymiser (remplacer le nom par un alias) laisse les données personnelles et réversibles ; seule l'anonymisation les fait sortir du RGPD, et le croisement de sources permet souvent de ré-identifier.",
    "NoSQL : clé-valeur, document, colonnes, graphe. On choisit selon la forme des données et des requêtes, et on combine souvent plusieurs bases.",
    "Sharding par hachage = répartition uniforme mais requêtes d'intervalle coûteuses ; le consistent hashing limite les migrations quand on ajoute un nœud.",
    "CAP : pendant une coupure réseau, on choisit entre cohérence (refuser de répondre) et disponibilité (répondre avec une donnée possiblement périmée).",
    "Hadoop = HDFS (gros fichiers en blocs de 128 Mo répliqués 3 fois) + MapReduce (map → shuffle → reduce), avec le calcul envoyé là où sont les données.",
    "Spark remplace MapReduce : DAG d'étapes, données en mémoire, résilience par la lignée des RDD ; jusqu'à des dizaines de fois plus rapide sur les algorithmes itératifs.",
    "Flux : requêtes continues sur des fenêtres ; aujourd'hui Structured Streaming (API DataFrame, heure d'événement, watermark) plutôt que les DStreams.",
    "MLlib : estimator.fit() → transformer ; un Pipeline enchaîne la préparation et le modèle et évite les fuites de données.",
  ],
};
