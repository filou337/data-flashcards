export const cardsAnalyse = [
  // ======================================================================
  // ---- Fondamentaux : démarche, exploration, pandas de base ----
  // ======================================================================
  {
    id: "ana-f1-1", langue: "analyse", niveau: "fondamentaux", type: "flip",
    front: "Quelles sont les étapes d'une analyse de données, de la question au livrable ?",
    back: "1. Cadrer : quelle DÉCISION l'analyse doit-elle éclairer ? Quelle question précise, quelle métrique, quelle période, quelle population ?\n2. Collecter et comprendre les données : sources, grain (une ligne = quoi ?), définitions.\n3. Nettoyer et contrôler la qualité.\n4. Explorer (EDA) : distributions, tendances, segments.\n5. Analyser : comparer, tester, modéliser si besoin.\n6. Restituer : conclusion d'abord, chiffres clés, limites, recommandation.\n\nLe cadrage évite l'erreur la plus coûteuse : répondre parfaitement à la mauvaise question."
  },
  {
    id: "ana-f1-2", langue: "analyse", niveau: "fondamentaux", type: "flip",
    front: "Qu'est-ce que le « grain » d'une table et pourquoi le vérifier en premier ?",
    back: "Le grain = ce que représente UNE ligne : une commande ? une ligne de commande (un produit dans une commande) ? un client par jour ?\n\nSe tromper de grain fausse tout : compter des lignes de commande en croyant compter des commandes, faire une moyenne de panier sur des lignes produit, dupliquer des montants lors d'une jointure.\n\nVérification : df.groupby(colonnes_cle).size().max() == 1 → la combinaison de colonnes est bien une clé unique."
  },
  {
    id: "ana-f1-3", langue: "analyse", niveau: "fondamentaux", type: "code",
    front: "Premières commandes pour découvrir un DataFrame inconnu. Que donne chacune ?",
    code: "df.shape\ndf.head()\ndf.info()\ndf.describe(include=\"all\")\ndf.isna().sum()\ndf[\"pays\"].value_counts(normalize=True)\ndf.duplicated().sum()",
    back: "• shape : (nb lignes, nb colonnes).\n• head() : aperçu des 5 premières lignes.\n• info() : types de colonnes, valeurs non nulles, mémoire. Repère les dates lues comme texte (object).\n• describe(include=\"all\") : stats (moyenne, quartiles, min/max) pour les numériques, nb de valeurs distinctes et modalité la plus fréquente pour le texte. Min/max aberrants = premiers indices de problèmes.\n• isna().sum() : nb de valeurs manquantes par colonne.\n• value_counts(normalize=True) : répartition en proportions (ajouter dropna=False pour voir les NaN).\n• duplicated().sum() : nb de lignes entièrement dupliquées."
  },
  {
    id: "ana-f1-4", langue: "analyse", niveau: "fondamentaux", type: "flip",
    front: "loc vs iloc en pandas ?",
    back: "• loc : sélection par LIBELLÉS (noms de lignes d'index, noms de colonnes) et par masques booléens. Les bornes de tranche sont INCLUSES.\n  df.loc[df[\"pays\"] == \"FR\", [\"client\", \"ca\"]]\n• iloc : sélection par POSITIONS entières, comme une liste Python. La borne de fin est EXCLUE.\n  df.iloc[:10, 0:3]\n\nPour modifier des valeurs filtrées, toujours utiliser loc en une seule opération : df.loc[masque, \"col\"] = valeur."
  },
  {
    id: "ana-f1-5", langue: "analyse", niveau: "fondamentaux", type: "qcm",
    front: "df.groupby(\"canal\")[\"ca\"].mean() — que se passe-t-il pour les lignes dont le canal est NaN ?",
    choices: [
      "Elles forment un groupe « NaN »",
      "Elles sont exclues silencieusement du résultat",
      "pandas lève une erreur",
      "Elles sont rattachées au premier canal"
    ],
    answer: 1,
    explain: "Par défaut groupby(dropna=True) ignore les clés manquantes. Le total des groupes ne correspond alors plus au total général, sans aucun avertissement. Utiliser groupby(\"canal\", dropna=False) ou remplir avant : df[\"canal\"].fillna(\"Inconnu\")."
  },
  {
    id: "ana-f1-6", langue: "analyse", niveau: "fondamentaux", type: "flip",
    front: "count() vs size() vs nunique() après un groupby ?",
    back: "• size() : nombre de LIGNES par groupe, NaN compris.\n• count() : nombre de valeurs NON NULLES, colonne par colonne.\n• nunique() : nombre de valeurs DISTINCTES (hors NaN).\n\nEx. commandes par client : groupby(\"client\").size() compte les lignes ; groupby(\"client\")[\"id_commande\"].nunique() compte les commandes distinctes (indispensable si la table est au grain ligne de commande)."
  },
  {
    id: "ana-f1-7", langue: "analyse", niveau: "fondamentaux", type: "flip",
    front: "Comment traiter les valeurs manquantes ? Quelles options ?",
    back: "D'abord comprendre POURQUOI elles manquent :\n• MCAR (complètement au hasard) : bug ponctuel → supprimer ou imputer est sans biais.\n• MAR (dépend d'autres variables observées) : ex. l'âge manque plus souvent pour les clients web → imputer par groupe.\n• MNAR (dépend de la valeur elle-même) : les hauts revenus ne déclarent pas leur revenu → toute imputation simple biaise.\n\nOptions : supprimer (dropna, si peu de lignes et MCAR), imputer (médiane, médiane par groupe, valeur métier : 0 achat = 0), garder une indicatrice « était manquant », ou laisser NaN et le signaler. Toujours documenter le choix."
  },
  {
    id: "ana-f1-8", langue: "analyse", niveau: "fondamentaux", type: "qcm",
    front: "La colonne « remise » est NaN quand il n'y a pas eu de remise. On calcule df[\"remise\"].mean() = 12 €. Est-ce la remise moyenne par commande ?",
    choices: [
      "Oui, mean() tient compte de toutes les commandes",
      "Non : mean() ignore les NaN, c'est la remise moyenne des seules commandes AVEC remise. La moyenne par commande s'obtient avec fillna(0) avant",
      "Non, mean() renvoie NaN dès qu'il y a un NaN",
      "Oui, mais seulement si la colonne est de type float"
    ],
    answer: 1,
    explain: "pandas utilise skipna=True par défaut : sum(), mean(), etc. ignorent les NaN. C'est correct si NaN = « inconnu », faux si NaN = « zéro » (aucune remise). Il faut décider du sens métier de chaque NaN."
  },
  {
    id: "ana-f1-9", langue: "analyse", niveau: "fondamentaux", type: "flip",
    front: "Doublons : comment les détecter et les supprimer proprement ?",
    back: "• Doublons stricts : df.duplicated().sum(), puis df.drop_duplicates().\n• Doublons sur la clé métier (le même client saisi deux fois avec une adresse différente) :\n  df[df.duplicated(subset=[\"id_client\"], keep=False)] pour les examiner tous.\n• Garder la version la plus récente :\n  df.sort_values(\"maj_le\").drop_duplicates(subset=\"id_client\", keep=\"last\")\n\nAvant de supprimer : comprendre l'origine (rejeu d'un chargement ? jointure qui duplique ?), sinon le problème reviendra."
  },
  {
    id: "ana-f1-10", langue: "analyse", niveau: "fondamentaux", type: "flip",
    front: "Quel graphique choisir selon la question ?",
    back: "• Évolution dans le temps → courbe (line chart).\n• Comparer des catégories → barres (horizontales si libellés longs), triées par valeur.\n• Distribution d'une variable → histogramme ou boxplot (pour comparer plusieurs groupes).\n• Relation entre deux variables quantitatives → nuage de points.\n• Part d'un tout → barres empilées à 100 % ou simple barre ; camembert seulement avec 2-3 parts très différentes.\n• Écart à un objectif → barres avec une ligne de référence.\n\nUn graphique = un message : le titre énonce la conclusion (« Le mobile porte 80 % de la croissance »), pas seulement le sujet."
  },
  {
    id: "ana-f1-11", langue: "analyse", niveau: "fondamentaux", type: "qcm",
    front: "Un diagramme en barres compare le CA de deux régions : axe Y de 980 k€ à 1 000 k€. La barre B paraît 3 fois plus haute que A. Problème ?",
    choices: [
      "Aucun, cela met en valeur la différence",
      "L'axe tronqué exagère visuellement l'écart (environ 1,5 % en réalité) : un diagramme en barres doit partir de 0",
      "Il faudrait un camembert",
      "Il faut une échelle logarithmique"
    ],
    answer: 1,
    explain: "La longueur d'une barre code la valeur : elle doit commencer à 0. Pour une courbe, un axe qui ne part pas de 0 est acceptable (on lit les variations), à condition de l'indiquer clairement. Toujours afficher l'écart en chiffres (+15 k€, +1,5 %)."
  },

  // ======================================================================
  // ---- Intermédiaire : transformation, jointures, dates, métriques ----
  // ======================================================================
  {
    id: "ana-i1-1", langue: "analyse", niveau: "intermediaire", type: "flip",
    front: "merge en pandas : quels paramètres pour éviter les mauvaises surprises ?",
    back: "commandes.merge(clients, on=\"id_client\", how=\"left\",\n                validate=\"many_to_one\", indicator=True)\n\n• how : inner (seulement les correspondances), left (garde toute la table de gauche), outer, right.\n• validate : lève une erreur si la relation n'est pas celle attendue (ex. un id_client en double dans clients dupliquerait les commandes).\n• indicator=True : ajoute la colonne _merge (both / left_only / right_only) pour compter les lignes sans correspondance.\n\nContrôle simple : nombre de lignes avant et après un left join many_to_one → il doit être identique."
  },
  {
    id: "ana-i1-2", langue: "analyse", niveau: "intermediaire", type: "code",
    front: "Après cette jointure, le CA total passe de 1,2 M€ à 1,9 M€. Pourquoi, et comment le détecter ?",
    code: "ventes = commandes.merge(promos, on=\"id_produit\", how=\"left\")\nventes[\"montant\"].sum()",
    back: "promos contient plusieurs lignes par id_produit (une par période de promo) : chaque commande est dupliquée autant de fois qu'il y a de promos pour son produit → montants comptés plusieurs fois.\n\nDétection :\npromos[\"id_produit\"].duplicated().any()      # True\nlen(ventes) > len(commandes)                 # True\n\nCorrection : joindre aussi sur la période (date de commande comprise entre debut et fin de la promo), ou dédupliquer promos selon une règle métier. Ajouter validate=\"many_to_one\" pour que pandas lève une erreur au lieu de dupliquer en silence."
  },
  {
    id: "ana-i1-3", langue: "analyse", niveau: "intermediaire", type: "flip",
    front: "agg vs transform après un groupby ?",
    back: "• agg : UNE ligne par groupe (résumé).\n  df.groupby(\"client\").agg(ca=(\"montant\", \"sum\"), nb=(\"id_commande\", \"nunique\"))\n• transform : renvoie une série de MÊME LONGUEUR que df, chaque ligne recevant la valeur de son groupe. Idéal pour comparer une ligne à son groupe sans jointure :\n  df[\"part_ca_client\"] = df[\"montant\"] / df.groupby(\"client\")[\"montant\"].transform(\"sum\")\n  df[\"ecart_moy_rayon\"] = df[\"prix\"] - df.groupby(\"rayon\")[\"prix\"].transform(\"mean\")"
  },
  {
    id: "ana-i1-4", langue: "analyse", niveau: "intermediaire", type: "flip",
    front: "pivot_table vs melt : à quoi servent-ils ?",
    back: "• pivot_table : format LONG → LARGE (tableau croisé).\n  df.pivot_table(index=\"region\", columns=\"mois\", values=\"ca\", aggfunc=\"sum\", fill_value=0)\n  Agrège s'il y a plusieurs lignes par case (contrairement à pivot, qui lève une erreur en cas de doublon).\n• melt : format LARGE → LONG (une colonne par mois → une colonne « mois » + une colonne « valeur »).\n  df.melt(id_vars=\"region\", var_name=\"mois\", value_name=\"ca\")\n\nLe format long (« tidy ») est celui qu'attendent groupby, la plupart des graphiques et les bases de données ; le format large sert à la présentation."
  },
  {
    id: "ana-i1-5", langue: "analyse", niveau: "intermediaire", type: "qcm",
    front: "Pour calculer un prix TTC sur 5 millions de lignes, quelle approche choisir ?",
    choices: [
      "df[\"ttc\"] = df.apply(lambda r: r[\"ht\"] * (1 + r[\"tva\"]), axis=1)",
      "Une boucle for sur df.iterrows()",
      "df[\"ttc\"] = df[\"ht\"] * (1 + df[\"tva\"])",
      "Convertir en liste Python puis recalculer"
    ],
    answer: 2,
    explain: "Les opérations vectorisées s'exécutent en code compilé sur des colonnes entières : souvent 100 fois plus rapides que apply(axis=1) ou iterrows(), qui appellent du Python ligne par ligne. Pour des conditions : np.where, np.select, Series.where, ou .map pour un dictionnaire de correspondance."
  },
  {
    id: "ana-i1-6", langue: "analyse", niveau: "intermediaire", type: "code",
    front: "Pourquoi cette ligne ne modifie-t-elle pas df (ou déclenche un SettingWithCopyWarning) ? Corrige.",
    code: "df[df[\"pays\"] == \"FR\"][\"tva\"] = 0.20",
    back: "C'est une affectation chaînée : df[masque] crée un objet intermédiaire (souvent une copie), et c'est cette copie qui est modifiée, pas df. Depuis pandas 3.0 (Copy-on-Write activé par défaut), cette écriture ne modifie JAMAIS df.\n\nCorrection, en une seule opération loc :\ndf.loc[df[\"pays\"] == \"FR\", \"tva\"] = 0.20\n\nMême piège quand on filtre dans une nouvelle variable puis qu'on la modifie : fr = df[df[\"pays\"] == \"FR\"].copy() pour signaler explicitement qu'on travaille sur une copie."
  },
  {
    id: "ana-i1-7", langue: "analyse", niveau: "intermediaire", type: "flip",
    front: "Comment bien gérer les dates en pandas ?",
    back: "• Conversion : pd.to_datetime(df[\"date\"], format=\"%d/%m/%Y\", errors=\"coerce\") ; errors=\"coerce\" transforme les valeurs invalides en NaT (à compter !). Préciser le format évite les inversions jour/mois.\n• Extraction : df[\"date\"].dt.year, .dt.month, .dt.day_name(), .dt.to_period(\"M\").\n• Agrégation temporelle : df.resample(\"W\", on=\"date\")[\"ca\"].sum() (semaine), \"MS\" (mois).\n• Fuseaux horaires : stocker en UTC, convertir pour l'affichage (.dt.tz_convert(\"Europe/Paris\")) ; sinon les ventes de 23 h basculent sur le mauvais jour."
  },
  {
    id: "ana-i1-8", langue: "analyse", niveau: "intermediaire", type: "code",
    front: "Série de CA quotidien. Que calcule chaque ligne ?",
    code: "s = df.set_index(\"date\")[\"ca\"].asfreq(\"D\", fill_value=0)\n\nmm7    = s.rolling(7).mean()\nvar_j  = s.pct_change()\nyoy    = s / s.shift(364) - 1\ncumul  = s.groupby(s.index.year).cumsum()",
    back: "• asfreq(\"D\", fill_value=0) : ajoute les jours manquants avec 0 (sinon rolling et shift sautent des jours sans le dire).\n• mm7 : moyenne mobile sur 7 jours, lisse l'effet jour de la semaine.\n• var_j : variation en % par rapport au jour précédent.\n• yoy : variation sur un an, avec un décalage de 364 jours = 52 semaines exactement, pour comparer un lundi à un lundi.\n• cumul : cumul depuis le début de chaque année (Year To Date)."
  },
  {
    id: "ana-i1-9", langue: "analyse", niveau: "intermediaire", type: "flip",
    front: "pd.cut vs pd.qcut pour créer des tranches ?",
    back: "• pd.cut : tranches de bornes FIXES choisies (ou de largeurs égales).\n  pd.cut(df[\"age\"], bins=[0, 25, 40, 60, 120], labels=[\"<25\", \"25-39\", \"40-59\", \"60+\"])\n  Attention : par défaut les intervalles sont fermés à droite (25 tombe dans « <25 ») ; right=False pour l'inverse.\n• pd.qcut : tranches d'EFFECTIFS égaux, basées sur les quantiles (déciles de CA, quartiles).\n  pd.qcut(df[\"ca\"], q=10, labels=False)  # décile 0 à 9\n\ncut pour des seuils métier lisibles, qcut pour des segments de taille comparable."
  },
  {
    id: "ana-i2-1", langue: "analyse", niveau: "intermediaire", type: "qcm",
    front: "Taux de conversion quotidiens : lundi 10 % (100 visites), mardi 2 % (10 000 visites). Quel est le taux de conversion de la période ?",
    choices: [
      "6 % (moyenne des deux taux)",
      "≈ 2,1 % : (10 + 200) / (100 + 10 000) — il faut faire le ratio des sommes, pas la moyenne des ratios",
      "12 %",
      "On ne peut pas savoir"
    ],
    answer: 1,
    explain: "Moyenne de ratios ≠ ratio des moyennes. La moyenne simple donne le même poids à un jour de 100 visites qu'à un jour de 10 000. Règle : sommer numérateurs et dénominateurs séparément, puis diviser. Même piège avec les marges en %, les paniers moyens par magasin, les taux par segment."
  },
  {
    id: "ana-i2-2", langue: "analyse", niveau: "intermediaire", type: "flip",
    front: "KPI e-commerce essentiels : définitions ?",
    back: "• Taux de conversion = commandes / visites (ou acheteurs / visiteurs uniques : préciser !).\n• Panier moyen (AOV) = CA / nb de commandes.\n• CA = visites × taux de conversion × panier moyen → permet de décomposer une variation de CA.\n• ARPU = CA / nb d'utilisateurs (actifs) sur la période.\n• Fréquence d'achat = commandes / clients.\n• Taux de churn = clients perdus sur la période / clients au début de la période.\n• CAC = dépenses d'acquisition / nouveaux clients.\n\nToujours écrire la définition exacte (numérateur, dénominateur, période, population) : deux équipes qui calculent « le taux de conversion » trouvent rarement le même chiffre."
  },
  {
    id: "ana-i2-3", langue: "analyse", niveau: "intermediaire", type: "flip",
    front: "Comment décomposer une variation de CA pour l'expliquer ?",
    back: "CA = trafic × taux de conversion × panier moyen.\n\nEx. CA −8 % : trafic +5 %, conversion −15 %, panier +3 % → le problème vient de la conversion, pas du trafic. On creuse ensuite par segment (device, canal, pays, catégorie) pour localiser la baisse.\n\nEffet mix : le CA global peut baisser alors que chaque segment progresse, si la répartition se déplace vers un segment moins rentable (même logique que le paradoxe de Simpson). Séparer « effet volume », « effet prix » et « effet mix »."
  },
  {
    id: "ana-i2-4", langue: "analyse", niveau: "intermediaire", type: "flip",
    front: "Comparaison temporelle : MoM, YoY, à jours comparables… comment éviter les faux signaux ?",
    back: "• MoM (mois sur mois) : sensible à la saisonnalité et au nombre de jours (février vs mars) → comparer des moyennes quotidiennes.\n• YoY (année sur année) : neutralise la saisonnalité ; aligner sur les jours de semaine (52 semaines = 364 jours) et tenir compte des jours fériés, de Pâques mobile, du Black Friday.\n• Mois en cours : comparer « du 1er au 14 » avec « du 1er au 14 » l'an dernier, jamais un mois partiel avec un mois complet.\n• Annoncer les variations en points pour les taux (3,1 % → 3,4 % = +0,3 pt, soit +10 % relatifs)."
  },
  {
    id: "ana-i2-5", langue: "analyse", niveau: "intermediaire", type: "flip",
    front: "Analyse de funnel (entonnoir) : comment la construire et la lire ?",
    back: "Suivre la part d'utilisateurs qui franchissent chaque étape : visite → fiche produit → panier → paiement → commande.\n\n• Taux de passage d'étape à étape (où perd-on le plus ?) et taux global.\n• Compter des UTILISATEURS uniques (ou des sessions), de manière cohérente, sur une fenêtre de temps définie (ex. 7 jours après la visite).\n• Imposer l'ordre des étapes, sinon on compte des parcours impossibles.\n• Segmenter (mobile vs desktop, nouveaux vs récurrents) : la fuite est souvent concentrée sur un segment.\n\nLa plus grosse chute n'est pas forcément la plus facile à corriger : croiser avec le potentiel de gain."
  },

  // ======================================================================
  // ---- Avancé : cohortes, segmentation, biais, qualité ----
  // ======================================================================
  {
    id: "ana-a1-1", langue: "analyse", niveau: "avance", type: "flip",
    front: "Qu'est-ce qu'une analyse de cohortes et pourquoi est-elle plus fiable qu'un taux de rétention global ?",
    back: "Une cohorte = un groupe de clients partageant la même date de départ (mois de premier achat, d'inscription). On suit chaque cohorte dans le temps : % encore actifs à M+1, M+2…\n\nUn taux global mélange des clients récents (peu de recul) et anciens, et dépend du rythme d'acquisition : une forte acquisition récente fait baisser mécaniquement la rétention moyenne.\n\nLa table de cohortes montre si les cohortes RÉCENTES retiennent mieux ou moins bien que les anciennes : c'est le vrai indicateur de l'évolution du produit."
  },
  {
    id: "ana-a1-2", langue: "analyse", niveau: "avance", type: "code",
    front: "Construire une table de rétention par cohorte mensuelle à partir des commandes (id_client, date). Complète.",
    code: "import pandas as pd\n\ncmd = commandes.copy()\ncmd[\"mois\"] = cmd[\"date\"].dt.to_period(\"M\")\ncmd[\"cohorte\"] = cmd.groupby(\"id_client\")[\"mois\"].transform(\"min\")",
    back: "cmd[\"age\"] = (cmd[\"mois\"] - cmd[\"cohorte\"]).apply(lambda d: d.n)\n\nactifs = (cmd.groupby([\"cohorte\", \"age\"])[\"id_client\"]\n             .nunique()\n             .unstack(fill_value=0))\n\nretention = actifs.div(actifs[0], axis=0)\n\n• cohorte = mois du 1er achat (transform(\"min\")).\n• age = nb de mois écoulés depuis la cohorte (la différence de deux Period donne un décalage, .n le convertit en entier).\n• actifs : clients distincts par cohorte et par mois d'âge.\n• retention : divisé par la taille de la cohorte (colonne 0) → % encore actifs à M+1, M+2…\nLes dernières cohortes ont forcément moins de colonnes remplies : ne pas les lire comme des baisses."
  },
  {
    id: "ana-a1-3", langue: "analyse", niveau: "avance", type: "flip",
    front: "Segmentation RFM : principe et usage ?",
    back: "Trois indicateurs par client :\n• Récence : jours depuis le dernier achat.\n• Fréquence : nombre d'achats sur la période.\n• Montant : CA total.\n\nChaque indicateur est découpé en quintiles (pd.qcut, score 1 à 5 ; attention : pour la récence, petite valeur = bon score). On combine en segments actionnables : « champions » (5-5-5), « à risque » (récence faible mais historiquement fréquents et gros), « nouveaux », « perdus ».\n\nAvantages : simple, explicable, sans modèle. Usage : cibler les campagnes (réactivation, fidélisation, VIP)."
  },
  {
    id: "ana-a1-4", langue: "analyse", niveau: "avance", type: "flip",
    front: "Loi de Pareto (80/20) et analyse ABC : comment les utiliser ?",
    back: "Souvent, une petite part des éléments concentre l'essentiel de la valeur : ~20 % des clients font ~80 % du CA (les chiffres exacts varient).\n\nAnalyse ABC : trier par CA décroissant, calculer la part cumulée, puis classer :\n• A : les éléments qui font ~80 % du CA,\n• B : les ~15 % suivants,\n• C : le reste.\n\npart_cum = s.sort_values(ascending=False).cumsum() / s.sum()\n\nUsages : priorités commerciales (clients A), gestion de stock (produits A jamais en rupture), rationalisation du catalogue (produits C)."
  },
  {
    id: "ana-a1-5", langue: "analyse", niveau: "avance", type: "flip",
    front: "Comment calculer simplement une valeur vie client (LTV / CLV) ?",
    back: "Formule simple (abonnement, churn constant) :\nLTV ≈ ARPU mensuel × marge brute / taux de churn mensuel\n\nEx. 30 €/mois × 70 % / 5 % = 420 € (1 / churn = durée de vie moyenne de 20 mois).\n\nComparer au CAC : un ratio LTV / CAC ≥ 3 est un repère courant de rentabilité de l'acquisition.\n\nLimites : le churn n'est pas constant (fort au début, plus faible ensuite) → préférer une LTV calculée à partir des courbes de cohortes, et l'actualiser (un euro dans 3 ans vaut moins qu'aujourd'hui)."
  },
  {
    id: "ana-a1-6", langue: "analyse", niveau: "avance", type: "qcm",
    front: "« Les clients qui ont acheté depuis plus de 5 ans dépensent 3 fois plus que les autres : il faut fidéliser tout le monde pendant 5 ans. » Quel biais ?",
    choices: [
      "Aucun biais, c'est une conclusion solide",
      "Biais du survivant : les clients encore présents après 5 ans sont précisément ceux qui étaient les plus engagés dès le départ ; on ne voit plus ceux qui sont partis",
      "Biais de confirmation uniquement",
      "Erreur de type II"
    ],
    answer: 1,
    explain: "On n'observe que les « survivants ». Leur forte dépense est peut-être la CAUSE de leur fidélité (ils aimaient le produit dès le départ), pas sa conséquence. Comparer plutôt des cohortes complètes depuis leur arrivée, et tester l'effet d'actions de fidélisation par expérience."
  },
  {
    id: "ana-a1-7", langue: "analyse", niveau: "avance", type: "flip",
    front: "Biais de sélection et autres pièges fréquents dans les données d'entreprise ?",
    back: "• Biais de sélection : l'échantillon n'est pas représentatif (enquête de satisfaction remplie surtout par les très contents ou très mécontents ; clients ayant accepté les cookies).\n• Biais du survivant : on n'observe que ce qui a « survécu » (clients restés, produits encore au catalogue).\n• Biais de mesure : changement de tracking, de définition ou d'outil en cours de période → fausse rupture de tendance.\n• Effet de saisonnalité / calendrier mal neutralisé.\n• Confusion corrélation / causalité.\n\nRéflexe : se demander « quelles données NE sont PAS dans ma table, et pourquoi ? »"
  },
  {
    id: "ana-a2-1", langue: "analyse", niveau: "avance", type: "flip",
    front: "Quels contrôles de qualité faire systématiquement avant une analyse ?",
    back: "• Complétude : nb de lignes attendu ? pas de jour ou de magasin manquant ? (compter par jour)\n• Unicité : la clé est-elle unique ? (doublons)\n• Validité : valeurs dans les plages possibles (âge 0-120, montants ≥ 0, dates pas dans le futur), modalités connues.\n• Cohérence : totaux qui recoupent une source de référence (CA comptable), date_livraison ≥ date_commande.\n• Fraîcheur : la dernière date chargée est-elle celle attendue ?\n\nEn faire des assertions dans le code (assert df[\"id\"].is_unique) plutôt que des vérifications visuelles ponctuelles."
  },
  {
    id: "ana-a2-2", langue: "analyse", niveau: "avance", type: "code",
    front: "Détecter des anomalies dans un CA quotidien avec un z-score glissant. Complète et explique.",
    code: "s = ca_jour.asfreq(\"D\", fill_value=0)\n\nmoy = s.rolling(28).mean().shift(1)\nstd = s.rolling(28).std().shift(1)",
    back: "z = (s - moy) / std\nanomalies = s[z.abs() > 3]\n\n• Fenêtre de 28 jours = 4 semaines complètes, donc un nombre égal de chaque jour de la semaine.\n• shift(1) : on compare chaque jour à l'historique PRÉCÉDENT, sans l'inclure lui-même (sinon un pic gonfle sa propre référence).\n• |z| > 3 : écart de plus de 3 écarts-types à la normale récente.\n\nAmélioration : comparer au même jour de la semaine (lundis entre eux), ou utiliser la médiane et le MAD, plus robustes que moyenne et écart-type face aux anomalies passées."
  },
  {
    id: "ana-a2-3", langue: "analyse", niveau: "avance", type: "flip",
    front: "Pandas sur de gros fichiers : comment réduire la mémoire et le temps de chargement ?",
    back: "• Ne charger que l'utile : pd.read_csv(..., usecols=[...]).\n• Types adaptés : dtype={\"pays\": \"category\"} pour les textes répétitifs (souvent 10 fois moins de mémoire), entiers et flottants réduits (int32, float32).\n• Formats colonnes compressés : Parquet plutôt que CSV (types conservés, lecture beaucoup plus rapide, lecture de colonnes seules).\n• Lire par morceaux : chunksize=500_000 et agréger au fur et à mesure.\n• Au-delà de la mémoire d'une machine : DuckDB (SQL directement sur les fichiers Parquet/CSV), Polars, ou Spark.\n\nMesurer : df.memory_usage(deep=True).sum()."
  },
  {
    id: "ana-a2-4", langue: "analyse", niveau: "avance", type: "flip",
    front: "Comment écrire un code pandas lisible et reproductible (method chaining) ?",
    back: "Enchaîner les transformations dans une seule expression, sans variables intermédiaires df2, df3, df_final_v2 :\n\nresultat = (\n    commandes\n    .query(\"statut == 'livree'\")\n    .assign(mois=lambda d: d[\"date\"].dt.to_period(\"M\"),\n            marge=lambda d: d[\"ca\"] - d[\"cout\"])\n    .groupby([\"mois\", \"canal\"], as_index=False)\n    .agg(ca=(\"ca\", \"sum\"), marge=(\"marge\", \"sum\"))\n    .sort_values(\"mois\")\n)\n\nAvantages : lecture de haut en bas, pas de modification en place, facile à transformer en fonction et à tester. Fixer les graines aléatoires et versionner le code (git) pour la reproductibilité."
  },

  // ======================================================================
  // ---- Pro : métriques, restitution, posture d'analyste ----
  // ======================================================================
  {
    id: "ana-p1-1", langue: "analyse", niveau: "pro", type: "flip",
    front: "North Star metric, indicateurs avancés et retardés : comment structurer un tableau de bord ?",
    back: "• North Star : LA métrique qui capture la valeur délivrée aux clients et prédit le succès long terme (ex. nb de commandes livrées par semaine, heures d'écoute).\n• Indicateurs retardés (lagging) : le résultat, connu tard et difficile à piloter directement (CA, churn annuel).\n• Indicateurs avancés (leading) : ceux qui bougent AVANT et sur lesquels les équipes peuvent agir (activation la 1re semaine, taux de réachat à 30 jours).\n• Garde-fous : ce qui ne doit pas se dégrader (marge, satisfaction, délais).\n\nUn bon tableau de bord : peu de chiffres, chacun avec un objectif, une tendance et un responsable. Sinon c'est un inventaire, pas un outil de pilotage."
  },
  {
    id: "ana-p1-2", langue: "analyse", niveau: "pro", type: "flip",
    front: "Loi de Goodhart : de quoi s'agit-il en pratique ?",
    back: "« Quand une mesure devient un objectif, elle cesse d'être une bonne mesure. »\n\nExemples : objectif sur le nombre de tickets clos → les tickets sont clos vite, sans être résolus ; objectif sur le taux de conversion → on coupe le trafic peu qualifié et le CA baisse ; objectif sur le temps passé dans l'appli → on ajoute des frictions.\n\nParades : associer à chaque objectif des métriques garde-fous, mesurer le résultat final et pas seulement l'activité, réviser régulièrement les indicateurs."
  },
  {
    id: "ana-p1-3", langue: "analyse", niveau: "pro", type: "qcm",
    front: "Lundi matin, le CA de la veille est en baisse de 40 %. Quelle est la PREMIÈRE chose à faire ?",
    choices: [
      "Alerter la direction d'une crise commerciale",
      "Vérifier la donnée : chargement complet ? tracking cassé ? changement de définition ? jour comparable (férié, panne de site) ?",
      "Lancer une campagne promotionnelle",
      "Construire un modèle de prévision"
    ],
    answer: 1,
    explain: "La majorité des « chutes » spectaculaires sont des problèmes de données : chargement partiel, tag de tracking supprimé lors d'une mise en production, fuseau horaire, changement de périmètre. Vérifier la complétude (nb de commandes par heure, par canal), comparer à une source indépendante (paiements, ERP), puis seulement chercher une cause métier en segmentant."
  },
  {
    id: "ana-p1-4", langue: "analyse", niveau: "pro", type: "flip",
    front: "Méthode pour investiguer une variation inattendue d'un KPI ?",
    back: "1. Est-ce réel ? Qualité et complétude des données, changement de définition ou de tracking.\n2. Est-ce significatif ? Comparer à la variabilité habituelle (même jour les semaines précédentes, intervalle de fluctuation).\n3. Décomposer le KPI en ses composantes (trafic × conversion × panier).\n4. Segmenter : device, canal, pays, catégorie, nouveaux / anciens. Où la variation est-elle concentrée ?\n5. Croiser avec les événements : mise en production, campagne, rupture de stock, concurrent, météo, jour férié.\n6. Formuler une hypothèse et la vérifier avec les données (pas l'inverse).\n\nRestituer : « La baisse de 12 % vient à 90 % du paiement mobile Android depuis la mise en production de mardi. »"
  },
  {
    id: "ana-p1-5", langue: "analyse", niveau: "pro", type: "flip",
    front: "Comment structurer la restitution d'une analyse pour un décideur ?",
    back: "Principe de la pyramide (Minto) : conclusion d'abord, puis les arguments, puis le détail.\n\n1. Le message clé en une phrase, en titre (« Les clients mobiles abandonnent au paiement : −1,2 M€/an »).\n2. 2-3 éléments qui le prouvent, chacun avec UN graphique dont le titre est une conclusion.\n3. La recommandation et son impact estimé (avec une fourchette).\n4. Les limites et hypothèses, sans les cacher.\n5. Le détail méthodologique en annexe.\n\nAdapter le niveau de détail à l'audience ; arrondir les chiffres ; une diapositive = une idée."
  },
  {
    id: "ana-p1-6", langue: "analyse", niveau: "pro", type: "code",
    front: "Un analyste présente ce résultat. Liste les problèmes de méthode.",
    code: "# Rapport mensuel - octobre (données au 20/10)\n# CA octobre : 820 k€  vs  septembre : 1 150 k€  -> -29 %, alerte rouge\n# Taux de conversion moyen = moyenne des taux quotidiens = 3,8 %\n# Clients VIP (CA > 5 k€ depuis 2019) : panier 4x supérieur\n#   -> recommandation : convertir tous les clients en VIP\n# Nouveau tag analytics installé le 05/10",
    back: "1. Mois partiel (20 jours) comparé à un mois complet : comparer du 1er au 20 dans les deux mois, ou les moyennes quotidiennes. La « baisse de 29 % » est en grande partie un artefact.\n2. Moyenne des taux quotidiens au lieu de commandes totales / visites totales : les jours à faible trafic pèsent autant que les gros jours.\n3. VIP définis PAR leur CA élevé : il est circulaire de constater qu'ils dépensent plus ; en plus biais du survivant (clients restés depuis 2019). La recommandation ne découle pas de l'analyse.\n4. Changement de tag en cours de mois : rupture de mesure possible sur le trafic et la conversion ; comparer avant/après le 05/10 et recouper avec une source indépendante.\n5. Pas de comparaison YoY (saisonnalité septembre / octobre), pas de segmentation, pas d'intervalle de variation normale."
  },
  {
    id: "ana-p1-7", langue: "analyse", niveau: "pro", type: "flip",
    front: "Analyse exploratoire vs analyse confirmatoire : pourquoi les distinguer ?",
    back: "• Exploratoire : on fouille les données pour trouver des pistes (segments, corrélations, anomalies). Utile, mais en testant beaucoup de choses, on trouve forcément des « effets » dus au hasard.\n• Confirmatoire : on teste UNE hypothèse définie à l'avance, idéalement sur de nouvelles données ou par une expérience.\n\nPratique : présenter les résultats exploratoires comme des HYPOTHÈSES à valider, pas comme des conclusions ; garder un échantillon de côté ou relancer une mesure pour confirmer ; se méfier des segments très fins (« les femmes de 35-40 ans en Bretagne le mardi convertissent 3 fois plus »)."
  },
  {
    id: "ana-p1-8", langue: "analyse", niveau: "pro", type: "flip",
    front: "Pandas, SQL, DuckDB, Spark, outil de BI : quel outil pour quelle situation ?",
    back: "• SQL (dans l'entrepôt de données) : extraire, filtrer, joindre et agréger au plus près des données ; reproductible et partageable. À privilégier pour tout ce qui est agrégation massive.\n• pandas / Polars : analyse fine, statistiques, modélisation, préparation de données de taille raisonnable (tient en mémoire).\n• DuckDB : SQL rapide en local sur des fichiers Parquet/CSV de plusieurs Go, sans serveur.\n• Spark (PySpark) : volumes distribués (centaines de Go et plus), traitements en production.\n• BI (Power BI, Tableau, Looker) : tableaux de bord récurrents en libre-service pour les métiers.\n\nRègle : pousser le calcul lourd vers la base, ramener dans pandas seulement le résultat agrégé utile."
  },
];
