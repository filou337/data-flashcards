// Explications et exemples ajoutés aux cartes DAX.
export const extrasDAX = {
  "dax-f1-1": {
    detail: "Une colonne calculée est évaluée une fois, à l'actualisation, pour chaque ligne, puis stockée : elle ne réagit pas aux filtres du rapport. Une mesure n'est pas stockée : elle est recalculée à chaque affichage, dans le contexte de la cellule (région, mois, segment sélectionné…).",
    example: `-- Colonne calculée (propriété fixe de la ligne) :
Ventes[Tranche] = IF(Ventes[Montant] >= 100, "Gros panier", "Petit panier")

-- Mesure (dépend des filtres du visuel) :
CA Total = SUM(Ventes[Montant])
Panier moyen = DIVIDE([CA Total], DISTINCTCOUNT(Ventes[CommandeId]))`,
  },
  "dax-f1-2": {
    detail: "VertiPaq compresse chaque colonne grâce à un dictionnaire de ses valeurs distinctes. Une colonne avec peu de valeurs (pays, statut) se compresse très bien ; une colonne où presque chaque ligne est unique (identifiant, horodatage à la seconde, concaténation) coûte presque autant que la donnée brute.",
    example: `-- Coûteux : une valeur différente par ligne
Ventes[Cle] = Ventes[ClientId] & "-" & Ventes[CommandeId] & "-" & Ventes[Ligne]

-- Préférer : ne pas créer la colonne, ou la calculer en amont (SQL / Power Query)
-- si elle est vraiment nécessaire. DAX Studio > VertiPaq Analyzer montre
-- la taille de chaque colonne dans le modèle.`,
  },
  "dax-f2-1": {
    detail: "Le contexte de ligne répond à « quelle ligne suis-je en train de traiter ? » ; il ne filtre rien. Le contexte de filtre répond à « quelles lignes sont visibles ? » ; il vient des axes du visuel, des segments et des filtres. Un même calcul peut avoir les deux : un itérateur (contexte de ligne) dans une mesure (contexte de filtre).",
    example: `-- Contexte de ligne : la colonne connaît Prix et Qte de SA ligne
Ventes[Montant] = Ventes[Prix] * Ventes[Qte]

-- Contexte de filtre : dans une matrice Pays x Année, la cellule (FR, 2025)
-- ne voit que les ventes FR de 2025
CA = SUM(Ventes[Montant])

-- Les deux : SUMX crée un contexte de ligne à l'intérieur du contexte de filtre
CA bis = SUMX(Ventes, Ventes[Prix] * Ventes[Qte])`,
  },
  "dax-f2-2": {
    detail: "Dans une mesure, la cellule d'un visuel correspond à un ENSEMBLE de lignes (toutes les ventes de France en 2025, par exemple). Référencer Ventes[Montant] seul est ambigu : de quelle ligne ? DAX exige donc d'agréger (SUM, MAX…) ou d'itérer (SUMX) sur ces lignes.",
    example: `-- Erreur : « Une valeur unique pour la colonne Montant ne peut pas être déterminée »
Mesure KO = Ventes[Montant]

-- Corrects :
Total   = SUM(Ventes[Montant])
Maximum = MAX(Ventes[Montant])
-- Si une seule valeur est attendue (ex. prix d'un produit sélectionné) :
Prix sélectionné = SELECTEDVALUE(Produits[Prix])`,
  },
  "dax-f3-1": {
    detail: "CALCULATE(expression, filtre1, filtre2…) part du contexte de filtre courant, applique les modifications demandées (ajouter, remplacer ou retirer des filtres), puis évalue l'expression. C'est la fonction centrale de DAX : comparaisons à une période, à un total, à une catégorie…",
    example: `CA                = SUM(Ventes[Montant])
CA France         = CALCULATE([CA], Clients[Pays] = "FR")
CA tous pays      = CALCULATE([CA], ALL(Clients[Pays]))
CA année préc.    = CALCULATE([CA], SAMEPERIODLASTYEAR(Dates[Date]))
-- Dans une matrice par Pays, « CA France » affiche le CA français sur chaque ligne :
-- le filtre Pays = "FR" REMPLACE le filtre de la ligne.`,
  },
  "dax-f3-2": {
    detail: "Chaque argument de filtre de CALCULATE porte sur une colonne et remplace le filtre existant sur celle-ci. Deux arguments sur la MÊME colonne sont combinés en ET : aucune ligne ne peut valoir à la fois EMEA et APAC. Pour un OU, on passe une seule condition qui inclut les deux valeurs.",
    example: `-- OU explicites :
CA EMEA+APAC = CALCULATE([CA], V[Region] IN {"EMEA", "APAC"})
CA EMEA+APAC = CALCULATE([CA], V[Region] = "EMEA" || V[Region] = "APAC")

-- ET sur deux colonnes DIFFÉRENTES (cas normal) :
CA EMEA 2025 = CALCULATE([CA], V[Region] = "EMEA", Dates[Annee] = 2025)`,
  },
  "dax-f4-1": {
    detail: "SUM(col) ne sait additionner qu'une colonne existante. Si le montant doit d'abord être calculé ligne par ligne (prix × quantité, conversion de devise), il faut un itérateur : SUMX parcourt chaque ligne, calcule l'expression, puis additionne. Additionner les prix puis multiplier par la somme des quantités donnerait un résultat faux.",
    example: `-- Ventes : (Prix 10, Qte 2), (Prix 5, Qte 4)
Faux = SUM(Ventes[Prix]) * SUM(Ventes[Qte])       -- (10+5) * (2+4) = 90
Juste = SUMX(Ventes, Ventes[Prix] * Ventes[Qte])   -- 10*2 + 5*4     = 40

-- Autres itérateurs : AVERAGEX, MAXX, COUNTX, RANKX…`,
  },
  "dax-i1-1": {
    detail: "Le numérateur est la mesure dans le contexte courant (la ligne de la matrice) ; le dénominateur est la même mesure dont on a retiré les filtres de la table ou de la colonne voulue. DIVIDE évite l'erreur de division par zéro (il renvoie vide). Choisir ALL(table) ou ALL(colonne) change le total de référence.",
    example: `% du total =
DIVIDE(
    [CA],
    CALCULATE([CA], ALL(Produits))    -- CA de tous les produits
)
-- Produit | CA  | % du total
-- Stylo   | 200 | 20 %
-- Cahier  | 800 | 80 %
-- ALL(Produits[Categorie]) : % du total toutes catégories, mais en gardant
-- les autres filtres sur Produits (ex. marque).`,
  },
  "dax-i1-2": {
    detail: "ALL retire les filtres, quelle que soit leur origine : le total est le grand total du modèle. ALLSELECTED retire les filtres posés par le visuel lui-même (les lignes de la matrice) mais garde ceux venant de l'extérieur (segments, filtres de page) : le total est celui de ce que l'utilisateur a sélectionné.",
    example: `% du total absolu   = DIVIDE([CA], CALCULATE([CA], ALL(Produits)))
% du total visible  = DIVIDE([CA], CALCULATE([CA], ALLSELECTED(Produits)))
-- Segment « Catégorie = Papeterie » actif :
-- Stylo : 200 / 10 000 (tout le catalogue)   = 2 %
-- Stylo : 200 / 1 000  (papeterie seulement) = 20 %   <- ce qu'attend l'utilisateur`,
  },
  "dax-i1-3": {
    detail: "ALLEXCEPT(table, col) équivaut à « retire tous les filtres de la table, sauf ceux sur col ». C'est pratique pour calculer un total par groupe : par exemple la part d'un produit dans SA catégorie, même si la matrice descend au niveau produit.",
    example: `% dans la catégorie =
DIVIDE(
    [CA],
    CALCULATE([CA], ALLEXCEPT(Produits, Produits[Categorie]))
)
-- Catégorie | Produit | CA  | % dans la catégorie
-- Papeterie | Stylo   | 200 | 20 %   (200 / 1 000 de papeterie)
-- Papeterie | Cahier  | 800 | 80 %`,
  },
  "dax-i2-1": {
    detail: "VAR nomme un résultat intermédiaire, RETURN donne le résultat final. La mesure devient lisible comme un raisonnement en étapes, se débogue facilement (on peut renvoyer une variable pour la tester) et évite de recalculer plusieurs fois la même sous-expression.",
    example: `Évolution % =
VAR CA_Actuel   = [CA]
VAR CA_Precedent = CALCULATE([CA], SAMEPERIODLASTYEAR(Dates[Date]))
VAR Ecart        = CA_Actuel - CA_Precedent
RETURN
    DIVIDE(Ecart, CA_Precedent)
-- Pour déboguer : RETURN CA_Precedent`,
  },
  "dax-i2-2": {
    detail: "Une variable est une constante : elle est calculée à l'endroit où elle est déclarée, avec le contexte de filtre de ce moment-là. L'utiliser ensuite dans un CALCULATE ne la recalcule pas. C'est une source fréquente de mesures qui renvoient la même valeur partout.",
    example: `-- Piège : CA_courant est figé AVANT le CALCULATE
CA tous pays (faux) =
VAR CA_courant = [CA]
RETURN CALCULATE(CA_courant, ALL(Clients[Pays]))   -- renvoie [CA] du pays courant

-- Correct : mettre la mesure elle-même dans le CALCULATE
CA tous pays = CALCULATE([CA], ALL(Clients[Pays]))`,
  },
  "dax-i3-1": {
    detail: "Les fonctions d'intelligence temporelle décalent ou étendent des ensembles de dates (année précédente, cumul depuis le début de l'année). Elles ont besoin d'un calendrier complet, une ligne par jour, pour savoir ce qu'est « le même jour l'an dernier ». On la crée avec CALENDAR ou en Power Query, puis on la marque comme table de dates.",
    example: `Dates =
ADDCOLUMNS(
    CALENDAR(DATE(2022, 1, 1), DATE(2026, 12, 31)),
    "Annee", YEAR([Date]),
    "Mois",  FORMAT([Date], "MMM"),
    "NumMois", MONTH([Date])
)
-- Relation : Dates[Date] (1) -> Ventes[DateVente] (*)
CA cumul annuel = TOTALYTD([CA], Dates[Date])
CA N-1          = CALCULATE([CA], SAMEPERIODLASTYEAR(Dates[Date]))`,
  },
  "dax-i3-2": {
    detail: "Si on utilise la colonne de date de la table de ventes comme calendrier, les jours sans vente n'existent pas. SAMEPERIODLASTYEAR ne peut décaler que des dates présentes : un jour férié sans vente l'an dernier disparaît, et les comparaisons deviennent fausses ou vides sans aucun message d'erreur.",
    example: `-- Calendrier tiré des ventes : 25/12/2024 absent (magasin fermé)
-- CA N-1 au 25/12/2025 = vide (au lieu de 0)
-- Pire : sur un cumul ou une comparaison de période, des jours manquent.

-- Solution : une vraie table de dates continue, reliée aux ventes
Dates = CALENDAR(MIN(Ventes[DateVente]), MAX(Ventes[DateVente]))`,
  },
  "dax-i4-1": {
    detail: "Le modèle ne peut propager les filtres que par une relation active entre deux tables. Quand on a besoin d'analyser selon une autre date (livraison au lieu de commande), on garde la relation en pointillés (inactive) et on l'active seulement dans les mesures qui en ont besoin.",
    example: `-- Relations : Dates[Date] -> Ventes[DateCommande]  (active)
--             Dates[Date] -> Ventes[DateLivraison] (inactive, pointillés)
CA par date de commande  = [CA]
CA par date de livraison =
CALCULATE(
    [CA],
    USERELATIONSHIP(Dates[Date], Ventes[DateLivraison])
)
-- Les deux mesures côte à côte sur un même axe de dates.`,
  },
  "dax-i4-2": {
    detail: "Si deux chemins actifs reliaient Ventes à Dates, le moteur ne saurait pas lequel suivre quand on filtre sur « mars 2025 » : commandes passées ou livrées en mars ? Une alternative à USERELATIONSHIP est de dupliquer la dimension (Dates commande, Dates livraison), utile quand les utilisateurs filtrent souvent sur les deux.",
    example: `Option 1 : une table Dates, 1 relation active + USERELATIONSHIP dans les mesures
Option 2 : deux tables de dates (« rôles »)
  DatesCommande[Date]  -> Ventes[DateCommande]   (active)
  DatesLivraison[Date] -> Ventes[DateLivraison]  (active)
  -> l'utilisateur peut filtrer « commandé en mars ET livré en avril ».`,
  },
  "dax-a1-1": {
    detail: "FILTER parcourt une table ligne par ligne et garde celles qui respectent la condition : on peut y comparer deux colonnes, appeler une mesure, combiner des conditions complexes. Le résultat est une table, utilisable comme argument de CALCULATE ou d'un itérateur.",
    example: `-- Condition entre deux colonnes : impossible en filtre simple
CA vendu sous le prix catalogue =
CALCULATE(
    [CA],
    FILTER(Ventes, Ventes[PrixVendu] < Ventes[PrixCatalogue])
)

-- Condition sur une mesure : clients ayant dépensé plus de 1 000
Nb gros clients = COUNTROWS(FILTER(VALUES(Clients[Id]), [CA] > 1000))`,
  },
  "dax-a1-2": {
    detail: "Un filtre simple comme Produits[Couleur] = \"Rouge\" est traduit en interne par un filtre sur la seule colonne, que le moteur de stockage applique très vite. FILTER(Ventes, …) sur toute la table de faits l'oblige à matérialiser la table et à la parcourir. Si FILTER est nécessaire, le limiter à la colonne utile.",
    example: `-- Lent : parcourt toutes les lignes (et toutes les colonnes) de Ventes
CA Rouge = CALCULATE([CA], FILTER(Ventes, RELATED(Produits[Couleur]) = "Rouge"))

-- Rapide : filtre simple sur la dimension
CA Rouge = CALCULATE([CA], Produits[Couleur] = "Rouge")

-- Si FILTER est indispensable, sur une seule colonne :
CA Rouge = CALCULATE([CA], FILTER(ALL(Produits[Couleur]), Produits[Couleur] = "Rouge"))`,
  },
  "dax-a2-1": {
    detail: "Dans une colonne calculée ou un itérateur, la ligne courante n'est PAS un filtre : SUM(Ventes[Montant]) y renverrait le grand total. CALCULATE convertit la ligne courante en filtres (une condition par colonne), si bien que l'expression est évaluée pour « cette ligne-là ». Toute mesure appelée est implicitement entourée d'un CALCULATE.",
    example: `-- Colonne calculée dans Clients :
Clients[Total sans CALCULATE] = SUM(Ventes[Montant])               -- grand total partout
Clients[Total avec CALCULATE] = CALCULATE(SUM(Ventes[Montant]))    -- total DU client
Clients[Total via mesure]     = [CA]                                -- idem (CALCULATE implicite)`,
  },
  "dax-a2-2": {
    detail: "Quand une mesure est appelée dans un itérateur sur une table de faits, la transition de contexte filtre sur TOUTES les colonnes de la ligne courante. Si deux lignes sont strictement identiques, chacune « voit » les deux : leur montant est compté deux fois. Sur une table de dimension à clé unique, le problème n'existe pas.",
    example: `-- Ventes contient deux lignes identiques : (C1, Stylo, 10) et (C1, Stylo, 10)
Total X = SUMX(Ventes, [CA])
-- Ligne 1 -> filtre C1, Stylo, 10 -> [CA] voit 2 lignes = 20
-- Ligne 2 -> même chose            = 20     Total X = 40 au lieu de 20

-- Itérer sur une dimension à clé unique :
Moy par client = AVERAGEX(VALUES(Clients[Id]), [CA])`,
  },
  "dax-a3-1": {
    detail: "Une hiérarchie parent-enfant est stockée dans une seule table (chaque employé a l'id de son manager). PATH reconstitue le chemin complet, puis PATHITEM permet de créer une colonne par niveau (Niveau1, Niveau2…), seul format qu'une matrice Power BI sait afficher comme hiérarchie.",
    example: `Employes[Chemin]  = PATH(Employes[Id], Employes[ManagerId])     -- "1|4|9"
Employes[Niveau]  = PATHLENGTH(Employes[Chemin])                -- 3
Employes[Niveau1] = LOOKUPVALUE(Employes[Nom], Employes[Id],
                      PATHITEM(Employes[Chemin], 1, INTEGER))  -- "PDG"
Employes[Niveau2] = LOOKUPVALUE(Employes[Nom], Employes[Id],
                      PATHITEM(Employes[Chemin], 2, INTEGER))  -- "Dir. ventes"`,
  },
  "dax-a4-1": {
    detail: "RANKX(table, expression) classe la ligne courante parmi les lignes de la table fournie. Dans une matrice par client, la table « Clients » est filtrée au seul client courant : il serait toujours 1er sur 1. ALL(Clients) fournit la liste complète des clients comme base de comparaison.",
    example: `Rang faux  = RANKX(Clients, [CA])           -- 1 partout
Rang client = RANKX(ALL(Clients), [CA], , DESC, DENSE)
-- Client | CA    | Rang client
-- Ana    | 5 000 | 1
-- Bob    | 3 000 | 2
-- ALLSELECTED(Clients) pour classer seulement parmi les clients filtrés par un segment.`,
  },
  "dax-a4-2": {
    detail: "Le rang étant calculé sur tous les clients, la mesure renvoie le CA pour les 10 premiers et vide (BLANK) pour les autres. Un visuel masque les lignes où toutes les mesures sont vides : le tableau n'affiche donc que le top 10. Attention au total : il reste celui de tous les clients si on ne le traite pas.",
    example: `Rang Client = RANKX(ALL(Clients[Nom]), [Total Ventes])

Top 10 Clients = IF([Rang Client] <= 10, [Total Ventes])

-- Total limité au top 10 :
Total Top 10 =
SUMX(TOPN(10, ALL(Clients[Nom]), [Total Ventes]), [Total Ventes])`,
  },
  "dax-p1-1": {
    detail: "VertiPaq remplace chaque valeur par un petit entier pointant vers un dictionnaire, puis compresse les séquences répétées (RLE). 10 millions de lignes avec 5 pays distincts : un dictionnaire de 5 entrées et des entiers de 3 bits. Avec 10 millions de valeurs distinctes : un dictionnaire énorme et presque aucune répétition à compresser.",
    example: `Colonne          | Valeurs distinctes | Taille approx. (10 M lignes)
Pays             |                  5 | quelques Ko
DateVente (jour) |              1 500 | quelques centaines de Ko
Horodatage (ms)  |         10 000 000 | plusieurs centaines de Mo
-- Diagnostic : DAX Studio > Advanced > View Metrics (VertiPaq Analyzer)`,
  },
  "dax-p1-2": {
    detail: "Le storage engine (VertiPaq) sait faire des opérations simples très vite et en parallèle : filtrer, grouper, sommer des colonnes. Le formula engine gère tout le reste (logique complexe, IF imbriqués, itérations sur des résultats) sur un seul cœur. Une mesure rapide pousse le maximum de travail vers le storage engine.",
    example: `DAX Studio > Server Timings sur une requête lente :
  Total : 4 200 ms   SE (storage engine) : 300 ms   FE (formula engine) : 3 900 ms
-> le temps est passé dans le formula engine : chercher les itérations
   et la logique ligne par ligne à simplifier (VAR, filtres simples).`,
  },
  "dax-p1-3": {
    detail: "La taille d'un modèle dépend surtout du nombre de valeurs distinctes par colonne. Séparer un horodatage en une colonne date (1 500 valeurs) et une colonne heure (1 440 minutes) remplace des millions de valeurs uniques par deux petits dictionnaires. Supprimer les colonnes jamais utilisées est le gain le plus simple.",
    example: `Avant : Ventes[Horodatage] = 2025-03-02 14:37:21.384    -> 9,8 M valeurs distinctes
Après : Ventes[Date]  = 2025-03-02   (~1 500 valeurs)
        Ventes[Heure] = 14:37        (1 440 valeurs)
Supprimer aussi : GUID techniques, colonnes de commentaires, clés jamais utilisées.`,
  },
  "dax-p2-1": {
    detail: "Quand une expression est trop complexe pour le storage engine (un IF ou un appel de fonction dans un itérateur), celui-ci doit rappeler le formula engine pour chaque ligne : c'est le CallbackDataID. Le calcul perd son parallélisme et son cache. Simplifier l'expression, ou précalculer une colonne en amont, le fait souvent disparaître.",
    example: `-- Provoque un CallbackDataID : un IF évalué pour chaque ligne de Ventes
Marge = SUMX(Ventes, IF(Ventes[Devise] = "USD", Ventes[Montant] * 0.92, Ventes[Montant]))

-- Mieux : précalculer Ventes[MontantEUR] en Power Query / SQL
Marge = SUM(Ventes[MontantEUR])`,
  },
};
