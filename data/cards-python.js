// Deck généré par le skill /notes-de-cours à partir de docs_divers/cours-python.pdf
// (note : data/notes/python.js). Pandas est couvert par le deck Analyse de données.
export const cardsPython = [
  {
    id: "py-f1-1", langue: "python", niveau: "fondamentaux", type: "qcm",
    front: "Que vaut `0.1 + 0.2 == 0.3` en Python ?",
    choices: ["True", "False", "Une erreur", "None"],
    answer: 1,
    explain: "0.1 et 0.2 n'ont pas de représentation binaire exacte : leur somme vaut 0.30000000000000004. On compare des flottants avec une tolérance (abs(a - b) < 1e-9 ou math.isclose) et on utilise decimal pour des montants financiers.",
  },
  {
    id: "py-f1-2", langue: "python", niveau: "fondamentaux", type: "flip",
    front: "Que valent 7 // 2, 7 % 2 et 7 / 2 ?",
    back: "7 // 2 = 3 (division entière), 7 % 2 = 1 (reste, modulo), 7 / 2 = 3.5 (en Python 3, / donne toujours un décimal). Le modulo sert à tester la parité (n % 2 == 0) ou à faire « tourner » un indice.",
  },
  {
    id: "py-f1-3", langue: "python", niveau: "fondamentaux", type: "flip",
    front: "Comment afficher 3.14159 avec 2 décimales, 0.256 en pourcentage et 42 sur 5 chiffres avec des zéros ?",
    back: "Avec des f-strings : f\"{x:.2f}\" → 3.14 ; f\"{0.256:.1%}\" → 25.6% ; f\"{42:05d}\" → 00042. Et f\"{x=}\" affiche le nom de la variable avec sa valeur, pratique pour déboguer.",
  },
  {
    id: "py-f1-4", langue: "python", niveau: "fondamentaux", type: "code",
    front: "Que contient `a` à la fin ?",
    code: "a = [1, 2, 3]\nb = a\nb.append(4)",
    back: "[1, 2, 3, 4]. b = a ne copie pas la liste : les deux noms désignent le même objet. Pour une copie indépendante : b = a.copy() (ou list(a), a[:]) ; pour des listes imbriquées : copy.deepcopy(a).",
  },
  {
    id: "py-f1-5", langue: "python", niveau: "fondamentaux", type: "flip",
    front: "l.sort() vs sorted(l) ?",
    back: "l.sort() trie la liste sur place et renvoie None (écrire l = l.sort() met None dans l). sorted(l) laisse l intacte et renvoie une nouvelle liste triée ; il accepte aussi n'importe quel itérable. Les deux prennent key= et reverse=.",
    example: "sorted([(\"b\", 2), (\"a\", 3)], key=lambda t: t[1], reverse=True)   # [('a', 3), ('b', 2)]",
  },
  {
    id: "py-f1-6", langue: "python", niveau: "fondamentaux", type: "flip",
    front: "Que donnent l[1:3], l[-1], l[::-1] et l[::2] pour l = [5, 3, 8, 1] ?",
    back: "l[1:3] = [3, 8] (fin exclue), l[-1] = 1 (le dernier), l[::-1] = [1, 8, 3, 5] (à l'envers), l[::2] = [5, 8] (un sur deux). Les mêmes tranches marchent sur les chaînes et les tuples.",
  },
  {
    id: "py-f1-7", langue: "python", niveau: "fondamentaux", type: "flip",
    front: "list, tuple, dict, set : quelles différences ?",
    back: "list : ordonnée, modifiable, doublons autorisés. tuple : ordonné, NON modifiable (enregistrement fixe, clé de dictionnaire, retour multiple). dict : paires clé-valeur, clés uniques, accès rapide par clé, ordre d'insertion conservé. set : non ordonné, sans doublons, test d'appartenance très rapide, opérations ensemblistes.",
  },
  {
    id: "py-f1-8", langue: "python", niveau: "fondamentaux", type: "flip",
    front: "Écris une liste de compréhension qui donne les carrés des nombres pairs de 0 à 5.",
    back: "[x ** 2 for x in range(6) if x % 2 == 0]  →  [0, 4, 16]\nMême principe pour un dictionnaire {k: v for …} ou un set {x for …}. Plus lisible et plus rapide qu'une boucle avec append.",
  },
  {
    id: "py-f1-9", langue: "python", niveau: "fondamentaux", type: "flip",
    front: "Pourquoi ouvrir un fichier avec `with open(...) as f` ?",
    back: "Le bloc with ferme automatiquement le fichier à la sortie, même si une erreur se produit au milieu. Parcourir f ligne par ligne (for ligne in f) lit le fichier progressivement, sans tout charger en mémoire. Préciser encoding=\"utf-8\" évite les problèmes d'accents.",
  },
  {
    id: "py-f1-10", langue: "python", niveau: "fondamentaux", type: "flip",
    front: "À quoi sert `if __name__ == \"__main__\":` ?",
    back: "Le code de ce bloc ne s'exécute que lorsque le fichier est lancé directement (python outils.py), pas quand il est importé comme module (from outils import nettoyer). On peut ainsi réutiliser les fonctions d'un script sans déclencher son programme principal.",
  },
  {
    id: "py-i1-1", langue: "python", niveau: "intermediaire", type: "code",
    front: "Que contient m après ces lignes, et pourquoi ?",
    code: "m = [[0] * 3] * 3\nm[0][0] = 1",
    back: "[[1, 0, 0], [1, 0, 0], [1, 0, 0]] : * 3 répète trois fois la MÊME sous-liste. Pour trois sous-listes indépendantes :\nm = [[0] * 3 for _ in range(3)]  →  [[1, 0, 0], [0, 0, 0], [0, 0, 0]] après m[0][0] = 1.",
  },
  {
    id: "py-i1-2", langue: "python", niveau: "intermediaire", type: "code",
    front: "Que renvoient successivement ajoute(1) puis ajoute(2) ? Corrige la fonction.",
    code: "def ajoute(x, liste=[]):\n    liste.append(x)\n    return liste",
    back: "ajoute(1) → [1], puis ajoute(2) → [1, 2] : la valeur par défaut est créée UNE fois, à la définition, et partagée par tous les appels.\nCorrection :\ndef ajoute(x, liste=None):\n    if liste is None:\n        liste = []\n    liste.append(x)\n    return liste",
  },
  {
    id: "py-i1-3", langue: "python", niveau: "intermediaire", type: "flip",
    front: "Qu'est-ce que la règle LGI (LEGB) ?",
    back: "L'ordre dans lequel Python cherche un nom : Local (la fonction en cours), puis Global (le module), puis Interne (les fonctions intégrées comme len). La version anglaise LEGB ajoute E (Enclosing : les fonctions englobantes). Une affectation dans une fonction crée une variable locale, sans toucher à la globale du même nom.",
    example: "x = 10\ndef f():\n    x = 5\n    return x\nf(), x   # (5, 10)",
  },
  {
    id: "py-i1-4", langue: "python", niveau: "intermediaire", type: "flip",
    front: "Une fonction peut-elle modifier une liste qu'on lui passe en argument ?",
    back: "Oui : elle reçoit une référence vers le même objet, et une liste est mutable. l.append(99) dans la fonction modifie la liste de l'appelant. En revanche, réaffecter le paramètre (l = [99]) ne change que la variable locale. Pour éviter les effets de bord, travailler sur une copie et renvoyer le résultat.",
  },
  {
    id: "py-i1-5", langue: "python", niveau: "intermediaire", type: "flip",
    front: "Que reçoivent *args et **kwargs ?",
    back: "*args reçoit les arguments positionnels supplémentaires sous forme de tuple, **kwargs les arguments nommés sous forme de dictionnaire. f(1, 2, unite=\"cm\") → args = (1, 2), kwargs = {'unite': 'cm'}. À l'appel, * et ** « déballent » une liste ou un dictionnaire en arguments.",
  },
  {
    id: "py-i1-6", langue: "python", niveau: "intermediaire", type: "flip",
    front: "Counter et defaultdict : à quoi servent-ils ?",
    back: "Counter compte les occurrences d'un itérable : Counter(\"ATGCATTA\").most_common(2) → [('A', 3), ('T', 3)]. defaultdict(list) crée automatiquement une valeur par défaut (ici une liste vide) à la première utilisation d'une clé : plus besoin de tester if cle not in d avant d[cle].append(…).",
  },
  {
    id: "py-i1-7", langue: "python", niveau: "intermediaire", type: "code",
    front: "Que renvoient ces appels ?",
    code: "import re\ntexte = \"Ana: 06 12 34 56 78, Bob: 07-98-76-54-32\"\nre.findall(r\"0[67](?:[ -]?\\d{2}){4}\", texte)\nre.search(r\"(\\w+): (\\d{2})\", texte).group(1)",
    back: "findall → ['06 12 34 56 78', '07-98-76-54-32'] : tous les numéros de mobile, séparés ou non par espace ou tiret.\nsearch(...).group(1) → 'Ana' : premier groupe de capture de la première correspondance.\nLe r devant les guillemets (chaîne brute) évite que Python interprète \\d avant le module re.",
  },
  {
    id: "py-i1-8", langue: "python", niveau: "intermediaire", type: "flip",
    front: "Qu'est-ce qu'un générateur et quel est son intérêt ?",
    back: "Une fonction qui utilise yield : elle produit ses valeurs une par une, à la demande, en se mettant en pause entre deux. Rien n'est stocké d'avance : on peut parcourir des millions d'éléments ou un fichier énorme avec très peu de mémoire. sum(n * n for n in range(1_000_000)) ne crée jamais la liste.",
  },
  {
    id: "py-i1-9", langue: "python", niveau: "intermediaire", type: "qcm",
    front: "Pourquoi éviter `except:` sans type d'exception ?",
    choices: [
      "C'est interdit par la syntaxe",
      "Il attrape toutes les erreurs, y compris les bugs et les fautes de frappe, qui passent alors inaperçus",
      "Il ralentit fortement le programme",
      "Il ne fonctionne qu'en Python 2",
    ],
    answer: 1,
    explain: "Un except trop large masque les vraies erreurs (NameError, KeyError imprévue…) et même Ctrl+C. On attrape l'exception précise attendue (ValueError, FileNotFoundError), on utilise else pour le cas sans erreur et finally pour le nettoyage.",
  },
  {
    id: "py-i1-10", langue: "python", niveau: "intermediaire", type: "flip",
    front: "Dans NumPy, que donnent a.sum(axis=0) et a.sum(axis=1) pour a = [[1, 2, 3], [4, 5, 6]] ?",
    back: "axis=0 → [5, 7, 9] : une somme par COLONNE (l'axe des lignes disparaît). axis=1 → [6, 15] : une somme par LIGNE. Retenir : axis désigne l'axe que l'on écrase. Même convention dans pandas.",
  },
  {
    id: "py-i1-11", langue: "python", niveau: "intermediaire", type: "flip",
    front: "Pourquoi NumPy est-il bien plus rapide qu'une boucle Python sur une liste ?",
    back: "Un array contient des éléments d'un seul type, rangés de façon contiguë en mémoire, et ses opérations (a * 10, a.sum(), a > 2) s'exécutent en code compilé sur tout le tableau d'un coup : c'est la vectorisation. Une boucle Python traite chaque élément comme un objet, avec une vérification de type à chaque étape.",
  },
  {
    id: "py-i1-12", langue: "python", niveau: "intermediaire", type: "flip",
    front: "Comment filtrer et remplacer des valeurs d'un array NumPy selon une condition ?",
    back: "Avec un masque booléen : a[a > 2] renvoie les éléments supérieurs à 2 ; a[a > 2] = 0 les remplace sur place ; np.where(a > 2, 1, 0) construit un nouveau tableau « si / sinon » élément par élément.",
  },
  {
    id: "py-a1-1", langue: "python", niveau: "avance", type: "flip",
    front: "Qu'est-ce que le broadcasting en NumPy ?",
    back: "Quand deux tableaux ont des formes différentes, NumPy étire virtuellement le plus petit le long des dimensions de taille 1, sans copier les données. Les dimensions sont comparées depuis la droite : elles doivent être égales ou valoir 1.",
    example: "a = [[1, 2, 3], [4, 5, 6]]   (forme 2 × 3)\na + [10, 20, 30]             (forme 3)\n→ [[11, 22, 33], [14, 25, 36]]",
  },
  {
    id: "py-a1-2", langue: "python", niveau: "avance", type: "code",
    front: "Que vaut m2.tours ? Corrige la classe.",
    code: "class Mauvais:\n    tours = []\n    def apprend(self, t):\n        self.tours.append(t)\n\nm1, m2 = Mauvais(), Mauvais()\nm1.apprend(\"assis\")",
    back: "['assis'] : tours est un attribut de CLASSE, une seule liste partagée par toutes les instances. Correction : créer la liste dans le constructeur.\ndef __init__(self):\n    self.tours = []\nChaque objet a alors sa propre liste.",
  },
  {
    id: "py-a1-3", langue: "python", niveau: "avance", type: "flip",
    front: "À quoi sert super().__init__(...) dans une classe fille ?",
    back: "À appeler le constructeur de la classe parente pour qu'il initialise ses propres attributs, avant d'ajouter ceux de la classe fille. Sans cet appel, les attributs définis dans le parent (self.nom…) n'existeraient pas sur l'objet.",
    example: "class Chat(Animal):\n    def __init__(self, nom, couleur):\n        super().__init__(nom)\n        self.couleur = couleur",
  },
  {
    id: "py-a1-4", langue: "python", niveau: "avance", type: "flip",
    front: "Pourquoi utiliser @property plutôt qu'un attribut public ?",
    back: "Pour contrôler la lecture ou l'écriture tout en gardant la syntaxe simple d'un attribut : c.solde = -5 passe par un setter qui peut lever une erreur. On peut ajouter une validation ou un calcul plus tard sans changer le code qui utilise la classe. Le préfixe _ (self._solde) signale par convention un attribut interne.",
  },
  {
    id: "py-a1-5", langue: "python", niveau: "avance", type: "flip",
    front: "Qu'est-ce qu'un décorateur ? Donne un exemple d'usage.",
    back: "Une fonction qui prend une fonction et en renvoie une version enrichie ; @deco au-dessus d'une définition équivaut à f = deco(f). Usages : chronométrer, journaliser, mettre en cache (@functools.lru_cache), contrôler l'accès. functools.wraps conserve le nom et la docstring de la fonction d'origine.",
  },
  {
    id: "py-a1-6", langue: "python", niveau: "avance", type: "qcm",
    front: "Que vaut `[1] is [1]`, et pourquoi ?",
    choices: [
      "True : les deux listes ont le même contenu",
      "False : is compare l'identité (le même objet en mémoire), pas le contenu ; [1] == [1] vaut True",
      "Une erreur de syntaxe",
      "None",
    ],
    answer: 1,
    explain: "is teste l'identité, == l'égalité de valeur. On réserve is aux singletons : x is None, x is True. Écrire x == None fonctionne souvent, mais c'est is None qui est correct.",
  },
  {
    id: "py-p1-1", langue: "python", niveau: "pro", type: "flip",
    front: "Quelles pratiques rendent un script Python prêt à être partagé ?",
    back: "Respecter la PEP 8 (snake_case, 4 espaces, imports en tête), documenter avec des docstrings (PEP 257), découper en fonctions courtes sans variables globales, protéger le programme principal par if __name__ == \"__main__\", vérifier et formater automatiquement (ruff, black), et tester les fonctions avec pytest.",
  },
  {
    id: "py-p1-2", langue: "python", niveau: "pro", type: "flip",
    front: "Héritage ou composition : comment choisir ?",
    back: "Héritage quand la relation est « est un » et que la classe fille respecte tout le contrat du parent (un Chat est un Animal). Composition quand la relation est « a un » (une Voiture a un Moteur) : on stocke l'objet en attribut. La composition est souvent plus souple : on peut remplacer une pièce sans toucher à une hiérarchie de classes.",
  },
];
