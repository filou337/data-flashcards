// Deck généré par le skill /notes-de-cours à partir de la présentation « Comprendre les Transformers »
// (note : data/notes/transformers.js).
export const cardsTransformers = [
  {
    id: "tr-f1-1", langue: "transformers", niveau: "fondamentaux", type: "flip",
    front: "Quelles limites des RNN / LSTM les Transformers ont-ils levées ?",
    back: "1) Le traitement séquentiel : un RNN lit les mots un par un, ce qui empêche de paralléliser l'entraînement ; le Transformer traite tous les tokens en même temps. 2) Les dépendances longues : dans un RNN, l'information d'un mot lointain s'estompe d'étape en étape ; avec l'attention, chaque mot accède directement à tous les autres.",
  },
  {
    id: "tr-f1-2", langue: "transformers", niveau: "fondamentaux", type: "flip",
    front: "Pourquoi ajoute-t-on un encodage de position aux embeddings ?",
    back: "L'attention est insensible à l'ordre : « le chat mange la souris » et « la souris mange le chat » produiraient les mêmes calculs. On additionne à chaque embedding un vecteur qui dépend de la position (sinus et cosinus de fréquences différentes dans l'article d'origine), pour que chaque token encode à la fois son sens et sa place.",
  },
  {
    id: "tr-f1-3", langue: "transformers", niveau: "fondamentaux", type: "flip",
    front: "Que représentent Q, K et V dans l'attention ?",
    back: "Ce sont trois projections apprises de la même entrée X. Q (query) : ce que le mot cherche. K (key) : ce par quoi un mot peut être trouvé. V (value) : l'information qu'il apporte. Le produit Q·Kᵀ mesure à quel point chaque mot « répond » à la requête de chaque autre ; ces scores pondèrent ensuite les valeurs V.",
  },
  {
    id: "tr-f1-4", langue: "transformers", niveau: "fondamentaux", type: "flip",
    front: "Écris la formule de l'attention et explique chaque terme.",
    back: "Attention(Q, K, V) = softmax(Q·Kᵀ / √d_k)·V.\nQ·Kᵀ : scores de similarité entre requêtes et clés. √d_k : mise à l'échelle par la racine de la dimension des clés. softmax : chaque ligne devient un ensemble de poids positifs qui somment à 1. ·V : chaque sortie est la moyenne des valeurs pondérée par ces poids.",
  },
  {
    id: "tr-f1-5", langue: "transformers", niveau: "fondamentaux", type: "qcm",
    front: "BERT et GPT utilisent-ils la même partie du Transformer ?",
    choices: [
      "Oui, les deux utilisent l'encodeur et le décodeur",
      "Non : BERT utilise la pile d'encodeurs (comprendre), GPT la pile de décodeurs avec masque causal (générer)",
      "Non : BERT utilise le décodeur et GPT l'encodeur",
      "Ni l'un ni l'autre n'est un Transformer",
    ],
    answer: 1,
    explain: "BERT voit toute la phrase dans les deux sens : il sert à classer, extraire, rechercher. GPT génère de gauche à droite grâce au masque causal. Le Transformer d'origine (et T5) garde les deux parties, pour traduire ou résumer.",
  },
  {
    id: "tr-f1-6", langue: "transformers", niveau: "fondamentaux", type: "flip",
    front: "Que signifie « génération auto-régressive » ?",
    back: "Le décodeur produit un token, l'ajoute à son entrée, puis produit le suivant en tenant compte de tout ce qui a déjà été généré, et ainsi de suite jusqu'au token de fin <EOS>. Chaque mot dépend des précédents, ce qui rend la génération séquentielle même si l'entraînement est parallèle.",
  },
  {
    id: "tr-i1-1", langue: "transformers", niveau: "intermediaire", type: "flip",
    front: "Pourquoi divise-t-on les scores par √d_k ?",
    back: "Le produit scalaire de deux vecteurs de dimension d_k a une variance qui croît avec d_k. Sans mise à l'échelle, les scores deviennent très grands, le softmax sature (un poids proche de 1, les autres proches de 0) et ses gradients deviennent minuscules : l'apprentissage stagne. Diviser par √d_k ramène les scores à une échelle raisonnable.",
  },
  {
    id: "tr-i1-2", langue: "transformers", niveau: "intermediaire", type: "code",
    front: "Tokens le = (1, 0), chat = (0, 1), dort = (1, 1) ; d_k = 2 ; Q = K = V = X. Quels sont les poids d'attention de « dort » ?",
    code: "scores de « dort » = [le, chat, dort] · dort / √2\n                  = [1, 1, 2] / 1.414\n                  = [0.71, 0.71, 1.41]",
    back: "softmax([0.71, 0.71, 1.41]) = [0.25, 0.25, 0.50]\nSortie de « dort » = 0.25·(1,0) + 0.25·(0,1) + 0.50·(1,1) = (0.75, 0.75).\n« dort » accorde la moitié de son attention à lui-même et un quart à chacun des deux autres mots.",
  },
  {
    id: "tr-i1-3", langue: "transformers", niveau: "intermediaire", type: "flip",
    front: "Qu'est-ce que l'attention multi-têtes et pourquoi l'utiliser ?",
    back: "Au lieu d'une seule attention, on en calcule h en parallèle (8 dans l'article), chacune avec ses propres matrices W_Q, W_K, W_V de dimension d_model / h. Chaque tête peut capter un type de relation (syntaxe, coréférence, dépendance lointaine). Les sorties sont concaténées puis projetées par W_O. Le coût total reste proche d'une seule attention de pleine dimension.",
  },
  {
    id: "tr-i1-4", langue: "transformers", niveau: "intermediaire", type: "flip",
    front: "À quoi servent les connexions résiduelles et la LayerNorm (« Add & Norm ») ?",
    back: "La connexion résiduelle z = x + Sous-couche(x) offre au gradient un chemin direct à travers les couches : on peut empiler des dizaines de blocs sans que l'apprentissage se bloque. La LayerNorm centre et réduit chaque vecteur (puis rééchelonne avec γ et β appris) : les activations restent stables et la convergence est plus rapide.",
  },
  {
    id: "tr-i1-5", langue: "transformers", niveau: "intermediaire", type: "flip",
    front: "Quel est le rôle du réseau feed-forward dans un bloc de Transformer ?",
    back: "FFN(x) = max(0, x·W₁ + b₁)·W₂ + b₂ : deux couches linéaires séparées par une ReLU, appliquées à chaque position indépendamment avec les mêmes poids. L'attention mélange l'information entre les tokens ; le feed-forward la transforme à l'intérieur de chaque token, et la ReLU apporte la non-linéarité.",
  },
  {
    id: "tr-i1-6", langue: "transformers", niveau: "intermediaire", type: "qcm",
    front: "À quoi sert le masque causal dans la self-attention du décodeur ?",
    choices: [
      "À ignorer les mots de ponctuation",
      "À empêcher chaque position de regarder les tokens futurs, en mettant −∞ sur leurs scores (poids nul après softmax)",
      "À réduire la taille du vocabulaire",
      "À accélérer l'encodeur",
    ],
    answer: 1,
    explain: "Pendant l'entraînement, toute la phrase cible est fournie d'un coup. Sans masque, le modèle « tricherait » en lisant le mot qu'il doit prédire. Avec M[t, k] = −∞ pour k > t, la prédiction en position t ne dépend que des tokens 1 à t, comme lors de la génération réelle.",
  },
  {
    id: "tr-i1-7", langue: "transformers", niveau: "intermediaire", type: "flip",
    front: "Qu'est-ce que la cross-attention ?",
    back: "L'attention du décodeur vers l'encodeur : les requêtes Q viennent du décodeur (ce qu'il est en train de générer), les clés K et les valeurs V viennent de la sortie de l'encodeur (la phrase source). En traduction, chaque mot généré consulte ainsi les mots pertinents de la phrase d'origine.",
  },
  {
    id: "tr-a1-1", langue: "transformers", niveau: "avance", type: "code",
    front: "Logits (chat, chien, maison) = (2.0, 1.0, 0.1). Quelles probabilités donne le softmax, et quel mot génère un décodage glouton ?",
    code: "P(mot_i) = e^(logit_i) / Σ_j e^(logit_j)",
    back: "e^2.0 = 7.39, e^1.0 = 2.72, e^0.1 = 1.11 ; somme = 11.21.\nP ≈ (0.66, 0.24, 0.10) : le décodage glouton génère « chat ».\nAvec une température T, on divise les logits par T avant le softmax : T < 1 accentue l'écart (plus prévisible), T > 1 l'aplatit (plus varié).",
  },
  {
    id: "tr-a1-2", langue: "transformers", niveau: "avance", type: "flip",
    front: "Pourquoi un LLM a-t-il une longueur de contexte maximale ?",
    back: "La self-attention compare chaque token à tous les autres : le calcul et la mémoire croissent comme n² (n = nombre de tokens). Doubler le contexte quadruple le coût de l'attention. Les modèles fixent donc une longueur maximale ; des variantes (attention creuse, FlashAttention, encodages de position relatifs comme RoPE) repoussent cette limite.",
  },
  {
    id: "tr-a1-3", langue: "transformers", niveau: "avance", type: "flip",
    front: "Encodage de position sinusoïdal : comment varient les dimensions ? (d_model = 4)",
    back: "PE(pos, 2i) = sin(pos / 10000^(2i/d)), PE(pos, 2i+1) = cos(…). Avec d = 4 :\npos 0 : [0.00, 1.00, 0.00, 1.00]\npos 1 : [0.84, 0.54, 0.01, 1.00]\npos 2 : [0.91, −0.42, 0.02, 1.00]\nLes premières dimensions oscillent vite, les dernières lentement : la combinaison donne une signature unique par position et facilite le repérage des distances relatives.",
  },
  {
    id: "tr-p1-1", langue: "transformers", niveau: "pro", type: "flip",
    front: "Pourquoi l'entraînement d'un Transformer est-il parallèle alors que la génération est séquentielle ?",
    back: "À l'entraînement, la phrase cible complète est connue : grâce au masque causal, on calcule les prédictions de toutes les positions en une seule passe matricielle. À la génération, le mot t+1 dépend du mot t qu'on vient de produire : il faut une passe par token. D'où les optimisations d'inférence comme le cache des clés et valeurs (KV cache), qui évite de recalculer les tokens déjà traités.",
  },
  {
    id: "tr-p1-2", langue: "transformers", niveau: "pro", type: "flip",
    front: "Les poids d'attention expliquent-ils la décision d'un modèle ?",
    back: "Pas vraiment. Ils montrent où chaque tête « regarde » à une couche donnée, ce qui aide à explorer le modèle (outils comme BertViz). Mais l'information passe aussi par les connexions résiduelles, les feed-forward et de nombreuses têtes et couches : un poids élevé n'est pas une cause démontrée. Comme pour l'importance des variables, c'est une piste d'interprétation, pas une explication causale.",
  },
];
