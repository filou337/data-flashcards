// Explications et exemples ajoutés aux cartes SQL (fusionnés par id dans data/index.js).
export const extrasSQL = {
  "sql-f1-1": {
    detail: "Le SQL s'écrit dans un ordre « lisible » (SELECT d'abord) mais s'exécute dans un ordre logique différent. Connaître cet ordre explique la plupart des erreurs du type « colonne inconnue » : à chaque étape, seul ce qui a été produit par les étapes précédentes existe.",
    example: `SELECT region, SUM(montant) AS total
FROM ventes
WHERE total > 1000        -- ERREUR : "total" n'existe pas encore
GROUP BY region;

-- Correct : filtrer un agrégat se fait dans HAVING
SELECT region, SUM(montant) AS total
FROM ventes
GROUP BY region
HAVING SUM(montant) > 1000
ORDER BY total DESC;      -- OK : ORDER BY s'exécute après SELECT`,
  },
  "sql-f1-2": {
    detail: "SQL utilise une logique à trois valeurs : VRAI, FAUX et INCONNU (NULL). Le WHERE ne garde que les lignes VRAIES ; une comparaison avec NULL donne INCONNU, donc la ligne est écartée. NULL veut dire « valeur inconnue », pas zéro.",
    example: `-- Table employes : (Ana, 500), (Bob, 300), (Chloé, NULL)
SELECT nom FROM employes WHERE bonus <> 500;
-- Résultat : Bob uniquement (Chloé disparaît)

SELECT NULL = NULL;   -- NULL, pas TRUE
SELECT NULL <> 500;   -- NULL, pas TRUE`,
  },
  "sql-f1-3": {
    detail: "Dès qu'une colonne est « nullable », il faut se demander pour chaque filtre : que doit-il se passer pour les NULL ? Les inclure demande d'écrire explicitement IS NULL. Autre écriture équivalente : COALESCE(bonus, -1) <> 500.",
    example: `-- Données : (Ana, 500), (Bob, 300), (Chloé, NULL)
SELECT nom FROM employes
WHERE bonus <> 500 OR bonus IS NULL;
-- Résultat : Bob, Chloé

-- Variante (PostgreSQL) : IS DISTINCT FROM traite NULL comme une valeur
SELECT nom FROM employes WHERE bonus IS DISTINCT FROM 500;`,
  },
  "sql-f2-1": {
    detail: "Une jointure produit une ligne par COUPLE de lignes qui correspondent. Si une clé apparaît 3 fois à droite, chaque ligne de gauche qui la porte ressort 3 fois. C'est la cause n°1 des totaux gonflés dans les tableaux de bord.",
    example: `-- commandes : (C1, client 7, 100 €)
-- adresses   : (client 7, Paris), (client 7, Lyon)   <- 2 adresses !
SELECT SUM(c.montant)
FROM commandes c
JOIN adresses a ON a.client_id = c.client_id;
-- Résultat : 200 € au lieu de 100 € (la commande est comptée 2 fois)`,
  },
  "sql-f2-2": {
    detail: "Après un LEFT JOIN, les lignes de gauche sans correspondance ont des NULL dans les colonnes de droite. Un WHERE sur une colonne de droite (= 'x') rejette ces NULL : on perd exactement les lignes que le LEFT JOIN devait garder.",
    example: `-- Tous les clients, avec leurs commandes de 2025 s'il y en a :
SELECT cl.nom, co.id
FROM clients cl
LEFT JOIN commandes co
  ON co.client_id = cl.id
 AND co.annee = 2025;          -- condition dans le ON : clients sans commande gardés

-- Faux : WHERE co.annee = 2025 -> les clients sans commande 2025 disparaissent`,
  },
  "sql-f2-3": {
    detail: "Ce contrôle prend quelques secondes et évite des heures de débogage : on vérifie que la clé est unique du côté qui doit l'être AVANT de joindre. À faire systématiquement sur toute nouvelle table de dimension.",
    example: `SELECT client_id, COUNT(*) AS nb
FROM adresses
GROUP BY client_id
HAVING COUNT(*) > 1
ORDER BY nb DESC;
-- client_id | nb
--         7 |  2   <- ce client dupliquera ses commandes à la jointure`,
  },
  "sql-f3-1": {
    detail: "COUNT(*) compte des lignes, COUNT(col) compte des valeurs non nulles, COUNT(DISTINCT col) compte des valeurs distinctes non nulles. Comparer les trois révèle vite les NULL et les doublons d'une colonne.",
    example: `-- bonus : 500, 300, NULL, 300
SELECT COUNT(*)              AS lignes,      -- 4
       COUNT(bonus)          AS renseignes,  -- 3
       COUNT(DISTINCT bonus) AS distincts,   -- 2
       AVG(bonus)            AS moyenne      -- 366,67 (NULL ignoré : 1100/3)
FROM employes;`,
  },
  "sql-f3-2": {
    detail: "Règle pratique : si la condition porte sur une valeur de ligne (date, statut), c'est WHERE ; si elle porte sur un agrégat (SUM, COUNT…), c'est HAVING. Filtrer tôt dans WHERE réduit aussi le volume à agréger.",
    example: `-- Clients ayant passé plus de 3 commandes livrées en 2025
SELECT client_id, COUNT(*) AS nb
FROM commandes
WHERE statut = 'livree' AND annee = 2025   -- avant agrégation
GROUP BY client_id
HAVING COUNT(*) > 3;                       -- après agrégation`,
  },
  "sql-f3-3": {
    detail: "Chaque colonne du SELECT doit être soit dans le GROUP BY, soit dans une fonction d'agrégat : sinon le moteur ne sait pas QUELLE valeur afficher parmi les lignes du groupe. Si on veut « le nom du meilleur vendeur par région », il faut un ROW_NUMBER, pas un GROUP BY.",
    example: `-- Correct : agréger ce qui n'est pas groupé
SELECT region, COUNT(DISTINCT nom) AS vendeurs, SUM(montant) AS total
FROM ventes
GROUP BY region;

-- Ou grouper aussi par nom
SELECT region, nom, SUM(montant) FROM ventes GROUP BY region, nom;`,
  },
  "sql-f4-1": {
    detail: "x NOT IN (1, 2, NULL) revient à x <> 1 AND x <> 2 AND x <> NULL. Le dernier terme vaut toujours INCONNU, donc le tout ne vaut jamais VRAI : aucune ligne ne sort. Le piège est silencieux et apparaît le jour où un NULL arrive dans la sous-requête.",
    example: `-- clients : 1, 2, 3     commandes.client_id : 1, NULL
SELECT id FROM clients
WHERE id NOT IN (SELECT client_id FROM commandes);
-- Résultat : AUCUNE ligne (on attendait 2 et 3)

-- Rustine : exclure les NULL dans la sous-requête
WHERE id NOT IN (SELECT client_id FROM commandes WHERE client_id IS NOT NULL)`,
  },
  "sql-f4-2": {
    detail: "NOT EXISTS teste l'absence de ligne correspondante, ligne par ligne ; un NULL dans la sous-requête ne correspond simplement à rien. C'est aussi souvent mieux optimisé (anti-jointure). Autre écriture équivalente : LEFT JOIN … WHERE droite.cle IS NULL.",
    example: `-- Clients sans aucune commande
SELECT cl.id
FROM clients cl
WHERE NOT EXISTS (
  SELECT 1 FROM commandes co WHERE co.client_id = cl.id
);
-- Résultat : 2, 3 (même s'il existe des commandes à client_id NULL)`,
  },
  "sql-f4-3": {
    detail: "Une sous-requête corrélée est pratique pour exprimer « pour chaque ligne, cherche… ». Les optimiseurs modernes la transforment souvent en jointure, mais pas toujours : sur un gros volume, une réécriture en JOIN ou en fonction fenêtrée est plus sûre.",
    example: `-- Corrélée : la sous-requête dépend de e.service
SELECT e.nom, e.salaire
FROM employes e
WHERE e.salaire > (SELECT AVG(salaire) FROM employes x WHERE x.service = e.service);

-- Réécriture avec une fonction fenêtrée (un seul passage)
SELECT nom, salaire FROM (
  SELECT nom, salaire, AVG(salaire) OVER (PARTITION BY service) AS moy
  FROM employes
) t WHERE salaire > moy;`,
  },
  "sql-i1-1": {
    detail: "ROW_NUMBER numérote les lignes de chaque groupe (PARTITION BY) selon un ordre (ORDER BY) ; on garde la n°1. Ajouter un second critère de tri rend le résultat déterministe en cas d'égalité. RANK serait un mauvais choix : il donne le même rang aux ex æquo et peut garder 2 lignes.",
    example: `WITH classees AS (
  SELECT *,
         ROW_NUMBER() OVER (
           PARTITION BY client_id
           ORDER BY maj_le DESC, id DESC
         ) AS rn
  FROM clients_versions
)
SELECT * FROM classees WHERE rn = 1;   -- la version la plus récente de chaque client`,
  },
  "sql-i1-2": {
    detail: "Une fonction fenêtrée garde le détail ET ajoute une information calculée sur un groupe de lignes : rang, cumul, moyenne du groupe, valeur précédente (LAG)… Idéal pour comparer une ligne à son groupe sans jointure.",
    example: `-- GROUP BY : 1 ligne par région
SELECT region, SUM(montant) FROM ventes GROUP BY region;

-- Fenêtre : toutes les lignes, avec le total et la part de leur région
SELECT region, vendeur, montant,
       SUM(montant) OVER (PARTITION BY region)           AS total_region,
       montant / SUM(montant) OVER (PARTITION BY region) AS part
FROM ventes;`,
  },
  "sql-i1-3": {
    detail: "Le « cadre » (frame) d'une fenêtre définit les lignes prises en compte pour la ligne courante. Avec ORDER BY et sans cadre explicite, la norme utilise RANGE … CURRENT ROW : toutes les lignes ayant la MÊME valeur de tri sont incluses d'un coup, donc les ex æquo affichent le même cumul.",
    example: `-- order_date | montant | cumul RANGE (défaut) | cumul ROWS
-- 01/03      |   10    |         10          |     10
-- 02/03      |   20    |         60          |     30
-- 02/03      |   30    |         60          |     60
-- 03/03      |    5    |         65          |     65
-- Ajouter un critère unique dans ORDER BY (ex. id) rend aussi le cumul déterministe.`,
  },
  "sql-i2-1": {
    detail: "Une CTE récursive démarre avec un ensemble de départ (l'ancre), puis applique la partie récursive sur les lignes produites à l'étape précédente, jusqu'à ce qu'elle ne produise plus rien. Usages typiques : hiérarchies (organigramme, nomenclature), génération de séries de dates.",
    example: `-- Tous les subordonnés (directs et indirects) du manager 1
WITH RECURSIVE equipe AS (
  SELECT id, nom, manager_id, 1 AS niveau
  FROM employes WHERE id = 1                      -- ancre
  UNION ALL
  SELECT e.id, e.nom, e.manager_id, q.niveau + 1
  FROM employes e
  JOIN equipe q ON e.manager_id = q.id            -- récursion
)
SELECT * FROM equipe;`,
  },
  "sql-i2-2": {
    detail: "La récursion s'arrête quand l'étape récursive ne renvoie plus de ligne. Une donnée cyclique (A manager de B, B manager de A) ou une condition oubliée empêche cela. On se protège avec une borne explicite (niveau < N) ou en mémorisant le chemin parcouru.",
    example: `-- Générer les dates de mars, avec une condition d'arrêt claire
WITH RECURSIVE jours AS (
  SELECT DATE '2025-03-01' AS d
  UNION ALL
  SELECT d + 1 FROM jours
  WHERE d < DATE '2025-03-31'      -- condition d'arrêt
)
SELECT d FROM jours;
-- SQL Server : OPTION (MAXRECURSION 1000) pour relever la limite de 100`,
  },
  "sql-i3-1": {
    detail: "Deux tables qui semblent parler des « commandes » peuvent avoir des grains différents : une ligne par commande ou une ligne par produit commandé. Compter des lignes, faire une moyenne de panier ou joindre sans connaître le grain donne des chiffres faux.",
    example: `-- lignes_commande (grain : 1 ligne = 1 produit dans 1 commande)
-- cmd | produit | montant
-- C1  | stylo   |  2
-- C1  | cahier  |  5
-- C2  | stylo   |  2
SELECT COUNT(*)            FROM lignes_commande;  -- 3 (lignes, pas commandes)
SELECT COUNT(DISTINCT cmd) FROM lignes_commande;  -- 2 commandes
SELECT SUM(montant) / COUNT(DISTINCT cmd) FROM lignes_commande;  -- panier moyen 4,5`,
  },
  "sql-i3-2": {
    detail: "Le type 2 permet de répondre à « quelle était la région du client AU MOMENT de la vente ? ». Avec un type 1, toutes les ventes passées basculent dans la nouvelle région après un déménagement, ce qui réécrit l'histoire des rapports.",
    example: `-- dim_client en SCD2 après un déménagement le 01/06/2025
-- cle | client | ville | date_debut | date_fin   | courant
--  11 | C7     | Lille | 2020-01-01 | 2025-06-01 | false
--  42 | C7     | Lyon  | 2025-06-01 | 9999-12-31 | true
-- Une vente de mars 2025 reste rattachée à la clé 11 (Lille).
-- En SCD1, il n'y aurait qu'une ligne : C7 | Lyon.`,
  },
  "sql-i4-1": {
    detail: "« Sargable » = Search ARGument ABLE : le moteur peut utiliser l'index. L'index est trié sur la valeur brute de la colonne ; si on transforme la colonne, il ne peut plus y chercher directement. La solution : laisser la colonne nue et transformer la constante.",
    example: `-- Non sargable : la fonction s'applique à chaque ligne
WHERE YEAR(date_vente) = 2026

-- Sargable : une plage sur la colonne brute, l'index est utilisé
WHERE date_vente >= '2026-01-01'
  AND date_vente <  '2027-01-01'

-- Même piège : WHERE UPPER(email) = '...' ou WHERE montant * 1.2 > 100`,
  },
  "sql-i4-2": {
    detail: "Dans un chargement, une seule valeur mal formée (« 12,5 € », « N/A ») suffit à faire échouer un CAST classique et tout le traitement. TRY_CAST renvoie NULL à la place : on peut alors compter et isoler les lignes invalides au lieu de tout bloquer.",
    example: `-- montant_txt : '12.5', 'N/A', '40'
SELECT montant_txt,
       TRY_CAST(montant_txt AS DECIMAL(10,2)) AS montant
FROM import_brut;
-- '12.5' -> 12.50 ; 'N/A' -> NULL ; '40' -> 40.00

-- Lignes à mettre en quarantaine :
SELECT * FROM import_brut
WHERE TRY_CAST(montant_txt AS DECIMAL(10,2)) IS NULL AND montant_txt IS NOT NULL;`,
  },
  "sql-a1-1": {
    detail: "Un index contient la colonne indexée (et un pointeur vers la ligne). Si la requête ne demande QUE des colonnes présentes dans l'index, le moteur n'a pas besoin de lire la table : c'est un index « couvrant ». On peut y ajouter des colonnes avec INCLUDE.",
    example: `CREATE INDEX idx_cmd_client ON commandes (client_id) INCLUDE (montant);

-- Couverte par l'index -> Index Only Scan
SELECT client_id, SUM(montant) FROM commandes WHERE client_id = 42 GROUP BY client_id;

-- Demande aussi "adresse" -> retour à la table pour chaque ligne (Index Scan)
SELECT client_id, montant, adresse FROM commandes WHERE client_id = 42;`,
  },
  "sql-a1-2": {
    detail: "L'optimiseur choisit le plan (index ou scan, type de jointure, ordre) à partir de statistiques sur les données. Si elles datent d'avant un gros chargement, il peut croire qu'une table a 100 lignes alors qu'elle en a 10 millions et choisir une boucle imbriquée désastreuse.",
    example: `EXPLAIN ANALYZE SELECT * FROM commandes WHERE statut = 'retour';
-- Seq Scan on commandes (rows=120) (actual rows=2 450 000)   <- écart énorme

ANALYZE commandes;                       -- PostgreSQL
-- UPDATE STATISTICS dbo.commandes;      -- SQL Server`,
  },
  "sql-a1-3": {
    detail: "Un index est utile quand il permet d'éliminer l'essentiel des lignes. Sur une colonne vrai/faux répartie à 50/50, il faudrait de toute façon lire la moitié de la table, et un scan complet est souvent plus rapide. Exception : un index partiel sur la valeur rare.",
    example: `-- 98 % des commandes ont est_annulee = false
-- Inutile :
CREATE INDEX idx_annulee ON commandes (est_annulee);

-- Utile (PostgreSQL) : index partiel sur la valeur rare qu'on cherche
CREATE INDEX idx_annulees ON commandes (date_cmd) WHERE est_annulee = true;`,
  },
  "sql-a2-1": {
    detail: "Atomicité : tout ou rien. Cohérence : les contraintes restent respectées. Isolation : les transactions concurrentes ne se voient pas à moitié faites. Durabilité : une fois validée, la transaction survit à une panne. C'est ce qui rend un virement bancaire sûr.",
    example: `BEGIN;
UPDATE comptes SET solde = solde - 100 WHERE id = 'A';
UPDATE comptes SET solde = solde + 100 WHERE id = 'B';
COMMIT;
-- Si le serveur plante entre les deux UPDATE, rien n'est appliqué (atomicité) :
-- on ne perd jamais 100 € « en route ».`,
  },
  "sql-a2-2": {
    detail: "READ COMMITTED garantit qu'on ne lit que des données validées (pas de lecture « sale »). Les niveaux plus stricts (REPEATABLE READ, SERIALIZABLE) évitent d'autres anomalies mais posent plus de verrous ou de conflits. Pour un rapport cohérent sur une longue requête, un instantané (snapshot) est souvent le bon compromis.",
    example: `-- Anomalie possible en READ COMMITTED : deux lectures dans la même transaction
-- peuvent donner des résultats différents si quelqu'un valide entre les deux.
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT SUM(montant) FROM ventes;   -- 1 000
-- (une autre session insère et valide une vente de 50)
SELECT SUM(montant) FROM ventes;   -- 1 050`,
  },
  "sql-a3-1": {
    detail: "Sur des dates consécutives, la date et le numéro de ligne augmentent tous les deux de 1 : leur différence reste constante. Dès qu'un jour manque, la différence change. Ce « groupe » sert ensuite à calculer début, fin et longueur de chaque série (ex. jours de connexion d'affilée).",
    example: `-- jour        | rn | jour - rn
-- 2025-03-01  |  1 | 2025-02-28
-- 2025-03-02  |  2 | 2025-02-28
-- 2025-03-05  |  3 | 2025-03-02   <- trou : nouveau groupe
SELECT user_id, MIN(jour) AS debut, MAX(jour) AS fin, COUNT(*) AS jours
FROM (SELECT user_id, jour,
             jour - CAST(ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY jour) AS INT) AS grp
      FROM connexions) t
GROUP BY user_id, grp;`,
  },
  "sql-a3-2": {
    detail: "Méthode en deux temps : 1) marquer 1 chaque événement qui démarre une session (premier événement ou écart > 30 min), 0 sinon ; 2) faire la somme cumulée de ces marqueurs : elle augmente de 1 à chaque nouvelle session, ce qui donne un identifiant.",
    example: `-- user | ts    | écart  | nouvelle | session
-- u1   | 10:00 |   —    |    1     |   1
-- u1   | 10:12 | 12 min |    0     |   1
-- u1   | 11:05 | 53 min |    1     |   2
-- u1   | 11:20 | 15 min |    0     |   2
SUM(nouvelle_session) OVER (PARTITION BY user_id ORDER BY ts
                            ROWS UNBOUNDED PRECEDING) AS session_id`,
  },
  "sql-a3-3": {
    detail: "Une requête SQL a un schéma de sortie fixe. Un PIVOT doit donc lister les valeurs qui deviennent colonnes. Alternatives fréquentes : l'agrégation conditionnelle (portable sur tous les moteurs), ou faire le pivot dans l'outil de restitution (Power BI, Excel), qui gère des colonnes dynamiques.",
    example: `-- Agrégation conditionnelle : un pivot portable
SELECT produit,
       SUM(CASE WHEN mois = 1 THEN montant END) AS janv,
       SUM(CASE WHEN mois = 2 THEN montant END) AS fevr,
       SUM(CASE WHEN mois = 3 THEN montant END) AS mars
FROM ventes
GROUP BY produit;
-- Un 4e mois demande de modifier la requête : la liste est figée.`,
  },
  "sql-a4-1": {
    detail: "ROLLUP(a, b) produit les groupes (a, b), (a) et le total général (). Les lignes de sous-total ont NULL dans les colonnes « remontées » ; GROUPING(col) vaut 1 sur ces lignes, ce qui permet de les distinguer d'un vrai NULL. CUBE produit toutes les combinaisons.",
    example: `SELECT annee, mois, SUM(montant) AS total
FROM ventes
GROUP BY ROLLUP (annee, mois)
ORDER BY annee, mois;
-- 2025 | 1    | 100
-- 2025 | 2    | 150
-- 2025 | NULL | 250   <- sous-total 2025
-- NULL | NULL | 250   <- total général`,
  },
  "sql-a4-2": {
    detail: "PERCENTILE_CONT interpole entre les deux valeurs centrales quand le nombre de lignes est pair (médiane « continue ») ; PERCENTILE_DISC renvoie une valeur réellement présente. La médiane est plus robuste que la moyenne pour des montants asymétriques (paniers, salaires).",
    example: `-- paniers : 10, 20, 30, 1000
SELECT AVG(panier) AS moyenne,                                         -- 265
       PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY panier) AS mediane, -- 25
       PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY panier) AS med_disc -- 20
FROM commandes;`,
  },
  "sql-p1-1": {
    detail: "Une requête analytique lit typiquement 3 colonnes sur 50, mais des millions de lignes. En stockage colonnes, on ne lit que ces 3 colonnes, très compressées (les valeurs d'une même colonne se ressemblent), et le calcul est réparti sur de nombreux nœuds. À l'inverse, retrouver UNE commande complète par son id est le terrain de l'OLTP.",
    example: `-- Rapide en colonnes (peu de colonnes, beaucoup de lignes) :
SELECT pays, SUM(montant) FROM ventes WHERE annee = 2025 GROUP BY pays;

-- Rapide en lignes (une ligne complète, accès par clé) :
SELECT * FROM commandes WHERE id = 987654;
-- Dans BigQuery, "SELECT *" sur une grosse table fait payer TOUTES les colonnes.`,
  },
  "sql-p1-2": {
    detail: "Dans un moteur distribué, les lignes de même clé sont envoyées sur la même tâche pour être jointes ou agrégées. Si une clé (souvent NULL, « inconnu » ou un très gros client) représente 40 % des lignes, une seule tâche fait 40 % du travail pendant que les autres attendent.",
    example: `-- Diagnostic : la répartition des clés
SELECT client_id, COUNT(*) AS nb
FROM ventes
GROUP BY client_id
ORDER BY nb DESC
LIMIT 5;
-- NULL | 38 000 000   <- la clé NULL concentre tout : la traiter à part`,
  },
  "sql-p1-3": {
    detail: "Une table partitionnée par date est rangée en blocs séparés (un par jour ou par mois). Un filtre sur la colonne de partition permet au moteur de ne même pas ouvrir les autres blocs. Le filtre doit porter directement sur la colonne, sans fonction, sinon l'élagage peut être perdu.",
    example: `-- Table partitionnée par date_vente (1 partition par jour, 3 ans)
SELECT SUM(montant) FROM ventes
WHERE date_vente >= '2025-03-01' AND date_vente < '2025-04-01';
-- Lit 31 partitions sur ~1 100.

-- Risque de tout lire selon le moteur :
WHERE CAST(date_vente AS VARCHAR) LIKE '2025-03%'`,
  },
  "sql-p2-1": {
    detail: "MERGE compare la source à la cible ligne par ligne : il met à jour ce qui existe, insère ce qui manque, et peut supprimer ce qui a disparu, en une seule instruction transactionnelle. Rejouer le même MERGE avec les mêmes données ne change rien : il est idempotent.",
    example: `MERGE INTO dim_produit AS cible
USING stg_produit AS src
  ON cible.code = src.code
WHEN MATCHED THEN
  UPDATE SET libelle = src.libelle, prix = src.prix
WHEN NOT MATCHED THEN
  INSERT (code, libelle, prix) VALUES (src.code, src.libelle, src.prix);`,
  },
  "sql-p2-2": {
    detail: "En production, un traitement peut être relancé : échec réseau, relance automatique, rattrapage d'historique. S'il fait un simple INSERT, chaque relance duplique les données. Les techniques idempotentes : MERGE sur une clé, ou supprimer puis réinsérer la période traitée dans une même transaction.",
    example: `-- Non idempotent : chaque relance ajoute les ventes du jour une fois de plus
INSERT INTO ventes_jour SELECT * FROM brut WHERE jour = '2025-03-02';

-- Idempotent : on remplace la période traitée, atomiquement
BEGIN;
DELETE FROM ventes_jour WHERE jour = '2025-03-02';
INSERT INTO ventes_jour SELECT * FROM brut WHERE jour = '2025-03-02';
COMMIT;`,
  },
};
