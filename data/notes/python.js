// Note de cours générée par le skill /notes-de-cours à partir de docs_divers/cours-python.pdf
export const note = {
  id: "python",
  titre: "Python : les bases solides pour la data",
  source: "Cours de Python · P. Fuchs et P. Poulain, Université Paris Cité (version du 29 septembre 2025) · 402 pages",
  deck: "python",
  resume: "Un cours complet de Python (pensé pour la biologie, mais généraliste). La note garde ce qui sert au quotidien d'un profil data : types et formatage, listes et conteneurs avec leurs **pièges de copie**, fonctions et **portée des variables**, chaînes, fichiers et expressions régulières, organisation du code et PEP 8, générateurs, exceptions et décorateurs, **NumPy**, puis la **programmation objet**.\n\nTous les exemples ont été exécutés : les résultats affichés sont réels. Pandas est traité dans le deck Analyse de données ; Tkinter et Biopython, trop spécifiques, sont laissés de côté.",
  prerequis: [],
  concepts: [
    "typage dynamique", "int", "float", "str", "bool", "None", "division entière //", "modulo %", "f-string", "format {:.2f}", "objet mutable", "objet immuable",
    "liste", "indiçage", "tranche (slicing)", "indice négatif", "append vs extend", "sort vs sorted", "référence", "copie de liste", "deepcopy", "liste de listes", "liste de compréhension",
    "zip", "enumerate", "dictionnaire", "tuple", "set", "dictionnaire de compréhension", "Counter", "defaultdict", "tri avec key",
    "fonction", "valeur de retour multiple", "argument par défaut mutable", "*args", "**kwargs", "portée des variables", "règle LGI", "global", "lambda", "récursivité", "docstring",
    "méthodes de chaînes", "split", "join", "with open", "expression régulière", "re.search", "re.findall", "re.sub", "groupe de capture", "chaîne brute r\"\"",
    "module", "import", "__name__ == \"__main__\"", "PEP 8", "PEP 257", "PEP 20", "ruff", "black", "Jupyter",
    "itérable", "itérateur", "générateur", "yield", "expression génératrice", "try / except / else / finally", "raise", "décorateur",
    "NumPy", "array", "dtype", "shape", "reshape", "axis", "vectorisation", "masque booléen", "np.where", "broadcasting", "produit matriciel @",
    "classe", "__init__", "self", "attribut d'instance", "attribut de classe", "méthode", "__repr__", "__str__", "héritage", "super()", "polymorphisme", "composition", "@property", "encapsulation",
  ],
  chapitres: [
    {
      id: "bases",
      titre: "1. Types, opérateurs et affichage",
      objectif: "Les briques de base, et les quelques surprises du calcul en Python.",
      blocs: [
        { type: "texte", contenu: "Python est à **typage dynamique** : une variable n'a pas de type déclaré, c'est la valeur qui en a un (`int`, `float`, `str`, `bool`, `None`…). `type(x)` le donne, `int(\"12\")`, `float(\"3.5\")`, `str(42)` convertissent." },
        { type: "exemple", titre: "Opérateurs arithmétiques", code: `7 // 2     # 3     division entière
7 % 2      # 1     reste (modulo)
7 / 2      # 3.5   division toujours décimale en Python 3
2 ** 10    # 1024  puissance
round(2.675, 2)   # 2.67 et non 2.68 : 2.675 n'est pas représentable exactement` },
        { type: "attention", contenu: "Les nombres décimaux sont stockés en binaire avec une précision limitée : `0.1 + 0.2 == 0.3` vaut **False**. On compare des flottants avec une tolérance (`abs(a - b) < 1e-9` ou `math.isclose`), et on utilise le module `decimal` pour des montants financiers." },
        { type: "exemple", titre: "Formater avec les f-strings", code: `x = 3.14159
print(f"{x:.2f}")          # 3.14     2 décimales
print(f"{42:05d}")         # 00042    largeur 5, complété par des zéros
print(f"{0.256:.1%}")      # 25.6%    pourcentage
print(f"{'ab':>5}|")       #    ab|   aligné à droite sur 5 caractères
print(f"{x=:.1f}")         # x=3.1    affiche le nom et la valeur (débogage)` },
        { type: "definition", terme: "Mutable / immuable", contenu: "Un objet **immuable** ne peut pas être modifié après sa création (int, float, str, tuple, frozenset) : toute « modification » crée un nouvel objet. Un objet **mutable** peut l'être en place (list, dict, set). Cette distinction explique la plupart des pièges des chapitres suivants." },
      ],
    },
    {
      id: "listes",
      titre: "2. Listes et conteneurs",
      objectif: "Manipuler listes, dictionnaires, tuples et sets sans tomber dans les pièges de copie.",
      blocs: [
        { type: "exemple", titre: "Indices et tranches", code: `l = [5, 3, 8, 1]
l[1:3]     # [3, 8]        de l'indice 1 inclus à 3 exclu
l[-1]      # 1             le dernier
l[::-1]    # [1, 8, 3, 5]  à l'envers
l[::2]     # [5, 8]        un sur deux` },
        { type: "tableau", entetes: ["Opération", "Modifie la liste ?", "Renvoie"], lignes: [
          ["`l.append(x)`", "oui", "None (ajoute un élément)"],
          ["`l.extend([x, y])`", "oui", "None (ajoute plusieurs éléments)"],
          ["`l.sort()`", "oui", "**None** : `l = l.sort()` met None dans l"],
          ["`sorted(l)`", "non", "une nouvelle liste triée"],
          ["`l.copy()` ou `l[:]`", "non", "une copie superficielle"],
        ] },
        { type: "attention", contenu: "`b = a` ne copie **pas** la liste : a et b désignent le même objet, et modifier b modifie a. Il faut `b = a.copy()` (ou `list(a)`, `a[:]`). Pour une liste qui contient d'autres listes, la copie superficielle partage encore les sous-listes : utiliser `copy.deepcopy(a)`." },
        { type: "schema", svg: `<svg viewBox="0 0 360 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Deux noms pour une même liste, et une copie">
  <defs><marker id="fl-py-ref" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="s-arrow"/></marker></defs>
  <rect x="6" y="20" width="44" height="30" rx="6" class="s-box"/><text x="28" y="40" text-anchor="middle" class="s-bold">a</text>
  <rect x="6" y="64" width="44" height="30" rx="6" class="s-box"/><text x="28" y="84" text-anchor="middle" class="s-bold">b</text>
  <rect x="140" y="38" width="150" height="38" rx="6" class="s-warn"/><text x="215" y="62" text-anchor="middle" class="s-txt">[1, 2, 3, 4]</text>
  <path d="M50 35L136 52" class="s-line" marker-end="url(#fl-py-ref)"/>
  <path d="M50 79L136 62" class="s-line" marker-end="url(#fl-py-ref)"/>
  <rect x="6" y="114" width="44" height="30" rx="6" class="s-box"/><text x="28" y="134" text-anchor="middle" class="s-bold">c</text>
  <rect x="140" y="110" width="150" height="38" rx="6" class="s-ok"/><text x="215" y="134" text-anchor="middle" class="s-txt">[1, 2, 3, 4, 5]</text>
  <path d="M50 129H136" class="s-line" marker-end="url(#fl-py-ref)"/>
  <text x="300" y="62" class="s-sub">un objet</text>
  <text x="300" y="134" class="s-sub">copie</text>
  <text x="180" y="14" text-anchor="middle" class="s-sub">b = a  →  deux noms, une seule liste ;  c = a.copy()  →  une autre liste</text>
</svg>`, legende: "Une variable est une étiquette posée sur un objet : b = a pose une deuxième étiquette sur la même liste." },
        { type: "exemple", titre: "Deux pièges de références", code: `a = [1, 2, 3]
b = a
b.append(4)
a                    # [1, 2, 3, 4] : a a été modifiée aussi

m = [[0] * 3] * 3    # 3 fois LA MÊME sous-liste
m[0][0] = 1
m                    # [[1, 0, 0], [1, 0, 0], [1, 0, 0]]

m = [[0] * 3 for _ in range(3)]   # 3 sous-listes distinctes
m[0][0] = 1
m                    # [[1, 0, 0], [0, 0, 0], [0, 0, 0]]` },
        { type: "exemple", titre: "Compréhensions, zip, enumerate, tri", code: `[x ** 2 for x in range(6) if x % 2 == 0]        # [0, 4, 16]
list(zip(["a", "b", "c"], [1, 2]))               # [('a', 1), ('b', 2)] : s'arrête au plus court
list(enumerate(["x", "y"], start=1))             # [(1, 'x'), (2, 'y')]
sorted(["poire", "Kiwi", "abricot"], key=str.lower)            # ['abricot', 'Kiwi', 'poire']
sorted([("b", 2), ("a", 3)], key=lambda t: t[1], reverse=True)  # [('a', 3), ('b', 2)]` },
        { type: "tableau", entetes: ["Conteneur", "Ordonné", "Modifiable", "Doublons", "Usage"], lignes: [
          ["`list` [ ]", "oui", "oui", "oui", "Séquence d'éléments"],
          ["`tuple` ( )", "oui", "non", "oui", "Enregistrement fixe, clé de dictionnaire, retour multiple"],
          ["`dict` { k: v }", "oui (ordre d'insertion)", "oui", "clés uniques", "Accès rapide par clé"],
          ["`set` { }", "non", "oui", "non", "Dédoublonner, tester l'appartenance, intersections"],
        ] },
        { type: "exemple", titre: "Le module collections", code: `from collections import Counter, defaultdict

Counter("ATGCATTA").most_common(2)      # [('A', 3), ('T', 3)]

villes = defaultdict(list)              # une liste vide est créée à la première clé
for pays, ville in [("fr", "Paris"), ("fr", "Lyon"), ("it", "Rome")]:
    villes[pays].append(ville)
dict(villes)                            # {'fr': ['Paris', 'Lyon'], 'it': ['Rome']}

{k: len(v) for k, v in villes.items()}  # {'fr': 2, 'it': 1}   dictionnaire de compréhension
{x % 3 for x in range(10)}              # {0, 1, 2}            set de compréhension` },
        { type: "application", titre: "Tester l'appartenance vite", contenu: "`x in liste` parcourt toute la liste ; `x in un_set` (ou une clé de dictionnaire) est quasi instantané grâce au hachage. Sur 1 million d'identifiants à vérifier, convertir la liste en set change tout." },
      ],
    },
    {
      id: "controle",
      titre: "3. Boucles et tests",
      objectif: "Les structures de contrôle et leurs subtilités.",
      blocs: [
        { type: "exemple", titre: "Boucles", code: `for i in range(2, 10, 3):     # 2, 5, 8 : début, fin exclue, pas
    print(i)

while solde > 0:
    solde -= retrait

for ligne in fichier:
    if ligne.startswith("#"):
        continue                 # passe à l'itération suivante
    if ligne == "FIN":
        break                    # sort de la boucle` },
        { type: "tableau", entetes: ["Expression", "Résultat", "Explication"], lignes: [
          ["`1 < 5 < 10`", "True", "Les comparaisons s'enchaînent comme en maths"],
          ["`[1] == [1]`", "True", "Même **contenu**"],
          ["`[1] is [1]`", "False", "Pas le même **objet** en mémoire"],
          ["`x is None`", "", "La bonne façon de tester None (pas `== None`)"],
          ["`if liste:`", "", "Faux si la liste est vide (même règle pour \"\", 0, None, {})"],
        ] },
        { type: "attention", contenu: "Ne pas modifier une liste pendant qu'on la parcourt (supprimer des éléments dans un `for` sur cette liste saute des éléments) : construire une nouvelle liste avec une compréhension." },
      ],
    },
    {
      id: "fonctions",
      titre: "4. Fonctions et portée des variables",
      objectif: "Écrire des fonctions réutilisables et comprendre où vivent les variables.",
      blocs: [
        { type: "exemple", titre: "Définir, documenter, renvoyer plusieurs valeurs", code: `def stats(valeurs):
    """Renvoie le minimum et le maximum d'une liste de nombres."""   # docstring (PEP 257)
    return min(valeurs), max(valeurs)      # en réalité un tuple

mini, maxi = stats([4, 9, 1])              # déballage : mini = 1, maxi = 9` },
        { type: "exemple", titre: "Arguments variables", code: `def f(*args, **kwargs):
    return args, kwargs

f(1, 2, unite="cm")    # ((1, 2), {'unite': 'cm'})
# *args reçoit les arguments positionnels en tuple, **kwargs les arguments nommés en dict` },
        { type: "definition", terme: "Règle LGI", contenu: "Pour trouver une variable, Python cherche d'abord dans l'espace **L**ocal (la fonction), puis **G**lobal (le module), puis **I**nterne (les fonctions intégrées comme `len`). Une variable créée dans une fonction est locale et disparaît à la fin de l'appel. (La documentation anglaise parle de règle LEGB, en ajoutant les fonctions englobantes.)" },
        { type: "exemple", titre: "Portée d'une variable, et d'une liste", code: `x = 10
def f():
    x = 5          # crée un x LOCAL, ne touche pas au x global
    return x
f(), x             # (5, 10)

def modifie(l):
    l.append(99)   # modifie l'objet reçu : la liste est mutable
z = [1]
modifie(z)
z                  # [1, 99] : une fonction peut modifier une liste passée en argument` },
        { type: "attention", contenu: "Précision (piège classique, au-delà du cours) : une valeur par défaut **mutable** est créée une seule fois, à la définition de la fonction, et partagée par tous les appels.", code: `def ajoute(x, liste=[]):      # piège
    liste.append(x)
    return liste
ajoute(1)    # [1]
ajoute(2)    # [1, 2]  la même liste est réutilisée !

def ajoute(x, liste=None):    # correct
    if liste is None:
        liste = []
    liste.append(x)
    return liste` },
        { type: "texte", contenu: "Une **lambda** est une petite fonction anonyme d'une expression, utile comme clé de tri ou dans `map` / `filter` : `sorted(clients, key=lambda c: c[\"ca\"])`. Pour plus d'une ligne, écrire une vraie fonction." },
        { type: "attention", contenu: "Le cours recommande d'éviter `global` : une fonction qui lit et modifie des variables globales est difficile à tester et à réutiliser. Passer les valeurs en arguments et récupérer le résultat avec `return`." },
      ],
    },
    {
      id: "texte",
      titre: "5. Chaînes, fichiers et expressions régulières",
      objectif: "Lire et nettoyer du texte.",
      blocs: [
        { type: "tableau", entetes: ["Méthode", "Exemple", "Résultat"], lignes: [
          ["`split`", "`\"a;b;c\".split(\";\")`", "['a', 'b', 'c']"],
          ["`join`", "`\"-\".join([\"a\", \"b\"])`", "'a-b'"],
          ["`strip`", "`\"  x \\n\".strip()`", "'x' (espaces et retours à la ligne retirés)"],
          ["`replace`", "`\"1,5\".replace(\",\", \".\")`", "'1.5'"],
          ["`startswith` / `endswith`", "`\"data.csv\".endswith(\".csv\")`", "True"],
          ["`upper` / `lower` / `title`", "`\"ana\".title()`", "'Ana'"],
          ["`find` / `count`", "`\"banane\".count(\"an\")`", "2"],
        ] },
        { type: "attention", contenu: "Les chaînes sont **immuables** : `s.upper()` ne modifie pas s, il renvoie une nouvelle chaîne. Il faut écrire `s = s.upper()`." },
        { type: "exemple", titre: "Lire et écrire un fichier proprement", code: `with open("ventes.csv", encoding="utf-8") as f:     # fermé automatiquement, même en cas d'erreur
    entete = f.readline().strip().split(";")
    total = 0.0
    for ligne in f:                                   # ligne par ligne : peu de mémoire
        champs = ligne.strip().split(";")
        total += float(champs[2])

with open("total.txt", "w", encoding="utf-8") as f:  # "w" écrase, "a" ajoute
    f.write(f"{total:.2f}\\n")` },
        { type: "exemple", titre: "Expressions régulières", code: `import re
texte = "Ana: 06 12 34 56 78, Bob: 07-98-76-54-32"

re.findall(r"0[67](?:[ -]?\\d{2}){4}", texte)
# ['06 12 34 56 78', '07-98-76-54-32']   tous les numéros de mobile

m = re.search(r"(\\w+): (\\d{2})", texte)
m.group(1), m.group(2)          # ('Ana', '06')   groupes de capture

re.sub(r"\\s+", " ", "a   b \\t c")   # 'a b c'   espaces multiples → un seul` },
        { type: "liste", items: [
          "Toujours écrire les motifs en **chaîne brute** `r\"…\"` : sinon `\\d` ou `\\b` sont interprétés par Python avant d'arriver au module `re`.",
          "`\\d` chiffre, `\\w` lettre ou chiffre, `\\s` espace, `.` n'importe quel caractère, `*` 0 ou plus, `+` 1 ou plus, `?` 0 ou 1, `{n}` exactement n fois, `^` début, `$` fin.",
          "`re.search` : première occurrence n'importe où ; `re.match` : seulement au début ; `re.findall` : toutes les occurrences.",
        ] },
      ],
    },
    {
      id: "organisation",
      titre: "6. Modules et bonnes pratiques",
      objectif: "Écrire du code lisible, réutilisable et conforme aux standards.",
      blocs: [
        { type: "exemple", titre: "Un script qui est aussi un module", code: `# fichier outils.py
def nettoyer(texte):
    """Retire les espaces superflus et met en minuscules."""
    return " ".join(texte.split()).lower()

if __name__ == "__main__":       # exécuté seulement avec « python outils.py »
    print(nettoyer("  Bonjour   LE monde "))

# ailleurs :  from outils import nettoyer   (le bloc ci-dessus ne s'exécute pas)` },
        { type: "tableau", entetes: ["Règle (PEP 8)", "Exemple"], lignes: [
          ["Indentation de 4 espaces", "pas de tabulations"],
          ["Variables et fonctions en snake_case", "`taux_conversion`, `calcul_total()`"],
          ["Classes en CamelCase", "`class CompteBancaire`"],
          ["Constantes en majuscules", "`TAUX_TVA = 0.2`"],
          ["Imports en haut du fichier, un par ligne", "bibliothèque standard, puis externes, puis locaux"],
          ["Lignes de longueur raisonnable", "79 caractères dans la PEP 8 (souvent 88 à 100 en pratique)"],
        ] },
        { type: "texte", contenu: "Les **docstrings** (PEP 257) documentent modules, classes et fonctions entre triples guillemets ; `help(fonction)` les affiche. Des outils vérifient et formatent le code automatiquement : le cours cite pycodestyle, pylint et black ; aujourd'hui **ruff** regroupe la vérification et le formatage en un seul outil très rapide." },
        { type: "renvoi", vers: "tests", contenu: "Tests unitaires avec pytest, fixtures, linting en intégration continue : deck Tests & qualité." },
        { type: "texte", contenu: "La **PEP 20** (« Le Zen de Python », `import this`) résume l'esprit du langage : « Le beau vaut mieux que le laid », « L'explicite vaut mieux que l'implicite », « La lisibilité compte »." },
      ],
    },
    {
      id: "avance",
      titre: "7. Générateurs, exceptions, décorateurs",
      objectif: "Trois outils qu'on rencontre dans tout code Python professionnel.",
      blocs: [
        { type: "definition", terme: "Générateur", contenu: "Une fonction qui contient `yield` produit ses valeurs **une par une, à la demande**, au lieu de construire toute une liste en mémoire. Une expression génératrice s'écrit comme une compréhension, entre parenthèses." },
        { type: "exemple", titre: "Générateurs", code: `def compte(n):
    i = 0
    while i < n:
        yield i          # met la fonction en pause et renvoie i
        i += 1
list(compte(3))          # [0, 1, 2]

sum(n * n for n in range(1_000_000))   # 333332833333500000, sans jamais créer la liste` },
        { type: "exemple", titre: "Gérer les erreurs", code: `try:
    valeur = int("abc")
except ValueError as e:          # attraper une erreur PRÉCISE
    print("erreur :", e)         # erreur : invalid literal for int() with base 10: 'abc'
else:
    print("conversion réussie")  # seulement si aucune exception
finally:
    print("toujours exécuté")    # nettoyage (fermer une connexion…)

if montant < 0:
    raise ValueError("montant négatif")   # lever sa propre erreur` },
        { type: "attention", contenu: "Ne jamais écrire `except:` ou `except Exception:` sans traiter l'erreur : on masque aussi les fautes de frappe et les vrais bugs. Attraper l'exception précise attendue (`ValueError`, `KeyError`, `FileNotFoundError`)." },
        { type: "definition", terme: "Décorateur", contenu: "Une fonction qui prend une fonction et renvoie une version enrichie (journalisation, chronométrage, cache, contrôle d'accès). La syntaxe `@decorateur` au-dessus d'une définition équivaut à `f = decorateur(f)`." },
        { type: "exemple", titre: "Un décorateur de chronométrage", code: `import time, functools

def chrono(f):
    @functools.wraps(f)                 # conserve le nom et la docstring de f
    def enveloppe(*args, **kwargs):
        debut = time.perf_counter()
        resultat = f(*args, **kwargs)
        print(f"{f.__name__} : {time.perf_counter() - debut:.3f} s")
        return resultat
    return enveloppe

@chrono
def somme(n):
    return sum(range(n))

somme(10)    # affiche « somme : 0.000 s » puis renvoie 45` },
        { type: "application", titre: "Décorateurs que tu croises déjà", contenu: "`@pytest.fixture`, `@functools.lru_cache` (mémoïser une fonction coûteuse), `@property` (chapitre 9), `@udf` et `@pandas_udf` en PySpark, `@app.get(\"/\")` dans les API web." },
      ],
    },
    {
      id: "numpy",
      titre: "8. NumPy : calculer sur des tableaux",
      objectif: "Comprendre pourquoi NumPy est rapide et maîtriser axis, masques et broadcasting.",
      blocs: [
        { type: "texte", contenu: "Un `array` NumPy contient des éléments **d'un seul type** stockés de façon contiguë en mémoire. Les opérations s'appliquent à tout le tableau d'un coup (**vectorisation**), en code compilé : souvent des dizaines de fois plus rapide qu'une boucle Python. NumPy est la base de pandas, scikit-learn et de la plupart des bibliothèques scientifiques." },
        { type: "exemple", titre: "Créer et calculer", code: `import numpy as np
a = np.array([[1, 2, 3], [4, 5, 6]])
a.shape, a.dtype       # ((2, 3), dtype('int64'))
a * 10                 # [[10 20 30] [40 50 60]]   chaque élément
a.sum(axis=0)          # [5 7 9]    somme de chaque COLONNE (on écrase l'axe des lignes)
a.sum(axis=1)          # [ 6 15]    somme de chaque LIGNE
a.mean()               # 3.5
np.arange(6).reshape(2, 3)    # [[0 1 2] [3 4 5]]
np.linspace(0, 1, 5)          # [0.   0.25 0.5  0.75 1.  ]
a @ a.T                # [[14 32] [32 77]]   produit matriciel` },
        { type: "schema", svg: `<svg viewBox="0 0 360 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sens de axis dans NumPy">
  <defs><marker id="fl-py-axis" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="s-arrow"/></marker></defs>
  <rect x="70" y="30" width="44" height="34" rx="4" class="s-box"/><text x="92" y="52" text-anchor="middle" class="s-txt">1</text>
  <rect x="116" y="30" width="44" height="34" rx="4" class="s-box"/><text x="138" y="52" text-anchor="middle" class="s-txt">2</text>
  <rect x="162" y="30" width="44" height="34" rx="4" class="s-box"/><text x="184" y="52" text-anchor="middle" class="s-txt">3</text>
  <rect x="70" y="66" width="44" height="34" rx="4" class="s-box"/><text x="92" y="88" text-anchor="middle" class="s-txt">4</text>
  <rect x="116" y="66" width="44" height="34" rx="4" class="s-box"/><text x="138" y="88" text-anchor="middle" class="s-txt">5</text>
  <rect x="162" y="66" width="44" height="34" rx="4" class="s-box"/><text x="184" y="88" text-anchor="middle" class="s-txt">6</text>
  <path d="M138 104V122" class="s-line" marker-end="url(#fl-py-axis)"/>
  <text x="146" y="118" class="s-sub">axis=0</text>
  <rect x="70" y="128" width="136" height="30" rx="6" class="s-acc"/><text x="138" y="148" text-anchor="middle" class="s-txt">[5, 7, 9]</text>
  <path d="M210 65H230" class="s-line" marker-end="url(#fl-py-axis)"/>
  <text x="306" y="69" class="s-sub">axis=1</text>
  <rect x="234" y="30" width="66" height="70" rx="6" class="s-acc"/><text x="267" y="58" text-anchor="middle" class="s-txt">6</text><text x="267" y="84" text-anchor="middle" class="s-txt">15</text>
  <text x="180" y="14" text-anchor="middle" class="s-sub">a.sum(axis=…) sur une matrice 2 × 3</text>
</svg>`, legende: "axis=0 écrase les lignes (un total par colonne) ; axis=1 écrase les colonnes (un total par ligne)." },
        { type: "attention", contenu: "`axis=0` ne veut pas dire « les lignes » mais « l'axe que l'on fait disparaître » : sommer selon axis=0 réduit les lignes et donne **un résultat par colonne**. Même convention dans pandas (`df.sum(axis=0)` = total de chaque colonne)." },
        { type: "exemple", titre: "Masques booléens", code: `a > 2                  # [[False False  True] [ True  True  True]]
a[a > 2]               # [3 4 5 6]           filtrer
np.where(a > 2, 1, 0)  # [[0 0 1] [1 1 1]]   si / sinon, élément par élément
a[a > 2] = 0           # modifier en place les éléments sélectionnés` },
        { type: "definition", terme: "Broadcasting (diffusion)", contenu: "Précision (au-delà du cours) : quand deux tableaux n'ont pas la même forme, NumPy « étire » virtuellement le plus petit le long des dimensions de taille 1, sans copier les données. Un vecteur de 3 valeurs s'ajoute ainsi à chaque ligne d'une matrice 2 × 3 :" , },
        { type: "code", contenu: `a + np.array([10, 20, 30])    # [[11 22 33] [14 25 36]]
# règle : les dimensions sont comparées depuis la droite ; elles doivent être égales ou valoir 1` },
        { type: "attention", contenu: "Une liste et un array ne se comportent pas pareil : `[1, 2] * 2` donne `[1, 2, 1, 2]` (répétition) alors que `np.array([1, 2]) * 2` donne `[2 4]` (multiplication élément par élément)." },
        { type: "renvoi", vers: "analyse", contenu: "Pandas (DataFrame, loc / iloc, groupby, merge, dates) est détaillé dans le deck Analyse de données ; Matplotlib y est remplacé par le choix du bon graphique." },
      ],
    },
    {
      id: "objets",
      titre: "9. Programmation orientée objet",
      objectif: "Écrire et lire des classes, éviter le piège des attributs de classe.",
      blocs: [
        { type: "exemple", titre: "Une classe simple", code: `class Chien:
    espece = "canis"                    # attribut de CLASSE : partagé par tous

    def __init__(self, nom):            # constructeur, appelé à la création
        self.nom = nom                  # attributs d'INSTANCE : propres à chaque chien
        self.tours = []

    def apprend(self, tour):            # méthode : self = l'objet sur lequel on l'appelle
        self.tours.append(tour)

    def __repr__(self):                 # représentation lisible (console, débogage)
        return f"Chien({self.nom!r})"

rex = Chien("Rex")
rex.apprend("assis")
rex, rex.tours, Chien.espece            # (Chien('Rex'), ['assis'], 'canis')` },
        { type: "attention", contenu: "Une liste déclarée comme attribut **de classe** est partagée par toutes les instances : chaque objet qui y ajoute un élément le modifie pour tous. Les données propres à chaque objet se créent dans `__init__` avec `self.`.", code: `class Mauvais:
    tours = []                    # partagé !
    def apprend(self, t):
        self.tours.append(t)

m1, m2 = Mauvais(), Mauvais()
m1.apprend("assis")
m2.tours                          # ['assis'] : m2 a « appris » le tour de m1` },
        { type: "exemple", titre: "Héritage et polymorphisme", code: `class Animal:
    def __init__(self, nom):
        self.nom = nom
    def cri(self):
        return "..."

class Chat(Animal):                     # Chat hérite d'Animal
    def __init__(self, nom, couleur):
        super().__init__(nom)           # réutilise le constructeur parent
        self.couleur = couleur
    def cri(self):                      # redéfinit la méthode
        return "miaou"

for a in [Animal("x"), Chat("Tom", "gris")]:
    print(a.nom, a.cri())               # x ...   puis   Tom miaou` },
        { type: "texte", contenu: "**Polymorphisme** : du code qui appelle `a.cri()` fonctionne avec tout objet qui possède cette méthode. **Composition** : plutôt que d'hériter, une classe peut contenir d'autres objets (une Voiture *a* un Moteur, elle n'*est* pas un Moteur) ; c'est souvent plus souple que l'héritage." },
        { type: "exemple", titre: "Contrôler l'accès avec @property", code: `class Compte:
    def __init__(self, solde):
        self._solde = solde             # _ : convention « usage interne »

    @property
    def solde(self):                    # se lit comme un attribut : c.solde
        return self._solde

    @solde.setter
    def solde(self, valeur):            # c.solde = … passe par cette vérification
        if valeur < 0:
            raise ValueError("solde négatif")
        self._solde = valeur

c = Compte(10)
c.solde = 30
c.solde      # 30
# c.solde = -5  → ValueError` },
        { type: "tableau", entetes: ["Méthode spéciale", "Appelée par"], lignes: [
          ["`__init__`", "la création de l'objet"],
          ["`__repr__` / `__str__`", "la console / `print()` et `str()`"],
          ["`__len__`, `__getitem__`", "`len(obj)`, `obj[i]`"],
          ["`__eq__`, `__lt__`", "`==`, `<` (comparaison et tri)"],
          ["`__add__`", "`+`"],
        ] },
        { type: "application", titre: "Où tu utilises déjà des objets", contenu: "Un DataFrame pandas, un modèle scikit-learn (`.fit()`, `.predict()`), une SparkSession : ce sont des classes. Comprendre les attributs et les méthodes aide à lire leur documentation et leurs messages d'erreur." },
      ],
    },
  ],
  aRetenir: [
    "0.1 + 0.2 != 0.3 : comparer des flottants avec une tolérance ; f-strings pour formater (`{x:.2f}`, `{p:.1%}`).",
    "b = a ne copie pas une liste ; a.copy() pour une copie superficielle, copy.deepcopy pour des listes imbriquées ; [[0]*3]*3 répète la même sous-liste.",
    "l.sort() modifie et renvoie None ; sorted(l) renvoie une nouvelle liste. Les sets et dictionnaires testent l'appartenance quasi instantanément.",
    "Règle LGI : local, puis global, puis interne ; une fonction peut modifier une liste reçue ; jamais de valeur par défaut mutable.",
    "with open(…) ferme le fichier automatiquement ; motifs de regex en chaîne brute r\"…\".",
    "if __name__ == \"__main__\" : code exécuté seulement quand le fichier est lancé directement. PEP 8, docstrings, ruff.",
    "Générateurs (yield) pour économiser la mémoire ; attraper des exceptions précises ; un décorateur enveloppe une fonction.",
    "NumPy : vectorisation, axis = l'axe qui disparaît, masques booléens, broadcasting.",
    "Classes : attributs d'instance dans __init__, jamais de liste mutable comme attribut de classe ; héritage avec super(), @property pour contrôler l'accès.",
  ],
};
