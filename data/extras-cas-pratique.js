// Explications et exemples ajoutés aux cartes « Cas pratiques ».
export const extrasCasPratique = {
  "cas-1": {
    detail: "Si une règle métier (conversion de devise, correction d'un code) est appliquée dès le chargement brut et qu'elle est fausse, la donnée d'origine est perdue : impossible de recalculer. En gardant bronze intact, on corrige la règle en silver et on reconstruit tout depuis bronze.",
    example: `# Mauvais : la conversion EUR est figée dans bronze
brut.withColumn("montant", F.col("montant") * 0.92).write.mode("append").save("bronze/ventes")
# Le taux était faux -> la valeur d'origine est perdue.

# Bon : bronze garde montant et devise d'origine
brut.write.mode("append").save("bronze/ventes")
silver = bronze.join(taux, ["devise", "date"]).withColumn("montant_eur", ...)`,
  },
  "cas-2": {
    detail: "overwrite remplacerait toute la table bronze par le seul lot du jour : l'historique disparaîtrait. En append, chaque exécution ajoute son lot ; on garde une colonne de date de chargement pour savoir d'où vient chaque ligne et pouvoir rejouer un jour précis.",
    example: `lot = spark.read.json(f"s3://landing/commandes/{jour}/")
(lot.withColumn("_jour_charge", F.lit(jour))
    .withColumn("_fichier", F.input_file_name())
    .write.mode("append").format("delta").save("s3://bronze/commandes"))
# Rejouer un jour sans doublon côté silver : relire bronze filtré sur _jour_charge.`,
  },
  "cas-3": {
    detail: "Le principe est de couper le problème en deux : si la somme SQL directe sur la table gold donne déjà 1,8x trop, le bug est dans le pipeline (jointure, doublons). Si elle est juste, il est dans le modèle Power BI (relation, mesure DAX). On avance couche par couche plutôt que de tout relire.",
    example: `-- 1. Total gold, sans Power BI
SELECT SUM(montant) FROM gold.fait_ventes WHERE annee = 2025;     -- 18,2 M€
-- 2. Total à la source
SELECT SUM(montant) FROM source.commandes WHERE annee = 2025;     -- 10,1 M€
-- -> déjà faux en gold : le bug est dans le pipeline, pas dans DAX.`,
  },
  "cas-4": {
    detail: "Une table de faits devrait avoir autant de lignes que sa source au même grain (aux rejets près). Si elle en a plus, une jointure a multiplié des lignes ; on cherche alors quelle clé est en double dans la table jointe. Ce contrôle peut devenir un test automatique du pipeline.",
    example: `SELECT
  (SELECT COUNT(*) FROM source.commandes   WHERE jour = '2025-03-02') AS source,  -- 41 200
  (SELECT COUNT(*) FROM gold.fait_ventes   WHERE jour = '2025-03-02') AS gold;    -- 74 160

-- Quelle clé duplique ?
SELECT customer_id, COUNT(*) FROM dim_client GROUP BY customer_id HAVING COUNT(*) > 1;`,
  },
  "cas-5": {
    detail: "Une dimension SCD2 contient plusieurs lignes par client, une par version. Joindre seulement sur l'identifiant client associe chaque commande à TOUTES les versions : un client ayant changé 2 fois d'adresse triple ses commandes. Il faut choisir la version valide à la date de la commande.",
    example: `-- dim_client : C7 Lille [2020-01-01 ; 2025-06-01[   C7 Lyon [2025-06-01 ; 9999-12-31[
-- commande C1 du 2025-03-10, client C7, 100 €

-- Faux : 2 lignes (Lille ET Lyon), 200 € au total
JOIN dim_client dc ON c.customer_id = dc.customer_id

-- Juste : 1 ligne (Lille)
JOIN dim_client dc ON c.customer_id = dc.customer_id
 AND c.order_date >= dc.date_debut AND c.order_date < dc.date_fin`,
  },
  "cas-6": {
    detail: "Quand une version se termine le 01/06 et que la suivante commence le 01/06, une commande datée exactement du 01/06 vérifie « date BETWEEN debut AND fin » pour les deux versions. Le doublon n'apparaît que pour les commandes de ce jour-là : le bug est rare, donc difficile à détecter.",
    example: `-- Version 1 : [2020-01-01 ; 2025-06-01]   Version 2 : [2025-06-01 ; 9999-12-31]
-- Commande du 2025-06-01 :
--   '2025-06-01' BETWEEN '2020-01-01' AND '2025-06-01'  -> vrai
--   '2025-06-01' BETWEEN '2025-06-01' AND '9999-12-31'  -> vrai   => 2 lignes`,
  },
  "cas-7": {
    detail: "Avec un intervalle semi-ouvert [début ; fin[, la date de fin d'une version est exactement la date de début de la suivante, et chaque date appartient à une seule version. C'est la convention la plus sûre pour toute donnée historisée (prix, contrats, affectations).",
    example: `-- Commande du 2025-06-01 :
--   version 1 : '2025-06-01' >= '2020-01-01' AND '2025-06-01' < '2025-06-01' -> faux
--   version 2 : '2025-06-01' >= '2025-06-01' AND '2025-06-01' < '9999-12-31' -> vrai
-- => exactement une version.`,
  },
  "cas-8": {
    detail: "Plutôt que de lister tous les cas de chevauchement (inclus, à cheval à gauche, à droite…), on vérifie l'inverse : deux intervalles NE se chevauchent PAS si l'un finit avant que l'autre ne commence. La négation de cette condition donne la formule courte.",
    example: `-- Promos du même produit qui se chevauchent
SELECT a.id, b.id
FROM promos a
JOIN promos b
  ON a.produit_id = b.produit_id
 AND a.id < b.id                       -- chaque paire une seule fois
 AND a.date_debut < b.date_fin
 AND b.date_debut < a.date_fin;
-- [01/03 ; 15/03[ et [10/03 ; 20/03[ -> chevauchement
-- [01/03 ; 10/03[ et [10/03 ; 20/03[ -> pas de chevauchement (bornes semi-ouvertes)`,
  },
  "cas-9": {
    detail: "La jointure ne fait que refléter la donnée : si deux promos valident la même date pour le même produit, il y a réellement deux prix possibles. Il faut une règle métier (priorité, la plus récente, la plus avantageuse) ou corriger la source, et un contrôle qui détecte ce cas avant le chargement.",
    example: `-- Promo A : -10 % du 01/03 au 15/03 ; promo B : -20 % du 10/03 au 20/03
-- Commande du 12/03 -> 2 prix. Règle possible : la promo la plus récente gagne.
ROW_NUMBER() OVER (PARTITION BY commande_id ORDER BY promo_debut DESC) = 1`,
  },
  "cas-10": {
    detail: "Une jointure temporelle ajoute à la clé une condition de période : « le prix du produit P en vigueur à la date de la commande ». C'est la même logique que la jointure SCD2 vers une dimension client. Certains moteurs ont une syntaxe dédiée (ASOF JOIN dans DuckDB ou Snowflake).",
    example: `SELECT c.id, c.date_cmd, p.prix
FROM commandes c
LEFT JOIN prix p
  ON p.produit_id = c.produit_id
 AND c.date_cmd >= p.debut
 AND c.date_cmd <  p.fin;

-- DuckDB : dernier prix connu avant la commande
SELECT * FROM commandes c ASOF LEFT JOIN prix p
  ON c.produit_id = p.produit_id AND c.date_cmd >= p.debut;`,
  },
  "cas-11": {
    detail: "Une commande sans prix trouvé révèle un problème de données (produit nouveau, trou dans l'historique des prix). En LEFT JOIN, elle reste avec un prix NULL qu'on peut compter et signaler. En INNER JOIN, elle disparaît, et le chiffre d'affaires est sous-estimé sans que personne ne le sache.",
    example: `jointes = commandes.join(prix,
    (commandes.produit_id == prix.produit_id) &
    (commandes.date_cmd >= prix.debut) & (commandes.date_cmd < prix.fin),
    "left")

sans_prix = jointes.filter(F.col("prix").isNull())
print(sans_prix.count())          # à surveiller / bloquer au-delà d'un seuil`,
  },
  "cas-12": {
    detail: "DAX est fait pour filtrer et agréger un modèle en étoile, pas pour des jointures sur des plages de dates. Une mesure qui cherche le prix valide pour chaque ligne au moment de l'affichage est lente et difficile à vérifier. Calculer prix_applique une fois dans le pipeline donne une colonne simple, testable, que DAX se contente de sommer.",
    example: `-- En amont (SQL / PySpark), une fois par chargement :
fait_ventes.montant = qte * prix_applique   (prix trouvé par jointure temporelle)

-- En DAX, une mesure triviale :
CA = SUM(fait_ventes[montant])

-- À éviter : une mesure avec LOOKUPVALUE + FILTER sur des plages de dates à chaque visuel.`,
  },
  "cas-13": {
    detail: "Un contrôle qui ne fait qu'alerter laisse les données fausses partir dans les rapports, les factures ou les commissions. Quand l'erreur a un impact financier direct, on préfère que le pipeline s'arrête : les rapports gardent la version de la veille, et l'équipe corrige avant publication (logique Write-Audit-Publish).",
    example: `nb = spark.sql("""
  SELECT COUNT(*) FROM prix a JOIN prix b
    ON a.produit_id = b.produit_id AND a.id < b.id
   AND a.debut < b.fin AND b.debut < a.fin
""").first()[0]

if nb > 0:
    raise ValueError(f"{nb} chevauchements de prix : publication bloquée")`,
  },
  "cas-14": {
    detail: "Sur 200 millions de lignes, chaque ligne faisait l'aller-retour entre la JVM et Python. Le passage à une UDF Scala supprime ce transfert. Avant même d'écrire une UDF, il faut vérifier si des fonctions natives suffisent (lower, trim, regexp_replace, translate), ce qui serait encore plus rapide.",
    example: `# Avant : UDF Python
@F.udf("string")
def normaliser(s): return unidecode(s).lower().strip() if s else None

# Souvent suffisant, sans UDF :
df.withColumn("nom_norm",
    F.lower(F.trim(F.translate("nom", "éèêàçôûî", "eeeacoui"))))`,
  },
  "cas-15": {
    detail: "On a tendance à soupçonner d'abord la dernière couche, la plus visible (le rapport, la mesure DAX). Or un total faux vient le plus souvent d'une jointure ou d'un chargement en amont. Contrôler chaque couche de la source vers le rapport localise le problème en quelques requêtes.",
    example: `Ordre de diagnostic pour « le CA affiché est faux » :
1. Source     : SUM(montant) dans la base de commandes      -> 10,1 M€
2. Bronze     : même somme                                  -> 10,1 M€
3. Silver     : même somme                                  -> 10,1 M€
4. Gold       : même somme                                  -> 18,2 M€  <- ici
5. (Power Query, puis DAX : inutile de les vérifier)`,
  },
  "cas-16": {
    detail: "Toute table historisée (SCD2, prix, contrats) repose sur une hypothèse : pour une même clé, les périodes ne se recouvrent pas et, souvent, ne laissent pas de trou. Ce contrôle générique s'écrit une fois et s'applique à toutes ces tables avant chargement.",
    example: `-- Contrôle générique : chevauchements par clé, sur n'importe quelle table [debut ; fin[
SELECT cle, COUNT(*) AS nb_chevauchements
FROM (
  SELECT cle, debut, fin,
         LAG(fin) OVER (PARTITION BY cle ORDER BY debut) AS fin_precedente
  FROM dim_client
) t
WHERE debut < fin_precedente          -- commence avant la fin de la version précédente
GROUP BY cle;`,
  },
};
