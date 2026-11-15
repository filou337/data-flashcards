// Note de cours générée par le skill /notes-de-cours à partir de
// docs_divers/ExcDAX-99-99-Fonctions DAX de Power Pivot pour contrôleur et analyste v4.4-qs.pdf
export const note = {
  id: "dax-power-pivot",
  titre: "DAX dans Excel Power Pivot",
  source: "Fonctions DAX de Power Pivot pour contrôleur et analyste · SLV Expert, v4.4 (2021) · 85 pages",
  deck: "dax",
  resume: "Le cours présente DAX côté **Excel Power Pivot** et passe en revue ses familles de fonctions. Cette note garde ce qui complète ton deck DAX : passer d'Excel à DAX, l'**intégrité référentielle** et la ligne « membre inconnu », les fonctions de **relation** et de **comptage**, les pièges de DISTINCT / VALUES / EARLIER, le **catalogue de l'intelligence temporelle** (périodes glissantes, soldes d'ouverture et de clôture) et les fonctions d'information.\n\nLes bases déjà maîtrisées (mesure vs colonne, contextes, CALCULATE, ALL, table de dates, PATH) sont des renvois vers le deck DAX.",
  prerequis: ["dax"],
  concepts: [
    "Power Pivot", "modèle de données Excel", "tableau croisé dynamique", "DAX vs Excel", "référence de cellule", "fonction qui renvoie une table",
    "intégrité référentielle", "ligne vide", "membre inconnu", "RELATED", "RELATEDTABLE", "RECHERCHEV / VLOOKUP",
    "COUNT", "COUNTA", "COUNTBLANK", "COUNTROWS", "DISTINCTCOUNT", "COUNTX", "AVERAGEX", "MAXX", "MINX",
    "DISTINCT", "VALUES", "ALLNONBLANKROW", "EARLIER", "variables VAR",
    "TOTALYTD", "TOTALQTD", "TOTALMTD", "DATESYTD", "exercice fiscal", "SAMEPERIODLASTYEAR", "DATEADD", "PARALLELPERIOD", "PREVIOUSMONTH", "NEXTMONTH",
    "DATESINPERIOD", "cumul glissant 12 mois", "DATESBETWEEN", "FIRSTDATE", "LASTDATE", "LASTNONBLANK", "OPENINGBALANCEMONTH", "CLOSINGBALANCEMONTH", "mesure semi-additive",
    "ISBLANK", "ISFILTERED", "ISCROSSFILTERED", "HASONEFILTER", "HASONEVALUE", "SELECTEDVALUE", "IFERROR", "DIVIDE", "FORMAT", "EOMONTH", "EDATE", "YEARFRAC",
    "PATHCONTAINS", "PATHITEMREVERSE",
  ],
  chapitres: [
    {
      id: "excel-vers-dax",
      titre: "1. Passer des formules Excel à DAX",
      objectif: "Comprendre ce qui change quand on quitte la grille de cellules pour un modèle de données.",
      blocs: [
        { type: "texte", contenu: "**Power Pivot** est le moteur de modèle de données intégré à Excel (le même que celui de Power BI). On y charge plusieurs tables reliées entre elles, puis on écrit du DAX à deux endroits : les **colonnes calculées** dans la fenêtre Power Pivot, et les **mesures** utilisées dans les tableaux croisés dynamiques." },
        { type: "tableau", entetes: ["Formule Excel", "Formule DAX"], lignes: [
          ["Référence des **cellules** ou des plages (`B2`, `A2:A100`)", "Référence des **colonnes** et des **tables** entières (`Ventes[Montant]`)"],
          ["Une formule par cellule, recopiée vers le bas", "Une formule par colonne calculée ou par mesure"],
          ["Une fonction renvoie une valeur (ou une plage)", "Beaucoup de fonctions renvoient une **table** (FILTER, VALUES, DATESYTD…), passée à une autre fonction"],
          ["Une colonne peut mélanger nombres et texte", "Chaque colonne a **un seul type** de données"],
          ["Dates = nombres de série", "Type date/heure dédié, plus des fonctions d'intelligence temporelle"],
          ["RECHERCHEV pour aller chercher une valeur", "Des **relations** entre tables, puis RELATED"],
        ] },
        { type: "attention", contenu: "Les fonctions portent souvent le même nom (SUM, LEFT, IF…) mais on ne peut pas coller une formule DAX dans une cellule Excel, ni l'inverse. Et `=SUM(Ventes[Montant])` n'a pas le même sens partout : dans une mesure, le résultat dépend des filtres du tableau croisé." },
        { type: "renvoi", vers: "dax", contenu: "Mesure ou colonne calculée, contexte de ligne et contexte de filtre, CALCULATE : voir les cartes « Fondamentaux » du deck DAX." },
      ],
    },
    {
      id: "relations",
      titre: "2. Relations, intégrité référentielle et ligne « inconnu »",
      objectif: "Lire les relations du modèle et comprendre d'où vient la ligne vide dans un tableau croisé.",
      blocs: [
        { type: "definition", terme: "Intégrité référentielle", contenu: "Toute clé étrangère du côté « plusieurs » (Ventes[ClientId]) existe du côté « un » (Clients[Id]). Power Pivot ne l'exige **pas** pour créer une relation." },
        { type: "texte", contenu: "Quand une vente pointe vers un client absent de la table Clients, le moteur ajoute automatiquement une **ligne vide** du côté « un ». Toutes les ventes orphelines y sont rattachées : elles apparaissent dans le tableau croisé sous un en-tête vide, l'équivalent du **membre inconnu** d'un entrepôt de données." },
        { type: "schema", svg: `<svg viewBox="0 0 360 214" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ligne vide créée pour les ventes sans client">
  <defs><marker id="fl-dax-blank" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="s-arrow"/></marker></defs>
  <text x="6" y="16" class="s-bold">Ventes</text>
  <rect x="6" y="24" width="150" height="30" rx="4" class="s-box"/><text x="16" y="44" class="s-txt">client 1 · 100 €</text>
  <rect x="6" y="60" width="150" height="30" rx="4" class="s-box"/><text x="16" y="80" class="s-txt">client 2 · 50 €</text>
  <rect x="6" y="96" width="150" height="30" rx="4" class="s-warn"/><text x="16" y="116" class="s-txt">client 9 · 30 €</text>
  <text x="204" y="16" class="s-bold">Clients</text>
  <rect x="204" y="24" width="150" height="30" rx="4" class="s-box"/><text x="214" y="44" class="s-txt">1 · Ana</text>
  <rect x="204" y="60" width="150" height="30" rx="4" class="s-box"/><text x="214" y="80" class="s-txt">2 · Bob</text>
  <rect x="204" y="96" width="150" height="30" rx="4" class="s-warn"/><text x="214" y="116" class="s-txt">(vide) · ajoutée</text>
  <path d="M156 39H200" class="s-line" marker-end="url(#fl-dax-blank)"/>
  <path d="M156 75H200" class="s-line" marker-end="url(#fl-dax-blank)"/>
  <path d="M156 111H200" class="s-dash" marker-end="url(#fl-dax-blank)"/>
  <text x="6" y="156" class="s-sub">Tableau croisé par client :</text>
  <text x="6" y="176" class="s-txt">Ana 100 € · Bob 50 € · (vide) 30 €</text>
  <text x="6" y="198" class="s-sub">Total 180 € : les 30 € orphelins ne sont pas perdus.</text>
</svg>`, legende: "Le client 9 n'existe pas : Power Pivot crée une ligne vide côté Clients et y rattache la vente." },
        { type: "application", titre: "Contrôle qualité du modèle", contenu: "Une ligne « (vide) » dans un tableau croisé n'est pas un bug d'affichage : c'est le signal qu'il manque des lignes dans une dimension. On liste les clés orphelines avant de corriger la source :", code: `Clés orphelines =
COUNTROWS(
    FILTER(Ventes, ISBLANK(RELATED(Clients[Nom])))
)` },
        { type: "texte", contenu: "Deux fonctions suivent une relation existante :" },
        { type: "tableau", entetes: ["Fonction", "Sens", "Renvoie", "Usage typique"], lignes: [
          ["`RELATED(col)`", "du côté « plusieurs » vers le côté « un »", "une **valeur**", "Ajouter le taux de la région à chaque vente (l'équivalent de RECHERCHEV)"],
          ["`RELATEDTABLE(table)`", "du côté « un » vers le côté « plusieurs »", "une **table**", "Compter ou sommer les ventes de chaque client"],
        ] },
        { type: "exemple", titre: "Les deux sens d'une relation, en colonnes calculées", code: `-- Dans Ventes (côté plusieurs) : une valeur de la table Régions
Ventes[Taxes] = Ventes[FraisTransport] * RELATED(Regions[TauxTaxe])

-- Dans Clients (côté un) : une table des ventes du client
Clients[NbAchats]  = COUNTROWS(RELATEDTABLE(Ventes))
Clients[CA client] = SUMX(RELATEDTABLE(Ventes), Ventes[Montant])` },
        { type: "attention", contenu: "RELATED ne fonctionne que s'il existe une relation **active** et qu'on se trouve dans un contexte de ligne (colonne calculée ou itérateur). Dans une mesure, `RELATED(Clients[Nom])` seul provoque une erreur : il faut un itérateur, comme SUMX sur Ventes." },
      ],
    },
    {
      id: "comptages",
      titre: "3. Compter et agréger sans se tromper",
      objectif: "Choisir la bonne fonction de comptage et connaître ses pièges.",
      blocs: [
        { type: "tableau", entetes: ["Fonction", "Compte…", "Piège"], lignes: [
          ["`COUNTROWS(table)`", "les lignes d'une table", "La plus sûre pour « combien de ventes »"],
          ["`COUNT(col)`", "les valeurs non vides d'une colonne de nombres ou de dates", "Ignore les vides"],
          ["`COUNTA(col)`", "les valeurs non vides, tout type", "—"],
          ["`COUNTBLANK(col)`", "les valeurs vides", "Utile pour mesurer la complétude"],
          ["`DISTINCTCOUNT(col)`", "les valeurs distinctes", "Compte **le vide comme une valeur** (DISTINCTCOUNTNOBLANK l'exclut)"],
          ["`COUNTX(table, expr)`", "les lignes où l'expression n'est pas vide", "Itérateur : évalue l'expression ligne par ligne"],
        ] },
        { type: "exemple", titre: "Les comptages ne donnent pas le même chiffre", contenu: "Colonne Ventes[ClientId] : 7, 7, 9, (vide).", resultat: "COUNTROWS(Ventes)              = 4\nCOUNT(Ventes[ClientId])         = 3\nCOUNTBLANK(Ventes[ClientId])    = 1\nDISTINCTCOUNT(Ventes[ClientId]) = 3   (7, 9 et le vide)" },
        { type: "texte", contenu: "Les fonctions en **X** (SUMX, AVERAGEX, MAXX, MINX, COUNTX) itèrent sur une table et évaluent une expression ligne par ligne. Les fonctions en **A** (AVERAGEA, MAXA, COUNTA) sont héritées d'Excel et traitent aussi les valeurs logiques ou texte." },
        { type: "application", titre: "Panier moyen et meilleur client", code: `Nb commandes = DISTINCTCOUNT(Ventes[CommandeId])
Panier moyen = DIVIDE([CA], [Nb commandes])
CA max d'un client = MAXX(VALUES(Clients[Id]), [CA])` },
        { type: "renvoi", vers: "dax", contenu: "Pourquoi SUMX plutôt que SUM pour un prix × quantité, et la transition de contexte quand une mesure est appelée dans un itérateur : deck DAX." },
      ],
    },
    {
      id: "tables",
      titre: "4. Fonctions qui renvoient des tables : DISTINCT, VALUES, EARLIER",
      objectif: "Éviter les trois pièges classiques des fonctions de table.",
      blocs: [
        { type: "tableau", entetes: ["Fonction", "Renvoie", "Différence clé"], lignes: [
          ["`DISTINCT(col)`", "les valeurs distinctes visibles", "N'inclut **pas** la ligne vide créée pour les clés orphelines"],
          ["`VALUES(col)`", "les valeurs distinctes visibles", "Peut inclure la ligne vide (« membre inconnu »)"],
          ["`ALL(col)`", "toutes les valeurs, sans tenir compte des filtres", "Inclut la ligne vide"],
          ["`ALLNONBLANKROW(col)`", "toutes les valeurs sans filtre", "Exclut la ligne vide"],
        ] },
        { type: "attention", contenu: "Dans un modèle sans clés orphelines, DISTINCT et VALUES donnent le même résultat ; la différence n'apparaît que le jour où une vente pointe vers un client inconnu. Pour compter les clients d'une sélection, `COUNTROWS(VALUES(Clients[Id]))` peut alors compter un client « vide » de plus." },
        { type: "definition", terme: "EARLIER", contenu: "Dans une colonne calculée qui contient un itérateur (FILTER, SUMX…), deux contextes de ligne sont imbriqués. EARLIER(col) renvoie la valeur de la colonne dans le contexte **extérieur**, c'est-à-dire la ligne pour laquelle on calcule la colonne." },
        { type: "exemple", titre: "Rang d'un produit par prix, avec EARLIER puis avec VAR", code: `-- Écriture historique
Produits[Rang prix] =
COUNTROWS(FILTER(Produits, Produits[Prix] > EARLIER(Produits[Prix]))) + 1

-- Écriture actuelle, plus lisible : la variable fige la valeur de la ligne courante
Produits[Rang prix] =
VAR PrixCourant = Produits[Prix]
RETURN COUNTROWS(FILTER(Produits, Produits[Prix] > PrixCourant)) + 1`, resultat: "Prix 50, 30, 30, 10 → rangs 1, 2, 2, 4" },
        { type: "attention", contenu: "Précision : le cours (version 2021) présente EARLIER, toujours valide, mais les variables (VAR) sont aujourd'hui l'écriture recommandée. Pour un classement dans une mesure, utiliser RANKX." },
      ],
    },
    {
      id: "temps",
      titre: "5. Le catalogue de l'intelligence temporelle",
      objectif: "Savoir quelle fonction de date choisir pour chaque question métier.",
      blocs: [
        { type: "renvoi", vers: "dax", contenu: "Prérequis : une table de dates continue, marquée comme telle et reliée aux faits. Voir les cartes du deck DAX sur l'intelligence temporelle." },
        { type: "tableau", entetes: ["Question", "Fonction", "Exemple"], lignes: [
          ["Cumul depuis le début de l'année / du trimestre / du mois", "TOTALYTD, TOTALQTD, TOTALMTD (ou DATESYTD…)", "`TOTALYTD([CA], Dates[Date])`"],
          ["Exercice qui ne finit pas le 31 décembre", "4e argument de TOTALYTD / DATESYTD", "`TOTALYTD([CA], Dates[Date], \"06-30\")`"],
          ["Même période l'an dernier", "SAMEPERIODLASTYEAR ou DATEADD(…, -1, YEAR)", "Les mêmes jours, décalés d'un an"],
          ["La **période entière** précédente", "PARALLELPERIOD", "`PARALLELPERIOD(Dates[Date], -1, YEAR)` : toute l'année N-1"],
          ["Le mois / jour / trimestre précédent ou suivant", "PREVIOUSMONTH, NEXTMONTH, PREVIOUSDAY…", "Mois complet précédent"],
          ["Cumul glissant (12 derniers mois)", "DATESINPERIOD", "voir l'exemple ci-dessous"],
          ["Une plage libre", "DATESBETWEEN", "`DATESBETWEEN(Dates[Date], debut, fin)`"],
          ["Solde à une date (stock, trésorerie)", "CLOSINGBALANCEMONTH / OPENINGBALANCEMONTH", "Stock en fin de mois"],
        ] },
        { type: "schema", svg: `<svg viewBox="0 0 360 232" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Fonctions de dates pour une sélection de mars 2025">
  <text x="6" y="16" class="s-sub">Sélection dans le visuel : mars 2025</text>
  <text x="6" y="40" class="s-sub">2024</text>
  <text x="186" y="40" class="s-sub">2025</text>
  <path d="M6 48H354" class="s-line"/>
  <path d="M180 42V54" class="s-line"/>
  <text x="6" y="72" class="s-txt">Sélection</text>
  <rect x="209.0" y="60" width="14.5" height="16" rx="3" class="s-acc"/>
  <text x="6" y="102" class="s-txt">DATESYTD</text>
  <rect x="180.0" y="90" width="43.5" height="16" rx="3" class="s-ok"/>
  <text x="6" y="132" class="s-txt">SAMEPERIODLASTYEAR</text>
  <rect x="35.0" y="138" width="14.5" height="16" rx="3" class="s-box"/>
  <text x="55.5" y="151" class="s-sub">mars 2024</text>
  <text x="6" y="178" class="s-txt">PARALLELPERIOD(-1, YEAR)</text>
  <rect x="6.0" y="184" width="174" height="14" rx="3" class="s-box"/>
  <text x="6" y="216" class="s-txt">DATESINPERIOD(-12, MONTH)</text>
  <rect x="49.5" y="222" width="174.0" height="8" rx="3" class="s-acc"/>
</svg>`, legende: "Pour une sélection de mars 2025 : DATESYTD couvre janvier-mars 2025, SAMEPERIODLASTYEAR mars 2024, PARALLELPERIOD(-1, YEAR) toute l'année 2024, DATESINPERIOD(-12 mois) d'avril 2024 à mars 2025." },
        { type: "exemple", titre: "Comparaisons et cumul glissant", code: `CA N-1         = CALCULATE([CA], SAMEPERIODLASTYEAR(Dates[Date]))
CA année N-1   = CALCULATE([CA], PARALLELPERIOD(Dates[Date], -1, YEAR))
CA 12 mois glissants =
CALCULATE(
    [CA],
    DATESINPERIOD(Dates[Date], MAX(Dates[Date]), -12, MONTH)
)`, resultat: "Sélection = mars 2025 :\nCA N-1          → CA de mars 2024\nCA année N-1    → CA de toute l'année 2024\nCA 12 mois gl.  → CA d'avril 2024 à mars 2025" },
        { type: "definition", terme: "Mesure semi-additive", contenu: "Une mesure qu'on peut sommer sur certaines dimensions mais pas sur le temps : un stock, un solde bancaire, un effectif. Le stock de l'année n'est pas la somme des stocks quotidiens, c'est le stock du dernier jour." },
        { type: "exemple", titre: "Stock de fin de période", code: `Stock fin de mois    = CLOSINGBALANCEMONTH(SUM(Stocks[Quantite]), Dates[Date])
Stock début de mois  = OPENINGBALANCEMONTH(SUM(Stocks[Quantite]), Dates[Date])

-- Plus robuste quand le dernier jour du mois n'a pas de relevé (week-end, jour férié) :
Stock fin de période =
CALCULATE(SUM(Stocks[Quantite]), LASTNONBLANK(Dates[Date], CALCULATE(SUM(Stocks[Quantite]))))` },
        { type: "attention", contenu: "CLOSINGBALANCEMONTH prend la **dernière date du calendrier** du mois. Si aucun relevé n'existe ce jour-là (le 31 tombe un dimanche), le résultat est vide. LASTNONBLANK prend la dernière date qui **a** une valeur." },
      ],
    },
    {
      id: "info",
      titre: "6. Fonctions d'information et calculs défensifs",
      objectif: "Écrire des mesures qui réagissent correctement aux sélections et aux cas vides.",
      blocs: [
        { type: "tableau", entetes: ["Fonction", "Renvoie VRAI quand…", "Usage"], lignes: [
          ["`ISBLANK(x)`", "x est vide", "Remplacer un vide, détecter une absence"],
          ["`ISFILTERED(col)`", "col est filtrée **directement**", "Afficher un message selon le niveau de détail"],
          ["`ISCROSSFILTERED(col)`", "col est filtrée directement ou via une autre colonne ou table", "Détecter tout filtre indirect"],
          ["`HASONEFILTER(col)`", "un seul élément est filtré directement sur col", "Sélection explicite d'une valeur"],
          ["`HASONEVALUE(col)`", "une seule valeur est visible dans col", "Calcul qui n'a de sens que pour un élément"],
          ["`SELECTEDVALUE(col, défaut)`", "renvoie la valeur s'il n'y en a qu'une, sinon le défaut", "Remplace IF(HASONEVALUE(…), VALUES(…))"],
        ] },
        { type: "exemple", titre: "Une mesure qui ne s'affiche qu'au niveau produit", code: `Prix unitaire =
IF(
    HASONEVALUE(Produits[Nom]),
    SELECTEDVALUE(Produits[Prix]),
    BLANK()      -- sur les sous-totaux, un prix n'a pas de sens
)

Marge % = DIVIDE([Marge], [CA])          -- vide au lieu d'une erreur si CA = 0` },
        { type: "tableau", entetes: ["Besoin", "Fonction"], lignes: [
          ["Division sans erreur", "`DIVIDE(a, b, défaut)` (préférer à IFERROR(a/b, …))"],
          ["Formater une date ou un nombre en texte", "`FORMAT(Dates[Date], \"mmmm yyyy\")`"],
          ["Fin de mois / décaler de n mois", "`EOMONTH(date, 0)` / `EDATE(date, 3)`"],
          ["Âge ou ancienneté en années", "`YEARFRAC(Clients[DateNaissance], TODAY())`"],
          ["Arrondir à un multiple", "`MROUND`, `CEILING`, `FLOOR`"],
        ] },
        { type: "attention", contenu: "FORMAT renvoie du **texte** : une colonne « Mois » créée avec FORMAT se trie alphabétiquement (août, avril, décembre…). Ajouter une colonne numéro de mois et utiliser « Trier par colonne »." },
        { type: "texte", contenu: "Pour les hiérarchies parent-enfant, le cours ajoute à PATH, PATHITEM et PATHLENGTH : **PATHCONTAINS(chemin, id)** (l'élément est-il un ancêtre ?) et **PATHITEMREVERSE(chemin, n)** (le n-ième élément en partant de la feuille)." },
        { type: "renvoi", vers: "dax", contenu: "PATH, PATHITEM et la mise à plat d'une hiérarchie parent-enfant en niveaux : deck DAX, carte sur les hiérarchies." },
      ],
    },
  ],
  aRetenir: [
    "DAX travaille sur des colonnes et des tables, jamais sur des cellules ; beaucoup de fonctions renvoient une table passée à une autre fonction.",
    "Une clé orpheline crée une ligne « vide » côté dimension : elle apparaît dans les tableaux croisés et signale un problème de qualité.",
    "RELATED va du côté plusieurs vers le côté un (une valeur) ; RELATEDTABLE va dans l'autre sens (une table).",
    "COUNTROWS compte des lignes ; DISTINCTCOUNT compte aussi la valeur vide.",
    "VALUES peut inclure la ligne vide, DISTINCT non ; EARLIER se remplace aujourd'hui par une variable.",
    "SAMEPERIODLASTYEAR décale la sélection d'un an ; PARALLELPERIOD renvoie la période entière ; DATESINPERIOD sert aux cumuls glissants.",
    "Stocks et soldes sont semi-additifs : CLOSINGBALANCE… ou LASTNONBLANK, jamais une somme sur le temps.",
    "HASONEVALUE / SELECTEDVALUE et DIVIDE rendent les mesures robustes aux sous-totaux et aux divisions par zéro.",
  ],
};
