// Note de cours générée par le skill /notes-de-cours à partir de
// Project_01/transformers/Transformers-/Transformers_Presentation.pdf
export const note = {
  id: "transformers",
  titre: "Comprendre les Transformers",
  source: "Comprendre les Transformers · E. The et P. Roumbo, M2 (décembre 2025) · 22 diapositives",
  deck: "transformers",
  resume: "L'architecture qui a remplacé les réseaux récurrents et qui est à la base de BERT, GPT et des LLM : plongements et encodage de position, **self-attention** (Q, K, V), attention multi-têtes, connexions résiduelles et normalisation, réseau feed-forward, puis le décodeur avec son **masque causal** et la génération mot par mot.\n\nChaque formule est accompagnée d'un petit calcul numérique fait à la main.",
  prerequis: ["regression"],
  concepts: [
    "RNN", "LSTM", "dépendances longues", "parallélisation", "Attention Is All You Need", "encodeur", "décodeur", "token", "embedding", "d_model",
    "encodage de position", "sinus / cosinus", "self-attention", "query", "key", "value", "produit scalaire", "mise à l'échelle √dk", "softmax",
    "attention multi-têtes", "connexion résiduelle", "LayerNorm", "feed-forward", "ReLU", "self-attention masquée", "masque causal",
    "cross-attention", "génération auto-régressive", "logits", "token de fin <EOS>", "BERT", "GPT", "complexité quadratique",
  ],
  chapitres: [
    {
      id: "pourquoi",
      titre: "1. Pourquoi les Transformers ?",
      objectif: "Comprendre ce qui bloquait avec les réseaux récurrents.",
      blocs: [
        { type: "texte", contenu: "Avant 2017, les séquences (texte, parole) étaient traitées par des réseaux **récurrents** (RNN, LSTM, GRU) : ils lisent les mots un par un, en transportant un état d'un mot au suivant." },
        { type: "tableau", entetes: ["Limite des RNN / LSTM", "Ce que fait le Transformer"], lignes: [
          ["Traitement **séquentiel** : le mot 10 attend le mot 9, impossible de paralléliser l'entraînement", "Tous les mots sont traités **en même temps** : entraînement massivement parallèle sur GPU"],
          ["L'information d'un mot lointain s'efface au fil des étapes (dépendances longues)", "Chaque mot accède **directement** à tous les autres par l'attention"],
        ] },
        { type: "texte", contenu: "L'article *Attention Is All You Need* (Vaswani et al., 2017) supprime toute récurrence et ne garde que le mécanisme d'**attention**. Résultat : un apprentissage plus rapide et de meilleurs résultats en traduction, puis en reconnaissance vocale et dans tout le traitement du langage." },
        { type: "attention", contenu: "Précision : le prix à payer est que l'attention compare chaque mot à tous les autres. Son coût croît comme le **carré** de la longueur de la séquence (n² paires) : c'est la raison pour laquelle les modèles ont une longueur de contexte maximale." },
      ],
    },
    {
      id: "architecture",
      titre: "2. L'architecture d'ensemble",
      objectif: "Situer chaque bloc avant d'entrer dans les détails.",
      blocs: [
        { type: "schema", svg: `<svg viewBox="0 0 360 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Architecture encodeur-décodeur du Transformer">
  <defs><marker id="fl-tr-arch" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="s-arrow"/></marker></defs>
  <text x="88" y="16" text-anchor="middle" class="s-bold">Encodeur (× N)</text>
  <rect x="6" y="26" width="164" height="150" rx="10" class="s-box"/>
  <rect x="16" y="36" width="144" height="30" rx="5" class="s-acc"/><text x="88" y="56" text-anchor="middle" class="s-txt">Attention multi-têtes</text>
  <rect x="16" y="72" width="144" height="26" rx="5" class="s-box"/><text x="88" y="90" text-anchor="middle" class="s-sub">Add &amp; Norm</text>
  <rect x="16" y="104" width="144" height="30" rx="5" class="s-acc"/><text x="88" y="124" text-anchor="middle" class="s-txt">Feed-forward</text>
  <rect x="16" y="140" width="144" height="26" rx="5" class="s-box"/><text x="88" y="158" text-anchor="middle" class="s-sub">Add &amp; Norm</text>
  <text x="272" y="16" text-anchor="middle" class="s-bold">Décodeur (× N)</text>
  <rect x="190" y="26" width="164" height="186" rx="10" class="s-box"/>
  <rect x="200" y="36" width="144" height="30" rx="5" class="s-warn"/><text x="272" y="56" text-anchor="middle" class="s-txt">Self-attention masquée</text>
  <rect x="200" y="72" width="144" height="26" rx="5" class="s-box"/><text x="272" y="90" text-anchor="middle" class="s-sub">Add &amp; Norm</text>
  <rect x="200" y="104" width="144" height="30" rx="5" class="s-acc"/><text x="272" y="124" text-anchor="middle" class="s-txt">Cross-attention</text>
  <rect x="200" y="140" width="144" height="30" rx="5" class="s-acc"/><text x="272" y="160" text-anchor="middle" class="s-txt">Feed-forward</text>
  <rect x="200" y="176" width="144" height="26" rx="5" class="s-box"/><text x="272" y="194" text-anchor="middle" class="s-sub">Add &amp; Norm (×2)</text>
  <path d="M170 119H196" class="s-line" marker-end="url(#fl-tr-arch)"/>
  <rect x="6" y="196" width="164" height="40" rx="8" class="s-ok"/>
  <text x="88" y="214" text-anchor="middle" class="s-txt">Embedding</text>
  <text x="88" y="230" text-anchor="middle" class="s-sub">+ encodage de position</text>
  <path d="M88 196V180" class="s-line" marker-end="url(#fl-tr-arch)"/>
  <text x="88" y="256" text-anchor="middle" class="s-sub">phrase source</text>
  <rect x="190" y="226" width="164" height="30" rx="8" class="s-ok"/>
  <text x="272" y="246" text-anchor="middle" class="s-txt">Linéaire + softmax</text>
  <path d="M272 212V222" class="s-line" marker-end="url(#fl-tr-arch)"/>
  <text x="272" y="276" text-anchor="middle" class="s-sub">probabilité du mot suivant</text>
  <text x="180" y="296" text-anchor="middle" class="s-sub">La sortie de l'encodeur alimente la cross-attention</text>
</svg>`, legende: "L'encodeur comprend la phrase source ; le décodeur génère la phrase cible mot par mot en s'appuyant sur cette compréhension." },
        { type: "liste", items: [
          "**Encodeur** : une pile de N blocs identiques (N = 6 dans l'article), chacun avec une self-attention multi-têtes et un réseau feed-forward, chacun suivi d'un *Add & Norm*.",
          "**Décodeur** : une pile de N blocs avec une self-attention **masquée**, une attention encodeur-décodeur (*cross-attention*) et un feed-forward.",
          "En entrée : plongements des mots + encodage de position. En sortie : une projection linéaire sur le vocabulaire et un softmax.",
        ] },
        { type: "tableau", entetes: ["Famille", "Partie utilisée", "Exemples", "Usage typique"], lignes: [
          ["Encodeur seul", "Encodeur", "BERT", "Comprendre : classification, extraction, recherche sémantique"],
          ["Décodeur seul", "Décodeur (sans cross-attention)", "GPT, la plupart des LLM", "Générer du texte"],
          ["Encodeur-décodeur", "Les deux", "Transformer d'origine, T5", "Traduire, résumer"],
        ] },
      ],
    },
    {
      id: "entree",
      titre: "3. Plongements et encodage de position",
      objectif: "Comment un texte devient une matrice de nombres qui connaît l'ordre des mots.",
      blocs: [
        { type: "texte", contenu: "Le texte est découpé en **tokens** (mots ou morceaux de mots), et chaque token est remplacé par un vecteur appris de dimension **d_model** (512 dans l'article) : son **embedding**, qui porte le sens." },
        { type: "texte", contenu: "L'attention ne tient pas compte de l'ordre : « le chat mange la souris » et « la souris mange le chat » donneraient les mêmes calculs. On **ajoute** donc à chaque embedding un vecteur qui dépend de la position." },
        { type: "formule", contenu: "PE(pos, 2i) = sin( pos / 10000^(2i / d_model) )      PE(pos, 2i+1) = cos( pos / 10000^(2i / d_model) )", explication: "pos = position du token dans la phrase ; i = indice de la paire de dimensions. Chaque paire de dimensions oscille à une fréquence différente : les premières dimensions changent vite d'une position à l'autre, les dernières lentement. Cela permet au modèle de repérer des positions relatives (« deux mots plus loin »)." },
        { type: "exemple", titre: "Encodage de position avec d_model = 4", resultat: "position 0 : [0.00, 1.00, 0.00, 1.00]\nposition 1 : [0.84, 0.54, 0.01, 1.00]\nposition 2 : [0.91, -0.42, 0.02, 1.00]\nLes deux premières dimensions varient vite (fréquence 1), les deux dernières lentement (fréquence 1/100)." },
        { type: "attention", contenu: "Précision : beaucoup de modèles récents remplacent cet encodage fixe par des positions **apprises** (BERT, GPT-2) ou par des encodages relatifs comme RoPE (LLaMA) ; l'idée reste la même : injecter l'ordre des tokens." },
      ],
    },
    {
      id: "attention",
      titre: "4. La self-attention, le cœur du modèle",
      objectif: "Savoir dérouler le calcul de l'attention sur un petit exemple.",
      blocs: [
        { type: "texte", contenu: "Chaque token doit construire une représentation **contextualisée** : dans « la banque du fleuve », « banque » doit s'imprégner de « fleuve ». Pour cela, la matrice d'entrée X est projetée de trois façons, par des matrices de poids apprises :" },
        { type: "tableau", entetes: ["Matrice", "Calcul", "Intuition"], lignes: [
          ["**Q** (query, requête)", "Q = X·W_Q", "Ce que le mot **cherche**"],
          ["**K** (key, clé)", "K = X·W_K", "Ce par quoi le mot **peut être trouvé**"],
          ["**V** (value, valeur)", "V = X·W_V", "L'information que le mot **apporte**"],
        ] },
        { type: "formule", contenu: "Attention(Q, K, V) = softmax( Q·Kᵀ / √d_k ) · V", explication: "Q·Kᵀ : score de similarité entre chaque requête et chaque clé (produit scalaire). √d_k : division par la racine de la dimension des clés, pour éviter des scores trop grands qui saturent le softmax et rendent les gradients minuscules. Softmax : transforme chaque ligne de scores en poids positifs dont la somme vaut 1. · V : chaque sortie est la moyenne des valeurs, pondérée par ces poids." },
        { type: "exemple", titre: "Le calcul à la main sur 3 tokens", contenu: "Tokens « le » = (1, 0), « chat » = (0, 1), « dort » = (1, 1), d_k = 2, et pour simplifier Q = K = V = X.", code: `Scores Q·Kᵀ / √2          Poids (softmax par ligne)     Sortie = poids · V
      le   chat dort          le   chat dort
le   0.71 0.00 0.71     le   0.40 0.20 0.40          le   (0.80, 0.60)
chat 0.00 0.71 0.71     chat 0.20 0.40 0.40          chat (0.60, 0.80)
dort 0.71 0.71 1.41     dort 0.25 0.25 0.50          dort (0.75, 0.75)` },
        { type: "schema", svg: `<svg viewBox="0 0 360 196" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Matrice des poids d'attention">
  <text x="180" y="16" text-anchor="middle" class="s-sub">poids d'attention (chaque ligne somme à 1)</text>
  <text x="122" y="40" text-anchor="middle" class="s-bold">le</text>
  <text x="196" y="40" text-anchor="middle" class="s-bold">chat</text>
  <text x="270" y="40" text-anchor="middle" class="s-bold">dort</text>
  <text x="74" y="74" text-anchor="end" class="s-bold">le</text>
  <rect x="86" y="50" width="72" height="40" rx="4" class="s-acc"/><text x="122" y="75" text-anchor="middle" class="s-txt">0.40</text>
  <rect x="160" y="50" width="72" height="40" rx="4" class="s-box"/><text x="196" y="75" text-anchor="middle" class="s-txt">0.20</text>
  <rect x="234" y="50" width="72" height="40" rx="4" class="s-acc"/><text x="270" y="75" text-anchor="middle" class="s-txt">0.40</text>
  <text x="74" y="116" text-anchor="end" class="s-bold">chat</text>
  <rect x="86" y="92" width="72" height="40" rx="4" class="s-box"/><text x="122" y="117" text-anchor="middle" class="s-txt">0.20</text>
  <rect x="160" y="92" width="72" height="40" rx="4" class="s-acc"/><text x="196" y="117" text-anchor="middle" class="s-txt">0.40</text>
  <rect x="234" y="92" width="72" height="40" rx="4" class="s-acc"/><text x="270" y="117" text-anchor="middle" class="s-txt">0.40</text>
  <text x="74" y="158" text-anchor="end" class="s-bold">dort</text>
  <rect x="86" y="134" width="72" height="40" rx="4" class="s-box"/><text x="122" y="159" text-anchor="middle" class="s-txt">0.25</text>
  <rect x="160" y="134" width="72" height="40" rx="4" class="s-box"/><text x="196" y="159" text-anchor="middle" class="s-txt">0.25</text>
  <rect x="234" y="134" width="72" height="40" rx="4" class="s-ok"/><text x="270" y="159" text-anchor="middle" class="s-txt">0.50</text>
  <text x="180" y="192" text-anchor="middle" class="s-sub">ligne = le mot qui regarde ; colonne = le mot regardé</text>
</svg>`, legende: "« dort » accorde la moitié de son attention à lui-même et 25 % à chacun des deux autres." },
        { type: "definition", terme: "Attention multi-têtes", contenu: "Au lieu d'une seule attention, le modèle en calcule h en parallèle (h = 8 dans l'article), chacune avec ses propres W_Q, W_K, W_V de plus petite dimension (d_model / h). Chaque tête peut se spécialiser (syntaxe, coréférence, dépendances lointaines). Les sorties sont concaténées puis projetées : MultiHead = Concat(tête₁, …, tête_h)·W_O." },
        { type: "application", titre: "Dans la pratique", contenu: "Visualiser les poids d'attention d'un modèle (avec des outils comme BertViz) aide à comprendre sur quels mots il s'appuie, mais ce n'est pas une explication causale de sa décision." },
      ],
    },
    {
      id: "blocs",
      titre: "5. Add & Norm et feed-forward",
      objectif: "Comprendre les deux briques qui rendent l'empilement de couches possible.",
      blocs: [
        { type: "formule", contenu: "z = x + Sous-couche(x)        LayerNorm(z) = γ ⊙ (z − μ) / σ + β", explication: "**Connexion résiduelle** (Add) : on ajoute l'entrée à la sortie de la sous-couche. Le gradient dispose ainsi d'un chemin direct à travers les couches, ce qui permet d'empiler des réseaux profonds. **Normalisation de couche** (Norm) : on centre et réduit chaque vecteur (μ, σ = moyenne et écart-type de ses composantes), puis γ et β, appris, rééchelonnent. Les activations restent stables et l'apprentissage converge plus vite." },
        { type: "formule", contenu: "FFN(x) = max(0, x·W₁ + b₁)·W₂ + b₂", explication: "Deux couches linéaires séparées par une activation ReLU, appliquées à chaque position **indépendamment** avec les mêmes poids. La première élargit (2 048 dimensions dans l'article), la seconde ramène à d_model. L'attention mélange l'information **entre** les tokens ; le feed-forward la transforme **dans** chaque token." },
        { type: "exemple", titre: "La ReLU sur un petit vecteur", resultat: "x·W₁ + b₁ = (−1.2, 0.5, 2.0)  →  max(0, ·) = (0, 0.5, 2.0)\nLes valeurs négatives sont coupées : c'est cette non-linéarité qui permet de représenter des motifs complexes." },
      ],
    },
    {
      id: "decodeur",
      titre: "6. Le décodeur et la génération",
      objectif: "Comprendre le masque causal et la génération mot par mot.",
      blocs: [
        { type: "texte", contenu: "Le décodeur génère la phrase cible de façon **auto-régressive** : il produit un token, l'ajoute à son entrée, produit le suivant, et recommence jusqu'au token de fin `<EOS>`." },
        { type: "formule", contenu: "Attention masquée = softmax( (Q·Kᵀ + M) / √d_k ) · V,   M[t, k] = 0 si k ≤ t, −∞ si k > t", explication: "Le masque met −∞ sur les positions futures : après le softmax, leur poids vaut exactement 0. La prédiction à la position t ne dépend que des tokens 1 à t, comme lors de la génération réelle. (Le cours place M avant la division ; ajouter −∞ avant ou après la mise à l'échelle donne le même résultat.)" },
        { type: "schema", svg: `<svg viewBox="0 0 360 178" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Poids d'attention avec masque causal">
  <text x="180" y="16" text-anchor="middle" class="s-sub">poids avec masque causal (même exemple)</text>
  <text x="122" y="40" text-anchor="middle" class="s-bold">le</text>
  <text x="196" y="40" text-anchor="middle" class="s-bold">chat</text>
  <text x="270" y="40" text-anchor="middle" class="s-bold">dort</text>
  <text x="74" y="70" text-anchor="end" class="s-bold">le</text>
  <rect x="86" y="50" width="72" height="34" rx="4" class="s-acc"/><text x="122" y="72" text-anchor="middle" class="s-txt">1.00</text>
  <rect x="160" y="50" width="72" height="34" rx="4" class="s-warn"/><text x="196" y="72" text-anchor="middle" class="s-sub">masqué</text>
  <rect x="234" y="50" width="72" height="34" rx="4" class="s-warn"/><text x="270" y="72" text-anchor="middle" class="s-sub">masqué</text>
  <text x="74" y="106" text-anchor="end" class="s-bold">chat</text>
  <rect x="86" y="86" width="72" height="34" rx="4" class="s-box"/><text x="122" y="108" text-anchor="middle" class="s-txt">0.33</text>
  <rect x="160" y="86" width="72" height="34" rx="4" class="s-acc"/><text x="196" y="108" text-anchor="middle" class="s-txt">0.67</text>
  <rect x="234" y="86" width="72" height="34" rx="4" class="s-warn"/><text x="270" y="108" text-anchor="middle" class="s-sub">masqué</text>
  <text x="74" y="142" text-anchor="end" class="s-bold">dort</text>
  <rect x="86" y="122" width="72" height="34" rx="4" class="s-box"/><text x="122" y="144" text-anchor="middle" class="s-txt">0.25</text>
  <rect x="160" y="122" width="72" height="34" rx="4" class="s-box"/><text x="196" y="144" text-anchor="middle" class="s-txt">0.25</text>
  <rect x="234" y="122" width="72" height="34" rx="4" class="s-acc"/><text x="270" y="144" text-anchor="middle" class="s-txt">0.50</text>
  <text x="180" y="174" text-anchor="middle" class="s-sub">chaque mot ne voit que lui-même et les mots précédents</text>
</svg>`, legende: "Avec le masque, « le » ne regarde que lui-même ; « chat » répartit son attention entre « le » et lui-même ; « dort » voit tout." },
        { type: "texte", contenu: "La **cross-attention** relie les deux parties : les requêtes Q viennent du décodeur, les clés K et les valeurs V viennent de la sortie de l'encodeur. En traduisant, chaque mot généré « consulte » ainsi les mots pertinents de la phrase source." },
        { type: "formule", contenu: "P(mot_i) = e^(logit_i) / Σ_j e^(logit_j)", explication: "La sortie du décodeur est projetée sur la taille du vocabulaire (un score brut, ou *logit*, par mot possible), puis le softmax transforme ces scores en probabilités." },
        { type: "exemple", titre: "Choisir le mot suivant", resultat: "logits (chat, chien, maison) = (2.0, 1.0, 0.1)\nprobabilités ≈ (0.66, 0.24, 0.10) → on génère « chat », on l'ajoute à l'entrée, et on recommence." },
        { type: "attention", contenu: "Précision : prendre toujours le mot le plus probable (décodage glouton, comme dans le cours) donne des textes répétitifs. Les LLM échantillonnent plutôt avec une **température** et des seuils (top-k, top-p) ; la température divise les logits avant le softmax : basse = plus prévisible, haute = plus varié." },
      ],
    },
  ],
  aRetenir: [
    "Les Transformers suppriment la récurrence : tous les tokens sont traités en parallèle et chacun accède directement aux autres par l'attention.",
    "Entrée = embedding (le sens) + encodage de position (l'ordre), car l'attention seule ignore l'ordre.",
    "Attention(Q, K, V) = softmax(Q·Kᵀ / √d_k)·V : scores de similarité, normalisés en poids qui somment à 1, puis moyenne pondérée des valeurs.",
    "La division par √d_k évite que le softmax sature et que les gradients disparaissent.",
    "Multi-têtes : plusieurs attentions en parallèle, chacune spécialisée, concaténées puis projetées.",
    "Add & Norm (connexion résiduelle + LayerNorm) rend l'empilement de couches entraînable ; le feed-forward transforme chaque token séparément.",
    "Le décodeur génère mot par mot ; le masque causal (−∞ sur le futur) l'empêche de regarder les mots suivants.",
    "Encodeur seul = BERT (comprendre), décodeur seul = GPT (générer), encodeur-décodeur = traduction. Coût de l'attention : quadratique en longueur.",
  ],
};
