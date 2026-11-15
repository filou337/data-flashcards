export const cardsRegression = [
  // ======================================================================
  // ---- Fondamentaux : vocabulaire, régression linéaire simple ----
  // ======================================================================
  {
    id: "reg-f1-1", langue: "regression", niveau: "fondamentaux", type: "flip",
    front: "Régression vs classification : quelle différence ?",
    back: "Les deux sont de l'apprentissage SUPERVISÉ : on apprend à prédire une cible y à partir de variables explicatives X, sur des exemples où y est connu.\n\n• Régression : y est quantitatif continu (prix, CA, durée). Ex. régression linéaire, forêt aléatoire régresseur.\n• Classification : y est une catégorie (churn oui/non, type de client). Ex. régression logistique (malgré son nom !), arbre de décision.\n\nNon supervisé = pas de cible : clustering, réduction de dimension."
  },
  {
    id: "reg-f1-2", langue: "regression", niveau: "fondamentaux", type: "flip",
    front: "Que fait la méthode des moindres carrés ordinaires (MCO / OLS) ?",
    back: "Elle choisit la droite (ou l'hyperplan) y = β₀ + β₁x₁ + … qui MINIMISE la somme des carrés des résidus, Σ(yᵢ − ŷᵢ)².\n\nRésidu = valeur observée − valeur prédite.\n\nLe carré pénalise fortement les grosses erreurs : OLS est donc sensible aux valeurs aberrantes. Avantage : solution exacte en formule fermée, coefficients faciles à interpréter."
  },
  {
    id: "reg-f1-3", langue: "regression", niveau: "fondamentaux", type: "qcm",
    front: "Modèle : prix (k€) = 45 + 3,2 × surface (m²). Comment lire le 3,2 ?",
    choices: [
      "Un appartement coûte 3,2 k€ au m²",
      "En moyenne, chaque m² supplémentaire est associé à un prix plus élevé de 3,2 k€",
      "La surface explique 3,2 % du prix",
      "Augmenter la surface d'un appartement CAUSE une hausse de 3,2 k€"
    ],
    answer: 1,
    explain: "La pente = variation moyenne de y associée à +1 unité de x. Ce n'est pas un prix au m² (il y a l'ordonnée à l'origine 45), et ce n'est pas causal sans plan d'expérience : c'est une association observée dans les données."
  },
  {
    id: "reg-f1-4", langue: "regression", niveau: "fondamentaux", type: "flip",
    front: "Que représente l'ordonnée à l'origine (intercept β₀) ? A-t-elle toujours un sens ?",
    back: "C'est la valeur prédite de y quand TOUTES les variables explicatives valent 0.\n\nSouvent sans sens métier : un prix pour une surface de 0 m², un salaire pour un âge de 0 an. C'est un paramètre technique qui positionne la droite.\n\nAstuce : centrer les variables (x − moyenne) rend l'intercept interprétable : c'est alors la prédiction pour un individu « moyen »."
  },
  {
    id: "reg-f1-5", langue: "regression", niveau: "fondamentaux", type: "flip",
    front: "Que mesure le R² ? Quelles sont ses limites ?",
    back: "R² = part de la variance de y expliquée par le modèle, entre 0 et 1 (sur les données d'entraînement). R² = 0,65 → 65 % de la variabilité de y est « captée ».\n\nLimites :\n• Il augmente TOUJOURS quand on ajoute une variable, même inutile → R² ajusté.\n• Un R² élevé ne prouve ni que le modèle est correct, ni qu'il est causal, ni qu'il prédira bien sur de nouvelles données.\n• Un R² faible n'est pas forcément un échec : en sciences humaines ou marketing, 0,2 peut être utile si les coefficients sont fiables."
  },
  {
    id: "reg-f1-6", langue: "regression", niveau: "fondamentaux", type: "flip",
    front: "MAE, RMSE, MAPE : comment choisir une métrique d'erreur pour une régression ?",
    back: "• MAE = moyenne des |erreurs|. Dans l'unité de y, robuste aux outliers. « On se trompe de 12 k€ en moyenne. »\n• RMSE = √(moyenne des erreurs²). Pénalise davantage les grosses erreurs. RMSE ≥ MAE ; un grand écart entre les deux signale quelques erreurs énormes.\n• MAPE = moyenne des |erreur / y| en %. Parlant pour le métier, mais explose quand y est proche de 0 et pénalise asymétriquement.\n\nChoisir selon le coût réel des erreurs : une grosse erreur coûte-t-elle plus que plusieurs petites ?"
  },
  {
    id: "reg-f1-7", langue: "regression", niveau: "fondamentaux", type: "flip",
    front: "Pourquoi séparer les données en jeu d'entraînement et jeu de test ?",
    back: "Un modèle évalué sur les données qui ont servi à l'entraîner paraît toujours meilleur qu'il n'est : il a pu « apprendre par cœur ».\n\nOn garde de côté un jeu de test (souvent 20-30 %) jamais vu pendant l'entraînement ni pendant les choix de modèle, pour estimer la performance sur de NOUVELLES données.\n\nPour des données temporelles : le test doit être POSTÉRIEUR à l'entraînement (pas de mélange aléatoire), sinon on prédit le passé avec le futur."
  },
  {
    id: "reg-f1-8", langue: "regression", niveau: "fondamentaux", type: "qcm",
    front: "Erreur d'entraînement très faible, erreur de test très élevée. Diagnostic ?",
    choices: [
      "Sous-apprentissage : le modèle est trop simple",
      "Surapprentissage : le modèle colle au bruit des données d'entraînement et généralise mal",
      "Le modèle est parfait",
      "Le jeu de test est trop grand"
    ],
    answer: 1,
    explain: "Overfitting. Remèdes : plus de données, modèle plus simple, moins de variables, régularisation (Ridge/Lasso), profondeur limitée pour les arbres, validation croisée. À l'inverse, erreurs élevées sur train ET test = sous-apprentissage (underfitting) : modèle trop simple ou variables peu informatives."
  },
  {
    id: "reg-f1-9", langue: "regression", niveau: "fondamentaux", type: "flip",
    front: "Pourquoi faut-il toujours comparer un modèle à une baseline ?",
    back: "Une métrique seule ne veut rien dire : « RMSE = 850 € », est-ce bien ?\n\nBaselines naïves :\n• Régression : prédire toujours la moyenne (ou la médiane) → R² = 0 par définition.\n• Série temporelle : prédire la valeur de la semaine dernière / de l'an dernier à la même date.\n• Classification : prédire toujours la classe majoritaire.\n\nSi le modèle ne bat pas nettement la baseline, il n'apporte rien, quelle que soit sa sophistication."
  },
  {
    id: "reg-f1-10", langue: "regression", niveau: "fondamentaux", type: "flip",
    front: "Pourquoi est-il dangereux d'extrapoler avec une régression ?",
    back: "Le modèle n'est valide que dans la plage des données observées. Entraîné sur des surfaces de 20 à 120 m², il ne dit rien de fiable sur un château de 800 m² : la relation peut devenir non linéaire, saturer, changer de régime.\n\nMême chose dans le temps : une tendance linéaire du CA sur 2 ans ne garantit rien pour les 5 années suivantes. Toujours vérifier que les cas à prédire ressemblent aux données d'entraînement."
  },

  // ======================================================================
  // ---- Intermédiaire : régression multiple, hypothèses, diagnostics ----
  // ======================================================================
  {
    id: "reg-i1-1", langue: "regression", niveau: "intermediaire", type: "flip",
    front: "Régression multiple : comment interpréter un coefficient ?",
    back: "βⱼ = variation moyenne de y associée à +1 unité de xⱼ, LES AUTRES VARIABLES DU MODÈLE ÉTANT MAINTENUES CONSTANTES (« toutes choses égales par ailleurs »).\n\nConséquence : le coefficient d'une variable change selon les autres variables incluses. Le prix associé au nombre de chambres peut être NÉGATIF à surface égale (plus de chambres = chambres plus petites), alors qu'il est positif seul.\n\nOn ne peut comparer les coefficients entre eux que si les variables sont sur la même échelle (standardisées)."
  },
  {
    id: "reg-i1-2", langue: "regression", niveau: "intermediaire", type: "flip",
    front: "Comment inclure une variable catégorielle (ex. ville : Paris, Lyon, Lille) dans une régression linéaire ?",
    back: "Encodage one-hot (variables indicatrices 0/1), en retirant UNE modalité qui sert de référence : si on garde les 3 indicatrices + l'intercept, elles sont parfaitement colinéaires (piège des variables muettes, dummy trap).\n\nAvec Lille en référence : coef de « Paris » = +85 k€ → à caractéristiques égales, un bien à Paris coûte en moyenne 85 k€ de plus qu'à Lille.\n\npd.get_dummies(df, columns=[\"ville\"], drop_first=True)\nNe jamais coder les villes en 1, 2, 3 : cela impose un ordre et un écart constant absurdes."
  },
  {
    id: "reg-i1-3", langue: "regression", niveau: "intermediaire", type: "flip",
    front: "Quelles sont les hypothèses de la régression linéaire (OLS) ?",
    back: "Moyen mnémotechnique LINE :\n• L — Linéarité : la relation entre X et y est linéaire (dans les paramètres).\n• I — Indépendance des erreurs (attention aux séries temporelles et aux données groupées).\n• N — Normalité des résidus : surtout utile pour les tests et IC sur petits échantillons.\n• E — Égalité des variances (homoscédasticité) : la dispersion des résidus est constante.\n\nPlus : pas de multicolinéarité parfaite, et surtout pas de variable confondante omise si on veut interpréter les coefficients causalement.\n\nPour la PRÉDICTION pure, seule la performance sur test compte vraiment ; pour l'INTERPRÉTATION et l'inférence, les hypothèses comptent."
  },
  {
    id: "reg-i1-4", langue: "regression", niveau: "intermediaire", type: "qcm",
    front: "Le graphe résidus vs valeurs prédites montre un « entonnoir » : les résidus s'écartent de plus en plus quand ŷ augmente. Que se passe-t-il ?",
    choices: [
      "Tout va bien, c'est le comportement attendu",
      "Hétéroscédasticité : la variance des erreurs n'est pas constante ; les coefficients restent sans biais mais les erreurs standard et p-values sont fausses",
      "Multicolinéarité entre les variables",
      "Le modèle est en sous-apprentissage"
    ],
    answer: 1,
    explain: "Très fréquent sur les prix, revenus, CA (erreurs proportionnelles au niveau). Remèdes : modéliser log(y), ou garder le modèle mais utiliser des erreurs standard robustes (HC3 dans statsmodels : fit(cov_type=\"HC3\")). Un résidu en forme de courbe (U) signalerait plutôt une non-linéarité."
  },
  {
    id: "reg-i1-5", langue: "regression", niveau: "intermediaire", type: "flip",
    front: "Qu'est-ce que la multicolinéarité, comment la détecter et est-ce grave ?",
    back: "Des variables explicatives fortement corrélées entre elles (surface et nombre de pièces).\n\nEffets : coefficients instables (changent beaucoup d'un échantillon à l'autre, voire de signe), erreurs standard gonflées → variables individuellement non significatives alors que le modèle est bon globalement.\n\nDétection : matrice de corrélation, VIF (Variance Inflation Factor) ; VIF > 5-10 = problème.\n\nGravité : sans impact sur la qualité des PRÉDICTIONS, mais rend l'INTERPRÉTATION des coefficients peu fiable. Remèdes : retirer ou combiner des variables, Ridge, ACP."
  },
  {
    id: "reg-i1-6", langue: "regression", niveau: "intermediaire", type: "flip",
    front: "R² vs R² ajusté : quelle différence ?",
    back: "Le R² augmente mécaniquement à chaque variable ajoutée, même du bruit pur.\n\nLe R² ajusté pénalise le nombre de variables p : R²adj = 1 − (1 − R²)·(n − 1)/(n − p − 1). Il ne monte que si la variable ajoutée améliore le modèle plus que ce que le hasard ferait.\n\nPour comparer des modèles en vue de PRÉDIRE, mieux vaut encore l'erreur en validation croisée ou des critères comme l'AIC / le BIC."
  },
  {
    id: "reg-i2-1", langue: "regression", niveau: "intermediaire", type: "code",
    front: "Lis cet extrait de résumé statsmodels (prix d'appartements en k€). Que conclure sur chaque variable ?",
    code: "                 coef   std err      t   P>|t|   [0.025   0.975]\nconst          38.20     9.10   4.20   0.000    20.3     56.1\nsurface         3.05     0.15  20.33   0.000     2.76     3.34\nage_immeuble   -0.31     0.29  -1.07   0.285    -0.88     0.26\nparking        14.80     4.20   3.52   0.000     6.54    23.06\n\nR-squared: 0.712   Adj. R-squared: 0.710   No. Observations: 412",
    back: "• surface : +3,05 k€ par m², à âge et parking égaux. Très significatif (t = 20), IC étroit [2,76 ; 3,34].\n• age_immeuble : −0,31 k€ par année, mais p = 0,29 et l'IC contient 0 → pas d'effet détectable dans ces données (≠ « aucun effet »).\n• parking : +14,8 k€ en moyenne pour un bien avec parking, à surface et âge égaux. Significatif, mais IC large [6,5 ; 23,1].\n• R² = 0,71 : 71 % de la variance des prix expliquée ; R² ajusté proche → pas de variable superflue qui gonfle artificiellement.\n\nt = coef / std err ; IC ≈ coef ± 1,97 × std err."
  },
  {
    id: "reg-i2-2", langue: "regression", niveau: "intermediaire", type: "code",
    front: "Ajuster une régression linéaire avec statsmodels en utilisant une formule. Complète.",
    code: "import statsmodels.formula.api as smf\n\n# df : prix, surface, ville, parking\nmodele = ...",
    back: "modele = smf.ols(\"prix ~ surface + C(ville) + parking\", data=df).fit()\nprint(modele.summary())\n\n• C(ville) encode automatiquement la variable catégorielle en indicatrices (la première modalité par ordre alphabétique sert de référence).\n• L'intercept est ajouté automatiquement (contrairement à sm.OLS, qui demande sm.add_constant).\n• Erreurs robustes à l'hétéroscédasticité : .fit(cov_type=\"HC3\").\n• Prédire : modele.predict(nouveau_df) ; intervalles : modele.get_prediction(nouveau_df).summary_frame()."
  },
  {
    id: "reg-i2-3", langue: "regression", niveau: "intermediaire", type: "flip",
    front: "Interpréter un coefficient quand y et/ou x sont en logarithme ?",
    back: "• log(y) = … + β·x (log-linéaire) : +1 unité de x ⇒ y multiplié par e^β, soit ≈ +100·β % si β est petit. Ex. β = 0,05 → ≈ +5 % (exactement +5,1 %).\n• y = … + β·log(x) (linéaire-log) : +1 % de x ⇒ y augmente de ≈ β/100 unités.\n• log(y) = … + β·log(x) (log-log) : +1 % de x ⇒ ≈ +β % de y. β est une ÉLASTICITÉ. Ex. élasticité prix de −1,8 → +1 % de prix ⇒ −1,8 % de volume.\n\nLe log est utile pour des variables positives et asymétriques (prix, revenus) et pour stabiliser la variance."
  },
  {
    id: "reg-i2-4", langue: "regression", niveau: "intermediaire", type: "flip",
    front: "Qu'est-ce qu'un terme d'interaction et comment l'interpréter ?",
    back: "Il permet à l'effet d'une variable de dépendre d'une autre.\n\nprix ~ surface + paris + surface:paris\n\n• coef surface = prix par m² HORS Paris (paris = 0).\n• coef surface:paris = supplément de prix par m² À Paris.\n→ Pente à Paris = coef surface + coef surface:paris.\n\nAvec une interaction, on ne peut plus lire les effets principaux isolément. En formule statsmodels, surface * paris = surface + paris + surface:paris."
  },
  {
    id: "reg-i2-5", langue: "regression", niveau: "intermediaire", type: "flip",
    front: "Outlier, point de levier, point influent : quelle différence ?",
    back: "• Outlier : y très éloigné de la prédiction (gros résidu).\n• Point de levier : x très atypique (un appartement de 400 m² au milieu de studios). Il PEUT tirer la droite.\n• Point influent : un point qui, si on le retire, change sensiblement les coefficients. Typiquement un fort levier ET un gros résidu.\n\nMesure : distance de Cook (repère courant : > 4/n à examiner). On enquête (erreur de saisie ? autre population ?) avant toute suppression, et on rapporte le résultat avec et sans."
  },
  {
    id: "reg-i2-6", langue: "regression", niveau: "intermediaire", type: "flip",
    front: "Intervalle de confiance vs intervalle de prédiction ?",
    back: "Pour une surface de 60 m² :\n• IC de la MOYENNE : où se situe le prix moyen de tous les appartements de 60 m² ? Étroit, se resserre quand n augmente.\n• Intervalle de PRÉDICTION : où se situera le prix d'UN appartement précis de 60 m² ? Bien plus large, car il ajoute la variabilité individuelle (le résidu), qui ne disparaît jamais même avec n infini.\n\nPour annoncer une fourchette sur un cas individuel (estimer UN bien), c'est l'intervalle de prédiction qu'il faut donner."
  },

  // ======================================================================
  // ---- Avancé : logistique, classification, validation, régularisation ----
  // ======================================================================
  {
    id: "reg-a1-1", langue: "regression", niveau: "avance", type: "flip",
    front: "Régression logistique : comment ça marche ?",
    back: "Pour une cible binaire (churn 0/1). On modélise le LOG-ODDS (logit) comme une combinaison linéaire :\nlog(p / (1 − p)) = β₀ + β₁x₁ + …\npuis p = 1 / (1 + e^−(β₀ + β₁x₁ + …)) (fonction sigmoïde), toujours entre 0 et 1.\n\nEstimée par maximum de vraisemblance, pas par moindres carrés. Sortie = une PROBABILITÉ ; la classe s'obtient en choisissant un seuil (0,5 par défaut, rarement optimal)."
  },
  {
    id: "reg-a1-2", langue: "regression", niveau: "avance", type: "qcm",
    front: "Régression logistique du churn : coefficient de « nb_appels_support » = 0,40. Interprétation ?",
    choices: [
      "Chaque appel augmente la probabilité de churn de 40 points",
      "Chaque appel augmente la probabilité de churn de 0,40 %",
      "Chaque appel supplémentaire multiplie les odds (cote) de churn par e^0,40 ≈ 1,49, soit +49 %, toutes choses égales par ailleurs",
      "40 % des clients qui appellent partent"
    ],
    answer: 2,
    explain: "Les coefficients sont sur l'échelle du log-odds : exp(β) = odds ratio. L'effet sur la PROBABILITÉ n'est pas constant : il dépend du niveau de départ (passer de 2 % à 3 % ou de 50 % à 60 % peut correspondre au même odds ratio). Pour communiquer en probabilités : effets marginaux (get_margeff dans statsmodels) ou prédictions sur des profils types."
  },
  {
    id: "reg-a1-3", langue: "regression", niveau: "avance", type: "flip",
    front: "Matrice de confusion : précision, rappel, F1 ?",
    back: "VP = vrais positifs, FP = faux positifs, FN = faux négatifs, VN = vrais négatifs.\n\n• Précision = VP / (VP + FP) : parmi ceux que je signale, combien sont vraiment positifs ? (qualité des alertes)\n• Rappel (sensibilité) = VP / (VP + FN) : parmi les vrais positifs, combien j'en détecte ? (couverture)\n• F1 = moyenne harmonique de la précision et du rappel.\n• Accuracy = (VP + VN) / total : trompeuse si les classes sont déséquilibrées.\n\nFraude, maladie grave → privilégier le rappel. Filtre anti-spam, campagne coûteuse → privilégier la précision."
  },
  {
    id: "reg-a1-4", langue: "regression", niveau: "avance", type: "qcm",
    front: "Détection de fraude : 0,5 % de fraudes. Un modèle affiche 99,5 % d'accuracy. Qu'en penser ?",
    choices: [
      "Excellent modèle, prêt pour la production",
      "Probablement inutile : prédire « jamais de fraude » donne exactement 99,5 % d'accuracy. Il faut regarder rappel, précision, PR-AUC",
      "L'accuracy devrait être de 100 %",
      "Il faut supprimer les fraudes du jeu de données"
    ],
    answer: 1,
    explain: "Avec des classes déséquilibrées, l'accuracy est dominée par la classe majoritaire. Métriques adaptées : rappel et précision sur la classe rare, courbe précision-rappel et son aire (PR-AUC), coût métier des FP et FN. Pistes : pondérer les classes (class_weight=\"balanced\"), ajuster le seuil, échantillonnage stratifié."
  },
  {
    id: "reg-a1-5", langue: "regression", niveau: "avance", type: "flip",
    front: "Courbe ROC et AUC : que mesurent-elles ?",
    back: "La courbe ROC trace le taux de vrais positifs (rappel) contre le taux de faux positifs pour TOUS les seuils possibles.\n\nAUC = aire sous cette courbe = probabilité qu'un positif tiré au hasard ait un score plus élevé qu'un négatif tiré au hasard. 0,5 = hasard, 1 = séparation parfaite.\n\nAvantage : indépendante du seuil. Limites : elle ne dit rien de la calibration des probabilités, et peut paraître flatteuse avec des classes très déséquilibrées → préférer alors la courbe précision-rappel (PR-AUC)."
  },
  {
    id: "reg-a1-6", langue: "regression", niveau: "avance", type: "flip",
    front: "Comment choisir le seuil de décision d'un classifieur ?",
    back: "Le seuil 0,5 n'a rien de spécial. On le choisit selon les COÛTS métier :\n\nEx. churn : contacter un client coûte 5 € (offre), un client perdu coûte 200 €. Il vaut mieux contacter beaucoup de clients, quitte à avoir des faux positifs → seuil bas.\n\nMéthode : pour chaque seuil, calculer le gain ou coût total attendu sur le jeu de validation (VP × gain − FP × coût…) et prendre le maximum. Ou bien fixer une contrainte (« au plus 1 000 appels par semaine » → prendre les 1 000 scores les plus élevés)."
  },
  {
    id: "reg-a2-1", langue: "regression", niveau: "avance", type: "flip",
    front: "Validation croisée k-fold : principe et intérêt ?",
    back: "On découpe les données d'entraînement en k blocs (souvent 5). On entraîne k fois sur k−1 blocs et on évalue sur le bloc restant. Performance = moyenne (± écart-type) des k scores.\n\nIntérêt : estimation plus stable qu'un seul découpage, utilise toutes les données, sert à choisir les hyperparamètres SANS toucher au jeu de test final.\n\nVariantes : StratifiedKFold (classification, garde la proportion des classes), GroupKFold (toutes les lignes d'un même client dans le même bloc), TimeSeriesSplit (données temporelles : on valide toujours sur le futur)."
  },
  {
    id: "reg-a2-2", langue: "regression", niveau: "avance", type: "flip",
    front: "Qu'est-ce que la fuite de données (data leakage) ? Exemples courants.",
    back: "Le modèle utilise, à l'entraînement, une information qui ne sera PAS disponible au moment de la prédiction réelle → performances spectaculaires en test, catastrophe en production.\n\nExemples :\n• Variable postérieure à l'événement : « date_resiliation » pour prédire le churn, « montant_remboursé » pour prédire la fraude.\n• Normalisation / imputation calculée sur TOUT le jeu avant le split (le test « fuit » dans le train).\n• Même client dans le train et le test (il est reconnu, pas prédit).\n• Split aléatoire sur des séries temporelles.\n\nRéflexe : un score « trop beau » (AUC 0,99) = chercher la fuite d'abord."
  },
  {
    id: "reg-a2-3", langue: "regression", niveau: "avance", type: "code",
    front: "Trouve la fuite de données dans ce code.",
    code: "from sklearn.preprocessing import StandardScaler\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\n\nX_scaled = StandardScaler().fit_transform(X)\nX_tr, X_te, y_tr, y_te = train_test_split(X_scaled, y, test_size=0.2)\nmodele = LogisticRegression().fit(X_tr, y_tr)\nprint(modele.score(X_te, y_te))",
    back: "Le StandardScaler est ajusté (moyenne, écart-type) sur TOUTES les données, test compris, avant le split : le test influence le prétraitement.\n\nCorrection : un Pipeline, ajusté sur le train uniquement :\n\nfrom sklearn.pipeline import make_pipeline\nX_tr, X_te, y_tr, y_te = train_test_split(\n    X, y, test_size=0.2, stratify=y, random_state=42)\nmodele = make_pipeline(StandardScaler(), LogisticRegression())\nmodele.fit(X_tr, y_tr)\nprint(modele.score(X_te, y_te))\n\nLe Pipeline garantit aussi l'absence de fuite dans la validation croisée (cross_val_score(modele, X_tr, y_tr, cv=5))."
  },
  {
    id: "reg-a2-4", langue: "regression", niveau: "avance", type: "flip",
    front: "Compromis biais-variance : de quoi s'agit-il ?",
    back: "Erreur de prédiction attendue = biais² + variance + bruit irréductible.\n\n• Biais : erreur due à un modèle trop simple, qui rate la vraie relation (sous-apprentissage).\n• Variance : sensibilité du modèle au hasard de l'échantillon d'entraînement ; un modèle trop flexible change beaucoup d'un échantillon à l'autre (surapprentissage).\n\nAugmenter la complexité réduit le biais mais augmente la variance. On cherche le point qui minimise l'erreur en validation. La régularisation, le bagging (forêts aléatoires) et plus de données réduisent la variance."
  },
  {
    id: "reg-a2-5", langue: "regression", niveau: "avance", type: "flip",
    front: "Régularisation Ridge vs Lasso vs Elastic Net ?",
    back: "On ajoute aux moindres carrés une pénalité sur la taille des coefficients, contrôlée par α (ou λ) :\n\n• Ridge (L2, Σβ²) : rétrécit tous les coefficients vers 0 sans les annuler. Efficace contre la multicolinéarité.\n• Lasso (L1, Σ|β|) : peut mettre des coefficients EXACTEMENT à 0 → sélection de variables automatique. Instable si les variables sont corrélées (en garde une au hasard).\n• Elastic Net : mélange des deux.\n\nIndispensable : STANDARDISER les variables avant (sinon la pénalité dépend des unités). α se choisit par validation croisée (RidgeCV, LassoCV)."
  },
  {
    id: "reg-a2-6", langue: "regression", niveau: "avance", type: "qcm",
    front: "Pour quels modèles la mise à l'échelle des variables (standardisation) est-elle importante ?",
    choices: [
      "Pour tous les modèles sans exception",
      "Pour les modèles basés sur des distances ou des pénalités (k-NN, SVM, k-means, Ridge/Lasso, réseaux de neurones), pas pour les arbres de décision et leurs ensembles",
      "Uniquement pour les arbres de décision",
      "Jamais, les algorithmes s'en chargent"
    ],
    answer: 1,
    explain: "Les arbres découpent variable par variable sur des seuils : changer d'unité ne change rien. Une régression OLS sans pénalité n'en a pas besoin non plus pour prédire (seule l'échelle des coefficients change), mais la standardisation aide à comparer les coefficients et à faire converger les solveurs."
  },

  // ======================================================================
  // ---- Pro : modèles non linéaires, causalité, production ----
  // ======================================================================
  {
    id: "reg-p1-1", langue: "regression", niveau: "pro", type: "flip",
    front: "Régression linéaire vs gradient boosting (XGBoost, LightGBM) : quand choisir lequel ?",
    back: "Linéaire / logistique :\n+ interprétable (coefficients), inférence (IC, p-values), robuste avec peu de données, extrapole « raisonnablement ».\n− il faut construire soi-même les non-linéarités et interactions.\n\nGradient boosting (arbres) :\n+ capte automatiquement non-linéarités et interactions, gère les valeurs manquantes, souvent le meilleur sur données tabulaires.\n− moins interprétable, nombreux hyperparamètres, n'extrapole pas (prédiction plate hors de la plage d'entraînement).\n\nPratique : commencer par une baseline linéaire, puis voir si le boosting apporte un gain qui justifie la complexité."
  },
  {
    id: "reg-p1-2", langue: "regression", niveau: "pro", type: "flip",
    front: "Importance des variables, SHAP : quels pièges d'interprétation ?",
    back: "• L'importance indique ce que le MODÈLE utilise pour prédire, pas un effet causal dans le monde réel.\n• L'importance « gain » / « impureté » des arbres favorise les variables à nombreuses modalités. Préférer l'importance par permutation (sur le jeu de test) ou SHAP.\n• Variables corrélées : l'importance se répartit entre elles de façon arbitraire ; chacune peut paraître peu importante alors que le groupe l'est.\n• SHAP décompose une prédiction en contributions additives par variable : excellent pour expliquer UNE prédiction ou le comportement global du modèle, mais toujours pas causal."
  },
  {
    id: "reg-p1-3", langue: "regression", niveau: "pro", type: "flip",
    front: "Qu'est-ce que le biais de variable omise ?",
    back: "Si une variable Z influence y ET est corrélée à x, mais qu'elle est absente du modèle, le coefficient de x absorbe une partie de l'effet de Z : il est biaisé.\n\nEx. salaire ~ nb_années_études sans « origine socio-économique » : le coefficient des études capte en partie l'effet du milieu d'origine.\n\nOn ne peut jamais être sûr d'avoir inclus tous les confondants dans des données observationnelles. C'est la raison principale pour laquelle « coefficient significatif » ≠ « effet causal ». Remèdes : expérience randomisée, variables instrumentales, différence de différences, effets fixes."
  },
  {
    id: "reg-p1-4", langue: "regression", niveau: "pro", type: "qcm",
    front: "Un modèle de churn très performant montre que les clients qui utilisent l'appli mobile partent moins. Le marketing veut forcer l'installation de l'appli pour réduire le churn. Ton avis ?",
    choices: [
      "Excellente idée : le modèle a prouvé l'effet de l'appli",
      "Prudence : un modèle prédictif capte des corrélations. Les clients engagés installent l'appli ET restent ; forcer l'installation ne rendra pas les autres engagés. Il faut tester (A/B test) avant de généraliser",
      "Il faut retirer la variable appli du modèle",
      "Il faut ré-entraîner le modèle avec plus de données"
    ],
    answer: 1,
    explain: "Prédiction ≠ causalité. Une variable très prédictive peut être un simple marqueur d'engagement (causalité inverse ou confondant). Pour une décision d'action, il faut une expérience : inciter aléatoirement à l'installation une moitié des clients et comparer le churn. Les modèles d'uplift visent spécifiquement l'effet d'une action."
  },
  {
    id: "reg-p1-5", langue: "regression", niveau: "pro", type: "flip",
    front: "Quelle régression utiliser pour des comptages (nb de commandes, nb de sinistres) ?",
    back: "La régression linéaire convient mal : elle peut prédire des valeurs négatives et suppose une variance constante, alors que pour des comptages la variance augmente avec la moyenne.\n\n• Régression de Poisson : log(E[y]) = β₀ + β₁x₁… ; exp(β) = rapport de taux (+1 unité de x ⇒ nombre attendu multiplié par e^β). Suppose variance = moyenne.\n• Binomiale négative : si sur-dispersion (variance >> moyenne), très fréquent en pratique.\n• Modèles zero-inflated : si beaucoup plus de zéros que prévu.\n• Exposition différente (clients suivis 3 vs 12 mois) : ajouter log(durée) en offset.\n\nstatsmodels : smf.poisson(...), smf.negativebinomial(...), ou smf.glm(..., family=sm.families.Poisson())."
  },
  {
    id: "reg-p1-6", langue: "regression", niveau: "pro", type: "flip",
    front: "Qu'est-ce que la calibration d'un classifieur et quand compte-t-elle ?",
    back: "Un modèle est calibré si, parmi les cas auxquels il attribue 20 % de probabilité, environ 20 % sont vraiment positifs.\n\nL'AUC mesure le CLASSEMENT, pas la calibration : un modèle peut bien ordonner les clients mais annoncer des probabilités fausses (fréquent avec le boosting, les SVM, ou après un rééchantillonnage des classes).\n\nCompte quand on utilise les probabilités elles-mêmes : calcul de valeur attendue (proba × montant), tarification, provisionnement de risque.\nDiagnostic : courbe de calibration, score de Brier. Correction : CalibratedClassifierCV (Platt / isotonique)."
  },
  {
    id: "reg-p1-7", langue: "regression", niveau: "pro", type: "flip",
    front: "Un modèle est en production depuis 6 mois. Que faut-il surveiller ?",
    back: "• Data drift : la distribution des variables d'entrée change (nouveau type de clients, nouvelle source de trafic). Mesures : PSI, test de Kolmogorov-Smirnov, comparaison des distributions.\n• Concept drift : la RELATION entre X et y change (crise, concurrent, changement de prix) : le modèle se dégrade même si les entrées semblent stables.\n• Performance réelle : dès que la vraie cible est connue (souvent avec retard), comparer prédictions et réalisé.\n• Qualité des données en entrée : valeurs manquantes, nouvelles modalités, changements de format en amont.\n\nPrévoir des seuils d'alerte et une stratégie de ré-entraînement (périodique ou déclenchée par une alerte)."
  },
  {
    id: "reg-p1-8", langue: "regression", niveau: "pro", type: "code",
    front: "Un analyste présente ce modèle de prévision des ventes. Liste les problèmes.",
    code: "# ventes quotidiennes 2023-2025, 1 095 lignes\nX = df[[\"prix\", \"promo\", \"temperature\", \"ventes_semaine_suivante\", \"jour\"]]\nX_tr, X_te, y_tr, y_te = train_test_split(X, df[\"ventes\"], test_size=0.2)\nmodele = LinearRegression().fit(X_tr, y_tr)\nprint(r2_score(y_te, modele.predict(X_te)))   # 0.97\n# -> \"Le prix explique les ventes, coef = -42 : baisser le prix de 1 € fait +42 ventes\"",
    back: "1. Fuite : « ventes_semaine_suivante » n'est pas connue au moment de prédire → R² de 0,97 artificiel.\n2. Split aléatoire sur une série temporelle : le test est mélangé avec le passé ; il faut tester sur les derniers mois (TimeSeriesSplit).\n3. « jour » codé numériquement (1 à 7 ?) comme une variable continue : il faut des indicatrices (ou un encodage cyclique).\n4. Interprétation causale du prix : les prix ne sont pas fixés au hasard (on baisse les prix quand les ventes sont faibles, les promos coïncident avec les saisons) → biais d'endogénéité. Pour une élasticité-prix, il faut des tests de prix ou des méthodes causales.\n5. Pas de baseline (ventes de la même semaine l'an dernier) ni de métrique métier (MAE en unités, MAPE)."
  },
];
