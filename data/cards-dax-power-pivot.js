// Cartes ajoutées au deck DAX par le skill /notes-de-cours
// (cours « Fonctions DAX de Power Pivot pour contrôleur et analyste », note : data/notes/dax-power-pivot.js).
export const cardsDaxPowerPivot = [
  {
    id: "daxpp-f1-1", langue: "dax", niveau: "fondamentaux", type: "flip",
    front: "Quelles sont les principales différences entre une formule Excel et une formule DAX ?",
    back: "Excel référence des cellules et des plages, une formule par cellule ; DAX référence des colonnes et des tables entières, une formule par colonne calculée ou par mesure. Beaucoup de fonctions DAX renvoient une table, chaque colonne a un seul type, et les dates ont un vrai type date/heure. On ne peut pas coller une formule DAX dans une cellule Excel, ni l'inverse.",
  },
  {
    id: "daxpp-f1-2", langue: "dax", niveau: "fondamentaux", type: "qcm",
    front: "Dans un tableau croisé Power Pivot par client, une ligne avec un en-tête vide apparaît, avec 30 € de ventes. Que signifie-t-elle ?",
    choices: [
      "Un bug d'affichage d'Excel",
      "Des ventes dont le ClientId n'existe pas dans la table Clients : Power Pivot les rattache à une ligne vide créée automatiquement",
      "Les ventes sans montant",
      "Le total général mal placé",
    ],
    answer: 1,
    explain: "Power Pivot n'impose pas l'intégrité référentielle : il crée une ligne vide (le « membre inconnu ») du côté « un » de la relation et y regroupe les lignes orphelines. Les 30 € ne sont pas perdus, mais il manque des clients dans la dimension.",
  },
  {
    id: "daxpp-f1-3", langue: "dax", niveau: "fondamentaux", type: "flip",
    front: "RELATED vs RELATEDTABLE : dans quel sens suit-on la relation, et que renvoie chacune ?",
    back: "RELATED(colonne) va du côté « plusieurs » vers le côté « un » et renvoie une valeur (le nom du client d'une vente) : c'est l'équivalent de RECHERCHEV. RELATEDTABLE(table) va du côté « un » vers le côté « plusieurs » et renvoie une table (toutes les ventes d'un client), à compter ou à agréger.",
    example: "Ventes[Taxes]     = Ventes[Frais] * RELATED(Regions[TauxTaxe])\nClients[NbAchats] = COUNTROWS(RELATEDTABLE(Ventes))",
  },
  {
    id: "daxpp-f1-4", langue: "dax", niveau: "fondamentaux", type: "code",
    front: "Colonne Ventes[ClientId] = 7, 7, 9, (vide). Que renvoie chaque formule ?",
    code: "COUNTROWS(Ventes)\nCOUNT(Ventes[ClientId])\nCOUNTBLANK(Ventes[ClientId])\nDISTINCTCOUNT(Ventes[ClientId])",
    back: "COUNTROWS = 4 (lignes)\nCOUNT = 3 (valeurs non vides)\nCOUNTBLANK = 1\nDISTINCTCOUNT = 3 : 7, 9 ET la valeur vide, comptée comme une valeur distincte.\nPour l'exclure : DISTINCTCOUNTNOBLANK.",
  },
  {
    id: "daxpp-f1-5", langue: "dax", niveau: "fondamentaux", type: "flip",
    front: "Où écrit-on des formules DAX dans Excel ?",
    back: "Dans Power Pivot, le moteur de modèle de données d'Excel (le même que Power BI) : les colonnes calculées s'écrivent dans la fenêtre Power Pivot, dans la table concernée ; les mesures se créent depuis le tableau croisé dynamique (ou dans la zone de calcul sous la table) et s'utilisent dans les tableaux et graphiques croisés.",
  },
  {
    id: "daxpp-i1-1", langue: "dax", niveau: "intermediaire", type: "flip",
    front: "DISTINCT vs VALUES : quelle différence ?",
    back: "Les deux renvoient les valeurs distinctes visibles d'une colonne. VALUES peut inclure la ligne vide créée pour les clés orphelines (le « membre inconnu »), DISTINCT ne l'inclut pas. La différence n'apparaît que dans un modèle où l'intégrité référentielle n'est pas respectée.",
    detail: "Même logique pour ALL (inclut la ligne vide) et ALLNONBLANKROW (l'exclut).",
  },
  {
    id: "daxpp-i1-2", langue: "dax", niveau: "intermediaire", type: "code",
    front: "Que calcule cette colonne calculée, et comment l'écrire aujourd'hui ?",
    code: "Produits[Rang prix] =\nCOUNTROWS(FILTER(Produits, Produits[Prix] > EARLIER(Produits[Prix]))) + 1",
    back: "Le rang du produit par prix décroissant. FILTER crée un second contexte de ligne ; EARLIER renvoie le prix de la ligne extérieure (celle pour laquelle on calcule la colonne). Prix 50, 30, 30, 10 → rangs 1, 2, 2, 4.\n\nÉcriture actuelle :\nVAR PrixCourant = Produits[Prix]\nRETURN COUNTROWS(FILTER(Produits, Produits[Prix] > PrixCourant)) + 1",
  },
  {
    id: "daxpp-i1-3", langue: "dax", niveau: "intermediaire", type: "qcm",
    front: "Le visuel affiche mars 2025. Quelle mesure renvoie le chiffre d'affaires de TOUTE l'année 2024 ?",
    choices: [
      "CALCULATE([CA], SAMEPERIODLASTYEAR(Dates[Date]))",
      "CALCULATE([CA], DATEADD(Dates[Date], -1, YEAR))",
      "CALCULATE([CA], PARALLELPERIOD(Dates[Date], -1, YEAR))",
      "TOTALYTD([CA], Dates[Date])",
    ],
    answer: 2,
    explain: "SAMEPERIODLASTYEAR et DATEADD décalent la sélection exacte (mars 2024). PARALLELPERIOD décale puis étend à la période entière : toute l'année 2024. TOTALYTD donne janvier à mars 2025.",
  },
  {
    id: "daxpp-i1-4", langue: "dax", niveau: "intermediaire", type: "code",
    front: "Complète la mesure « CA des 12 derniers mois glissants ».",
    code: "CA 12 mois glissants =\nCALCULATE(\n    [CA],\n    ???\n)",
    back: "DATESINPERIOD(Dates[Date], MAX(Dates[Date]), -12, MONTH)\n\nÀ partir de la dernière date visible (MAX), on remonte de 12 mois. Pour mars 2025 : avril 2024 à mars 2025. Lisse la saisonnalité, idéal pour une courbe de tendance.",
  },
  {
    id: "daxpp-i1-5", langue: "dax", niveau: "intermediaire", type: "flip",
    front: "Comment calculer un cumul annuel sur un exercice fiscal qui se termine le 30 juin ?",
    back: "Avec le dernier argument (date de fin d'année) de TOTALYTD ou DATESYTD : TOTALYTD([CA], Dates[Date], \"06-30\"). Le cumul repart alors de zéro chaque 1er juillet.",
  },
  {
    id: "daxpp-i1-6", langue: "dax", niveau: "intermediaire", type: "flip",
    front: "Qu'est-ce qu'une mesure semi-additive ? Donne un exemple et la façon de la calculer.",
    back: "Une mesure qu'on peut sommer sur certaines dimensions mais pas sur le temps : stock, solde bancaire, effectif. Le stock de l'année n'est pas la somme des stocks quotidiens mais le stock du dernier jour. On utilise CLOSINGBALANCEMONTH / QUARTER / YEAR, OPENINGBALANCE… ou LASTNONBLANK.",
    example: "Stock fin de mois = CLOSINGBALANCEMONTH(SUM(Stocks[Qte]), Dates[Date])",
  },
  {
    id: "daxpp-i1-7", langue: "dax", niveau: "intermediaire", type: "flip",
    front: "ISFILTERED vs ISCROSSFILTERED ?",
    back: "ISFILTERED(col) est vrai seulement si la colonne est filtrée directement (segment ou axe sur cette colonne). ISCROSSFILTERED(col) est vrai aussi quand le filtre arrive indirectement, via une autre colonne ou une table reliée.",
  },
  {
    id: "daxpp-i1-8", langue: "dax", niveau: "intermediaire", type: "flip",
    front: "Pourquoi une colonne « Mois » créée avec FORMAT(Dates[Date], \"mmmm\") s'affiche-t-elle dans le désordre ?",
    back: "FORMAT renvoie du texte : les mois sont triés alphabétiquement (août, avril, décembre…). Il faut une colonne numéro de mois (MONTH(Dates[Date])) et l'option « Trier par colonne » sur la colonne de libellé.",
  },
  {
    id: "daxpp-a1-1", langue: "dax", niveau: "avance", type: "flip",
    front: "Pourquoi CLOSINGBALANCEMONTH peut-il renvoyer un stock vide, et que faire ?",
    back: "Elle évalue l'expression à la dernière date du calendrier du mois. Si aucun relevé n'existe ce jour-là (le 31 est un dimanche), le résultat est vide. LASTNONBLANK prend la dernière date qui a une valeur :\nCALCULATE(SUM(Stocks[Qte]), LASTNONBLANK(Dates[Date], CALCULATE(SUM(Stocks[Qte]))))",
  },
  {
    id: "daxpp-a1-2", langue: "dax", niveau: "avance", type: "code",
    front: "Cette mesure doit afficher le prix unitaire uniquement au niveau produit, et rien sur les sous-totaux. Complète.",
    code: "Prix unitaire =\nIF(\n    ???,\n    SELECTEDVALUE(Produits[Prix]),\n    BLANK()\n)",
    back: "HASONEVALUE(Produits[Nom])\n\nSur un sous-total, plusieurs produits sont visibles : HASONEVALUE est faux, la mesure renvoie vide au lieu d'un prix qui n'aurait pas de sens. SELECTEDVALUE renvoie la valeur s'il n'y en a qu'une (sinon vide, ou la valeur par défaut fournie).",
  },
  {
    id: "daxpp-a1-3", langue: "dax", niveau: "avance", type: "flip",
    front: "Comment repérer les ventes dont le client n'existe pas dans la dimension ?",
    back: "Dans une mesure : COUNTROWS(FILTER(Ventes, ISBLANK(RELATED(Clients[Nom])))). Un résultat non nul signifie des clés orphelines : il faut compléter la dimension à la source plutôt que de laisser la ligne « vide » dans les rapports.",
  },
  {
    id: "daxpp-a1-4", langue: "dax", niveau: "avance", type: "qcm",
    front: "Dans une mesure, `= RELATED(Clients[Region])` provoque une erreur. Pourquoi ?",
    choices: [
      "RELATED est réservée à Power BI",
      "RELATED a besoin d'un contexte de ligne (colonne calculée ou itérateur) ; une mesure n'en a pas",
      "Il faut écrire RELATEDTABLE",
      "La relation doit être inactive",
    ],
    answer: 1,
    explain: "RELATED va chercher la valeur liée à LA ligne courante. Dans une mesure, il n'y a pas de ligne courante : il faut l'utiliser dans un itérateur, par exemple SUMX(Ventes, Ventes[Montant] * RELATED(Clients[Remise])).",
  },
  {
    id: "daxpp-p1-1", langue: "dax", niveau: "pro", type: "flip",
    front: "Un contrôleur veut « le CA depuis le début de l'exercice, comparé à la même période l'an dernier, et le stock de fin de période ». Quelles fonctions combines-tu ?",
    back: "CA YTD = TOTALYTD([CA], Dates[Date], \"06-30\") si l'exercice finit le 30 juin.\nCA YTD N-1 = CALCULATE([CA YTD], SAMEPERIODLASTYEAR(Dates[Date])).\nÉcart % = DIVIDE([CA YTD] - [CA YTD N-1], [CA YTD N-1]).\nStock = mesure semi-additive : CLOSINGBALANCEMONTH ou LASTNONBLANK, jamais une somme sur les jours.",
  },
  {
    id: "daxpp-p1-2", langue: "dax", niveau: "pro", type: "flip",
    front: "PATHCONTAINS et PATHITEMREVERSE : à quoi servent-elles dans une hiérarchie parent-enfant ?",
    back: "PATHCONTAINS(chemin, id) indique si un élément figure dans le chemin d'un employé, c'est-à-dire s'il en est un ancêtre (« cet employé dépend-il du directeur 4 ? »), utile pour la sécurité au niveau des lignes. PATHITEMREVERSE(chemin, n) renvoie le n-ième élément en partant de la feuille (1 = l'employé lui-même, 2 = son manager direct).",
  },
];
