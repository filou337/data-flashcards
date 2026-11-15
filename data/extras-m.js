// Explications et exemples ajoutés aux cartes Power Query M.
export const extrasM = {
  "m-f1-1": {
    detail: "Une requête M est une suite d'étapes nommées dans un bloc let … in. Chaque étape est une expression qui reçoit l'étape précédente et renvoie une NOUVELLE table. On peut donc cliquer sur n'importe quelle étape pour voir l'état des données à ce moment-là.",
    example: `let
    Source   = Csv.Document(File.Contents("C:\\data\\ventes.csv")),
    Entetes  = Table.PromoteHeaders(Source),
    Typee    = Table.TransformColumnTypes(Entetes, {{"Montant", type number}}),
    Filtree  = Table.SelectRows(Typee, each [Montant] > 0)
in
    Filtree
// Source, Entetes et Typee existent toujours, inchangées.`,
  },
  "m-f1-2": {
    detail: "Chaque clic dans l'interface ajoute une ligne de code M. Lire ce code dans l'Éditeur avancé est la meilleure façon d'apprendre M : on voit la fonction générée, ses paramètres, et on peut la modifier à la main (renommer les étapes, ajouter un paramètre).",
    example: `Clic « Supprimer les colonnes » sur « Commentaire » génère :

#"Colonnes supprimées" = Table.RemoveColumns(#"Type modifié", {"Commentaire"})

Dans l'Éditeur avancé, on peut le réécrire de façon plus robuste :
Sans_commentaire = Table.SelectColumns(Typee, {"Date", "Client", "Montant"})`,
  },
  "m-f2-1": {
    detail: "M a trois structures de base : le record (une ligne : des champs nommés), la liste (des valeurs ordonnées) et la table (des lignes partageant des colonnes). Une table peut être vue comme une liste de records, et une colonne comme une liste.",
    example: `let
    Client   = [Nom = "Ana", Ville = "Lyon"],
    Nombres  = {10, 20, 30},
    T        = #table({"Produit", "Prix"}, {{"Stylo", 2}, {"Cahier", 5}}),
    a = Client[Ville],          // "Lyon"
    b = Nombres{1},             // 20 (index base 0)
    c = T[Prix],                // {2, 5}
    d = T{0}[Produit],          // "Stylo" : 1re ligne, champ Produit
    e = List.Sum(T[Prix])       // 7
in
    e`,
  },
  "m-f2-2": {
    detail: "« Regrouper par » avec l'option « Toutes les lignes » range, pour chaque groupe, la sous-table complète dans une cellule. On peut ensuite la développer (retrouver les lignes) ou l'agréger. C'est puissant pour calculer des choses par groupe, comme un rang ou un écart à la moyenne du groupe.",
    example: `Groupe = Table.Group(Ventes, {"Client"}, {
    {"Lignes", each _, type table},              // la sous-table du client
    {"Total",  each List.Sum([Montant]), type number}
})
// Client | Lignes  | Total
// Ana    | [Table] |   120
Developpe = Table.ExpandTableColumn(Groupe, "Lignes", {"Date", "Montant"})`,
  },
  "m-f3-1": {
    detail: "En M, un identifiant simple ne contient ni espace ni caractère spécial. Pour tout autre nom (étape « Lignes filtrées », colonne « Prix TTC » dans certains contextes), on utilise la notation #\"…\". L'interface génère ces noms ; les renommer sans espace rend le code plus lisible.",
    example: `let
    #"Table filtrée" = Table.SelectRows(Source, each [Pays] = "FR"),
    Resultat         = Table.RowCount(#"Table filtrée")    // OK
    // Resultat      = Table.RowCount(Table filtrée)      -> erreur de syntaxe
in
    Resultat`,
  },
  "m-f4-1": {
    detail: "Les étapes générées par clics « codent en dur » les noms de colonnes et leurs types. Si on insère avant elles une étape qui supprime ou renomme une colonne, l'étape suivante référence une colonne qui n'existe plus : erreur « La colonne X de la table est introuvable ».",
    example: `Typee     = Table.TransformColumnTypes(Source, {{"Prix", type number}}),
// Étape insérée après coup :
Renommee  = Table.RenameColumns(Typee, {{"Prix", "PrixHT"}}),
// Étape existante, écrite quand la colonne s'appelait encore "Prix" :
Filtree   = Table.SelectRows(Renommee, each [Prix] > 0)
// -> Expression.Error : le champ « Prix » du record est introuvable.`,
  },
  "m-i1-1": {
    detail: "On transforme la requête de traitement d'UN fichier en fonction, puis on l'applique à chaque fichier listé par Folder.Files. Ajouter un nouveau fichier au dossier suffit pour qu'il soit intégré à la prochaine actualisation. Les fichiers doivent avoir la même structure.",
    example: `// Fonction : traiter un fichier
TraiterFichier = (contenu as binary) as table =>
    let
        Csv   = Csv.Document(contenu, [Delimiter = ";"]),
        Table = Table.PromoteHeaders(Csv)
    in  Table,

// Requête principale
Fichiers = Folder.Files("C:\\data\\ventes"),
Csvs     = Table.SelectRows(Fichiers, each [Extension] = ".csv"),
Ajout    = Table.AddColumn(Csvs, "Data", each TraiterFichier([Content])),
Tout     = Table.Combine(Ajout[Data])`,
  },
  "m-i1-2": {
    detail: "Une fonction appelée pour chaque ligne s'exécute dans le moteur Power Query, pas dans la source : la base de données ne peut plus faire le travail. Pire, si la fonction interroge elle-même une source (appel d'API, requête SQL), on fait une requête par ligne.",
    example: `// À éviter : une requête SQL par ligne de commande (10 000 lignes = 10 000 appels)
Ajout = Table.AddColumn(Commandes, "Client",
          each Sql.Database("srv", "db", [Query = "SELECT ... WHERE id = " & Text.From([ClientId])]))

// Mieux : charger la table des clients une fois et fusionner
Fusion = Table.NestedJoin(Commandes, {"ClientId"}, Clients, {"Id"}, "Client", JoinKind.LeftOuter)`,
  },
  "m-i2-1": {
    detail: "try évalue une expression ; en cas d'erreur, otherwise fournit une valeur de remplacement. Sans otherwise, try renvoie un record [HasError, Value] ou [HasError, Error] qui permet de lire le message d'erreur, utile pour signaler les lignes problématiques plutôt que de les masquer.",
    example: `Montant = Table.AddColumn(Source, "MontantNum",
            each try Number.From([MontantTexte]) otherwise null, type nullable number)
// "12.5" -> 12.5 ; "N/A" -> null

// Garder la trace de l'erreur :
Diag = Table.AddColumn(Source, "Erreur",
         each let r = try Number.From([MontantTexte]) in
              if r[HasError] then r[Error][Message] else null)`,
  },
  "m-i2-2": {
    detail: "Power Query évalue à la demande : une erreur de conversion dans une cellule n'est visible que si on regarde cette cellule. L'aperçu ne montre que les premières lignes. À l'actualisation complète ou dans une étape qui lit toute la colonne (somme, regroupement), l'erreur remonte et fait échouer la requête.",
    example: `// Ligne 48 213 : Montant = "12,5 €"   (texte non convertible)
Typee  = Table.TransformColumnTypes(Source, {{"Montant", type number}}),
//   l'aperçu (1000 premières lignes) semble correct
Total  = Table.Group(Typee, {"Mois"}, {{"CA", each List.Sum([Montant])}})
//   -> échec à l'actualisation : DataFormat.Error

// Diagnostic : Accueil > Conserver les lignes > Conserver les erreurs
Erreurs = Table.SelectRowsWithErrors(Typee, {"Montant"})`,
  },
  "m-i3-1": {
    detail: "Append colle des tables les unes sous les autres : les colonnes sont alignées par NOM (une colonne absente d'une table est remplie de null). Merge ajoute des colonnes d'une autre table en associant les lignes par une clé, avec un type de jointure (interne, externe gauche, anti…).",
    example: `// Append : ventes 2024 + ventes 2025 (mêmes colonnes)
Tout = Table.Combine({Ventes2024, Ventes2025})

// Merge : ajouter le nom du client à chaque vente
Fusion = Table.NestedJoin(Ventes, {"ClientId"}, Clients, {"Id"}, "Cli", JoinKind.LeftOuter),
Dev    = Table.ExpandTableColumn(Fusion, "Cli", {"Nom", "Ville"})`,
  },
  "m-i3-2": {
    detail: "Après un Merge, la colonne fusionnée contient une sous-table par ligne. Si elle contient 2 lignes (clé en double côté droit), le développement crée 2 lignes : le montant de la vente apparaît deux fois. Vérifier l'unicité de la clé avant de fusionner.",
    example: `// Vérifier l'unicité de la clé côté droit avant le Merge
Doublons = Table.SelectRows(
             Table.Group(Clients, {"Id"}, {{"Nb", each Table.RowCount(_), Int64.Type}}),
             each [Nb] > 1)
// Si Doublons n'est pas vide : dédupliquer d'abord
ClientsUniques = Table.Distinct(Clients, {"Id"})`,
  },
  "m-i4-1": {
    detail: "Un tableau Excel « une colonne par mois » est un format large. Pour l'analyse, on veut un format long : une colonne Mois et une colonne Valeur. UnpivotOtherColumns liste les colonnes à GARDER (les identifiants) ; toutes les autres sont dépivotées, y compris celles qui apparaîtront plus tard.",
    example: `// Avant : Produit | Jan | Fev | Mar
//          Stylo   |  10 |  12 |   9
Long = Table.UnpivotOtherColumns(Source, {"Produit"}, "Mois", "Ventes")
// Après : Produit | Mois | Ventes
//         Stylo   | Jan  |   10
//         Stylo   | Fev  |   12
//         Stylo   | Mar  |    9
// Le jour où la colonne "Avr" apparaît, elle est prise en compte sans rien modifier.`,
  },
  "m-a1-1": {
    detail: "Quand la source est une base de données, Power Query essaie de traduire les étapes (filtre, sélection de colonnes, regroupement) en une seule requête SQL. La base fait le travail et ne renvoie que le résultat. Sans folding, on télécharge toute la table puis on filtre en local, ce qui est lent et coûteux en mémoire.",
    example: `Source  = Sql.Database("srv", "ventes_db"),
Ventes  = Source{[Schema = "dbo", Item = "Ventes"]}[Data],
Filtre  = Table.SelectRows(Ventes, each [Annee] = 2025),
Cols    = Table.SelectColumns(Filtre, {"Pays", "Montant"}),
Groupe  = Table.Group(Cols, {"Pays"}, {{"CA", each List.Sum([Montant])}})
// Requête native envoyée à la base :
// SELECT Pays, SUM(Montant) AS CA FROM dbo.Ventes WHERE Annee = 2025 GROUP BY Pays`,
  },
  "m-a1-2": {
    detail: "« Afficher la requête native » montre le SQL réellement envoyé. Si l'option est grisée, le folding est rompu à cette étape (ou la source ne le permet pas). Les « indicateurs de folding » de l'éditeur (petites icônes à côté des étapes) donnent la même information en un coup d'œil.",
    example: `Étapes appliquées :
  Source             ✓ requête native disponible
  Lignes filtrées    ✓ WHERE Annee = 2025
  Colonne ajoutée    ✗ grisé : Text.Proper([Nom]) n'a pas d'équivalent traduit
  Lignes regroupées  ✗ s'exécute en local, sur toutes les lignes déjà téléchargées`,
  },
  "m-a1-3": {
    detail: "Après une étape non traduisible, Power Query doit matérialiser les données en local ; tout ce qui suit s'exécute donc localement. L'ordre des étapes compte : un filtre placé APRÈS l'étape bloquante ne réduit plus le volume téléchargé.",
    example: `// Mauvais ordre : tout est téléchargé, puis filtré en local
Ajout  = Table.AddColumn(Ventes, "NomPropre", each Text.Proper([Nom])),   // casse le folding
Filtre = Table.SelectRows(Ajout, each [Annee] = 2025),

// Bon ordre : le filtre part en SQL, seule l'année 2025 est téléchargée
Filtre = Table.SelectRows(Ventes, each [Annee] = 2025),
Ajout  = Table.AddColumn(Filtre, "NomPropre", each Text.Proper([Nom]))`,
  },
  "m-a2-1": {
    detail: "Un paramètre est une valeur nommée, utilisable dans toutes les requêtes. En y mettant le serveur ou la base, on bascule de l'environnement de développement à la production en changeant une seule valeur, y compris depuis les paramètres du jeu de données dans Power BI Service.",
    example: `// Paramètres : Serveur = "srv-dev" ; Base = "ventes_dev"
Source = Sql.Database(Serveur, Base),
Ventes = Source{[Schema = "dbo", Item = "Ventes"]}[Data]

// Publication : Paramètres du jeu de données > Serveur = "srv-prod", Base = "ventes"
// Aucune requête n'est modifiée.`,
  },
  "m-a3-1": {
    detail: "On découpe souvent le travail en requêtes intermédiaires réutilisables (nettoyage d'une source, table de correspondance). Si elles sont chargées, elles apparaissent comme des tables du modèle : mémoire gaspillée, modèle encombré, et risque que des utilisateurs s'en servent par erreur.",
    example: `Requêtes :
  stg_Ventes_brutes    (chargement désactivé)  -> nettoyage de la source
  stg_Clients          (chargement désactivé)
  Ventes               (chargée)  = fusion de stg_Ventes_brutes et stg_Clients
// Clic droit sur la requête > décocher « Activer le chargement »
// Elle apparaît alors en italique dans la liste des requêtes.`,
  },
  "m-a3-2": {
    detail: "Table.Buffer charge entièrement la table en mémoire et l'y fige. C'est utile quand une même petite table est relue de nombreuses fois (par exemple dans une boucle List.Generate) ou pour figer un ordre de tri. Sur une grosse table issue d'une base, cela empêche toute délégation à la source et consomme beaucoup de mémoire.",
    example: `// Utile : petite table de correspondance relue pour chaque ligne
Taux   = Table.Buffer(TauxDeChange),            // 50 lignes, lues 1 seule fois
Ajout  = Table.AddColumn(Ventes, "Taux",
           each Table.SelectRows(Taux, (t) => t[Devise] = [Devise]){0}[Taux])

// Nuisible : Table.Buffer(Ventes) sur 20 millions de lignes SQL
// -> tout est téléchargé, les filtres suivants ne partent plus en SQL.`,
  },
  "m-p1-1": {
    detail: "L'actualisation incrémentielle découpe la table en partitions par période. Power BI remplace RangeStart et RangeEnd par les bornes de chaque partition et ne recharge que les périodes récentes (par exemple les 10 derniers jours), en gardant l'historique (par exemple 5 ans) tel quel. Il faut que le filtre soit traduit en SQL (folding) pour que ce soit efficace.",
    example: `// Paramètres de type date/heure : RangeStart, RangeEnd
Source  = Sql.Database("srv", "db"),
Ventes  = Source{[Schema = "dbo", Item = "Ventes"]}[Data],
Periode = Table.SelectRows(Ventes,
            each [DateVente] >= RangeStart and [DateVente] < RangeEnd)
// Stratégie dans Power BI : archiver 5 ans, actualiser 10 jours.`,
  },
  "m-p2-1": {
    detail: "Des noms d'étapes parlants rendent la requête auto-documentée et facilitent la maintenance : on comprend la logique sans cliquer partout, et une erreur « l'étape X a échoué » indique immédiatement où chercher. Éviter aussi les espaces pour se passer de la syntaxe #\"…\".",
    example: `// Peu lisible
#"Lignes filtrées1" = ...,
#"Personnalisée ajoutée2" = ...,

// Lisible
Commandes_livrees  = Table.SelectRows(Source, each [Statut] = "livrée"),
Avec_montant_TTC   = Table.AddColumn(Commandes_livrees, "TTC", each [HT] * 1.2),
Par_mois           = Table.Group(Avec_montant_TTC, {"Mois"}, {{"CA", each List.Sum([TTC])}})`,
  },
  "m-p2-2": {
    detail: "Les partitions sont des intervalles [RangeStart ; RangeEnd[ qui se suivent : la fin de l'une est le début de la suivante. Avec >= au début et < à la fin, chaque ligne tombe dans une seule partition. Avec <= aux deux bornes, une ligne pile à minuit serait chargée deux fois.",
    example: `// Partitions mensuelles :
// [2025-01-01 ; 2025-02-01[   [2025-02-01 ; 2025-03-01[
// Une vente au 2025-02-01 00:00 :
//   >= début et <  fin -> uniquement dans la partition de février  ✓
//   >= début et <= fin -> dans janvier ET février : doublon       ✗`,
  },
};
