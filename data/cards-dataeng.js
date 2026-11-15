export const cardsDataEng = [
  // ======================================================================
  // ---- Fondamentaux : architectures, formats, modélisation ----
  // ======================================================================
  {
    id: "de-f1-1", langue: "dataeng", niveau: "fondamentaux", type: "flip",
    front: "ETL vs ELT : quelle différence et pourquoi l'ELT s'est-il imposé ?",
    back: "• ETL (Extract, Transform, Load) : on transforme les données AVANT de les charger dans l'entrepôt, sur un serveur ou un outil dédié.\n• ELT (Extract, Load, Transform) : on charge les données brutes dans l'entrepôt / le lakehouse, puis on les transforme EN SQL, sur place (dbt, Spark SQL).\n\nL'ELT s'est imposé avec les entrepôts cloud (Snowflake, BigQuery, Databricks) : stockage bon marché, calcul élastique. Avantages : données brutes conservées (on peut retransformer), transformations versionnées en SQL, moins d'outils.\nL'ETL reste pertinent pour masquer des données sensibles avant chargement ou pour des formats complexes."
  },
  {
    id: "de-f1-2", langue: "dataeng", niveau: "fondamentaux", type: "flip",
    front: "OLTP vs OLAP ?",
    back: "• OLTP (transactionnel) : la base de l'application (PostgreSQL, MySQL). Beaucoup de petites lectures/écritures sur quelques lignes, données normalisées, stockage en lignes, intégrité forte.\n• OLAP (analytique) : l'entrepôt de données (BigQuery, Snowflake, Synapse). Peu de requêtes mais qui scannent des millions de lignes et agrègent quelques colonnes ; stockage en colonnes, données dénormalisées (schéma en étoile).\n\nOn ne fait pas l'analytique lourde directement sur la base de production : on ralentirait l'application. On copie les données vers l'OLAP."
  },
  {
    id: "de-f1-3", langue: "dataeng", niveau: "fondamentaux", type: "flip",
    front: "Data warehouse, data lake, lakehouse : quelles différences ?",
    back: "• Data warehouse : données structurées, schéma défini à l'écriture, SQL performant, gouvernance forte. Coûteux pour du brut ou du non structuré.\n• Data lake : stockage objet bon marché (S3, ADLS, GCS) de fichiers bruts de tout type, schéma appliqué à la lecture. Risque de « marécage » (data swamp) sans gouvernance, pas de transactions.\n• Lakehouse : fichiers ouverts (Parquet) sur le lake + une couche de format de table (Delta Lake, Apache Iceberg, Hudi) qui apporte transactions ACID, mises à jour, time travel et performances proches d'un entrepôt."
  },
  {
    id: "de-f1-4", langue: "dataeng", niveau: "fondamentaux", type: "qcm",
    front: "Pourquoi Parquet est-il bien plus efficace que CSV pour l'analytique ?",
    choices: [
      "Parquet est un format texte plus lisible",
      "Parquet est colonnaire, compressé et typé : on ne lit que les colonnes utiles, on saute des blocs grâce aux statistiques min/max, et les types sont conservés",
      "Parquet stocke les données dans une base relationnelle",
      "Il n'y a aucune différence de performance"
    ],
    answer: 1,
    explain: "Stockage par colonnes → une requête sur 3 colonnes d'une table de 100 lit ~3 % des données. Compression efficace (valeurs similaires côte à côte), statistiques par bloc pour le « predicate pushdown », schéma typé (fini les dates lues comme du texte et les zéros de tête perdus). Le CSV reste utile pour les échanges simples et la lisibilité humaine."
  },
  {
    id: "de-f1-5", langue: "dataeng", niveau: "fondamentaux", type: "flip",
    front: "Schéma en étoile : table de faits et tables de dimensions ?",
    back: "• Table de FAITS : les événements mesurables, au grain le plus fin utile (une ligne par ligne de vente). Contient des MESURES numériques (montant, quantité) et des CLÉS ÉTRANGÈRES vers les dimensions. Très longue.\n• Tables de DIMENSIONS : le contexte descriptif pour filtrer et regrouper (client, produit, magasin, date). Des attributs textuels, relativement courtes et larges.\n\nLe fait est au centre, les dimensions autour → étoile. Schéma en flocon = dimensions elles-mêmes normalisées (produit → catégorie → rayon) : moins de redondance, plus de jointures."
  },
  {
    id: "de-f1-6", langue: "dataeng", niveau: "fondamentaux", type: "flip",
    front: "Clé naturelle vs clé de substitution (surrogate key) ?",
    back: "• Clé naturelle (métier) : l'identifiant venant de la source (n° client du CRM, code EAN).\n• Clé de substitution : un identifiant technique généré dans l'entrepôt (entier séquentiel ou hash), sans signification métier.\n\nPourquoi une clé de substitution dans les dimensions :\n• historiser (SCD2) : un même client a plusieurs versions → plusieurs lignes, donc il faut une clé par version ;\n• intégrer plusieurs sources dont les identifiants se chevauchent ;\n• se protéger des changements d'identifiant côté source ;\n• jointures sur des entiers plus rapides."
  },
  {
    id: "de-f1-7", langue: "dataeng", niveau: "fondamentaux", type: "flip",
    front: "Normaliser ou dénormaliser ?",
    back: "• Normalisation (3e forme normale) : chaque information stockée une seule fois, tables reliées par des clés. Évite les incohérences lors des mises à jour → idéal pour l'OLTP.\n• Dénormalisation : on duplique volontairement des informations (le nom de la catégorie dans la table produit, voire dans la table de faits) pour éviter des jointures → idéal pour l'analytique, où l'on lit beaucoup et met peu à jour.\n\nAvec le stockage colonnaire compressé, la redondance coûte peu ; les grandes tables plates (« One Big Table ») sont devenues courantes pour les usages BI."
  },
  {
    id: "de-f1-8", langue: "dataeng", niveau: "fondamentaux", type: "flip",
    front: "Qu'est-ce qu'un pipeline idempotent et pourquoi est-ce essentiel ?",
    back: "Idempotent = exécuter le pipeline une fois ou plusieurs fois pour la même période donne EXACTEMENT le même résultat.\n\nEssentiel car les pipelines échouent et sont relancés (retry automatique, backfill, correction de bug). Un pipeline non idempotent qui fait INSERT à chaque exécution crée des doublons à chaque relance.\n\nTechniques : écraser la partition traitée (INSERT OVERWRITE de la partition du jour), MERGE sur une clé unique, DELETE de la période puis INSERT dans une transaction. Ne jamais dépendre de « maintenant » dans la logique : utiliser la date logique d'exécution passée en paramètre."
  },
  {
    id: "de-f1-9", langue: "dataeng", niveau: "fondamentaux", type: "flip",
    front: "Architecture médaillon (bronze / silver / gold) ?",
    back: "• Bronze (raw) : données brutes telles que reçues, en ajout seul, avec métadonnées de chargement (date, fichier source). Permet de tout rejouer.\n• Silver (clean) : données nettoyées, typées, dédupliquées, conformes (mêmes codes partout), jointes entre sources. Grain fin.\n• Gold (business) : tables prêtes à l'usage : agrégats, schémas en étoile, KPI pour la BI et la data science.\n\nIntérêt : séparation des responsabilités, traçabilité, possibilité de reconstruire silver et gold depuis bronze en cas de bug."
  },
  {
    id: "de-f1-10", langue: "dataeng", niveau: "fondamentaux", type: "flip",
    front: "Batch vs streaming : comment choisir ?",
    back: "• Batch : traitement par lots à intervalle régulier (toutes les heures, chaque nuit). Simple, robuste, peu coûteux, facile à rejouer.\n• Streaming : traitement continu des événements à mesure qu'ils arrivent (secondes). Plus complexe : ordre, retards, état, exactly-once, coût permanent.\n\nQuestion clé : quelle FRAÎCHEUR le métier exige-t-il réellement, et que fait-il de la donnée en temps réel ? Un rapport consulté le matin n'a pas besoin de streaming. Le temps réel se justifie pour la détection de fraude, les alertes, la personnalisation en direct, les stocks. Entre les deux : micro-batch (toutes les 1 à 5 minutes)."
  },

  // ======================================================================
  // ---- Intermédiaire : chargements, SCD, partitionnement, orchestration ----
  // ======================================================================
  {
    id: "de-i1-1", langue: "dataeng", niveau: "intermediaire", type: "flip",
    front: "Les types de dimensions à évolution lente (SCD) : 0, 1, 2, 3 ?",
    back: "Que faire quand un attribut change (un client déménage) ?\n• Type 0 : on ne change jamais la valeur (date de naissance, valeur à l'origine).\n• Type 1 : on ÉCRASE l'ancienne valeur. Pas d'historique ; les anciennes ventes sont réattribuées à la nouvelle ville.\n• Type 2 : on AJOUTE une nouvelle ligne (nouvelle clé de substitution) avec date_debut, date_fin, est_courant. L'historique est complet : chaque vente reste liée à la version valable au moment de la vente.\n• Type 3 : on garde une colonne « valeur précédente ». Historique limité à un changement.\n\nLe type 2 est le plus utilisé pour les attributs qui servent à l'analyse."
  },
  {
    id: "de-i1-2", langue: "dataeng", niveau: "intermediaire", type: "flip",
    front: "Chargement complet vs chargement incrémental ?",
    back: "• Complet (full load) : on recharge toute la table à chaque fois. Simple et idempotent, mais lent et coûteux sur de gros volumes ; ne capte pas l'historique des suppressions.\n• Incrémental : on ne traite que les nouveautés depuis le dernier chargement.\n  – par watermark : WHERE updated_at > dernière_valeur_chargée (nécessite une colonne de mise à jour fiable, ne voit pas les suppressions physiques) ;\n  – par CDC (Change Data Capture) : lecture du journal de transactions de la base source, qui voit insertions, mises à jour ET suppressions.\n\nPrévoir une marge (relire les dernières heures) pour les données qui arrivent en retard, et un MERGE pour rester idempotent."
  },
  {
    id: "de-i1-3", langue: "dataeng", niveau: "intermediaire", type: "code",
    front: "Écris un upsert idempotent qui intègre le lot du jour (staging_clients) dans dim_clients (SCD type 1).",
    code: "-- staging_clients(id_client, nom, ville, maj_le)\n-- dim_clients(id_client, nom, ville, maj_le)",
    back: "MERGE INTO dim_clients AS cible\nUSING staging_clients AS src\n  ON cible.id_client = src.id_client\nWHEN MATCHED AND src.maj_le > cible.maj_le THEN\n  UPDATE SET nom = src.nom, ville = src.ville, maj_le = src.maj_le\nWHEN NOT MATCHED THEN\n  INSERT (id_client, nom, ville, maj_le)\n  VALUES (src.id_client, src.nom, src.ville, src.maj_le);\n\n• Rejouer le même lot ne change rien (idempotent).\n• La condition maj_le > évite d'écraser une donnée plus récente par un lot ancien rejoué.\n• Prérequis : staging dédupliqué sur id_client, sinon le MERGE échoue (plusieurs lignes source pour une ligne cible)."
  },
  {
    id: "de-i1-4", langue: "dataeng", niveau: "intermediaire", type: "code",
    front: "La table brute contient plusieurs versions par client. Garde uniquement la plus récente.",
    code: "-- raw_clients(id_client, nom, ville, maj_le, _charge_le)",
    back: "SELECT id_client, nom, ville, maj_le\nFROM (\n  SELECT *,\n         ROW_NUMBER() OVER (\n           PARTITION BY id_client\n           ORDER BY maj_le DESC, _charge_le DESC\n         ) AS rn\n  FROM raw_clients\n) t\nWHERE rn = 1;\n\n• ROW_NUMBER (et pas RANK) garantit exactement une ligne par client, même en cas d'égalité.\n• Le second critère de tri (_charge_le) départage les égalités de façon déterministe : sans lui, deux exécutions pourraient garder des lignes différentes.\n• Certains moteurs (Snowflake, BigQuery, Databricks) proposent QUALIFY rn = 1, sans sous-requête."
  },
  {
    id: "de-i1-5", langue: "dataeng", niveau: "intermediaire", type: "flip",
    front: "Partitionnement : comment choisir la colonne et quels pièges éviter ?",
    back: "Partitionner = découper physiquement la table en dossiers selon une colonne (souvent la date) → les requêtes filtrées sur cette colonne ne lisent que les partitions utiles (partition pruning).\n\nBien choisir : une colonne presque toujours utilisée dans les filtres, de cardinalité modérée (jour ou mois, pays).\n\nPièges :\n• colonne à très forte cardinalité (id_client) → des millions de minuscules fichiers ;\n• partitions trop fines (heure sur un petit volume) → problème des petits fichiers ;\n• filtre sur une expression (WHERE YEAR(date) = 2025 dans certains moteurs) qui empêche l'élagage → filtrer sur la colonne de partition directement.\n\nRepère : viser des fichiers d'environ 100 Mo à 1 Go."
  },
  {
    id: "de-i1-6", langue: "dataeng", niveau: "intermediaire", type: "qcm",
    front: "Une table Parquet de 50 Go est stockée en 400 000 fichiers. Les requêtes sont très lentes. Cause principale probable ?",
    choices: [
      "Parquet n'est pas adapté aux gros volumes",
      "Le problème des petits fichiers : ouvrir, lister et lire les métadonnées de centaines de milliers de fichiers coûte plus cher que lire les données ; il faut compacter",
      "Il manque un index B-tree",
      "Le cluster n'a pas assez de disque"
    ],
    answer: 1,
    explain: "50 Go / 400 000 ≈ 125 Ko par fichier, bien trop petit. Causes : streaming ou micro-batchs fréquents, partitionnement trop fin, trop de tâches en écriture. Remèdes : compaction (OPTIMIZE sur Delta, rewrite_data_files sur Iceberg), repartition / coalesce avant écriture, partitionnement moins fin."
  },
  {
    id: "de-i1-7", langue: "dataeng", niveau: "intermediaire", type: "flip",
    front: "Orchestration (Airflow) : DAG, tâche, dépendances, retries… les notions clés ?",
    back: "• DAG : graphe orienté sans cycle qui décrit un pipeline : des tâches et leurs dépendances (extraire → nettoyer → agréger).\n• Tâche : une unité de travail (un script, une requête SQL, un job Spark), idéalement idempotente.\n• Planification : fréquence d'exécution (schedule) ; chaque exécution porte une DATE LOGIQUE (la période traitée), distincte de l'heure réelle d'exécution.\n• Retries : relance automatique en cas d'échec transitoire (réseau), avec délai.\n• Capteurs (sensors) : attendre qu'une condition soit remplie (fichier arrivé, table amont à jour).\n• Backfill : rejouer le DAG sur des périodes passées.\n\nL'orchestrateur ORCHESTRE : le calcul lourd s'exécute ailleurs (entrepôt, Spark), pas sur les workers Airflow."
  },
  {
    id: "de-i1-8", langue: "dataeng", niveau: "intermediaire", type: "code",
    front: "Pourquoi cette tâche quotidienne est-elle dangereuse en cas de relance ou de backfill ? Corrige-la.",
    code: "INSERT INTO ventes_jour\nSELECT *\nFROM raw_ventes\nWHERE date_vente = CURRENT_DATE - 1;",
    back: "Deux problèmes :\n1. Non idempotente : chaque relance ajoute une nouvelle fois les mêmes lignes → doublons.\n2. Dépend de l'heure réelle (CURRENT_DATE) : un backfill du 3 mars exécuté le 10 mars traiterait le 9 mars.\n\nCorrection : utiliser la date logique fournie par l'orchestrateur et remplacer la partition :\n\nDELETE FROM ventes_jour WHERE date_vente = '{{ ds }}';\nINSERT INTO ventes_jour\nSELECT * FROM raw_ventes WHERE date_vente = '{{ ds }}';\n(dans une transaction, ou INSERT OVERWRITE ... PARTITION (date_vente = '{{ ds }}'))\n\n{{ ds }} est la date logique dans Airflow (format AAAA-MM-JJ)."
  },
  {
    id: "de-i1-9", langue: "dataeng", niveau: "intermediaire", type: "flip",
    front: "Types de tables de faits : transactionnelle, instantané périodique, instantané cumulatif ?",
    back: "• Transactionnelle : une ligne par événement (une vente, un clic). La plus courante, grain le plus fin, ajout seul.\n• Instantané périodique (periodic snapshot) : l'état à intervalle régulier (stock de chaque produit chaque soir, solde de chaque compte chaque fin de mois). Les mesures sont SEMI-ADDITIVES : on peut sommer des stocks entre produits, pas entre jours (on prend la dernière valeur ou la moyenne).\n• Instantané cumulatif (accumulating snapshot) : une ligne par processus, mise à jour à chaque étape (commande : date_commande, date_expédition, date_livraison). Idéal pour mesurer des délais entre étapes."
  },
  {
    id: "de-i1-10", langue: "dataeng", niveau: "intermediaire", type: "flip",
    front: "Évolution de schéma : que faire quand la source ajoute, renomme ou change le type d'une colonne ?",
    back: "• Ajout de colonne : en général sans risque si le pipeline sélectionne explicitement ses colonnes (jamais SELECT * jusqu'en gold) ; les formats Delta/Iceberg gèrent l'ajout (mergeSchema).\n• Renommage / suppression : casse les pipelines en aval → à détecter avant la production.\n• Changement de type (entier → texte) : erreurs de chargement ou conversions silencieuses.\n\nBonnes pratiques : figer le schéma attendu à l'entrée (validation), faire échouer bruyamment plutôt que corrompre en silence, alerter, et formaliser avec les équipes sources un contrat de données (schéma, sémantique, préavis de changement)."
  },

  // ======================================================================
  // ---- Avancé : CDC, streaming, formats de table, Spark, dbt ----
  // ======================================================================
  {
    id: "de-a1-1", langue: "dataeng", niveau: "avance", type: "flip",
    front: "Kafka : topic, partition, offset, groupe de consommateurs ?",
    back: "• Topic : un flux nommé d'événements (commandes, clics), conservé un temps donné (rétention), relisible.\n• Partition : un topic est découpé en partitions, unité de parallélisme. L'ORDRE n'est garanti qu'À L'INTÉRIEUR d'une partition. Les messages de même clé (id_client) vont dans la même partition → ordre garanti par client.\n• Offset : position d'un message dans sa partition. Le consommateur enregistre (commit) l'offset atteint pour reprendre au bon endroit.\n• Groupe de consommateurs : les partitions sont réparties entre les consommateurs du groupe ; au plus un consommateur par partition dans un groupe. Plus de consommateurs que de partitions = consommateurs inactifs."
  },
  {
    id: "de-a1-2", langue: "dataeng", niveau: "avance", type: "flip",
    front: "At-most-once, at-least-once, exactly-once : quelles garanties de livraison ?",
    back: "• At-most-once : un message peut être perdu, jamais dupliqué (commit de l'offset AVANT traitement).\n• At-least-once : jamais perdu, mais peut être traité plusieurs fois en cas de panne (commit APRÈS traitement). Le plus courant.\n• Exactly-once : chaque message produit son effet une seule fois. Possible au sein d'un système (transactions Kafka, checkpoints Spark/Flink avec une destination transactionnelle), difficile de bout en bout.\n\nEn pratique : at-least-once + traitement IDEMPOTENT côté destination (MERGE sur un identifiant d'événement unique, déduplication) = effet « exactly-once »."
  },
  {
    id: "de-a1-3", langue: "dataeng", niveau: "avance", type: "flip",
    front: "Temps de l'événement vs temps de traitement, et rôle du watermark en streaming ?",
    back: "• Event time : quand l'événement s'est réellement produit (horodatage du clic sur le téléphone).\n• Processing time : quand le système le reçoit et le traite. Écart possible de plusieurs heures (téléphone hors ligne, file d'attente).\n\nLes agrégats métier doivent se baser sur l'event time. Mais jusqu'à quand attendre les retardataires pour clore la fenêtre de 10 h-11 h ?\n\nWatermark = seuil de retard toléré (ex. 30 min) : passé « heure max vue − 30 min », la fenêtre est considérée complète, son état est libéré, et les événements plus tardifs sont ignorés ou traités à part. Compromis : exactitude vs latence et mémoire."
  },
  {
    id: "de-a1-4", langue: "dataeng", niveau: "avance", type: "flip",
    front: "Fenêtres en streaming : tumbling, sliding (hopping), session ?",
    back: "• Tumbling (fixe) : fenêtres de même durée, contiguës, sans chevauchement (CA par tranche de 5 min). Chaque événement appartient à une seule fenêtre.\n• Sliding / hopping (glissante) : fenêtres de durée D qui démarrent toutes les P < D (fenêtre de 10 min toutes les 5 min). Un événement appartient à plusieurs fenêtres. Idéal pour des moyennes mobiles et des alertes.\n• Session : fenêtre par utilisateur, qui se ferme après une période d'inactivité (30 min sans événement). Durée variable. Idéal pour analyser des visites."
  },
  {
    id: "de-a1-5", langue: "dataeng", niveau: "avance", type: "flip",
    front: "CDC (Change Data Capture) basé sur les journaux : comment ça marche, avantages ?",
    back: "Un outil (Debezium, Fivetran, AWS DMS…) lit le journal de transactions de la base source (WAL PostgreSQL, binlog MySQL) et publie chaque INSERT, UPDATE et DELETE comme un événement (avec l'état avant/après), souvent dans Kafka.\n\nAvantages par rapport à un watermark sur updated_at :\n• capte les SUPPRESSIONS et toutes les modifications intermédiaires ;\n• ne dépend pas d'une colonne updated_at mise à jour correctement par l'application ;\n• charge minimale sur la base source (pas de grosses requêtes) ;\n• quasi temps réel.\n\nÀ gérer : snapshot initial, évolution de schéma, ordre des événements, rétention du journal."
  },
  {
    id: "de-a1-6", langue: "dataeng", niveau: "avance", type: "flip",
    front: "Delta Lake / Apache Iceberg : qu'apportent ces formats de table par rapport à des fichiers Parquet seuls ?",
    back: "Une couche de métadonnées (journal de transactions) au-dessus des fichiers Parquet :\n• Transactions ACID : un lecteur ne voit jamais une écriture à moitié faite ; écritures concurrentes gérées.\n• UPDATE, DELETE, MERGE (indispensables pour SCD, CDC, RGPD).\n• Time travel : relire la table telle qu'elle était à une version ou une date (audit, reproduction, annulation d'erreur).\n• Évolution de schéma contrôlée.\n• Performances : statistiques par fichier, élagage, compaction (OPTIMIZE), tri / clustering (Z-order, liquid clustering).\n\nIceberg met l'accent sur l'interopérabilité multi-moteurs (Spark, Trino, Snowflake…) et le partitionnement caché."
  },
  {
    id: "de-a1-7", langue: "dataeng", niveau: "avance", type: "qcm",
    front: "Un job Spark : 199 tâches finissent en 2 minutes, la dernière tourne depuis 1 heure. Diagnostic le plus probable ?",
    choices: [
      "Le cluster manque de mémoire globale",
      "Un déséquilibre des données (skew) : une clé de jointure ou de regroupement très fréquente (ex. client NULL ou « inconnu ») concentre une énorme partie des lignes dans une seule partition",
      "Le format Parquet est corrompu",
      "Il faut augmenter le nombre de partitions à 10 000"
    ],
    answer: 1,
    explain: "Le skew : une tâche reçoit beaucoup plus de données que les autres. Pistes : examiner la distribution des clés (groupBy(cle).count() trié), traiter à part la clé dominante ou les NULL, activer l'Adaptive Query Execution (spark.sql.adaptive.skewJoin.enabled), salage de la clé, broadcast join si l'autre table est petite."
  },
  {
    id: "de-a1-8", langue: "dataeng", niveau: "avance", type: "flip",
    front: "dbt : quels sont les concepts essentiels ?",
    back: "dbt = le « T » de l'ELT : des transformations écrites en SELECT SQL, versionnées dans git.\n• Modèle : un fichier .sql = une table ou une vue. Matérialisations : view, table, incremental, ephemeral.\n• ref('modele') : référence un autre modèle → dbt construit le graphe de dépendances (lignage) et l'ordre d'exécution.\n• source() : déclare les tables brutes, avec contrôle de fraîcheur.\n• Tests : unique, not_null, accepted_values, relationships (intégrité référentielle), et tests SQL personnalisés.\n• Snapshots : historisation SCD type 2 automatique.\n• Documentation générée automatiquement et macros Jinja pour factoriser.\n\ndbt build exécute les modèles ET leurs tests dans l'ordre du graphe."
  },
  {
    id: "de-a1-9", langue: "dataeng", niveau: "avance", type: "code",
    front: "Explique ce modèle dbt incrémental et son point faible.",
    code: "{{ config(materialized='incremental', unique_key='id_commande') }}\n\nSELECT id_commande, id_client, montant, maj_le\nFROM {{ source('shop', 'commandes') }}\n{% if is_incremental() %}\nWHERE maj_le > (SELECT MAX(maj_le) FROM {{ this }})\n{% endif %}",
    back: "• Première exécution : is_incremental() est faux → toute la table est chargée.\n• Exécutions suivantes : seules les lignes modifiées depuis le dernier maj_le chargé sont lues, puis fusionnées (MERGE) sur unique_key → une commande mise à jour remplace l'ancienne version, sans doublon.\n\nPoints faibles :\n• Les données arrivant en retard avec un maj_le antérieur au MAX déjà chargé sont perdues → prévoir une marge : maj_le > MAX(maj_le) − INTERVAL 3 DAY (le MERGE absorbe les relectures).\n• Les suppressions côté source ne sont pas vues.\n• En cas de changement de logique, il faut reconstruire : dbt run --full-refresh."
  },
  {
    id: "de-a1-10", langue: "dataeng", niveau: "avance", type: "flip",
    front: "Données arrivant en retard (late arriving) : quels problèmes et quelles parades ?",
    back: "Cas 1 — faits en retard : une vente du 3 mars arrive le 6 mars. Si le pipeline du 3 mars est déjà passé, l'agrégat du 3 mars est faux.\n→ Retraiter une fenêtre glissante (les N derniers jours) à chaque exécution, de façon idempotente ; ou partitionner aussi par date de chargement.\n\nCas 2 — dimension en retard : une vente arrive pour un client absent de dim_client.\n→ Ne pas perdre la vente (pas d'INNER JOIN) : créer un membre « inconnu » (clé −1) ou une ligne provisoire (« inferred member ») complétée quand la dimension arrive.\n\nToujours mesurer le retard réel (date_chargement − date_evenement) pour calibrer la fenêtre."
  },

  // ======================================================================
  // ---- Pro : conception, coûts, fiabilité, gouvernance ----
  // ======================================================================
  {
    id: "de-p1-1", langue: "dataeng", niveau: "pro", type: "flip",
    front: "Comment réduire la facture d'un entrepôt de données cloud (BigQuery, Snowflake, Databricks) ?",
    back: "• Lire moins : jamais SELECT * sur les grosses tables (stockage colonnaire : on paie les colonnes lues), filtrer sur les colonnes de partition / clustering, prévisualiser plutôt que requêter pour « voir les données ».\n• Calculer moins : modèles incrémentaux plutôt que reconstructions complètes, tables agrégées pour les tableaux de bord, cache des résultats, vues matérialisées.\n• Dimensionner : entrepôts / clusters adaptés, mise en veille automatique, autoscaling plafonné, files de priorité.\n• Stocker intelligemment : rétention et time travel ajustés, suppression des tables orphelines, compaction.\n• Observer : coût par requête, par utilisateur, par pipeline ; alertes de budget. Les 10 requêtes les plus chères font souvent l'essentiel de la facture."
  },
  {
    id: "de-p1-2", langue: "dataeng", niveau: "pro", type: "flip",
    front: "SLA, SLO, SLI pour un pipeline de données ?",
    back: "• SLI (indicateur) : ce qu'on mesure. Ex. fraîcheur = heure de disponibilité de la table gold ; taux de lignes rejetées ; taux de succès des exécutions.\n• SLO (objectif) : la cible interne. Ex. « table ventes_jour disponible avant 7 h, 99 % des jours sur le trimestre ».\n• SLA (accord) : l'engagement contractuel envers les utilisateurs, avec conséquences s'il n'est pas tenu ; moins strict que le SLO pour garder une marge.\n\nIntérêt : discuter des vraies attentes (faut-il vraiment 7 h ?), prioriser les alertes, et justifier les investissements en fiabilité par des chiffres plutôt que par des ressentis."
  },
  {
    id: "de-p1-3", langue: "dataeng", niveau: "pro", type: "flip",
    front: "Observabilité des données : que surveiller au-delà de « le job a réussi » ?",
    back: "Un job vert peut produire des données fausses. Les 5 piliers couramment cités :\n• Fraîcheur : la donnée est-elle à jour ?\n• Volume : nombre de lignes cohérent avec l'historique (une chute de 80 % = source tronquée) ?\n• Schéma : colonnes ajoutées, supprimées, types changés ?\n• Distribution : taux de NULL, valeurs hors plage, moyenne qui dérive, nouvelles modalités ?\n• Lignage : quelles tables et quels tableaux de bord en aval sont touchés en cas d'incident ?\n\nObjectif : détecter le problème AVANT que l'utilisateur métier ne le découvre dans son tableau de bord."
  },
  {
    id: "de-p1-4", langue: "dataeng", niveau: "pro", type: "flip",
    front: "RGPD dans un data lake : comment gérer le droit à l'effacement ?",
    back: "Difficulté : les données sont copiées partout (bronze, silver, gold, sauvegardes, time travel) et les fichiers sont immuables.\n\nPratiques :\n• Minimiser : ne collecter et ne propager que les données personnelles nécessaires.\n• Pseudonymiser tôt : remplacer les identifiants directs par un identifiant technique ; isoler les données personnelles dans une table dédiée, seule à purger.\n• Utiliser un format de table qui supporte DELETE (Delta, Iceberg), puis purger les anciennes versions (VACUUM / expiration des snapshots) pour que le time travel ne conserve pas la donnée.\n• Crypto-shredding : chiffrer les données de chaque personne avec sa propre clé ; supprimer la clé rend les données illisibles partout.\n• Tracer les données personnelles (catalogue, lignage) pour savoir où elles se trouvent."
  },
  {
    id: "de-p1-5", langue: "dataeng", niveau: "pro", type: "qcm",
    front: "Architecture Lambda vs Kappa : quelle affirmation est correcte ?",
    choices: [
      "Lambda n'utilise que du streaming",
      "Lambda maintient deux chaînes (batch pour l'exactitude + streaming pour la fraîcheur) avec deux codes à garder cohérents ; Kappa traite tout comme un flux et rejoue le journal d'événements pour retraiter",
      "Kappa nécessite obligatoirement Hadoop",
      "Les deux sont identiques"
    ],
    answer: 1,
    explain: "Le défaut principal de Lambda est la double logique (batch + temps réel) qui finit par diverger. Kappa simplifie avec une seule chaîne de streaming et un journal rejouable (Kafka avec longue rétention). Aujourd'hui, les moteurs unifiés (Spark Structured Streaming, Flink) et les lakehouses permettent souvent d'écrire une seule logique exécutée en batch ou en continu."
  },
  {
    id: "de-p1-6", langue: "dataeng", niveau: "pro", type: "code",
    front: "Revue de pipeline : liste les problèmes de cette conception.",
    code: "# Job nocturne lancé par cron à 2 h\ndf = spark.read.csv(\"s3://landing/ventes/*.csv\", header=True, inferSchema=True)\ndf = df.join(clients, \"id_client\")              # inner join\ndf.write.mode(\"append\").partitionBy(\"id_client\").parquet(\"s3://gold/ventes\")\n# En cas d'échec : relancer le script à la main",
    back: "1. Relit TOUS les fichiers du dossier à chaque exécution, et écrit en append → chaque nuit duplique l'historique ; non idempotent. Traiter la date logique uniquement et écraser sa partition.\n2. inferSchema : types devinés, qui peuvent changer d'un jour à l'autre (un code postal qui devient entier, zéros de tête perdus) → schéma explicite.\n3. INNER JOIN sur clients : les ventes de clients pas encore présents disparaissent silencieusement → LEFT JOIN + membre « inconnu » + compteur de rejets.\n4. partitionBy(\"id_client\") : cardinalité énorme → des millions de petits fichiers. Partitionner par date.\n5. Écriture directe en gold depuis le brut : pas de couche bronze/silver, pas de rejouabilité.\n6. cron + relance manuelle : ni retries, ni dépendances, ni alerte, ni backfill → orchestrateur, contrôles qualité (volume, unicité) avant publication."
  },
  {
    id: "de-p1-7", langue: "dataeng", niveau: "pro", type: "flip",
    front: "Data mesh : principes et conditions de réussite ?",
    back: "Une organisation décentralisée des données, en 4 principes :\n1. Responsabilité par domaine : chaque domaine métier (ventes, logistique) est responsable de ses données analytiques.\n2. La donnée comme produit : documentée, fiable, avec un propriétaire, des SLO et des utilisateurs identifiés.\n3. Plateforme en libre-service : une équipe centrale fournit les outils (stockage, orchestration, qualité, catalogue) pour que les domaines soient autonomes.\n4. Gouvernance fédérée : des standards communs (identifiants, sécurité, interopérabilité) appliqués automatiquement.\n\nPertinent pour les grandes organisations où l'équipe data centrale est devenue un goulot d'étranglement. Prématuré pour une petite structure : coût organisationnel élevé, risque de silos."
  },
  {
    id: "de-p1-8", langue: "dataeng", niveau: "pro", type: "flip",
    front: "Entretien : « Conçois le pipeline des ventes d'un e-commerce jusqu'au tableau de bord ». Quelle trame de réponse ?",
    back: "1. Clarifier les besoins : quels KPI, quelle fraîcheur (quotidienne ? 15 min ?), quels volumes, quels utilisateurs, quelles contraintes (RGPD, budget).\n2. Sources et ingestion : base de commandes → CDC ou extraction incrémentale ; événements web → flux ; référentiels → full load.\n3. Stockage et couches : bronze (brut, rejouable) → silver (nettoyé, dédupliqué, conforme) → gold (étoile : fait_ventes au grain ligne de commande, dimensions client SCD2, produit, date).\n4. Transformation et orchestration : dbt / Spark, orchestrateur, idempotence, gestion des retards.\n5. Qualité et observabilité : tests (unicité, non-nullité, volumes), alertes, SLO de fraîcheur, lignage.\n6. Exposition : modèle sémantique / BI, droits d'accès.\n7. Compromis assumés : coût vs fraîcheur, simplicité vs flexibilité, et comment le système évolue si le volume est multiplié par 10."
  },
];
