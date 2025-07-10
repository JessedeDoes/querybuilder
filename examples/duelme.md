## ec129 
Expressions headed by an adjective, taking a fixed comparison complement headed by a complementizer and taking a complement consisting of a determiner and a noun.

```
                        hij is zo vrij als een vogeltje 
                        hij is zo gespannen als een veer
                        het is zo zacht als boter
                        hij is zo gesloten als een oester
                        hij is zo stijf als een plank
                        het is zo goed als niets
                        het is zo krom als een hoepel
                        het is zo lek als een zeef
```


```
[pos='ADJ']
 -advmod-> ([lemma='zo|even' & pos='ADV']
   -advcl-> ([pos='NOUN']
     -mark-> [lemma='als' & pos='SCONJ'];
     -det-> [pos='DET'] ) )  
```


https://corpora.ato2.ivdnt.org/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&number=20&patt=%28%5Bpos%3D%27ADJ%27%5D%0A+-advmod-%3E+%28%5Blemma%3D%27zo%7Ceven%27+%26+pos%3D%27ADV%27%5D%0A+++-advcl-%3E+%28%5Bpos%3D%27NOUN%27%5D%0A+++++-mark-%3E+%5Blemma%3D%27als%27+%26+pos%3D%27SCONJ%27%5D%3B%0A+++++-det-%3E+%5Bpos%3D%27DET%27%5D+%29+%29++%29&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D


## ec48 
Expressions headed by a preposition containing three fixed components taking a variable complement.

```
                        hij deed iets ter voorbereiding van iets
                        hij deed iets in tegenstelling tot iets
                        hij deed iets naar aanleiding van iets
                        hij deed iets in verband met iets
                        hij deed iets ter voorkoming van iets
                        hij deed iets onder leiding van iemand
```

De gevallen waar het (enkelvoudige) znw verder niet gemodificeerd wordt zijn min of meer te vinden met
```
[pos='NOUN' & xpos='.*number=sing.*']
 -case-> [pos='ADP'];
 -nmod-> ([]
   -case-> [pos='ADP'] );
 !-(~(nmod|case))-> []  
```


https://corpora.ato2.ivdnt.org/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&number=20&patt=%28%5Bpos%3D%27NOUN%27+%26+xpos%3D%27.%2Anumber%3Dsing.%2A%27%5D%0A+-case-%3E+%5Bpos%3D%27ADP%27%5D%3B%0A+-nmod-%3E+%28%5B%5D%0A+++-case-%3E+%5Bpos%3D%27ADP%27%5D+%29%3B%0A+%21-%28~%28nmod%7Ccase%29%29-%3E+%5B%5D++%29&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D



## ec64
                Expressions headed by a verb, taking a direct object consisting of a modifiable noun and a modifier headed by a fixed preposition taking variable complement.

```
                        iets heeft sporen van iets gedragen
                        hij heeft een spoor van iets vertoond
                        hij heeft geen tekenen van iets vertoond
                        hij heeft een impressie van iets geven
```


```
[pos='VERB']
 -obj-> ([pos='NOUN']
   -nmod-> ([]
     -case-> [pos='ADP'] ) )  
```


https://corpora.ato2.ivdnt.org/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&group=capture%3Alemma%3Ai%3Aobj%3Asource%2Ccapture%3Alemma%3Ai%3Aobj%3Atarget%2Ccapture%3Alemma%3Ai%3Acase%3Atarget&number=20&patt=%28%5Bpos%3D%27VERB%27%5D%0A+-obj-%3E+%28%5Bpos%3D%27NOUN%27%5D%0A+++-nmod-%3E+%28%5B%5D%0A+++++-case-%3E+%5Bpos%3D%27ADP%27%5D+%29+%29++%29&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D


## ec124
                Expressions headed by a verb, taking a direct object consisting of a fixed determiner, an unmodifiable noun and a modifier headed by a fixed preposition taking variable complement.
```
                        n.a.hij heeft de kloof tussen iets overbrugd
                        hij heeft het gezicht van iets bepaald
                        iets heeft een koers van iets genoteerd
                        iets heeft een overzicht van iets gegeven
                        hij heeft de kunst van iets verstaan
```

```
[pos='VERB']
 -obj-> ([pos='NOUN' & xpos='.*number=sing.*']
   -nmod-> ([]
     -case-> [pos='ADP'] ) )  
```


## ec73 
                Expressions headed by a verb, taking (1) a variable indirect object, and (2) a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
                        iets is iemand in handen gevallen
                        iets heeft iemand boven het hoofd gehangen
                        iets heeft iemand voor ogen gestaan
                        hij is iemand in de haren gevlogen
                        iets heeft iemand in het bloed gezeten
                        iets heeft iemand tegen de borst gestoten
