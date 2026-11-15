// Deck généré par le skill /notes-de-cours à partir de docs_divers/Cours-Data-Mining.pdf
// (note : data/notes/data-mining.js). La validation des modèles est dans le deck Régression.
export const cardsDataMining = [
  {
    id: "dm-f1-1", langue: "data-mining", niveau: "fondamentaux", type: "flip",
    front: "Quelles sont les étapes du processus KDD, et où se situe le data mining ?",
    back: "Sélection des données → nettoyage → transformation → data mining (application d'un algorithme) → évaluation et interprétation. Le data mining n'est qu'une étape ; la préparation prend souvent l'essentiel du temps, et le processus est itératif (on revient en arrière après évaluation).",
  },
  {
    id: "dm-f1-2", langue: "data-mining", niveau: "fondamentaux", type: "qcm",
    front: "Une enseigne veut découvrir des groupes de clients aux comportements proches, sans catégories définies à l'avance. Quelle tâche de data mining ?",
    choices: ["Classification", "Clustering (segmentation)", "Règles d'association", "Détection de déviations"],
    answer: 1,
    explain: "Aucune classe n'est connue à l'avance : c'est du non supervisé, donc du clustering. La classification attribue des cas à des classes déjà définies (supervisé).",
  },
  {
    id: "dm-f1-3", langue: "data-mining", niveau: "fondamentaux", type: "flip",
    front: "Distance de Manhattan vs distance euclidienne ? Calcule-les entre (1, 3) et (4, 7).",
    back: "Manhattan (Minkowski q = 1) : somme des écarts absolus = 3 + 4 = 7. Euclidienne (q = 2) : racine de la somme des carrés = √(9 + 16) = 5. La distance euclidienne pénalise davantage les grands écarts sur une seule variable.",
  },
  {
    id: "dm-f1-4", langue: "data-mining", niveau: "fondamentaux", type: "flip",
    front: "Pourquoi faut-il normaliser les variables avant de calculer une distance ?",
    back: "Sinon la variable de plus grande échelle domine : un écart de 1 000 € de revenu pèse mille fois plus qu'un écart d'un an d'âge. On divise chaque écart par l'étendue de la variable, ou on standardise (z-score), avant de combiner. Indispensable pour k-means et kNN.",
  },
  {
    id: "dm-f1-5", langue: "data-mining", niveau: "fondamentaux", type: "flip",
    front: "Décris l'algorithme des k-moyennes (k-means).",
    back: "1) Choisir k et tirer k centres initiaux. 2) Affecter chaque point au centre le plus proche. 3) Recalculer chaque centre comme la moyenne de ses points. 4) Répéter 2 et 3 jusqu'à ce que les groupes ne changent plus.",
    example: "8 points, k = 2, centres initiaux B et D → convergence en 3 itérations :\n{A, B, C, D} centre (1.75, 3) et {E, F, G, H} centre (5.5, 2.25)",
  },
  {
    id: "dm-f1-6", langue: "data-mining", niveau: "fondamentaux", type: "flip",
    front: "Comment fonctionne la classification par k plus proches voisins (kNN) ?",
    back: "Pour un nouveau cas, on cherche les k exemples d'apprentissage les plus proches et on lui donne la classe majoritaire parmi eux. Aucun modèle n'est construit (apprentissage « paresseux ») : tout le calcul se fait à la prédiction. On choisit k par validation croisée, souvent impair, et on normalise les variables.",
  },
  {
    id: "dm-f1-7", langue: "data-mining", niveau: "fondamentaux", type: "flip",
    front: "Que mesurent le support et la confiance d'une règle X ⇒ Y ?",
    back: "Support : part des transactions qui contiennent X et Y (la règle est-elle fréquente ?). Confiance : parmi les transactions qui contiennent X, part de celles qui contiennent aussi Y, soit P(Y | X).",
    example: "5 paniers, {couches, lait} dans 3, {couches, lait, bière} dans 2 :\nsupport = 2/5 = 0.40, confiance = 2/3 = 0.67",
  },
  {
    id: "dm-i1-1", langue: "data-mining", niveau: "intermediaire", type: "flip",
    front: "Correspondance simple vs Jaccard pour des variables binaires : quand utiliser lequel ?",
    back: "Correspondance simple (b + c) / (a + b + c + d) : variables symétriques, où 0 et 1 ont la même importance (sexe). Jaccard (b + c) / (a + b + c) : variables asymétriques, où seule la présence est informative (un test positif) ; on ignore d, les absences communes, qui ne rapprochent pas deux individus.",
  },
  {
    id: "dm-i1-2", langue: "data-mining", niveau: "intermediaire", type: "code",
    front: "Calcule la distance de Jaccard entre Jack et Mary (1 = positif).",
    code: "       fièvre toux t1 t2 t3 t4\nJack     1     0   1  0  0  0\nMary     1     0   1  0  1  0",
    back: "a = 2 (fièvre, t1 : 1 chez les deux), b = 0 (1 chez Jack seulement), c = 1 (t3 : 1 chez Mary seulement).\nd = (b + c) / (a + b + c) = 1 / 3 = 0.33.\nLes 3 variables à 0 chez les deux sont ignorées.",
  },
  {
    id: "dm-i1-3", langue: "data-mining", niveau: "intermediaire", type: "flip",
    front: "Quelles sont les principales limites de k-means ?",
    back: "Il faut fixer k à l'avance ; le résultat dépend des centres initiaux (relancer plusieurs fois, k-means++) ; la moyenne est sensible aux valeurs aberrantes (k-médoïdes est plus robuste) ; il ne trouve que des groupes convexes, « ronds » ; il ne traite que des variables numériques (k-modes pour le catégoriel).",
  },
  {
    id: "dm-i1-4", langue: "data-mining", niveau: "intermediaire", type: "flip",
    front: "Comment choisir le nombre de groupes k ?",
    back: "Tracer l'inertie intra-groupe en fonction de k et chercher le « coude » où le gain diminue nettement ; maximiser le coefficient de silhouette (cohésion interne vs séparation des autres groupes) ; et confronter au besoin métier (5 segments exploitables valent mieux que 12). La classification hiérarchique permet aussi de choisir en coupant le dendrogramme.",
  },
  {
    id: "dm-i1-5", langue: "data-mining", niveau: "intermediaire", type: "flip",
    front: "Single link, complete link, average link : comment mesure-t-on la distance entre deux groupes ?",
    back: "Single link : la plus petite distance entre deux points des groupes (groupes allongés, effet de chaîne). Complete link : la plus grande distance (groupes compacts). Average link : la moyenne de toutes les paires (compromis). Ward : la hausse d'inertie causée par la fusion (groupes de taille comparable).",
  },
  {
    id: "dm-i1-6", langue: "data-mining", niveau: "intermediaire", type: "qcm",
    front: "Des points GPS forment des groupes en forme de croissant, avec quelques points isolés. Quelle méthode convient le mieux ?",
    choices: ["k-means", "Un clustering par densité comme DBSCAN", "Une classification hiérarchique en single link sans précaution", "Un arbre de décision"],
    answer: 1,
    explain: "DBSCAN regroupe les points denses de proche en proche : il trouve des groupes de forme quelconque, n'exige pas k et classe les points isolés comme du bruit. k-means ne trouve que des groupes ronds et rattache chaque point aberrant à un groupe.",
  },
  {
    id: "dm-i1-7", langue: "data-mining", niveau: "intermediaire", type: "flip",
    front: "Calcule l'entropie d'un ensemble de 9 « oui » et 5 « non ». Que vaut-elle pour un groupe pur ? pour un groupe moitié-moitié ?",
    back: "Entropie = −(9/14)·log₂(9/14) − (5/14)·log₂(5/14) = 0.940. Groupe pur : 0. Groupe moitié-moitié (2 classes) : 1, le maximum. L'arbre cherche les divisions qui font baisser l'entropie.",
  },
  {
    id: "dm-i1-8", langue: "data-mining", niveau: "intermediaire", type: "code",
    front: "Calcule le gain d'information de la variable « ciel » (9 oui / 5 non au total).",
    code: "ciel     oui non\nsoleil    2   3\ncouvert   4   0\npluie     3   2",
    back: "Entropies : soleil 0.971, couvert 0, pluie 0.971.\nE(ciel) = 5/14 × 0.971 + 4/14 × 0 + 5/14 × 0.971 = 0.694.\nGain = 0.940 − 0.694 = 0.247, le plus élevé des quatre variables (humidité 0.152, vent 0.048, température 0.029) : « ciel » devient la racine.",
  },
  {
    id: "dm-i1-9", langue: "data-mining", niveau: "intermediaire", type: "flip",
    front: "Qu'est-ce que l'indice de Gini dans un arbre de décision ?",
    back: "Une mesure d'impureté utilisée par CART : Gini(S) = 1 − Σ pᵢ², 0 pour un groupe pur, 0.5 au maximum pour deux classes équilibrées. Pour une division, on pondère le Gini de chaque sous-groupe par sa taille, et on choisit la division qui le minimise.",
    example: "Revenu <80K : 14 non-fraude / 9 fraude → 0.476 ; >80K : 1 / 18 → 0.100\nGini pondéré = 23/42 × 0.476 + 19/42 × 0.100 = 0.31",
  },
  {
    id: "dm-i1-10", langue: "data-mining", niveau: "intermediaire", type: "flip",
    front: "Quelle hypothèse fait le classifieur bayésien naïf, et pourquoi ?",
    back: "Les variables sont indépendantes sachant la classe : P(x₁, …, xₖ | C) = P(x₁ | C) × … × P(xₖ | C). Estimer la loi jointe de toutes les variables serait impossible avec des données limitées ; avec l'hypothèse, chaque terme est une simple fréquence. Elle est souvent fausse, mais le classement reste bon en pratique.",
  },
  {
    id: "dm-i1-11", langue: "data-mining", niveau: "intermediaire", type: "flip",
    front: "Pourquoi un perceptron seul ne peut-il pas apprendre le OU exclusif (XOR) ?",
    back: "Un perceptron calcule une somme pondérée suivie d'un seuil : sa frontière de décision est une droite (un hyperplan). Les points de XOR, (0,1) et (1,0) d'un côté, (0,0) et (1,1) de l'autre, ne sont pas séparables par une droite. Le perceptron multicouche, avec une couche cachée, y parvient.",
  },
  {
    id: "dm-a1-1", langue: "data-mining", niveau: "avance", type: "code",
    front: "Classe X = (pluie, chaud, humidité haute, vent faible) avec le Bayes naïf.",
    code: "P(oui)=9/14  P(pluie|oui)=3/9  P(chaud|oui)=2/9  P(haute|oui)=3/9  P(faible|oui)=6/9\nP(non)=5/14  P(pluie|non)=2/5  P(chaud|non)=2/5  P(haute|non)=4/5  P(faible|non)=2/5",
    back: "oui : 3/9 × 2/9 × 3/9 × 6/9 × 9/14 = 0.010582\nnon : 2/5 × 2/5 × 4/5 × 2/5 × 5/14 = 0.018286\nLe score « non » est le plus élevé : classe prédite NON. (On compare P(X|C)·P(C) ; P(X) est commun aux deux classes.)",
  },
  {
    id: "dm-a1-2", langue: "data-mining", niveau: "avance", type: "flip",
    front: "Pourquoi une seule probabilité nulle pose-t-elle problème dans le Bayes naïf, et comment le corriger ?",
    back: "Si une valeur n'apparaît jamais dans une classe (P(couvert | non) = 0), le produit vaut 0 pour cette classe, quelles que soient toutes les autres variables. Le lissage de Laplace ajoute 1 à chaque comptage (et le nombre de valeurs possibles au dénominateur), pour qu'aucune probabilité ne soit nulle.",
  },
  {
    id: "dm-a1-3", langue: "data-mining", niveau: "avance", type: "flip",
    front: "Pourquoi le gain d'information favorise-t-il les variables à nombreuses valeurs, et comment corriger ?",
    back: "Une variable avec une valeur différente par ligne (un identifiant client) découpe les données en groupes d'un seul exemple, tous purs : gain maximal, mais aucune généralisation. C4.5 utilise le ratio de gain (gain divisé par l'entropie de la division elle-même), qui pénalise les divisions en beaucoup de petits groupes.",
  },
  {
    id: "dm-a1-4", langue: "data-mining", niveau: "avance", type: "flip",
    front: "Pré-élagage vs post-élagage d'un arbre de décision ?",
    back: "Pré-élagage : on arrête la croissance tôt (profondeur maximale, nombre minimal d'exemples par feuille, gain minimal). Simple, mais risque d'arrêter avant une division utile. Post-élagage : on laisse l'arbre pousser puis on supprime les branches qui n'améliorent pas l'erreur sur des données de validation. Les deux combattent le sur-apprentissage.",
  },
  {
    id: "dm-a1-5", langue: "data-mining", niveau: "avance", type: "flip",
    front: "Qu'est-ce que le principe d'Apriori et pourquoi rend-il la recherche possible ?",
    back: "Anti-monotonie : tout sous-ensemble d'un itemset fréquent est fréquent, donc tout sur-ensemble d'un itemset rare est rare. Apriori génère les candidats de taille k+1 uniquement à partir des itemsets fréquents de taille k et élimine les autres sans les compter. Sans cela, il faudrait examiner 2^n combinaisons de n articles.",
  },
  {
    id: "dm-a1-6", langue: "data-mining", niveau: "avance", type: "qcm",
    front: "90 % des clients achètent du pain. La règle « confiture ⇒ pain » a une confiance de 90 %. Qu'en conclure ?",
    choices: [
      "C'est une association forte entre confiture et pain",
      "Rien d'intéressant : le lift vaut 0.90 / 0.90 = 1, la confiture ne change pas la probabilité d'acheter du pain",
      "Il faut placer la confiture à côté du pain",
      "La règle est fausse",
    ],
    answer: 1,
    explain: "La confiance seule est trompeuse quand Y est très fréquent. Lift = confiance / P(Y) : 1 = indépendance, > 1 = association positive, < 1 = association négative. Et même un lift élevé ne prouve pas une causalité.",
  },
  {
    id: "dm-p1-1", langue: "data-mining", niveau: "pro", type: "flip",
    front: "Comment mener une segmentation de clientèle de bout en bout ?",
    back: "1) Choisir des variables pertinentes (récence, fréquence, montant, catégories achetées). 2) Traiter les valeurs aberrantes et normaliser. 3) Lancer k-means pour plusieurs k (avec k-means++, plusieurs initialisations). 4) Choisir k avec le coude, la silhouette et le sens métier. 5) Décrire chaque segment (moyennes, taille), lui donner un nom et une action. 6) Vérifier la stabilité dans le temps.",
  },
  {
    id: "dm-p1-2", langue: "data-mining", niveau: "pro", type: "flip",
    front: "Le cours présente Apriori, Clementine et WEKA 3.2. Qu'utiliserait-on aujourd'hui ?",
    back: "scikit-learn en Python (KMeans, DBSCAN, DecisionTreeClassifier, KNeighborsClassifier, naive_bayes), Spark MLlib sur de gros volumes, avec FP-Growth plutôt qu'Apriori pour les règles d'association (pas de génération de candidats). Côté plateformes : KNIME, Dataiku, IBM SPSS Modeler (l'héritier de Clementine), SAS Viya. Et des ensembles d'arbres (forêts, gradient boosting) plutôt qu'un arbre seul.",
  },
];
