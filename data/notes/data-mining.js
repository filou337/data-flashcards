// Note de cours générée par le skill /notes-de-cours à partir de docs_divers/Cours-Data-Mining.pdf
export const note = {
  id: "data-mining",
  titre: "Data Mining : clustering, classification, règles d'association",
  source: "Introduction au Data Mining · Laboratoire d'Informatique, Université du Littoral Côte d'Opale · 325 diapositives",
  deck: "data-mining",
  resume: "Les grandes familles d'algorithmes de fouille de données, avec les calculs du cours refaits pas à pas : **distances**, **k-means**, classification hiérarchique et par densité, **kNN**, **arbres de décision** (entropie, gain d'information, Gini), **Bayes naïf**, réseaux de neurones et **règles d'association** (Apriori).\n\nLa validation des modèles (train/test, sur-apprentissage, métriques) est déjà dans le deck Régression : la note y renvoie. Les outils présentés dans le cours (Clementine, MineSet…) ont disparu ; les équivalents actuels sont indiqués.",
  prerequis: ["regression", "stats"],
  concepts: [
    "KDD", "data mining", "induction", "classification", "clustering", "segmentation", "règles d'association", "recherche de séquences", "détection de déviations",
    "distance", "Minkowski", "euclidienne", "Manhattan", "normalisation", "correspondance simple", "Jaccard", "variable binaire asymétrique", "données mixtes",
    "k-means", "centroïde", "choix de k", "classification hiérarchique", "dendrogramme", "single link", "complete link", "average link", "DBSCAN", "point dense", "bruit",
    "kNN", "plus proches voisins", "apprentissage paresseux", "arbre de décision", "ID3", "C4.5", "CART", "entropie", "gain d'information", "indice de Gini", "élagage", "règles SI-ALORS",
    "Bayes naïf", "probabilité a posteriori", "indépendance conditionnelle", "lissage de Laplace", "perceptron", "perceptron multicouche", "rétropropagation",
    "support", "confiance", "lift", "itemset fréquent", "Apriori", "anti-monotonie", "algorithme génétique", "WEKA",
  ],
  chapitres: [
    {
      id: "kdd",
      titre: "1. Le processus de découverte de connaissances",
      objectif: "Situer le data mining dans un projet et connaître ses grandes tâches.",
      blocs: [
        { type: "definition", terme: "Data mining", contenu: "L'extraction, à partir de grandes quantités de données, de connaissances **nouvelles, valides, compréhensibles et utiles** (motifs, règles, modèles). C'est une démarche d'**induction** : on généralise à partir d'exemples observés." },
        { type: "schema", svg: `<svg viewBox="0 0 360 254" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Processus KDD">
  <defs><marker id="fl-dm-kdd" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="s-arrow"/></marker></defs>
  <rect x="6" y="6" width="348" height="32" rx="6" class="s-box"/><text x="16" y="27" class="s-bold">1. Sélection</text><text x="344" y="27" text-anchor="end" class="s-sub">quelles données, quelle cible</text>
  <rect x="6" y="52" width="348" height="32" rx="6" class="s-box"/><text x="16" y="73" class="s-bold">2. Nettoyage</text><text x="344" y="73" text-anchor="end" class="s-sub">doublons, manquants, erreurs</text>
  <rect x="6" y="98" width="348" height="32" rx="6" class="s-box"/><text x="16" y="119" class="s-bold">3. Transformation</text><text x="344" y="119" text-anchor="end" class="s-sub">variables, normalisation</text>
  <rect x="6" y="144" width="348" height="32" rx="6" class="s-acc"/><text x="16" y="165" class="s-bold">4. Data mining</text><text x="344" y="165" text-anchor="end" class="s-sub">algorithme → motifs, modèle</text>
  <rect x="6" y="190" width="348" height="32" rx="6" class="s-ok"/><text x="16" y="211" class="s-bold">5. Évaluation</text><text x="344" y="211" text-anchor="end" class="s-sub">validité, intérêt, usage</text>
  <path d="M180 39V48" class="s-line" marker-end="url(#fl-dm-kdd)"/>
  <path d="M180 85V94" class="s-line" marker-end="url(#fl-dm-kdd)"/>
  <path d="M180 131V140" class="s-line" marker-end="url(#fl-dm-kdd)"/>
  <path d="M180 177V186" class="s-line" marker-end="url(#fl-dm-kdd)"/>
  <text x="180" y="244" text-anchor="middle" class="s-sub">On revient souvent en arrière : c'est un processus itératif</text>
</svg>`, legende: "Le data mining proprement dit n'est qu'une étape du processus KDD (Knowledge Discovery in Databases) ; la préparation en représente souvent l'essentiel du temps." },
        { type: "tableau", entetes: ["Tâche", "Question", "Exemple", "Méthodes"], lignes: [
          ["**Classification** (supervisée)", "À quelle classe connue appartient ce cas ?", "Accorder un crédit : oui / non", "Arbres, kNN, Bayes, réseaux de neurones"],
          ["**Clustering** (non supervisé)", "Quels groupes naturels existent ?", "Segmenter la clientèle", "k-means, hiérarchique, densité"],
          ["**Règles d'association**", "Qu'est-ce qui va ensemble ?", "Panier : couches ⇒ bière", "Apriori"],
          ["**Séquences**", "Qu'est-ce qui suit quoi ?", "Achat d'un téléphone puis d'une coque dans le mois", "Motifs séquentiels"],
          ["**Détection de déviations**", "Qu'est-ce qui sort de l'ordinaire ?", "Fraude à la carte bancaire", "Écarts au modèle, densité"],
        ] },
        { type: "renvoi", vers: "regression", contenu: "Supervisé vs non supervisé, train/test, sur-apprentissage, validation croisée, matrice de confusion : deck Régression & modélisation. Les étapes d'une analyse et la qualité des données : deck Analyse de données." },
      ],
    },
    {
      id: "distances",
      titre: "2. Mesurer la ressemblance : les distances",
      objectif: "Choisir une distance adaptée au type de chaque variable.",
      blocs: [
        { type: "texte", contenu: "Clustering et kNN reposent sur une **distance** : d(x, y) ≥ 0, d(x, y) = 0 si x = y, symétrique, et inégalité triangulaire d(x, z) ≤ d(x, y) + d(y, z)." },
        { type: "formule", contenu: "Minkowski : d(x, y) = ( Σ |xᵢ − yᵢ|^q )^(1/q)", explication: "q = 1 : distance de **Manhattan** (somme des écarts, « en suivant les rues ») ; q = 2 : distance **euclidienne** (à vol d'oiseau). Exemple : x = (1, 3), y = (4, 7) → Manhattan = 3 + 4 = 7, euclidienne = √(9 + 16) = 5." },
        { type: "attention", contenu: "Sans **normalisation**, la variable de plus grande échelle écrase les autres : un écart de 1 000 € de revenu pèse mille fois plus qu'un écart d'un an d'âge. On divise chaque écart par l'étendue de la variable (ou on standardise) avant de combiner." },
        { type: "texte", contenu: "Pour des variables **binaires**, on compte les accords et désaccords entre deux individus i et j : a = nombre de variables à 1 chez les deux, b = 1 chez i seulement, c = 1 chez j seulement, d = 0 chez les deux." },
        { type: "tableau", entetes: ["Coefficient", "Distance", "Quand"], lignes: [
          ["Correspondance simple", "(b + c) / (a + b + c + d)", "Variables **symétriques** (sexe : 0 et 1 ont la même importance)"],
          ["Jaccard", "(b + c) / (a + b + c)", "Variables **asymétriques** (un test positif est informatif, deux tests négatifs ne le sont pas) : on ignore d"],
        ] },
        { type: "exemple", titre: "Distance de Jaccard entre patients (exemple du cours)", contenu: "Six variables asymétriques (fièvre, toux, tests 1 à 4), positif = 1 :", code: `       fièvre toux t1 t2 t3 t4
Jack     1     0   1  0  0  0
Mary     1     0   1  0  1  0
Jim      1     1   0  0  0  0`, resultat: "d(Jack, Mary) = (0 + 1) / (2 + 0 + 1) = 0.33\nd(Jack, Jim)  = (1 + 1) / (1 + 1 + 1) = 0.67\nd(Jim, Mary)  = (1 + 2) / (1 + 1 + 2) = 0.75\n→ Jack et Mary sont les plus proches." },
        { type: "exemple", titre: "Données mixtes (exemple du cours)", contenu: "(âge, propriétaire 0/1, mensualités) : x = (30, 1, 1000), y = (40, 0, 2200), z = (45, 1, 4000). Écarts numériques divisés par l'étendue (âge : 15, mensualités : 3 000), écart binaire 0 ou 1, puis distance euclidienne :", resultat: "d(x, y) = √((10/15)² + 1² + (1200/3000)²) = 1.27\nd(x, z) = √((15/15)² + 0² + (3000/3000)²) = 1.41\nd(y, z) = √((5/15)² + 1² + (1800/3000)²) = 1.21\n→ le plus proche voisin de x est y." },
        { type: "texte", contenu: "Pour une variable **catégorielle** à plusieurs valeurs (couleur, ville), la distance vaut 0 si les valeurs sont égales, 1 sinon ; sur p variables : (p − nombre d'accords) / p." },
      ],
    },
    {
      id: "clustering",
      titre: "3. Clustering : k-means, hiérarchique, densité",
      objectif: "Dérouler k-means à la main et choisir la bonne famille de méthode.",
      blocs: [
        { type: "texte", contenu: "Un bon clustering a une forte similarité **à l'intérieur** des groupes et une faible similarité **entre** les groupes. Il n'y a pas de « bonne réponse » connue : la qualité dépend de la distance choisie et de l'usage." },
        { type: "liste", ordonnee: true, items: [
          "Choisir k et tirer k centres initiaux.",
          "Affecter chaque point au centre le plus proche.",
          "Recalculer chaque centre comme la **moyenne** (centroïde) de ses points.",
          "Recommencer les étapes 2 et 3 jusqu'à ce que les groupes ne changent plus.",
        ] },
        { type: "exemple", titre: "k-means sur 8 points, k = 2, centres initiaux B et D", code: `A(1,3) B(2,2) C(2,3) D(2,4) E(4,2) F(5,2) G(6,2) H(7,3)

it. 1 : {A,B,C,E,F,G,H} | {D}        centres (3.86, 2.43) et (2, 4)
it. 2 : {B,E,F,G,H} | {A,C,D}        centres (4.8, 2.2) et (1.67, 3.33)
it. 3 : {E,F,G,H} | {A,B,C,D}        centres (5.5, 2.25) et (1.75, 3)
it. 4 : aucun changement → convergence` },
        { type: "schema", svg: `<svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Résultat du k-means sur 8 points">
  <path d="M30 170H350M30 170V10" class="s-line"/>
  <text x="340" y="190" class="s-sub">x</text><text x="14" y="20" class="s-sub">y</text>
  <rect x="58" y="28" width="96" height="112" rx="40" class="s-acc"/>
  <rect x="172" y="60" width="176" height="96" rx="40" class="s-ok"/>
  <circle cx="72" cy="80" r="6" class="s-box"/><text x="72" y="70" text-anchor="middle" class="s-sub">A</text>
  <circle cx="112" cy="120" r="6" class="s-box"/><text x="124" y="124" class="s-sub">B</text>
  <circle cx="112" cy="80" r="6" class="s-box"/><text x="124" y="84" class="s-sub">C</text>
  <circle cx="112" cy="40" r="6" class="s-box"/><text x="124" y="44" class="s-sub">D</text>
  <circle cx="192" cy="120" r="6" class="s-box"/><text x="192" y="140" text-anchor="middle" class="s-sub">E</text>
  <circle cx="232" cy="120" r="6" class="s-box"/><text x="232" y="140" text-anchor="middle" class="s-sub">F</text>
  <circle cx="272" cy="120" r="6" class="s-box"/><text x="272" y="140" text-anchor="middle" class="s-sub">G</text>
  <circle cx="312" cy="80" r="6" class="s-box"/><text x="326" y="84" class="s-sub">H</text>
  <text x="100" y="186" text-anchor="middle" class="s-sub">centre (1.75, 3)</text>
  <text x="266" y="186" text-anchor="middle" class="s-sub">centre (5.5, 2.25)</text>
</svg>`, legende: "Après convergence : deux groupes nets, {A, B, C, D} à gauche et {E, F, G, H} à droite." },
        { type: "tableau", entetes: ["k-means", ""], lignes: [
          ["Avantages", "Simple, rapide (linéaire en nombre de points), passe à l'échelle (MLlib, scikit-learn)"],
          ["Inconvénients", "Il faut fixer k ; résultat dépendant des centres initiaux ; sensible aux valeurs aberrantes (la moyenne) ; ne trouve que des groupes « ronds » ; variables numériques seulement"],
          ["Variantes", "k-médoïdes (le centre est un vrai point : robuste aux outliers), k-modes (variables catégorielles), k-means++ (meilleure initialisation)"],
        ] },
        { type: "attention", contenu: "Précision (au-delà du cours) : pour choisir k, on trace l'inertie intra-groupe en fonction de k et on cherche le « coude », ou on maximise le **coefficient de silhouette**. Et on relance k-means plusieurs fois avec des initialisations différentes (k-means++)." },
        { type: "texte", contenu: "La classification **hiérarchique ascendante** part de groupes d'un seul point et fusionne à chaque étape les deux groupes les plus proches. On obtient un **dendrogramme**, qu'on coupe à la hauteur voulue : pas besoin de fixer k à l'avance." },
        { type: "tableau", entetes: ["Distance entre deux groupes", "Définition", "Effet"], lignes: [
          ["Single link", "La plus petite distance entre deux points des groupes", "Groupes allongés, « effet de chaîne »"],
          ["Complete link", "La plus grande distance", "Groupes compacts"],
          ["Average link", "La distance moyenne entre toutes les paires", "Compromis"],
          ["Centroïde (ou Ward)", "Distance entre centres (Ward : hausse d'inertie)", "Groupes de taille comparable"],
        ] },
        { type: "definition", terme: "Clustering par densité (DBSCAN)", contenu: "Un point est **dense** s'il a au moins e* voisins dans un rayon d*. Les points denses proches s'enchaînent en un même groupe, les points non denses rattachés sont des points de **bordure**, et les points isolés sont du **bruit**. Il trouve des groupes de forme quelconque, n'exige pas k et isole les valeurs aberrantes." },
        { type: "application", titre: "Segmentation de clientèle", contenu: "On normalise récence, fréquence et montant, on lance k-means pour plusieurs k, on choisit k avec la silhouette et le bon sens métier (5 segments exploitables par le marketing valent mieux que 12), puis on décrit chaque segment par ses moyennes." },
        { type: "renvoi", vers: "analyse", contenu: "La segmentation RFM « à la main » (quintiles) est dans le deck Analyse de données." },
      ],
    },
    {
      id: "knn",
      titre: "4. Classification par plus proches voisins (kNN)",
      objectif: "Comprendre la méthode la plus simple de classification.",
      blocs: [
        { type: "texte", contenu: "Pour classer un nouveau cas, on cherche les **k exemples les plus proches** dans les données d'apprentissage, et on lui attribue la classe **majoritaire** parmi eux (éventuellement pondérée par l'inverse de la distance)." },
        { type: "exemple", titre: "Classer un client avec k = 3", contenu: "Les 3 clients les plus proches (après normalisation) ont résilié, résilié, et sont restés.", resultat: "Vote : 2 « résilie » contre 1 « reste » → classe prédite « résilie »." },
        { type: "liste", items: [
          "**Apprentissage paresseux** : aucun modèle n'est construit ; tout le calcul se fait au moment de la prédiction (coûteux sur de gros volumes).",
          "k petit : sensible au bruit ; k grand : frontières trop lissées. On choisit k par validation croisée, souvent impair pour éviter les égalités.",
          "Indispensable : **normaliser** les variables, sinon la distance est dominée par la plus grande échelle.",
          "Se dégrade quand le nombre de variables augmente (en grande dimension, tous les points deviennent presque à la même distance).",
        ] },
      ],
    },
    {
      id: "arbres",
      titre: "5. Arbres de décision",
      objectif: "Calculer entropie, gain d'information et Gini pour choisir une division.",
      blocs: [
        { type: "texte", contenu: "Un arbre pose une suite de questions sur les variables (« ciel ? », « humidité > 75 % ? ») jusqu'à une feuille qui donne la classe. On le construit de haut en bas : à chaque nœud, on choisit la variable qui sépare **le mieux** les classes, c'est-à-dire qui produit les sous-groupes les plus **purs**." },
        { type: "formule", contenu: "Entropie(S) = − p₊·log₂(p₊) − p₋·log₂(p₋)", explication: "p₊ et p₋ = proportions d'exemples positifs et négatifs. L'entropie vaut 0 pour un groupe pur (une seule classe) et 1 pour un groupe moitié-moitié. Exemple du cours, « jouer au tennis » : 9 oui et 5 non → Entropie = −(9/14)·log₂(9/14) − (5/14)·log₂(5/14) = 0.940." },
        { type: "formule", contenu: "Gain(S, A) = Entropie(S) − Σᵥ (|Sᵥ| / |S|) · Entropie(Sᵥ)", explication: "La baisse d'entropie obtenue en découpant S selon les valeurs de la variable A. On choisit la variable au plus grand gain." },
        { type: "exemple", titre: "Quelle première question pour « jouer au tennis » ?", code: `Ciel     oui non  entropie
soleil    2   3    0.971
couvert   4   0    0
pluie     3   2    0.971

E(ciel) = 5/14 × 0.971 + 4/14 × 0 + 5/14 × 0.971 = 0.694
Gain(ciel) = 0.940 − 0.694 = 0.247`, resultat: "Gain(ciel) = 0.247   Gain(humidité) = 0.152   Gain(vent) = 0.048   Gain(température) = 0.029\n→ la racine de l'arbre est « ciel ». « Couvert » est déjà pur (toujours oui) : c'est une feuille." },
        { type: "schema", svg: `<svg viewBox="0 0 360 214" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Arbre de décision jouer au tennis">
  <rect x="130" y="6" width="100" height="32" rx="8" class="s-acc"/><text x="180" y="27" text-anchor="middle" class="s-bold">Ciel ?</text>
  <path d="M150 38L64 80M180 38V80M210 38L296 80" class="s-line"/>
  <text x="96" y="58" text-anchor="end" class="s-sub">soleil</text><text x="186" y="64" class="s-sub">couvert</text><text x="266" y="58" class="s-sub">pluie</text>
  <rect x="14" y="80" width="100" height="32" rx="8" class="s-box"/><text x="64" y="101" text-anchor="middle" class="s-txt">Humidité ?</text>
  <rect x="140" y="80" width="80" height="32" rx="8" class="s-ok"/><text x="180" y="101" text-anchor="middle" class="s-bold">OUI</text>
  <rect x="246" y="80" width="100" height="32" rx="8" class="s-box"/><text x="296" y="101" text-anchor="middle" class="s-txt">Vent ?</text>
  <path d="M44 112L24 154M84 112L104 154M276 112L256 154M316 112L336 154" class="s-line"/>
  <text x="28" y="134" text-anchor="end" class="s-sub">haute</text><text x="100" y="134" class="s-sub">normale</text>
  <text x="236" y="138" text-anchor="end" class="s-sub">fort</text><text x="332" y="134" class="s-sub">faible</text>
  <rect x="2" y="154" width="54" height="30" rx="8" class="s-warn"/><text x="29" y="174" text-anchor="middle" class="s-bold">NON</text>
  <rect x="78" y="154" width="54" height="30" rx="8" class="s-ok"/><text x="105" y="174" text-anchor="middle" class="s-bold">OUI</text>
  <rect x="228" y="154" width="54" height="30" rx="8" class="s-warn"/><text x="255" y="174" text-anchor="middle" class="s-bold">NON</text>
  <rect x="304" y="154" width="54" height="30" rx="8" class="s-ok"/><text x="331" y="174" text-anchor="middle" class="s-bold">OUI</text>
  <text x="180" y="206" text-anchor="middle" class="s-sub">règle : SI ciel = soleil ET humidité = haute ALORS non</text>
</svg>`, legende: "L'arbre obtenu par ID3 sur les 14 exemples ; chaque chemin de la racine à une feuille donne une règle SI… ALORS." },
        { type: "formule", contenu: "Gini(S) = 1 − Σ pᵢ²        Gini(S₁, S₂) = (n₁/n)·Gini(S₁) + (n₂/n)·Gini(S₂)", explication: "Autre mesure d'impureté (algorithme CART) : 0 pour un groupe pur, 0.5 au maximum pour deux classes équilibrées. On choisit la division qui **minimise** le Gini pondéré." },
        { type: "exemple", titre: "Détection de fraude : quelle division ? (exemple du cours)", code: `Revenu    pas fraude  fraude          Situation  pas fraude  fraude
< 80 K        14         9            M             5          23
> 80 K         1        18            F            10           4`, resultat: "Gini(revenu)    = 23/42 × 0.476 + 19/42 × 0.100 = 0.31\nGini(situation) = 28/42 × 0.293 + 14/42 × 0.408 = 0.33 (le cours indique 0.34)\n→ on divise d'abord sur le revenu (Gini le plus bas)." },
        { type: "attention", contenu: "Un arbre qu'on laisse pousser jusqu'à des feuilles pures **apprend le bruit** (sur-apprentissage) : parfait sur l'apprentissage, mauvais sur de nouveaux cas. On limite la profondeur ou le nombre minimal d'exemples par feuille (pré-élagage), ou on fait pousser l'arbre puis on coupe les branches qui n'améliorent pas l'erreur de validation (post-élagage)." },
        { type: "attention", contenu: "Le gain d'information favorise les variables à **nombreuses valeurs** (un identifiant client sépare parfaitement… et ne généralise rien). C4.5 corrige avec le *ratio de gain*." },
        { type: "tableau", entetes: ["Arbres de décision", ""], lignes: [
          ["Avantages", "Lisibles et traduisibles en règles, peu de préparation (pas de normalisation), variables numériques et catégorielles, rapides"],
          ["Inconvénients", "Instables (quelques données en plus changent l'arbre), frontières en escalier, sur-apprentissage"],
          ["Aujourd'hui", "On les combine : forêts aléatoires et gradient boosting (XGBoost, LightGBM) sont des ensembles d'arbres"],
        ] },
        { type: "renvoi", vers: "regression", contenu: "Forêts et gradient boosting comparés à la régression, importance des variables et SHAP : deck Régression & modélisation." },
      ],
    },
    {
      id: "bayes",
      titre: "6. Classification bayésienne naïve",
      objectif: "Classer un cas à la main avec le théorème de Bayes.",
      blocs: [
        { type: "formule", contenu: "P(C | X) = P(X | C) · P(C) / P(X)", explication: "On attribue au cas X la classe C de plus grande probabilité a posteriori. P(X) est la même pour toutes les classes : il suffit de comparer P(X | C)·P(C)." },
        { type: "definition", terme: "Hypothèse naïve", contenu: "Les variables sont supposées **indépendantes** sachant la classe : P(x₁, …, xₖ | C) = P(x₁ | C) × … × P(xₖ | C). Chaque terme s'estime simplement par une fréquence dans les données d'apprentissage." },
        { type: "exemple", titre: "Jouer au tennis si (pluie, chaud, humidité haute, vent faible) ?", code: `P(oui) = 9/14                    P(non) = 5/14
P(pluie|oui) = 3/9                P(pluie|non) = 2/5
P(chaud|oui) = 2/9                P(chaud|non) = 2/5
P(haute|oui) = 3/9                P(haute|non) = 4/5
P(faible|oui) = 6/9               P(faible|non) = 2/5`, resultat: "oui : 3/9 × 2/9 × 3/9 × 6/9 × 9/14 = 0.010582\nnon : 2/5 × 2/5 × 4/5 × 2/5 × 5/14 = 0.018286\n→ classe prédite : NON." },
        { type: "attention", contenu: "Si une valeur n'apparaît jamais dans une classe (P(couvert | non) = 0), tout le produit vaut 0, quelles que soient les autres variables. Précision : on applique le **lissage de Laplace**, en ajoutant 1 à chaque comptage." },
        { type: "application", titre: "Où on l'utilise", contenu: "Filtrage du spam et classement de textes : très rapide, efficace avec beaucoup de variables (les mots), et étonnamment performant même quand l'hypothèse d'indépendance est fausse." },
      ],
    },
    {
      id: "neurones",
      titre: "7. Réseaux de neurones",
      objectif: "Les bases : perceptron, couches cachées, rétropropagation.",
      blocs: [
        { type: "formule", contenu: "sortie = f( Σ wᵢ·xᵢ + b )", explication: "Un **neurone** (perceptron) fait une somme pondérée de ses entrées plus un biais, puis applique une fonction d'activation f (seuil, sigmoïde, aujourd'hui souvent ReLU). Exemple : x = (1, 0), w = (0.6, 0.4), b = −0.5 → 0.6 − 0.5 = 0.1 > 0 → sortie 1." },
        { type: "texte", contenu: "Un perceptron seul ne sépare que des classes **linéairement séparables** (il ne sait pas faire le OU exclusif). Le **perceptron multicouche** (PMC) ajoute des couches cachées entre l'entrée et la sortie, ce qui permet d'apprendre des frontières non linéaires." },
        { type: "definition", terme: "Rétropropagation du gradient", contenu: "On présente un exemple, on calcule la sortie, on mesure l'erreur par rapport à la valeur attendue, puis on propage cette erreur de la sortie vers l'entrée pour ajuster chaque poids dans le sens qui la diminue (descente de gradient). On répète sur tous les exemples, pendant plusieurs passes (époques)." },
        { type: "tableau", entetes: ["Réseaux de neurones", ""], lignes: [
          ["Avantages", "Très bonne précision, robustes au bruit, capables d'apprendre des relations complexes"],
          ["Inconvénients", "Apprentissage long, beaucoup de réglages (architecture, taux d'apprentissage), modèle opaque (« boîte noire »), besoin de beaucoup de données"],
        ] },
        { type: "renvoi", vers: "note:transformers", contenu: "Les architectures modernes (attention, Transformers, LLM) prolongent ces idées : voir la note « Comprendre les Transformers »." },
      ],
    },
    {
      id: "association",
      titre: "8. Règles d'association et Apriori",
      objectif: "Calculer support, confiance et lift, et comprendre l'astuce d'Apriori.",
      blocs: [
        { type: "texte", contenu: "Une règle **X ⇒ Y** (« qui achète X achète aussi Y ») se mesure avec :" },
        { type: "tableau", entetes: ["Mesure", "Formule", "Lecture"], lignes: [
          ["**Support**", "P(X et Y) = transactions contenant X et Y / total", "La règle est-elle fréquente ?"],
          ["**Confiance**", "P(Y | X) = support(X ∪ Y) / support(X)", "Quand X est présent, Y l'est-il souvent ?"],
          ["**Lift**", "confiance / P(Y)", "> 1 : X augmente la probabilité de Y ; = 1 : indépendance ; < 1 : X la diminue"],
        ] },
        { type: "exemple", titre: "Couches et lait ⇒ bière ? (exemple du cours)", code: `T1  pain, lait
T2  bière, couches, pain, œufs
T3  bière, coca, couches, lait
T4  bière, pain, couches, lait
T5  coca, pain, couches, lait`, resultat: "support({couches, lait, bière}) = 2/5 = 0.40\nconfiance = 2 / 3 = 0.67 (3 transactions contiennent couches et lait)\nlift = 0.67 / P(bière) = 0.67 / 0.60 = 1.11 (précision : non calculé dans le cours)\n→ légère association positive." },
        { type: "attention", contenu: "Une confiance élevée ne suffit pas : si 90 % des clients achètent du pain, toute règle « X ⇒ pain » aura une confiance d'environ 90 % sans rien révéler. Le **lift** corrige ce biais. Et une association n'est pas une causalité." },
        { type: "texte", contenu: "Le problème est combinatoire : avec 1 000 articles, il y a 2¹⁰⁰⁰ ensembles possibles. **Apriori** procède en deux temps : 1) trouver les **itemsets fréquents** (support ≥ seuil minimal), 2) en déduire les règles dont la confiance dépasse le seuil." },
        { type: "definition", terme: "Principe d'Apriori (anti-monotonie)", contenu: "Tout sous-ensemble d'un itemset fréquent est fréquent ; donc si {A, B} n'est pas fréquent, aucun ensemble qui contient {A, B} ne peut l'être. On construit les candidats de taille k+1 uniquement à partir des itemsets fréquents de taille k, et on élague tous les autres sans les compter." },
        { type: "exemple", titre: "Le déroulé d'Apriori, support minimal = 50 %", code: `Transactions : {A,B,C} {A,C} {A,D} {B,E,F}
1-itemsets : A 75 %  B 50 %  C 50 %  D 25 %  E 25 %  F 25 %   → garder A, B, C
2-itemsets candidats : {A,B} 25 %  {A,C} 50 %  {B,C} 25 %        → garder {A,C}
3-itemsets : aucun candidat (il faudrait deux paires fréquentes)
Règles : A ⇒ C  confiance 50 % / 75 % = 67 %    C ⇒ A  confiance 50 % / 50 % = 100 %` },
        { type: "tableau", entetes: ["Seuil", "Trop haut", "Trop bas"], lignes: [
          ["Support minimal (souvent 2 à 10 %)", "Peu de règles, seulement les évidences", "Explosion du nombre de règles, règles rares et fragiles"],
          ["Confiance minimale (souvent 70 à 90 %)", "Peu de règles, presque toutes vraies", "Beaucoup de règles incertaines"],
        ] },
        { type: "application", titre: "Usages", contenu: "Analyse de paniers (placement en rayon, « souvent achetés ensemble »), recommandations simples, et dans le cours, l'analyse de l'expression de gènes (quels gènes s'activent ensemble). Précision : en Spark, FP-Growth (MLlib) remplace Apriori sur de gros volumes, car il ne génère pas de candidats." },
      ],
    },
    {
      id: "outils",
      titre: "9. Méthodes complémentaires et outils",
      objectif: "Ce qui a changé depuis le cours.",
      blocs: [
        { type: "texte", contenu: "Le cours présente aussi les **algorithmes génétiques** pour découvrir des règles : une population de règles candidates évolue par sélection (selon une mesure d'intérêt, la *fitness*), croisement et mutation, jusqu'à obtenir des règles intéressantes. Utile quand l'espace de recherche est trop grand pour une énumération." },
        { type: "tableau", entetes: ["Dans le cours", "Aujourd'hui"], lignes: [
          ["WEKA 3.2 (interface Explorer)", "WEKA existe toujours (enseignement) ; en pratique : scikit-learn (Python), Spark MLlib (gros volumes)"],
          ["Clementine, Intelligent Miner, MineSet, Alice", "Disparus ou absorbés : IBM SPSS Modeler, KNIME, Dataiku, SAS Viya"],
          ["SAS Enterprise Miner", "SAS Viya"],
          ["Arbres de décision seuls", "Ensembles d'arbres (forêts aléatoires, gradient boosting)"],
        ] },
        { type: "exemple", titre: "Les mêmes algorithmes en scikit-learn", code: `from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.naive_bayes import CategoricalNB

arbre = DecisionTreeClassifier(criterion="entropy", max_depth=3).fit(X_train, y_train)
print(export_text(arbre, feature_names=list(X_train.columns)))   # l'arbre sous forme de règles
segments = KMeans(n_clusters=4, n_init=10, random_state=0).fit_predict(X_normalise)` },
      ],
    },
  ],
  synthese: [
    { svg: `<svg viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Data mining en une image : trois familles de tâches">
  <defs><marker id="fl-syn-data-mining" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="s-arrow"/></marker></defs>
  <rect x="6" y="8" width="348" height="32" rx="6" class="s-box"/><text x="16" y="29" class="s-bold">Données</text><text x="344" y="28" text-anchor="end" class="s-sub">sélection, nettoyage</text><path d="M180 41V50" class="s-line" marker-end="url(#fl-syn-data-mining)"/><rect x="6" y="54" width="348" height="32" rx="6" class="s-box"/><text x="16" y="75" class="s-bold">Transformation</text><text x="344" y="74" text-anchor="end" class="s-sub">normaliser, encoder</text><path d="M180 87V96H62V108" class="s-line" marker-end="url(#fl-syn-data-mining)"/><rect x="6" y="112" width="112" height="42" rx="8" class="s-acc"/><text x="62" y="129.5" text-anchor="middle" class="s-bold">Clustering</text><text x="62" y="144.5" text-anchor="middle" class="s-sub">sans étiquette</text><rect x="6" y="162" width="112" height="62" rx="8" class="s-box"/><text x="62" y="182" text-anchor="middle" class="s-sub">k-means</text><text x="62" y="197" text-anchor="middle" class="s-sub">CAH</text><text x="62" y="212" text-anchor="middle" class="s-sub">DBSCAN</text><rect x="6" y="232" width="112" height="30" rx="8" class="s-ok"/><text x="62" y="251" text-anchor="middle" class="s-txt">distance</text><path d="M180 87V96H180V108" class="s-line" marker-end="url(#fl-syn-data-mining)"/><rect x="124" y="112" width="112" height="42" rx="8" class="s-acc"/><text x="180" y="129.5" text-anchor="middle" class="s-bold">Classer</text><text x="180" y="144.5" text-anchor="middle" class="s-sub">avec étiquette</text><rect x="124" y="162" width="112" height="62" rx="8" class="s-box"/><text x="180" y="182" text-anchor="middle" class="s-sub">kNN, Bayes</text><text x="180" y="197" text-anchor="middle" class="s-sub">arbre : Gini</text><text x="180" y="212" text-anchor="middle" class="s-sub">réseau</text><rect x="124" y="232" width="112" height="30" rx="8" class="s-ok"/><text x="180" y="251" text-anchor="middle" class="s-txt">confusion</text><path d="M180 87V96H298V108" class="s-line" marker-end="url(#fl-syn-data-mining)"/><rect x="242" y="112" width="112" height="42" rx="8" class="s-acc"/><text x="298" y="129.5" text-anchor="middle" class="s-bold">Associations</text><text x="298" y="144.5" text-anchor="middle" class="s-sub">paniers</text><rect x="242" y="162" width="112" height="62" rx="8" class="s-box"/><text x="298" y="182" text-anchor="middle" class="s-sub">Apriori</text><text x="298" y="197" text-anchor="middle" class="s-sub">itemsets</text><text x="298" y="212" text-anchor="middle" class="s-sub">règles A ⇒ B</text><rect x="242" y="232" width="112" height="30" rx="8" class="s-ok"/><text x="298" y="251" text-anchor="middle" class="s-txt">support, lift</text><text x="180" y="290" text-anchor="middle" class="s-sub">Évaluer, puis itérer : c'est le processus KDD</text>
</svg>`,
      legende: "Trois familles de tâches, leurs algorithmes phares et ce qui sert à les juger." },
  ],
  aRetenir: [
    "Le data mining est une étape du processus KDD (sélection, nettoyage, transformation, fouille, évaluation), qui est itératif.",
    "Toujours normaliser avant une distance ; Jaccard pour des variables binaires asymétriques, correspondance simple pour des symétriques.",
    "k-means : affecter au centre le plus proche, recalculer les moyennes, répéter. Il faut choisir k (coude, silhouette) et relancer plusieurs fois.",
    "Hiérarchique = dendrogramme sans k fixé ; DBSCAN = groupes de forme libre et détection du bruit.",
    "kNN : vote des k voisins les plus proches ; pas de modèle, prédiction coûteuse, normalisation indispensable.",
    "Arbres : choisir la division au plus grand gain d'information (ou au plus petit Gini) ; élaguer contre le sur-apprentissage.",
    "Bayes naïf : produit des probabilités conditionnelles × probabilité de la classe ; lissage de Laplace contre les zéros.",
    "Règles d'association : support, confiance et surtout lift ; Apriori élague grâce à l'anti-monotonie des itemsets fréquents.",
  ],
};
