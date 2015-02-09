# game-wang

En 1936, dans l’article intitulé "Finite combinatory processes - formulation 1", Emil Post estime que le modèle qu’il vient de conjecturer, d’une simplicité extrême (d’après lui !), est "logiquement équivalent à la récursivité" ; l’histoire lui donnera raison...

En fait le modèle de Post utilise un procédé qui consiste en une séquence infinie de "boites" :
Une boite peut-être marquée ou non.
Initialement, un certain nombre (fini) de boites est marqué, les autres étant, de facto, non marquées. 
Un "ouvrier" va alors se déplacer de boite en boite et manipuler une seule boite à la fois.
Ce faisant, il va marquer ou effacer une marque sur la boite en fonction des instructions qui lui ont été données.
Finalement les instructions feront effectuer les actions suivantes, très basiques, à cet ouvrier :

(a) Marquer la boîte devant laquelle il se trouve (à condition que celle-ci soit non-marquée),
(b) Effacer la marque de la boite devant laquelle il se trouve (à condition que celle-ci soit marquée),
(c) se déplacer vers la boite de droite,
(d) se déplacer vers la boite de gauche,
(e) Déterminer si la boite devant laquelle il se trouve est marquée ou non.

Ce set d’axiomes va permettre d’accomplir des tâches répétitives variées qui sont à la base de la programmation que nous connaissons aujourd’hui.

Nous vous proposons un "jeu" de conversion binaire dans lequel vous êtes cet ouvrier (Émilio Posti !) qui ne peut effectuer que les actions précédemment décrites. Saurez vous utiliser une démarche systématique pour progresser ? Vous seriez alors en mesure de décrire les instructions nécessaires à la conversion binaire !
