export const cardsStats = [
  // ======================================================================
  // ---- Fondamentaux : statistique descriptive & distributions ----
  // ======================================================================
  {
    id: "stats-f1-1", langue: "stats", niveau: "fondamentaux", type: "flip",
    front: "Population vs échantillon, paramètre vs statistique : quelle différence ?",
    back: "Population = l'ensemble qu'on veut décrire (tous les clients). Échantillon = la partie qu'on observe réellement.\n\nParamètre = valeur vraie de la population (μ, σ, p), en général inconnue. Statistique = valeur calculée sur l'échantillon (x̄, s, p̂), qui sert à estimer le paramètre.\n\nToute l'inférence consiste à dire quelque chose sur le paramètre à partir de la statistique, en quantifiant l'incertitude."
  },
  {
    id: "stats-f1-2", langue: "stats", niveau: "fondamentaux", type: "qcm",
    front: "Salaires d'une entreprise : moyenne 4 800 €, médiane 2 900 €. Que peut-on en déduire ?",
    choices: [
      "La distribution est symétrique",
      "La distribution est asymétrique à droite : quelques très hauts salaires tirent la moyenne vers le haut",
      "La distribution est asymétrique à gauche",
      "Il y a forcément une erreur de calcul"
    ],
    answer: 1,
    explain: "Moyenne > médiane ⇒ queue à droite (skew positif). La moyenne est sensible aux valeurs extrêmes, la médiane non. Pour des revenus, prix, durées : rapporter la médiane (et les quartiles), pas seulement la moyenne."
  },
  {
    id: "stats-f1-3", langue: "stats", niveau: "fondamentaux", type: "flip",
    front: "Écart-type (σ, s) vs erreur standard (SE) : quelle différence ?",
    back: "Écart-type = dispersion des DONNÉES individuelles autour de la moyenne. Il ne diminue pas quand n augmente.\n\nErreur standard de la moyenne = SE = s / √n = dispersion de l'ESTIMATION de la moyenne si on refaisait l'échantillonnage. Elle diminue quand n augmente.\n\nPiège classique : présenter des barres d'erreur sans dire si c'est ±s, ±SE ou un IC 95 % — ce n'est pas du tout la même chose."
  },
  {
    id: "stats-f1-4", langue: "stats", niveau: "fondamentaux", type: "flip",
    front: "Loi normale : règle 68-95-99,7 ?",
    back: "Pour une variable normale de moyenne μ et d'écart-type σ :\n• ~68 % des valeurs dans μ ± 1σ\n• ~95 % dans μ ± 2σ (exactement ±1,96σ)\n• ~99,7 % dans μ ± 3σ\n\nD'où le 1,96 des IC à 95 %, et la règle « au-delà de 3σ = suspect » pour repérer des anomalies."
  },
  {
    id: "stats-f1-5", langue: "stats", niveau: "fondamentaux", type: "flip",
    front: "Que dit le théorème central limite (TCL) et pourquoi est-il si important ?",
    back: "Quelle que soit la distribution des données (pourvu que la variance soit finie), la distribution de la MOYENNE d'un échantillon tend vers une loi normale quand n grandit, de moyenne μ et d'écart-type σ/√n.\n\nConséquence : on peut faire des IC et des t-tests sur des moyennes même si les données brutes ne sont pas normales, dès que n est assez grand (souvent n ≥ 30, davantage si la distribution est très asymétrique ou à queues lourdes)."
  },
  {
    id: "stats-f1-6", langue: "stats", niveau: "fondamentaux", type: "flip",
    front: "Qu'est-ce qu'un z-score et à quoi sert-il ?",
    back: "z = (x − moyenne) / écart-type : nombre d'écarts-types entre une valeur et la moyenne.\n\nUsages : comparer des grandeurs d'échelles différentes (une note sur 20 vs un score sur 100), standardiser des variables avant un modèle, repérer des valeurs aberrantes (|z| > 3). Attention : la moyenne et l'écart-type sont eux-mêmes tirés par les outliers, d'où l'intérêt de la méthode IQR sur des données asymétriques."
  },
  {
    id: "stats-f1-7", langue: "stats", niveau: "fondamentaux", type: "flip",
    front: "Comment détecter des valeurs aberrantes avec la règle de l'IQR (boxplot) ?",
    back: "IQR = Q3 − Q1 (intervalle interquartile, 50 % centraux).\nOutlier si x < Q1 − 1,5·IQR ou x > Q3 + 1,5·IQR.\n\nRobuste car basé sur les quartiles, pas sur la moyenne. Un outlier n'est pas forcément une erreur : il faut enquêter (bug de saisie ? vrai client exceptionnel ?) avant de supprimer quoi que ce soit."
  },
  {
    id: "stats-f1-8", langue: "stats", niveau: "fondamentaux", type: "qcm",
    front: "Les ventes de glaces et les noyades sont fortement corrélées (r = 0,8). Quelle conclusion est correcte ?",
    choices: [
      "Manger des glaces augmente le risque de noyade",
      "Les noyades font vendre des glaces",
      "Une variable confondante (la chaleur) influence probablement les deux ; la corrélation ne prouve aucun lien causal",
      "r = 0,8 prouve la causalité car il dépasse 0,7"
    ],
    answer: 2,
    explain: "Corrélation ≠ causalité. Trois explications possibles à une corrélation : causalité (A→B ou B→A), variable confondante commune, ou hasard. Seule une expérience randomisée (A/B test) ou une méthode causale rigoureuse permet de conclure à un effet."
  },
  {
    id: "stats-f1-9", langue: "stats", niveau: "fondamentaux", type: "flip",
    front: "Corrélation de Pearson vs Spearman : quand utiliser laquelle ?",
    back: "Pearson (r) : mesure une relation LINÉAIRE entre deux variables quantitatives. Sensible aux outliers.\n\nSpearman (ρ) : corrélation de Pearson calculée sur les RANGS. Mesure une relation MONOTONE (qui monte toujours, même non linéaire), robuste aux outliers, utilisable sur des données ordinales.\n\nr ≈ 0 ne veut pas dire « aucune relation » : une relation en U donne r ≈ 0. Toujours tracer le nuage de points."
  },
  {
    id: "stats-f1-10", langue: "stats", niveau: "fondamentaux", type: "flip",
    front: "Quels sont les types de variables et pourquoi ça compte pour choisir un test ?",
    back: "• Quantitative continue (prix, durée) → moyennes, t-test, ANOVA, corrélation.\n• Quantitative discrète (nb d'achats) → souvent traitée comme continue si beaucoup de valeurs, sinon Poisson.\n• Qualitative nominale (pays, canal) → proportions, χ².\n• Qualitative ordinale (satisfaction 1-5) → médianes, tests sur les rangs (Mann-Whitney, Spearman).\n\nLe type de la variable mesurée est la première question à se poser avant tout test."
  },

  // ======================================================================
  // ---- Intermédiaire : logique des tests, IC, tests usuels ----
  // ======================================================================
  {
    id: "stats-i1-1", langue: "stats", niveau: "intermediaire", type: "flip",
    front: "Quelle est la logique d'un test d'hypothèse (H0, H1) ?",
    back: "1. H0 = hypothèse nulle, « pas d'effet / pas de différence ». H1 = ce qu'on cherche à montrer.\n2. On choisit un seuil α (souvent 5 %) AVANT de regarder les données.\n3. On calcule une statistique de test et sa p-value : à quel point les données seraient surprenantes SI H0 était vraie.\n4. p < α → on rejette H0. p ≥ α → on ne rejette pas H0.\n\nC'est un raisonnement par l'absurde probabiliste : on ne « prouve » jamais H1, on montre que H0 explique mal les données."
  },
  {
    id: "stats-i1-2", langue: "stats", niveau: "intermediaire", type: "qcm",
    front: "Un test donne p = 0,03. Quelle interprétation est correcte ?",
    choices: [
      "Il y a 3 % de chances que H0 soit vraie",
      "Il y a 97 % de chances que l'effet soit réel",
      "Si H0 était vraie, on aurait 3 % de chances d'observer un résultat au moins aussi extrême que celui-ci",
      "L'effet est grand et important"
    ],
    answer: 2,
    explain: "La p-value est P(données au moins aussi extrêmes | H0), pas P(H0 | données). Elle ne mesure ni la probabilité que l'effet soit réel, ni sa taille. C'est l'erreur d'interprétation la plus fréquente en entretien et en entreprise."
  },
  {
    id: "stats-i1-3", langue: "stats", niveau: "intermediaire", type: "qcm",
    front: "Un test donne p = 0,24. Que conclure ?",
    choices: [
      "H0 est vraie : il n'y a aucun effet",
      "On ne rejette pas H0 : les données ne permettent pas de détecter un effet (il peut exister mais être trop petit pour cet échantillon)",
      "L'effet est négatif",
      "Il faut baisser α à 0,30 pour que ce soit significatif"
    ],
    answer: 1,
    explain: "Absence de preuve ≠ preuve d'absence. Un test non significatif peut venir d'un manque de puissance (n trop petit). Regarder l'intervalle de confiance : s'il est large et contient des effets importants, on ne sait simplement pas. Changer α après coup = p-hacking."
  },
  {
    id: "stats-i1-4", langue: "stats", niveau: "intermediaire", type: "flip",
    front: "Erreur de type I, erreur de type II, puissance : définitions ?",
    back: "• Type I (faux positif, α) : rejeter H0 alors qu'elle est vraie. « Je vois un effet qui n'existe pas. »\n• Type II (faux négatif, β) : ne pas rejeter H0 alors qu'elle est fausse. « Je rate un vrai effet. »\n• Puissance = 1 − β : probabilité de détecter un effet qui existe vraiment. Cible usuelle : 80 %.\n\nLa puissance augmente avec n, avec la taille de l'effet, avec α, et quand la variance diminue."
  },
  {
    id: "stats-i1-5", langue: "stats", niveau: "intermediaire", type: "qcm",
    front: "IC à 95 % de l'écart de panier moyen : [+1,2 € ; +4,8 €]. Quelle phrase est correcte ?",
    choices: [
      "Il y a 95 % de chances que le vrai écart soit dans [1,2 ; 4,8]",
      "Si on répétait l'expérience de nombreuses fois, 95 % des intervalles ainsi construits contiendraient le vrai écart ; ici, l'intervalle exclut 0, donc l'écart est significatif à 5 %",
      "95 % des clients ont un écart entre 1,2 et 4,8 €",
      "L'écart vaut exactement 3 €"
    ],
    answer: 1,
    explain: "Au sens fréquentiste, le 95 % porte sur la MÉTHODE, pas sur cet intervalle précis. En pratique, l'IC est plus informatif que la p-value : il donne la taille plausible de l'effet. IC qui exclut 0 ⇔ p < 0,05 (test bilatéral)."
  },
  {
    id: "stats-i1-6", langue: "stats", niveau: "intermediaire", type: "flip",
    front: "Comment se construit un intervalle de confiance pour une moyenne ?",
    back: "IC = estimation ± valeur critique × erreur standard\n\nPour une moyenne : x̄ ± t(n−1; 0,975) × s/√n (≈ x̄ ± 1,96·s/√n si n est grand).\nPour une proportion : p̂ ± 1,96 × √(p̂(1−p̂)/n).\n\nPour diviser la largeur de l'IC par 2, il faut 4 fois plus de données (à cause du √n)."
  },
  {
    id: "stats-i1-7", langue: "stats", niveau: "intermediaire", type: "flip",
    front: "Test bilatéral vs unilatéral : quand utiliser lequel ?",
    back: "Bilatéral (H1 : μA ≠ μB) : on détecte une différence dans les deux sens. C'est le choix par défaut.\n\nUnilatéral (H1 : μA > μB) : plus puissant, mais seulement si un effet dans l'autre sens est impossible ou sans intérêt, ET si le choix est fait AVANT de voir les données.\n\nPasser en unilatéral après coup pour rendre un résultat significatif revient à diviser la p-value par 2 : c'est de la triche."
  },
  {
    id: "stats-i2-1", langue: "stats", niveau: "intermediaire", type: "flip",
    front: "Les 3 variantes du t-test : laquelle pour quelle situation ?",
    back: "• Un échantillon : comparer une moyenne à une valeur de référence (le temps de réponse moyen dépasse-t-il 200 ms ?).\n• Deux échantillons indépendants : deux groupes distincts (groupe A vs groupe B d'un A/B test).\n• Apparié : deux mesures sur les MÊMES individus (avant/après formation). On teste la moyenne des différences.\n\nTraiter des données appariées comme indépendantes fait perdre beaucoup de puissance."
  },
  {
    id: "stats-i2-2", langue: "stats", niveau: "intermediaire", type: "flip",
    front: "t-test de Student vs t-test de Welch ?",
    back: "Student suppose que les deux groupes ont la même variance. Welch ne le suppose pas (il ajuste les degrés de liberté).\n\nRecommandation actuelle : utiliser Welch par défaut. Il perd très peu quand les variances sont égales et reste valide quand elles diffèrent, surtout avec des tailles de groupes différentes. Dans scipy : ttest_ind(a, b, equal_var=False)."
  },
  {
    id: "stats-i2-3", langue: "stats", niveau: "intermediaire", type: "code",
    front: "Comparer le temps passé sur la page entre les groupes A et B. Que fait ce code, et comment interpréter le résultat t = 2,41, p = 0,016 ?",
    code: "from scipy import stats\n\nt, p = stats.ttest_ind(groupe_b, groupe_a, equal_var=False)\nprint(f\"t = {t:.2f}, p = {p:.3f}\")",
    back: "C'est un t-test de Welch bilatéral (equal_var=False) entre deux groupes indépendants.\n\nt = 2,41 > 0 → la moyenne de B est supérieure à celle de A (ordre des arguments).\np = 0,016 < 0,05 → on rejette H0 « moyennes égales » au seuil de 5 %.\n\nÀ compléter avant de conclure : la taille de l'écart (en secondes et en %), son IC, et vérifier la distribution (temps très asymétriques → regarder aussi la médiane, ou passer au log)."
  },
  {
    id: "stats-i2-4", langue: "stats", niveau: "intermediaire", type: "flip",
    front: "Quelles sont les hypothèses du t-test et comment les vérifier ?",
    back: "1. Observations indépendantes (la plus importante, garantie par le plan d'expérience : pas plusieurs lignes par utilisateur !).\n2. Normalité de la MOYENNE : vraie si les données sont normales, ou si n est grand grâce au TCL. Vérifier avec un histogramme ou un QQ-plot.\n3. Égalité des variances : inutile si on utilise Welch.\n\nSi n est petit et les données très asymétriques → test non paramétrique (Mann-Whitney) ou bootstrap."
  },
  {
    id: "stats-i2-5", langue: "stats", niveau: "intermediaire", type: "flip",
    front: "Test du χ² d'indépendance : à quoi sert-il et quelle condition vérifier ?",
    back: "Tester si deux variables QUALITATIVES sont liées, à partir d'un tableau de contingence (ex. canal d'acquisition × a converti oui/non).\n\nPrincipe : comparer les effectifs observés aux effectifs attendus si les variables étaient indépendantes.\n\nCondition : effectifs attendus ≥ 5 dans chaque case (au moins 80 % des cases). Sinon → test exact de Fisher (tableaux 2×2) ou regroupement de modalités. Le χ² dit s'il y a un lien, pas sa force : compléter par le V de Cramér."
  },
  {
    id: "stats-i2-6", langue: "stats", niveau: "intermediaire", type: "code",
    front: "Le taux de conversion dépend-il du canal ? Complète l'analyse.",
    code: "import pandas as pd\nfrom scipy import stats\n\ntable = pd.crosstab(df[\"canal\"], df[\"converti\"])\nchi2, p, ddl, attendus = stats.chi2_contingency(table)",
    back: "chi2_contingency renvoie la statistique, la p-value, les degrés de liberté et le tableau des effectifs ATTENDUS sous indépendance.\n\nÀ faire ensuite :\n1. Vérifier (attendus >= 5).all() pour valider le test.\n2. Si p < 0,05 : il y a un lien, mais lequel ? Regarder les taux par canal :\n   df.groupby(\"canal\")[\"converti\"].mean()\n   et les résidus standardisés (observé − attendu) / √attendu pour voir quelles cases contribuent.\n3. Ne pas confondre lien statistique et effet causal du canal (profils de clients différents)."
  },
  {
    id: "stats-i2-7", langue: "stats", niveau: "intermediaire", type: "flip",
    front: "ANOVA : à quoi sert-elle et pourquoi ne pas faire plusieurs t-tests ?",
    back: "L'ANOVA à un facteur teste si les moyennes de 3 groupes ou plus sont toutes égales (H0 : μ1 = μ2 = μ3…). Elle compare la variance ENTRE groupes à la variance À L'INTÉRIEUR des groupes (statistique F).\n\nFaire tous les t-tests deux à deux gonfle le risque de faux positif : avec 5 groupes = 10 comparaisons → ~40 % de chances d'au moins un faux positif à α = 5 %.\n\nSi l'ANOVA est significative, elle ne dit pas QUELS groupes diffèrent → test post-hoc (Tukey HSD)."
  },
  {
    id: "stats-i2-8", langue: "stats", niveau: "intermediaire", type: "flip",
    front: "Tests non paramétriques : quel équivalent pour chaque test classique ?",
    back: "• t-test indépendant → Mann-Whitney U (Wilcoxon rank-sum)\n• t-test apparié → Wilcoxon signé (signed-rank)\n• ANOVA → Kruskal-Wallis\n• Pearson → Spearman\n\nIls travaillent sur les rangs : robustes aux outliers et aux distributions asymétriques, utilisables sur des données ordinales. Prix à payer : un peu moins de puissance si les données sont vraiment normales, et ils ne testent pas exactement une égalité de moyennes."
  },
  {
    id: "stats-i2-9", langue: "stats", niveau: "intermediaire", type: "qcm",
    front: "Shapiro-Wilk sur 50 000 observations : p = 0,0001. Que faire ?",
    choices: [
      "Interdire tout t-test : les données ne sont pas normales",
      "Pas d'inquiétude pour un test sur des moyennes : avec un n énorme, Shapiro détecte des écarts minimes, et le TCL rend la moyenne approximativement normale",
      "Supprimer les valeurs extrêmes jusqu'à obtenir p > 0,05",
      "Refaire le test sur un sous-échantillon de 30 lignes"
    ],
    answer: 1,
    explain: "Les tests de normalité sont trop sensibles sur de gros échantillons et trop peu puissants sur de petits. Mieux vaut un QQ-plot et le bon sens. Avec n grand, la normalité des données brutes importe peu pour un test sur des moyennes ; la vraie question est l'indépendance des observations et l'influence des valeurs extrêmes."
  },
  {
    id: "stats-i2-10", langue: "stats", niveau: "intermediaire", type: "flip",
    front: "Arbre de décision rapide : quel test choisir ?",
    back: "Variable mesurée QUANTITATIVE :\n• 2 groupes indépendants → Welch t-test (sinon Mann-Whitney)\n• 2 mesures sur les mêmes individus → t apparié (sinon Wilcoxon signé)\n• 3+ groupes → ANOVA + Tukey (sinon Kruskal-Wallis)\n• Lien entre 2 quantitatives → Pearson / Spearman (ou régression)\n\nVariable mesurée QUALITATIVE :\n• Comparer 2 proportions → z-test de proportions (ou χ²)\n• Lien entre 2 qualitatives → χ² (Fisher si effectifs faibles)"
  },

  // ======================================================================
  // ---- Avancé : taille d'effet, puissance, tests multiples, A/B ----
  // ======================================================================
  {
    id: "stats-a1-1", langue: "stats", niveau: "avance", type: "qcm",
    front: "A/B test sur 2 millions d'utilisateurs : conversion 5,00 % → 5,03 %, p = 0,01. Que conclure ?",
    choices: [
      "C'est un grand succès, il faut déployer immédiatement",
      "La différence est statistiquement significative, mais son ampleur (+0,03 pt) est peut-être négligeable : il faut juger l'importance métier, pas seulement p",
      "Le test est invalide car p devrait être plus petit",
      "Il y a 99 % de chances que B soit meilleur"
    ],
    answer: 1,
    explain: "Significatif ≠ important. Avec un n énorme, des effets minuscules deviennent significatifs. Toujours rapporter la taille d'effet + son IC, et la comparer à l'effet minimum qui a du sens pour le business (coût de déploiement, maintenance)."
  },
  {
    id: "stats-a1-2", langue: "stats", niveau: "avance", type: "flip",
    front: "Qu'est-ce qu'une taille d'effet et comment lire le d de Cohen ?",
    back: "La taille d'effet mesure l'AMPLEUR d'une différence, indépendamment de n.\n\nd de Cohen = (moyenne B − moyenne A) / écart-type poolé : la différence exprimée en écarts-types.\nRepères (à prendre avec recul) : 0,2 petit, 0,5 moyen, 0,8 grand.\n\nAutres tailles d'effet : différence absolue ou relative (« +12 % de panier »), odds ratio, risque relatif, η² (ANOVA), V de Cramér (χ²). En entreprise, la différence en unités métier (€, %, secondes) est souvent la plus parlante."
  },
  {
    id: "stats-a1-3", langue: "stats", niveau: "avance", type: "flip",
    front: "Problème des tests multiples : pourquoi et comment corriger ?",
    back: "Avec k tests indépendants à α = 5 %, P(au moins un faux positif) = 1 − 0,95^k : 10 tests → 40 %, 20 tests → 64 %.\n\nCorrections :\n• Bonferroni : seuil α/k. Simple, très conservateur (contrôle le risque d'UN SEUL faux positif, FWER).\n• Holm : version séquentielle de Bonferroni, toujours au moins aussi puissante.\n• Benjamini-Hochberg : contrôle la proportion de faux positifs parmi les découvertes (FDR). Adapté quand on teste beaucoup de choses (nombreux segments, métriques, gènes).\n\nEn A/B test : définir UNE métrique principale à l'avance, le reste est exploratoire."
  },
  {
    id: "stats-a1-4", langue: "stats", niveau: "avance", type: "code",
    front: "On a testé l'effet d'une campagne sur 12 segments. Comment corriger les p-values ?",
    code: "from statsmodels.stats.multitest import multipletests\n\npvals = [0.001, 0.008, 0.039, 0.041, 0.042, 0.06,\n         0.074, 0.205, 0.212, 0.36, 0.59, 0.88]",
    back: "rejet, p_corr, _, _ = multipletests(pvals, alpha=0.05, method=\"fdr_bh\")\n\n• method=\"bonferroni\" → seuil 0,05/12 ≈ 0,0042 : seul le premier segment reste significatif.\n• method=\"holm\" → idem ici, un peu plus puissant en général.\n• method=\"fdr_bh\" (Benjamini-Hochberg) → les deux premiers restent significatifs (0,008 ≤ 2/12 × 0,05 ≈ 0,0083) ; on accepte qu'une petite fraction des « découvertes » soient fausses.\n\nSans correction, 5 segments sortaient « significatifs », dont plusieurs probablement par hasard."
  },
  {
    id: "stats-a1-5", langue: "stats", niveau: "avance", type: "flip",
    front: "Qu'est-ce que le p-hacking ? Donne des exemples concrets.",
    back: "Torturer les données jusqu'à obtenir p < 0,05, souvent sans mauvaise intention :\n• tester beaucoup de métriques / segments et ne rapporter que ceux qui « marchent » ;\n• arrêter le test dès que p passe sous 0,05 (peeking) ;\n• retirer des outliers ou changer de test après avoir vu le résultat ;\n• passer en unilatéral après coup.\n\nParade : PRÉ-ENREGISTRER le plan d'analyse (métrique principale, durée, taille d'échantillon, test, règle sur les outliers) avant de lancer l'expérience."
  },
  {
    id: "stats-a2-1", langue: "stats", niveau: "avance", type: "flip",
    front: "Comment dimensionner un A/B test (taille d'échantillon) ?",
    back: "Il faut fixer 4 choses AVANT le test :\n1. α (5 %) et puissance (80 %).\n2. Le MDE (Minimum Detectable Effect) : le plus petit effet qui vaut la peine d'être détecté.\n3. La variabilité de la métrique (taux de base p, ou écart-type σ, tirés de l'historique).\n\nRègle de Lehr (α = 5 %, puissance 80 %) : n par groupe ≈ 16·σ² / δ².\nPour une proportion : n ≈ 16·p(1−p) / δ².\nEx. p = 5 %, δ = 0,5 pt → 16 × 0,0475 / 0,000025 ≈ 30 400 par groupe.\n\nDiviser le MDE par 2 ⇒ 4 fois plus d'utilisateurs."
  },
  {
    id: "stats-a2-2", langue: "stats", niveau: "avance", type: "code",
    front: "Calculer le nombre d'utilisateurs par groupe pour détecter une hausse de conversion de 10 % à 11 %.",
    code: "from statsmodels.stats.power import NormalIndPower\nfrom statsmodels.stats.proportion import proportion_effectsize\n\neffet = proportion_effectsize(0.11, 0.10)",
    back: "n = NormalIndPower().solve_power(\n    effect_size=effet, alpha=0.05, power=0.8,\n    ratio=1, alternative=\"two-sided\")\nprint(round(n))  # ≈ 14 750 par groupe\n\nproportion_effectsize calcule le h de Cohen (transformation arcsinus). solve_power résout pour le paramètre laissé à None (ici nobs1).\n\nEnsuite : nb de jours = 2 × n / trafic quotidien éligible, arrondi à des semaines complètes pour couvrir les effets jour de semaine / week-end."
  },
  {
    id: "stats-a2-3", langue: "stats", niveau: "avance", type: "qcm",
    front: "Un analyste regarde la p-value de l'A/B test chaque matin et l'arrête dès qu'elle passe sous 0,05. Quel est le problème ?",
    choices: [
      "Aucun, c'est une bonne pratique agile",
      "Le peeking gonfle fortement le taux de faux positifs (bien au-delà de 5 %) : la p-value fluctue et finit souvent par passer sous le seuil par hasard",
      "Il faudrait regarder le soir plutôt que le matin",
      "Cela réduit seulement la puissance"
    ],
    answer: 1,
    explain: "La garantie α = 5 % ne vaut que pour UNE analyse à taille d'échantillon fixée à l'avance. Regarder tous les jours et s'arrêter au premier p < 0,05 peut porter le taux de faux positifs à 20-30 %. Solutions : fixer n et la durée à l'avance, ou utiliser des méthodes séquentielles conçues pour ça (alpha spending, tests séquentiels toujours valides)."
  },
  {
    id: "stats-a2-4", langue: "stats", niveau: "avance", type: "flip",
    front: "Qu'est-ce qu'un SRM (Sample Ratio Mismatch) et pourquoi est-ce grave ?",
    back: "On attend un split 50/50 et on observe 50 812 vs 49 188 utilisateurs. Un test χ² d'adéquation donne p très petit → le déséquilibre n'est pas dû au hasard.\n\nCauses : bug d'assignation, redirection qui perd des utilisateurs dans une variante, bots filtrés différemment, variante qui fait planter le tracking.\n\nGravité : les groupes ne sont plus comparables, le résultat est INVALIDE, quelle que soit la p-value sur la métrique. C'est le premier contrôle à faire avant de lire un A/B test."
  },
  {
    id: "stats-a2-5", langue: "stats", niveau: "avance", type: "flip",
    front: "Comparer deux taux de conversion : quel test et quelles précautions ?",
    back: "Test z de deux proportions (équivalent au χ² sur le tableau 2×2) :\nstatsmodels.stats.proportion.proportions_ztest(count=[conv_a, conv_b], nobs=[n_a, n_b])\n\nPrécautions :\n• Unité d'analyse = unité de randomisation (l'utilisateur, pas la session ni la page vue).\n• Rapporter l'écart absolu (+0,6 pt) ET relatif (+12 %), avec IC.\n• Pour une métrique ratio (CA / session, CTR par page vue), la variance naïve est fausse : utiliser la méthode delta ou le bootstrap par utilisateur."
  },
  {
    id: "stats-a3-1", langue: "stats", niveau: "avance", type: "flip",
    front: "Qu'est-ce que le bootstrap et quand l'utiliser ?",
    back: "Rééchantillonner AVEC remise les données observées (même taille n), des milliers de fois, et recalculer la statistique à chaque fois. La distribution obtenue approxime la distribution d'échantillonnage.\n\nIC percentile 95 % = quantiles 2,5 % et 97,5 % des statistiques bootstrap.\n\nUtile quand il n'y a pas de formule simple : médiane, ratio, percentile 95 des temps de réponse, écart de CA par utilisateur très asymétrique. Rééchantillonner l'unité indépendante (l'utilisateur), pas les lignes."
  },
  {
    id: "stats-a3-2", langue: "stats", niveau: "avance", type: "code",
    front: "Calculer un IC à 95 % pour l'écart de MÉDIANE de panier entre B et A par bootstrap.",
    code: "import numpy as np\n\nrng = np.random.default_rng(42)\na = np.asarray(panier_a)\nb = np.asarray(panier_b)",
    back: "ecarts = np.empty(10_000)\nfor i in range(10_000):\n    ra = rng.choice(a, size=a.size, replace=True)\n    rb = rng.choice(b, size=b.size, replace=True)\n    ecarts[i] = np.median(rb) - np.median(ra)\n\nic = np.percentile(ecarts, [2.5, 97.5])\n\nSi l'IC exclut 0 → écart de médiane significatif à ~5 %. On rééchantillonne chaque groupe séparément (groupes indépendants). Alternative prête à l'emploi : scipy.stats.bootstrap."
  },
  {
    id: "stats-a3-3", langue: "stats", niveau: "avance", type: "flip",
    front: "Qu'est-ce que le paradoxe de Simpson ? Donne un exemple.",
    back: "Une tendance présente dans chaque sous-groupe s'inverse quand on agrège les groupes.\n\nExemple : la variante B convertit mieux sur mobile ET sur desktop, mais moins bien au total, parce que B a reçu proportionnellement plus de trafic mobile (qui convertit moins partout).\n\nCause : une variable (le device) liée à la fois au groupe et au résultat, réparti de façon déséquilibrée. Leçon : toujours vérifier l'équilibre des groupes et segmenter sur les variables clés ; la randomisation protège contre ce problème si elle est bien faite."
  },
  {
    id: "stats-a3-4", langue: "stats", niveau: "avance", type: "flip",
    front: "Qu'est-ce que la régression vers la moyenne ? Pourquoi piège-t-elle les analyses avant/après ?",
    back: "Les valeurs extrêmes, en partie dues au hasard, ont tendance à être moins extrêmes à la mesure suivante.\n\nPiège : on cible les 10 % de magasins aux pires ventes ce trimestre, on lance un plan d'action, les ventes remontent le trimestre suivant… mais elles seraient remontées en partie sans rien faire.\n\nParade : un groupe contrôle tiré dans la même population (les pires magasins aussi), randomisé si possible."
  },
  {
    id: "stats-a3-5", langue: "stats", niveau: "avance", type: "flip",
    front: "Données très asymétriques (CA par client, temps de chargement) : quelles options pour comparer deux groupes ?",
    back: "1. Gros n : le t-test sur les moyennes reste valide (TCL), mais la variance est énorme → faible puissance. On peut plafonner les valeurs extrêmes (winsorisation au p99) en le décidant à l'avance.\n2. Transformer : comparer log(x) (valide si x > 0). On compare alors des moyennes géométriques ; l'écart s'interprète en %.\n3. Mann-Whitney : robuste, mais teste une « dominance » et pas les moyennes.\n4. Bootstrap sur la statistique qui intéresse vraiment le métier (moyenne, médiane, p95).\n\nLe choix dépend de la question : le business veut souvent le CA MOYEN (le total compte), pas la médiane."
  },

  // ======================================================================
  // ---- Pro : expérimentation en production, interprétation fine ----
  // ======================================================================
  {
    id: "stats-p1-1", langue: "stats", niveau: "pro", type: "flip",
    front: "Quelle checklist avant de lire le résultat d'un A/B test ?",
    back: "1. SRM : le split observé correspond-il au split prévu (χ² d'adéquation) ?\n2. Durée : le n prévu est-il atteint ? au moins une semaine complète (cycles hebdo) ?\n3. A/A ou métriques pré-période : les groupes étaient-ils équivalents avant le test ?\n4. Unité d'analyse = unité de randomisation ?\n5. Métrique principale définie à l'avance ; métriques garde-fous (guardrails) non dégradées (latence, désabonnements, erreurs) ?\n6. Effet de nouveauté : l'effet est-il stable dans le temps ou s'estompe-t-il ?\n7. Taille d'effet + IC, comparés au MDE et à l'enjeu métier."
  },
  {
    id: "stats-p1-2", langue: "stats", niveau: "pro", type: "flip",
    front: "Qu'est-ce que CUPED et pourquoi l'utiliser ?",
    back: "CUPED (Controlled-experiment Using Pre-Experiment Data) réduit la variance d'une métrique grâce à une covariable mesurée AVANT le test, typiquement la même métrique sur la période précédente.\n\nY_cuped = Y − θ·(X − moyenne(X)), avec θ = cov(X, Y) / var(X).\n\nVariance réduite d'un facteur (1 − ρ²), où ρ = corr(X, Y). Avec ρ = 0,7 → ~50 % de variance en moins ⇒ moitié moins d'utilisateurs pour la même puissance. Sans biais car X est antérieur à la randomisation, donc non affecté par le traitement."
  },
  {
    id: "stats-p1-3", langue: "stats", niveau: "pro", type: "qcm",
    front: "On randomise par MAGASIN (40 magasins) mais on analyse 200 000 tickets avec un t-test ticket par ticket. Quel est le problème ?",
    choices: [
      "Aucun, plus il y a de lignes mieux c'est",
      "Les tickets d'un même magasin sont corrélés : traiter les tickets comme indépendants sous-estime fortement la variance → p-values beaucoup trop petites, faux positifs",
      "Il faudrait utiliser un test unilatéral",
      "Le t-test ne fonctionne pas au-delà de 100 000 lignes"
    ],
    answer: 1,
    explain: "L'unité indépendante est le magasin : l'information effective est proche de 40 observations, pas 200 000. Solutions : agréger par magasin puis comparer les magasins, erreurs standard clusterisées, ou modèle mixte. Même problème quand on randomise par utilisateur mais qu'on analyse par session ou page vue."
  },
  {
    id: "stats-p1-4", langue: "stats", niveau: "pro", type: "flip",
    front: "Effet de nouveauté / effet de primauté : de quoi s'agit-il ?",
    back: "Nouveauté : les utilisateurs cliquent sur un nouveau design par curiosité ; l'effet positif s'estompe après quelques jours.\nPrimauté (change aversion) : les habitués sont perturbés par le changement ; l'effet négatif s'atténue une fois qu'ils s'adaptent.\n\nDétection : tracer l'effet par jour depuis le lancement, ou comparer nouveaux vs anciens utilisateurs (les nouveaux n'ont pas de référence).\nParade : tester assez longtemps, et juger sur l'effet stabilisé."
  },
  {
    id: "stats-p1-5", langue: "stats", niveau: "pro", type: "flip",
    front: "Approche fréquentiste vs bayésienne pour un A/B test : quelle différence pratique ?",
    back: "Fréquentiste : p-value et IC, garanties sur le taux d'erreur à long terme si on suit le protocole (n fixé, pas de peeking). Réponse : « rejette-t-on H0 ? ».\n\nBayésien : on combine un a priori avec les données pour obtenir une distribution a posteriori de l'effet. Réponses directes : « P(B > A) = 94 % », « perte attendue si je choisis B = 0,02 pt ». Plus intuitif pour décider.\n\nPièges : le résultat dépend de l'a priori, et le bayésien n'immunise pas magiquement contre le peeking. Les deux approches donnent souvent la même décision avec beaucoup de données."
  },
  {
    id: "stats-p1-6", langue: "stats", niveau: "pro", type: "code",
    front: "Un collègue présente ce résultat. Liste ce qui ne va pas dans l'analyse.",
    code: "# A/B test nouveau checkout, lancé lundi, analysé mercredi\n# Groupe A : 4 210 sessions, Groupe B : 3 690 sessions\n# Conversion par session : A = 3,1 %, B = 3,6 %\n# 15 métriques testées, 2 significatives dont celle-ci\n# p = 0,04 -> \"B augmente la conversion de 16 %, on déploie\"",
    back: "1. Durée : 3 jours, pas une semaine complète ; effet de nouveauté possible ; n prévu non mentionné (peeking ?).\n2. SRM : 4 210 vs 3 690 pour un split 50/50 → χ² p ≈ 5·10⁻⁹ : assignation ou tracking suspect, résultat invalide en l'état.\n3. Unité : conversion par SESSION alors qu'on randomise probablement par utilisateur → sessions corrélées, variance sous-estimée.\n4. Tests multiples : 15 métriques, 2 significatives à 5 % ≈ ce qu'on attend par hasard (0,75 en moyenne) ; la métrique principale n'était pas fixée à l'avance.\n5. « +16 % » sans IC : en recalculant (z-test de proportions), on trouve p ≈ 0,22 et un IC de l'écart relatif d'environ −10 % à +42 %. Le p = 0,04 annoncé n'est même pas reproductible.\n→ Corriger le SRM, relancer avec une durée et un n définis à l'avance, analyse par utilisateur."
  },
  {
    id: "stats-p1-7", langue: "stats", niveau: "pro", type: "flip",
    front: "Quand un A/B test est impossible, quelles méthodes pour estimer un effet causal ?",
    back: "• Différence de différences (DiD) : comparer l'évolution avant/après d'un groupe traité à celle d'un groupe non traité. Hypothèse clé : tendances parallèles avant le traitement.\n• Contrôle synthétique : construire un « jumeau » du groupe traité comme combinaison pondérée d'unités non traitées (ex. une région).\n• Régression sur discontinuité : exploiter un seuil arbitraire (remise si panier ≥ 50 €).\n• Appariement / score de propension : comparer des traités et non-traités aux caractéristiques similaires (ne corrige que les confondants OBSERVÉS).\n\nToutes reposent sur des hypothèses non vérifiables à 100 % : les expliciter et faire des tests de robustesse."
  },
  {
    id: "stats-p1-8", langue: "stats", niveau: "pro", type: "flip",
    front: "Comment présenter le résultat d'un test statistique à un décideur non technique ?",
    back: "Structure en 4 temps :\n1. La décision proposée en une phrase (« Déployer B »).\n2. L'effet en unités métier avec sa fourchette : « +0,6 pt de conversion (entre +0,2 et +1,0), soit ~+45 k€/mois estimés ».\n3. Le niveau de confiance en langage clair : « Très peu probable que ce soit du hasard ; le résultat est stable sur 3 semaines et sur mobile/desktop. »\n4. Les risques et garde-fous : « Aucune dégradation du temps de chargement ni des retours. »\n\nÉviter « p = 0,032 » seul, le jargon, et la fausse précision (« +12,347 % »)."
  },
];