```

Dit wil niet zo lekker omdat het ld-complement niet gecodeerd is in UD



## ec65
                Expressions headed by a verb, taking (1) a variable indirect object, and (2) a direct object consisting of a fixed determiner and a modifiable noun.

```
                        hij heeft iemand een dienst bewezen
                        hij heeft iemand een loer gedraaid
                        hij heeft iemand gelijk gegeven
                        hij heeft iemand de weg gewezen
                        hij heeft iemand een aanbod gedaan
                        hij heeft iemand een streek geleverd
                        hij heeft iemand een alibi verschaft
                        hij heeft iemand een waarschuwing gegeven
                        hij heeft iemand een applaus gegeven
                        hij heeft iemand een schouderklopje gegeven
                        hij heeft iemand ontslag aangezegd
                        hij heeft iemand een gezicht gegeven
                        hij heeft iemand een bezoek gebracht
                        iets heeft iemand de rillingen bezorgd
```

```
([pos='VERB']
 -iobj-> [];
 -obj-> ([pos='NOUN']
   -det-> [pos='DET'] )  )
```

Gegroepeerd:


https://corpora.ato2.ivdnt.org/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&group=capture%3Alemma%3Ai%3Aiobj%3Asource%2Ccapture%3Alemma%3Ai%3Aobj%3Atarget&number=20&patt=%28%5Bpos%3D%27VERB%27%5D%0A+-iobj-%3E+%5B%5D%3B%0A+-obj-%3E+%28%5Bpos%3D%27NOUN%27%5D%0A+++-det-%3E+%5Bpos%3D%27DET%27%5D+%29++%29&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D


Of met de det mee:

https://corpora.ato2.ivdnt.org/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&group=capture%3Alemma%3Ai%3Aiobj%3Asource%2Ccapture%3Alemma%3Ai%3Adet%3Atarget%2Ccapture%3Alemma%3Ai%3Aobj%3Atarget&number=20&patt=%28%5Bpos%3D%27VERB%27%5D%0A+-iobj-%3E+%5B%5D%3B%0A+-obj-%3E+%28%5Bpos%3D%27NOUN%27%5D%0A+++-det-%3E+%5Bpos%3D%27DET%27%5D+%29++%29&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D



## ec115 

Expressions headed by a verb, taking (1) a direct object consisting of a fixed determiner and a modifiable noun, and (2) a variable verbal complement consisting of a subordinate clause.

```
                        hij heeft de indruk gegeven dat zij iets wil doen
                        hij heeft de indruk gewekt dat zij iets wil doen
                        hij heeft het idee gekregen dat zij iets wil doen
                        hij heeft het gevoel gehad dat zij iets wil doen
                        hij heeft de indruk gehad dat zij iets wil doen
                        hij heeft het gevoel gekregen dat zij iets wil doen
                        hij heeft het idee gehad dat zij iets wil doen
                        hij heeft de indruk gekregen dat zij iets wil doen
                        hij heeft het geluk gehad dat zij iets wil doen
                        hij heeft de hoop uitgesproken dat zij iets wil doen
                        hij heeft het vermoeden gehad dat zij iets wil doen
                        hij heeft de opvatting gedeeld dat zij iets wil doen
                        hij heeft de opvatting gehuldigd dat zij iets wil doen
                        hij heeft de garantie gegeven dat zij iets wil doen
                        hij heeft de pretentie gehad dat zij iets wil doen
                        hij heeft de suggestie gewekt dat zij iets wil doen
                        hij heeft het genoegen gesmaakt dat zij iets wil doen
                        hij heeft het voorgevoel gehad dat zij iets wil doen
```

```
[pos='VERB']
 -obj-> ([pos='NOUN']
   -det-> [pos='DET'];
   -acl-> ([pos='VERB']
     -mark-> [lemma='dat' & pos='SCONJ'] ) ) 
```


Gegroepeerd:


https://corpora.ato2.ivdnt.org/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&group=capture%3Alemma%3Ai%3Adet%3Atarget%2Ccapture%3Alemma%3Ai%3Aobj%3Atarget%2Ccapture%3Alemma%3Ai%3Aobj%3Asource&number=20&patt=%28%5Bpos%3D%27VERB%27%5D%0A+-obj-%3E+%28%5Bpos%3D%27NOUN%27%5D%0A+++-det-%3E+%5Bpos%3D%27DET%27%5D%3B%0A+++-acl-%3E+%28%5Bpos%3D%27VERB%27%5D%0A+++++-mark-%3E+%5Blemma%3D%27dat%27+%26+pos%3D%27SCONJ%27%5D+%29+%29++%29&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D






