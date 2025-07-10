
## ec1

Expressions headed by a verb, taking a direct object constisting of a fixed determiner and an unmodifiable noun.

```
			wij hebben de rollen verdeeld
			hij heeft zijn kansen waargenomen
			hij heeft zijn kans geroken
			hij heeft zijn dienst bewezen
			hij heeft zijn taak volbracht
			hij heeft zijn land gediend
			iets heeft zijn intrede gedaan
			zij hebben woorden gehad
			hij heeft zijn eigen zin gedaan
			hij heeft zijn zinnen verzet
```

```
[pos='VERB']
 -obj-> ([pos='NOUN']
   -det-> [pos='DET'] )  
```

Groepering:

https://corpora.ato2.ivdnt.org/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&group=capture%3Alemma%3Ai%3Aobj%3Asource%2Ccapture%3Alemma%3Ai%3Adet%3Atarget%2Ccapture%3Aword%3Ai%3Aobj%3Atarget&number=20&patt=%28%5Bpos%3D%27VERB%27%5D%0A+-obj-%3E+%28%5Bpos%3D%27NOUN%27%5D%0A+++-det-%3E+%5Bpos%3D%27DET%27%5D+%29++%29&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D

## ec4

Expressions headed by a verb, taking (1) a variable indirect object, and (2) a direct object consisting of a modifiable noun.

```
			iets heeft iemand veel zorgen gebaard
			hij heeft iemand veel pijn gedaan
			hij heeft iemand een vraag gesteld
			hij heeft iemand veel kwaad gedaan
			hij heeft iemand een kans gegeven
			hij heeft iemand een opdracht gegeven
			hij heeft iemand veel aandacht gegeven
			hij heeft iemand veel ruimte gegeven
			hij heeft iemand een advies gegeven
			hij heeft iemand een voorstel gedaan
```
```
[pos='VERB']
 -iobj-> [];
 -obj-> [pos='NOUN']  
```

Gegroepeerd:

https://corpora.ato2.ivdnt.org/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&group=capture%3Alemma%3Ai%3Aobj%3Atarget%2Ccapture%3Alemma%3Ai%3Aiobj%3Asource&number=20&patt=%5Bpos%3D%27VERB%27%5D%0A+-iobj-%3E+%5B%5D%3B%0A+-obj-%3E+%5Bpos%3D%27NOUN%27%5D&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D

## ec6

Expressions headed by a verb, taking (1) a variable locative/directional complement, and (2) a direct object constisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft ergens aansluiting gevonden
			hij heeft ergens zijn licht opgestoken
			hij heeft ergens een kijkje genomen
			hij heeft ergens de scepter gezwaaid
			hij heeft ergens geen gehoor gevonden
			hij heeft ergens aansluiting gezocht
			iets heeft ergens zijn oorsprong gevonden
			iets heeft ergens zijn oorsprong gehad
			hij heeft ergens eenheid gebracht
			hij heeft ergens halt gehouden
```

Probleem: ld complement niet gecodeerd

## ec7

Expressions headed by a verb, taking a direct object consisting of a fixed determiner and a modifiable noun.

```
			hij heeft de rollen omgedraaid
			zij hebben de taken verdeeld
			hij heeft zijn debuut gemaakt
			hij heeft zijn best gedaan
			hij heeft de gevolgen overzien
			hij heeft iemands belangen behartigd
			hij heeft plannen gemaakt (hier geen determiner)
			hij heeft de stap gewaagd
			hij heeft stappen ondernomen
			hij heeft de aandacht opgeëist
```

* Verschil tussen nmod:poss, det en juist geen determiner maken? (varianten van constructie)
* noun juist niet modifiable? (in de zin dat de groeperin natuurlijkerwijs op woord is, niet op lemma)

Met nmod:poss bijvoorbeeld
```
([pos='VERB']
 -obj-> ([pos='NOUN']
   -nmod:poss-> [] )  )
```

https://corpora.ato2.ivdnt.org/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&group=capture%3Alemma%3Ai%3Aobj%3Asource%2Ccapture%3Aword%3Ai%3Aobj%3Atarget&number=20&patt=%28%5Bpos%3D%27VERB%27%5D%0A+-obj-%3E+%28%5Bpos%3D%27NOUN%27%5D%0A+++-nmod%3Aposs-%3E+%5B%5D+%29++%29&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D

## ec8

Expressions headed by a verb, taking (1) a direct object consisting of a modifiable noun, and (2) a variable verbal complement consisting of a subordinate clause.

```
			hij heeft de fout gemaakt dat zij iets wil doen
			hij heeft de afspraak gemaakt dat zij iets wil doen
			hij heeft het risico gelopen dat zij iets wil doen
			hij heeft de conclusie getrokken dat zij iets wil doen
			hij heeft het gevaar gelopen dat zij iets wil doen
			hij heeft het bezwaar gehad dat zij iets wil doen
			hij heeft de uitspraak gedaan dat zij iets wil doen
			hij heeft het commentaar gegeven dat zij iets wil doen
			hij heeft het risico genomen dat zij iets wil doen
			we hebben de afspraak gehad dat wij iets gaan doen
```

```
[pos='VERB']
 -obj-> ([pos='NOUN']
   -acl-> ([pos='VERB']
     -mark-> [pos='SCONJ'] ) ) 
```

Gegroepeerd: 

https://corpora.ato2.ivdnt.org/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&group=capture%3Alemma%3Ai%3Aobj%3Atarget%2Ccapture%3Alemma%3Ai%3Aobj%3Asource&number=20&patt=%28%5Bpos%3D%27VERB%27%5D%0A+-obj-%3E+%28%5Bpos%3D%27NOUN%27%5D%0A+++-acl-%3E+%28%5Bpos%3D%27VERB%27%5D%0A+++++-mark-%3E+%5Bpos%3D%27SCONJ%27%5D+%29+%29++%29&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D

## ec9

Expressions headed by a verb, taking (1) a direct object consisting of a modifiable noun, and (2) a PP-argument consisting of fixed preposition and a variable complement.

```
			hij heeft geen plezier gehad in iets
			hij heeft geen last gehad van iets
			hij heeft geen gevoelens gehad voor iemand
			hij heeft kans gehad op iets
			hij heeft geen zin gehad in iets
			hij heeft veel kritiek gehad op iets
			hij heeft geen probleem gemaakt van iets
			iets heeft geen gevolgen gehad voor iemand
			hij heeft geen effect gehad op iets
			hij heeft invloed gehad op iemand
```

## ec10

Expressions headed by a verb, taking (1) a direct object consisting of a fixed determiner and an unmodifiable noun, and (2) a variable verbal complement consisting of an (om)-te-infinitive phrase.

```
			hij heeft de moeite genomen om iets te doen
			hij heeft opdracht gehad om iets te doen
			hij heeft opdracht gegeven om iets te doen
			hij heeft de tijd gehad om iets te moeten doen
			hij heeft opdracht gekregen om iets te doen
			hij heeft bevel gekregen om iets te doen
			hij heeft de tijd gekregen om iets te moeten doen
			hij heeft toestemming gegeven om iets te doen
			hij heeft de aanleiding gegeven om iets te doen
			hij heeft de bevoegdheid gehad om iets te doen
```

## ec11

Expressions headed by a verb, taking (1) a variable indirect object, (2) a direct object consisting of a fixed determiner and an unmodifiable noun, and (3) a variable verbal complement consisting of a subordinate clause.

```
			hij heeft iemand het gevoel gegeven dat zij iets wil doen
			hij heeft iemand de indruk gegeven dat zij iets wil doen
			hij heeft iemand de garantie gegeven dat zij iets wil doen
```

## ec13

Expressions headed by a verb, taking a direct object consisting of a pronoun.

```
			hij heeft alles gegeven
			dat heeft elkaar gebeten
			hij heeft iets gehad
			hij heeft iets betekend
```

## ec14

Expressions headed by a verb, taking (1) a direct object consisting of a fixed determiner and an unmodifiable noun, and (2) a modifier headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft zijn handen in onschuld gewassen
			hij heeft een klap in het gezicht gekregen
			hij heeft twee vliegen in een klap geslagen
```

## ec15

Expressions headed by a verb, taking (1) a direct object consisting of a modifiable noun, and (2) a locative/directional complement consisting of a fixed preposition and a variable complement.

```
			hij heeft veel geld gepompt in iets
			hij heeft een les getrokken uit iets
			hij heeft veel energie gestoken in iets
			hij heeft veel energie gestopt in iets
			hij heeft het accent gelegd op iets
			hij heeft een accent gezet op iets
			hij heeft veel vaart gezet achter iets
```

## ec16

Expressions headed by a verb, taking (1) a direct object consisting of a fixed determiner and an unmodifiable noun, and (2) a PP-argument consisting of a fixed preposition and a variable complement.

```
			hij heeft recht gehad op iets
			iets heeft recht gegeven op iets
			hij heeft zijn recht verspeeld op iets
			hij heeft het hoofd gebogen voor iets
			hij heeft zijn voordeel gedaan met iets
			hij heeft zijn naam verbonden aan iets
			hij heeft zijn naam ontleend aan iets
			hij heeft oog gehad voor iets
			hij heeft de ogen gesloten voor iets
			hij heeft bezwaar aangetekend tegen iets
```

## ec17

Expressions headed by a verb, taking (1) a reflexive pronoun, and (2) a direct object consisting of a modifiable noun.

```
			hij heeft zich veel zorgen gemaakt
			hij heeft zich veel tijd gegund
			hij zich veel beperkingen opgelegd
			hij heeft zich veel rust gegund
			hij heeft zich veel pijn gedaan
```

## ec18

Expressions headed by a reflexive verb, taking a PP-argument consisting of a fixed preposition and a variable complement.

```
			hij heeft zich toegespitst op iets
			hij heeft zich verheugd op iets
			hij heeft zich uitgelaten over iets
			hij heeft zich gespecialiseerd in iets
			hij heeft zich geleend tot iets
			hij heeft zich opgemaakt voor iets
			hij heeft zich geidentificeerd met iets
			hij heeft zich gebrand aan iets
			hij heeft zich geleend voor iets
			hij heeft zich afgesloten voor iets
```

## ec19

Expressions headed by a verb, taking (1) a reflexive pronoun, and (2) a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft zich op de vlakte gehouden
			hij heeft zich voor de kop geslagen
			hij heeft zich op de borst geslagen
			hij heeft zich voor het hoofd geslagen
			hij heeft zich in veiligheid gebracht
			hij heeft zich in acht genomen
			hij heeft zich in de kijker gespeeld
			hij heeft zich voor de trein gegooid
			hij heeft zich in de strijd gegooid
			hij heeft zich in de handen gewreven
```

## ec20

Expressions headed by a verb, taking (1) a reflexive pronoun, and (2) a predicative complement headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft zich op zijn gemak gevoeld
			hij heeft zich in het zweet gewerkt
			hij heeft zich in de nesten gewerkt
			hij heeft zicht van kant gemaakt
```

## ec21

Expressions headed by a verb, taking (1) a reflexive pronoun, and (2) a predicative complement consisting of a modifiable adjective.

```
			hij heeft zich druk gemaakt
			hij heeft zich rijk gerekend
```

## ec22

Expressions headed by a reflexive verb, taking a locative/directional complement consisting of a fixed preposition and a variable complement.

```
			hij heeft zich gevoegd bij iemand
			hij heeft zich geworpen op iets
			hij heeft zich gehesen in iets
			hij heeft zich gewenteld in iets
			hij heeft zich gestort op iets
			hij heeft zich gesteld achter iets
			hij heeft zich gesleept naar iets
			hij heeft zich aangesloten bij iets
			hij heeft zich ondergedompeld in iets
			hij heeft zich teruggevonden in iets
```

## ec23

Expressions headed by a reflexive verb, taking a variable locative/directional complement.

```
			hij heeft zich ergens gevestigd
			hij heeft zich ergens begeven
			hij heeft zich ergens gepresenteerd
			hij heeft zich ergens verstopt
			hij heeft zich ergens bevonden
			hij heeft zich ergens gevlijd
			hij heeft zich ergens neergevlijd
			hij heeft zich ergens gepositioneerd
			hij heeft zich ergens geïnstalleerd
			hij heeft zich ergens geposteerd
```

## ec24

Expressions headed by a verb, taking (1) a variable direct object, and (2) a predicative complement headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft iets op prijs gesteld
			hij heeft iemand om het leven gebracht
			hij heeft iemand in leven gehouden
			hij heeft iemand tot leven geroepen
			hij heeft iets tot leven gebracht
			hij is iets van plan gebleken
			hij heeft iets in aanmerking genomen
			hij heeft iets in stand gehouden
			hij heeft iets tot stand gebracht
			hij heeft iets in gang gehouden
```

## ec26

Expressions headed by a verb, taking a direct object constisting of a fixed determiner, an unmodifiable adjective and an unmodifiable noun.

```
			hij heeft een hoge prijs betaald
			hij heeft zijn ware karakter getoond
			hij heeft ruim baan gemaakt
			hij heeft de eerste stap gezet
			hij heeft gemene zaak gemaakt
			hij heeft hoge ogen gegooid
			hij heeft de juiste toon getroffen
			hij heeft een open deur ingetrapt
			iets heeft een eigen leven geleid
			hij heeft de eerste klap uitgedeeld
```

## ec27

Expressions headed by a verb, taking a direct object constisting of a fixed determiner, a variable modifier headed by an adjective, and a modifiable noun.

```
			hij heeft een vervelende gewoonte
			hij heeft een andere toon aangeslagen
			hij heeft een goede keus gedaan
			hij heeft het goede voorbeeld gegeven
			hij heeft een goede dag gehad
			hij is een nieuw leven begonnen
			hij heeft een goede dag gekend
			hij heeft een algemeen belang gediend
			hij heeft krachtige taal uitgeslagen
			hij heeft een slechte tijd gekend
```

## ec28

Expressions headed by a verb, taking (1) a direct object consisting of a fixed determiner and an unmodifiable noun, and (2) a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft de zaak op de spits gedreven
			hij heeft de touwtjes in handen genomen
			hij heeft het heft in handen genomen
			hij heeft de touwtjes in handen gehouden
			hij heeft het heft in handen gehouden
			hij heeft de touwtjes in handen gehad
			hij heeft het heft in handen gehad
			hij heeft iemands bloed aan zijn handen gehad
			hij heeft de lachers op zijn hand gekregen
			hij heeft de lachers op zijn hand gehad
```

## ec29

Expressions headed by a unaccusative verb taking a subject constisting of a fixed determiner and a modifiable noun as a specifier.

```
			de rollen zijn omgekeerd
			de zaak is beklonken
			het gevaar is geweken
			de tijden zijn veranderd
			het tij is gekeerd
			de storm is geluwd
			de gemoederen zijn verhit
			de rust is weergekeerd
			het doek is gevallen
```

## ec30

Expressions headed by a verb, taking (1) a direct object consisting of a fixed determiner and a modifiable noun, and (2) a PP-argument consisting of a fixed preposition and a variable complement.

```
			hij heeft de gevolgen ondervonden van iets
			hij heeft een hekel gehad aan iets
			hij heeft een beroep gedaan op iemand
			hij heeft de neiging gehad tot iets
			iets heeft een aanslag gedaan op iets
			hij heeft een hekel gekregen aan iemand
			hij heeft de basis gevormd voor iets
			hij heeft een verklaring gehad voor iets
			hij heeft een verklaring gegeven voor iets
			hij heeft een stem gehad in iets
```

## ec32

Expressions headed by a verb, taking (1) a variable indirect object, and (2) a direct object consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft iemand het woord gegeven
			hij heeft iemand zijn steun betuigd
			hij heeft iemand antwoord geven
			hij heeft iets betekenis gegeven
			hij heeft iets een plaats gegeven
			hij heeft iemand het woord gevraagd
			hij heeft iemand zijn woord gegeven
			hij heeft iets karakter geven
			hij heeft iets recht gedaan
			hij heeft iemand zijn toestemming gegeven
```

## ec33

Expressions headed by a verb, taking (1) a direct object constisting of a fixed determiner and an unmodifiable noun, and (2) a verbal complement headed by an infinitive taking an implied subject.

```
			hij heeft zijn hoofd laten hangen
			hij heeft zijn stem laten gelden
			hij heeft iemands naam laten vallen
			hij heeft de bui zien hangen
			hij heeft de moed laten zakken
			hij heeft het tij doen keren
			hij heeft een gat laten vallen
```

## ec34

Expressions headed by a verb, taking (1) a direct object consisting of a fixed determiner and an unmodifiable noun, and (2) a locative/directional complement consisting of a fixed preposition and a variable complement.

```
			hij heeft zijn zinnen gezet op iets
			hij heeft de aandacht gevestigd op iets
			hij heeft zijn geluk gezocht in iets
			hij heeft zijn voordeel getrokken uit iets
			hij heeft geen hand uitgestoken naar iets
			hij heeft zijn heil gezocht in iets
			hij heeft de hand gehad in iets
			hij heeft de hand gelegd op iets
			hij heeft de deur opengezet naar iets
			hij heeft de schuld geschoven op iemand
```

## ec35

Expressions headed by a verb, taking (1) a direct object consisting of a fixed determiner and an unmodifiable noun, and (2) a PP-modifier consisting of a fixed preposition and a variable complement.

```
			hij heeft zijn tijd gedood met iets
			hij heeft geen been gezien in iets
			hij heeft zijn naam gevestigd met iets
			hij heeft zijn leven gesleten met iets
			hij heeft geen kwaad gezien in iets
			hij heeft geen heil gezien in iets
			hij heeft zijn handen afgetrokken van iets
			hij heeft de hand gelicht met iets
			hij heeft geen brood gezien in iets
			hij heeft zijn nek gebroken over iets
```

## ec36

Expressions headed by a verb, taking a direct object constisting of a modifiable adjective and an unmodifiable noun.

```
			hij heeft een grote mond gegeven
			hij heeft een prominente plaats gehad
			hij heeft een lange adem gehad
			iets heeft een aanzuigende werking gehad
			hij heeft een goede pers gekregen
			hij heeft een goede naam gehad
			hij heeft een goede naam gehouden
			hij heeft een goede naam gekregen
			hij heeft een grote mond gehad
			hij heeft een grote mond gekregen
```


Gegroepeerd:

https://corpora.ato2.ivdnt.org/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&group=capture%3Alemma%3Ai%3Aamod%3Atarget%2Ccapture%3Alemma%3Ai%3Aamod%3Asource%2Ccapture%3Alemma%3Ai%3Aobj%3Asource&number=20&patt=%28%5Bpos%3D%27VERB%27%5D%0A+-obj-%3E+%28%5Bpos%3D%27NOUN%27%5D%0A+++-det-%3E+%5Bpos%3D%27DET%27%5D%3B%0A+++-amod-%3E+%5Bpos%3D%27ADJ%27%5D+%29++%29&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D




## ec37

Expressions headed by a verb, taking (1) a direct object constisting of a fixed determiner, a modifiable adjective and an unmodifiable noun, and (2) a PP-argument constisting of a fixed preposition and a variable complement.

```
			hij heeft de laatste hand gelegd aan iets
			hij heeft een zwakke plek gehad voor iemand
			hij heeft een hoge prijs betaald voor iets
			hij heeft een goed woordje gedaan voor iemand
			hij heeft geen goed woord overgehad voor iets
			hij heeft korte metten gemaakt met iets
			hij heeft gelijke tred gehoud met iemand
			hij heeft een sterk besef gehad van iets
			hij heeft een hoge dunk gehad van iemand
			hij heeft een lage dunk gehad van iemand
```

## ec38

Expressions headed by a verb, taking (1) a variable indirect object, and (2) a direct object constisting of a fixed determiner, a variable modifier headed by an adjective, and a modifiable noun.

```
			hij heeft iemand het goede voorbeeld gegeven
			hij heeft iemand een goed gevoel gegeven
			hij heeft iemand een grote toekomst voorspeld
			iets heeft iemand een modern uiterlijk gegeven
```

## ec39

Expressions headed by a verb, taking (1) a direct object constisting of a fixed determiner, a variable modifier headed by an adjective, and a modifiable noun, and (2) an indirect object consisting of the preposition &quot;aan&quot; and a variable complement.

```
			hij heeft het goede voorbeeld gegeven aan iemand
			hij heeft een modern uiterlijk gegeven aan iets
```

## ec40

Expressions headed by a verb, taking a PP-argument headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft voor iemands leven gevreesd
			iets heeft tot de verbeelding gesproken
			hij heeft aan de bel getrokken
			hij is aan iemands aandacht ontsnapt
			iets heeft tot het verleden behoord
			zij hebben van gedachten gewisseld
			zij zijn tot overeenstemming gekomen
			hij is aan zijn trekken gekomen
			hij heeft voor de eer bedankt
			hij is in woede ontstoken
```

## ec41

Expressions headed by a verb, taking (1) a variable indirect object, (2) a direct object consisting of a fixed determiner and an unmodifiable noun, and (3) a variable verbal complement consisting of a te-infinitive clause.

```
			hij heeft iemand het gevoel gegeven iets te doen
			hij heeft iemand de indruk gegeven iets te doen
```

## ec42

Expressions headed by a verb, taking (1) a direct object consisting of a modifiable noun, and (2) a variable verbal complement consisting of an (om)-te-infinitive phrase.

```
			hij heeft kans gehad om iets te doen
			hij heeft de beslissing genomen om iets te doen
			hij heeft kans gezien om iets te doen
			hij heeft de afspraak gemaakt om iets te doen
			hij heeft het risico gelopen om iets te doen
			hij heeft geen maatregelen genomen om iets te doen
			hij heeft een poging gedaan om iets te doen
			hij heeft moeite gedaan om iets te doen
			hij heeft de stap genomen om iets te doen
			hij heeft behoefte gehad om iets te doen
```

## ec44

Expressions headed by a verb, taking (1) a direct object consisting of a fixed determiner and a modifiable noun, and (2) a PP-modifier consisting of a fixed preposition and a variable complement.

```
			hij heeft de tijd gevuld met iets
			hij heeft zijn dagen gesleten met iets
```

## ec45

Expressions headed by a verb, taking (1) a direct object consisting of a fixed determiner and a modifiable noun, and (2) a variable verbal complement consisting of an (om)-te-infinitive phrase.

```
			hij heeft het recht gekregen om iets te doen
			hij heeft het plan opgevat om iets te doen
			hij heeft de neiging gehad om iets te doen
			hij heeft het recht gehad om iets te doen
			hij heeft verplichting gehad om iets te doen
			hij heeft de gewoonte gehad om iets te doen
			hij heeft de eer gehad om iets te doen
			hij heeft het genoegen gesmaakt om iets te doen doen
			hij heeft het voorrecht gehad om iets te doen
```

## ec46

Expressions headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij deed iets in iemands ogen
			hij deed iets op tijd
			hij deed iets volgens plan
			hij deed iets voor geen goud
			hij deed iets in iemands plaats
			hij deed iets op vakantie
			hij deed iets in de buurt
			hij deed iets uit het hoofd
			hij deed iets met klem
			hij deed iets op de achtergrond
```

## ec48

Expressions headed by a preposition containing three fixed components taking a variable complement.

```
			hij deed iets ter voorbereiding van iets
			hij deed iets in tegenstelling tot iets
			hij deed iets naar aanleiding van iets
			hij deed iets in verband met iets
			hij deed iets ter voorkoming van iets
			hij deed iets onder leiding van iemand
			hij deed iets ter compensatie van iets
			hij deed iets na afloop van iets
			hij deed iets uit hoofde van iemand
			hij deed iets met behulp van iemand
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


## ec49

Expressions headed by a reflexive verb.

```
			hij heeft zich uitgesproken
			hij heeft zich afgesloten
			iets heeft zich voorgedaan
			hij heeft zich verdedigd
			iets heeft zich uitgebreid
			hij heeft zich verstopt
			hij heeft zich verzekerd
			hij heeft zich voorgesteld
			hij heeft zich gewassen
			hij heeft zich opgemaakt
```

## ec50

Expressions headed by a verb, taking (1) a direct object consisting of a fixed determiner and a modifiable noun, and (2) a variable verbal complement consisting of a te-infinitive clause.

```
			hij heeft de indruk gegeven iets te willen doen
			hij heeft de indruk gewekt iets te moeten doen
			hij heeft het idee gekregen iets te willen doen
			hij heeft het gevoel gehad iets te willen doen
			hij heeft de indruk gehad iets te moeten doen
			hij heeft het gevoel gekregen iets te willen doen
			hij heeft het idee gehad iets te willen doen
			hij heeft de indruk gekregen iets te moeten doen
			hij heeft de suggestie gewekt iets te willen doen
```

## ec51

Expressions headed by a verb, taking a predicative complement headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij is om het leven gekomen
			iets is aan de kook gekomen
			hij is met vakantie gegaan
			hij is in leven gebleken
			hij is tot leven gekomen
			hij is in aanmerking gekomen
			hij is in actie gekomen
			iets is tot stand gekomen
			iets is in stand gebleven
			hij is op gang gekomen
```

## ec52

Expressions headed by a verb, taking (1) a variable indirect object, and (2) a direct object constisting of a fixed determiner, an unmodifiable adjective and an unmodifiable noun.

```
			hij heeft iemand de helpende hand geboden
			hij heeft iemand de helpende hand toegestoken
			hij heeft iets nieuw leven ingeblazen
			hij heeft iemand de vrije hand gegeven
			hij heeft iemand een goede naam bezorgd
			hij heeft iemand een slechte naam bezorgd
			hij heeft iemand vrij baan gegeven
			hij heeft iemand ruim baan gegeven
			hij heeft iemand de helpende hand gereikt
			hij heeft iemand de reddende hand geboden
```

## ec53

Expressions headed by a verb, taking a locative/directional complement headed by a fixed preposition taking (1) a variable modifier headed by an adverb, and (2) a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij is goed uit zijn woorden gekomen
			hij heeft slecht uit de voeten gekund
			hij is goed uit de verf gekomen
```

## ec54

Expressions headed by a verb, taking (1) a reflexive pronoun, (2) a direct object consisting of a modifiable noun, and (3) a PP-argument consisting of fixed preposition and a variable complement.

```
			hij heeft zich veel zorgen gemaakt over iets
			hij heeft zich veel zorgen gemaakt om iets
```

## ec56

Expressions headed by a verb, taking (1) a direct object consisting of a modifiable noun, and (2) an indirect object consisting of the preposition &quot;aan&quot; and a variable complement.

```
			hij heeft een vraag gesteld aan iemand
			hij heeft veel aandacht gegeven aan iemand
			hij heeft weinig leiding gegeven aan iemand
			hij heeft schade toegebracht aan iemand
			hij heeft veel bekendheid gegeven aan iets
			hij heeft een offer gebracht aan iemand
			hij heeft veel voorlichting gegeven aan iemand
			hij heeft een college gegeven aan iemand
			hij heeft geen invulling gegeven aan iets
			hij heeft inhoud gegeven aan iets
```

## ec57

Expressions headed by a verb, taking (1) a variable indirect object, (2) a direct object consisting of a fixed determiner and an unmodifiable noun, and (3) a variable verbal complement consisting of a (om)-te-infinitive clause.

```
			iets heeft iemand het recht gegeven om iets te doen
			hij heeft iemand opdracht gegeven om iets te doen
			hij heeft iemand de tijd gegeven om iets te doen
			hij heeft iemand toestemming gegeven om iets te doen
			iets heeft iemand de moed gegeven om iets te doen
			hij heeft iemand het recht ontnomen om iets te doen
			hij heeft iemand voldoende aanleiding gegeven om iets te doen
			hij heeft iemand de gelegenheid gegeven om iets te doen
			hij heeft iemand bevel gegeven om iets te doen
			hij heeft iemand kracht gegeven om iets te doen
```

## ec58

Expressions headed by a verb, taking (1) variable direct object, and (2) a predicative complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij is iemand de baas geworden
			hij heeft iemand de baas gekund
			hij heeft iets het einde gevonden
			hij is iemand de baas gebleven
			hij heeft iemand kandidaat gesteld
			hij heeft iemand gezelschap gehouden
			hij heeft iemand een compliment gemaakt
			hij heeft iemand het hof gemaakt
```


Beetje heterogeen: kandidaat stellen is natuurlijk anders dan een compliment maken, etc

```
[pos='VERB']
 -obj-> [];
 -xcomp-> [pos='NOUN'] !--> []
```

en andere varianten

## ec59

Expressions headed by a verb, taking (1) a direct object consisting of a fixed determiner and an unmodifiable noun, and (2) an indirect object consisting of the preposition &quot;aan&quot; and a variable complement.

```
			hij heeft het woord gegeven aan iemand
			hij heeft zijn steun betuigd aan iemand
			hij heeft betekenis gegeven aan iets
			hij heeft zijn woord gegeven aan iemand
			hij heeft karakter gegeven aan iets
			hij heeft recht gedaan aan iets
			hij heeft zijn toestemming gegeven aan iemand
			hij heeft advies gegeven aan iemand
			hij heeft advies gevraagd aan haar
			hij heeft asiel verleend aan iemand
```

## ec60

Expressions headed by a verb, taking (1) a variable indirect object, (2) a direct object consisting of a fixed determiner and an unmodifiable noun, and (3) a PP-argument consisting of a fixed preposition and a variable complement.

```
			iets heeft iemand recht gegeven op iets
			hij heeft iemand een verklaring gegeven voor iets
			hij heeft iemand begrip gevraagd voor iets
			iets heeft iemand de naam bezorgd van iets
			hij heeft iemand voldoende aanleiding gegeven tot iets
			hij heeft iemand de gelegenheid gegeven tot iets
```

## ec61

Expressions headed by a verb, taking (1) a direct object consisting of a fixed determiner and a modifiable noun, and (2) a locative/directional complement consisting of a fixed preposition and a variable complement.

```
			iets heeft zijn schaduw geworpen op iets
			hij heeft de gang gemaakt naar iets
			hij heeft een stempel gezet op iets
			hij heeft vraagtekens gezet bij iets
			hij heeft vraagtekens geplaatst bij iets
			hij heeft zijn hoop gevestigd op iets
			hij heeft een stempel gedrukt op iets
			hij heeft een einde gemaakt aan iets
			hij heeft zijn intrek genomen in iets
			iets heeft een licht geworpen op iets
```

## ec63

Expressions headed by a verb, taking a predicative complement headed by a fixed preposition taking a complement consisting of a fixed determiner, an unmodifiable adjective and an unmodifiable noun.

```
			hij is op vrije voeten gekomen
			iets is van tijdelijke aard gebleken
			hij is van de oude stempel gebleken
			hij is op vrije voeten geweest
			iets heeft van tijdelijke aard geleken
			iets is van tijdelijke aard geweest
			hij is van de oude stempel geweest
```

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




## ec66

Expressions headed by a preposition taking a complement consisting of a fixed determiner, an unmodifiable noun and a modifier headed by a fixed preposition taking variable complement.

```
			hij deed iets aan het eind van iets
			hij deed iets onder de paraplu van iemand
			hij deed iets uit het oogpunt van iets
			hij deed iets in de loop van iets
			hij deed iets aan de hand van iets
			hij deed iets aan het einde van iets
			hij deed iets in het kader van iets
			hij deed iets aan het begin van iets
			hij deed iets op het gebied van iets
			hij deed iets met het oog op iets
```

## ec67

Expressions headed by a verb, taking (1) a reflexive pronoun, and (2) a PP-argument headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft zich van het leven beroofd
			hij heeft zich aan de dood uitgeleverd
			hij heeft zich aan de regels gehouden
			hij heeft zich van stemming onthouden
			hij heeft zich aan zijn woord gehouden
```

## ec68

Expressions headed by a verb, taking (1) a reflexive pronoun, (2) a variable direct object, and (3) a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft zich iets op de hals gehaald
			hij heeft zich iemand van het lijf gehouden
			hij heeft zich iets voor de geest gehaald
```

## ec69

Expressions headed by a verb, taking a predicative complement headed by a modifiable adjective taking a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij is hard van stapel gelopen
			hij heeft hoog in aanzien gestaan
			hij heeft krap bij kas gezeten
```

## ec71

Expressions headed by a verb, taking (1) a direct object consisting of a fixed determiner and an unmodifiable noun, and (2) a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed pronoun.

```
			hij heeft de deur achter zich dichtgetrokken
			hij heeft de hand aan zichzelf geslagen
			zij hebben de handen in elkaar geslagen
			hij heeft de handen op elkaar gekregen
			hij heeft de eindjes aan elkaar geknoopt
			zij hebben de koppen bij elkaar gestoken
			hij heeft de verdenking op zich geladen
```

## ec72

Expressions headed by a verb, taking a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner, a variable modifier headed by an adjective, and a modifiable noun.

```
			hij heeft in een kwaad daglicht gestaan
			hij heeft in een lastig parket gezeten
			hij is uit een goed nest gekomen
			hij heeft in rustig vaarwater gezeten
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


## ec74

Expressions headed by a verb, taking (1) a variable direct object, and (2) a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft iemand aan de lijn gehad
			hij heeft iets aan boord gehad
			hij heeft iemand in het zadel geholpen
			hij heeft iemand om een boodschap gestuurd
			hij heeft iemand in het oog gehad
			hij heeft iets in het leven geroepen
			hij heeft iemand naar het leven gestaan
			hij heeft iets van de hand gewezen
			hij heeft iets van de hand gedaan
			hij heeft iets in de hand gewerkt
```

## ec75

Expressions headed by a verb, taking (1) a variable direct object, and (2) a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner, a variable modifier headed by an adjective, and a modifiable noun.

```
			hij heeft iemand op het rechte pad gebracht
			hij heeft iets tot een goed einde gebracht
			hij heeft iemand in een kansrijke positie gebracht
			hij heeft iemand in een kwaad daglicht gesteld
			hij heeft iets in een ander daglicht geplaatst
			hij heeft iemand in een lastig parket gebracht
			hij heeft iets in een nieuw jasje gestoken
```

## ec76

Expressions headed by a modifiable noun, taking a modifier consisting of a modifiable adjective.

```
			zwaar accent
			felle aanval
			hard oordeel
			mager jaar
			breed publiek
			harde woorden
			hechte band
			groot verlies
			sterk punt
			scherpe kritiek
```

## ec77

Expressions headed by a verb, taking (1) a variable indirect object, and (2) a locative/directional complement consisting of two fixed components.

```
			iets is iemand ten goede gekomen
			iets is iemand ten deel gevallen
			hij is iemand te hulp gekomen
			iets is iemand te boven gegaan
			iets is iemand te binnen geschoten
			iets is iemand ter harte gegaan
			iets is iemand te beurt gevallen
			iets heeft iemand ten dienste gestaan
			iets is iemand ter ore gekomen
			hij is iemand te na gekomen
```

## ec78

Expressions headed by a verb, taking (1) a variable direct object, and (2) a locative/directional complement consisting of two fixed components.

```
			hij heeft iets aan kant gemaakt
			hij heeft iets ter hand genomen
			hij heeft iets ter sprake gebracht
			hij is iemand te lijf gegaan
			hij heeft iemand ten val gebracht
			hij heeft iets in petto gehad
			hij is iets te boven gekomen
			hij heeft iets in ere hersteld
			hij heeft iets in ere gehouden
			hij heeft iets ten tonele gebracht
```

## ec79

Expressions headed by a verb, taking a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij is op tournee gegaan
			hij heeft op kop gezeten
			hij heeft in de bijstand gezeten
			hij heeft in voorarrest gezeten
			hij heeft in de hoek gestaan
			hij is over iemands grens gegaan
			iets is uit de hand gelopen
			iets heeft in iemands handen gelegen
			iets is van zijn hand gebleken
			hij is op iemands hand gebleken
```

## ec80

Expressions headed by a verb, taking (1) a variable indirect object, (2) a direct object consisting of a fixed determiner and an unmodifiable noun, and (3) a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft iemand de hand boven het hoofd gehouden
			hij heeft iemand de stuipen op het lijf gejaagd
			hij heeft iemand zand in de ogen gestrooid
			hij heeft iemand een hart onder de riem gestoken
			hij heeft iemand het hoofd op hol gebracht
			hij heeft iemand het mes op de keel gezet
			hij heeft iemand een duwtje in de rug gegeven
			hij heeft iemand de wind uit de zeilen genomen
			hij heeft iemand geen strobreed in de weg gelegd
```

## ec81

Expressions headed by a verb, taking (1) a variable direct object, and (2) a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner, a unmodifiable adjective and a unmodifiable noun.

```
			hij heeft iets in eigen hand gehad
			hij heeft iets in eigen hand gehouden
			hij heeft iets in eigen hand genomen
			hij heeft iets eigen hand gekregen
			hij heeft iets op de lange baan geschoven
			hij heeft iets in goede banen geleid
			hij heeft iemand op het verkeerde been gezet
			hij heeft iemand op vrije voeten gesteld
			hij heeft iets in eigen zak gestoken
			hij heeft iemand voorlopige hechtenis genomen
```

## ec82

Expressions headed by a verb, taking a PP-modifier headed by a fixed preposition taking a complement consisting of a fixed determiner, an unmodifiable adjective and an unmodifiable noun.

```
			hij heeft met lege handen gestaan
			hij heeft met twee woorden gesproken
			hij heeft op volle toeren gedraaid
			hij heeft onder Nederlandse vlag gevaren
			hij heeft met de gebakken peren gezeten
			hij heeft met kromme tenen gezeten
```

## ec83

Expressions headed by a verb, taking (1) a direct object consisting of a fixed determiner and an unmodifiable noun, and (2) a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner, an unmodifiable adjective and an unmodifiable noun.

```
			hij heeft de vinger op de zwakke plek gelegd
			hij heeft de vinger op de gevoelige plek gelegd
			hij heeft het heft in eigen hand genomen
			hij heeft het heft in eigen hand gehouden
			hij heeft het heft in eigen handen gehad
			hij heeft de vinger op de zere plek gelegd
			hij heeft het recht in eigen hand genomen
```

## ec84

Expressions headed by a verb, taking (1) a PP-modifier headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun, and (2) a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft met de handen in het haar gezeten
			hij heeft met de hand over het hart gestreken
			hij heeft met de rug tegen de muur gestaan
			hij heeft met de vuist op tafel geslagen
			hij heeft met zijn neus in de boeken gezeten
```

## ec85

Expressions headed by a fixed noun, taking a fixed determiner and a modifier consisting of an unmodifiable adjective.

```
			de grote stad
			het lopend jaar
			het openbare leven
			de zware misdaad
			de grote lijnen
			de harde lijn
			het grote geld
			goed geld
			een onvertogen woord
			de laatste ronde
```

## ec86

Expressions headed by a verb, taking a predicative complement headed by a fixed preposition taking a complement consisting of a fixed determiner and a modifiable noun.

```
			iets is van belang gebleken
			hij is in beroep gegaan
			hij is in gevaar gebleven
			iets is in première gegaan
			hij is in dienst gebleven
			hij is met pensioen gebleken
			hij is in paniek gebleven
			zij is in verwachting gebleken
			hij is van betekenis geweest
			hij is in coma gebleven
```

## ec87

Expressions headed by a verb, taking (1) a predicative complement headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun, and (2) a variable verbal complement consisting of an (om)-te-infinitive phrase.

```
			hij is in aanmerking gekomen om iets te doen
			hij is in de gelegenheid gebleken om iets te doen
			hij is in de verleiding gekomen om iets te doen
			hij is in de verleiding geraakt om iets te doen
			hij is in de verleiding geweest om iets te doen
			hij is in de gelegenheid gekomen om iets te doen
			hij heeft in de gelegenheid geleken om iets te doen
			hij is in de gelegenheid geweest om iets te doen
```

## ec88

Expressions headed by a verb, taking (1) a predicative complement headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun, and (2) a PP-argument consisting of a fixed preposition and a variable complement.

```
			hij is in aanmerking gekomen voor iets
			hij is in de markt gebleken voor iemand
			hij heeft in dienst gestaan van iets
			hij is in opstand gekomen tegen iets
			iets in tot uitdrukking gekomen in iets
			hij is in de race gebleven voor iets
			hij is als de dood gebleken voor iets
			hij is in staat gebleken tot iets
			hij is in conflict gebleven met iemand
			hij is in het geweer gekomen tegen iets
```

## ec90

Expressions headed by a verb, taking (1) a predicative complement headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun, and (2) a variable verbal complement consisting of a subordinate clause.

```
			hij is van mening gebleken dat zij iets ging doen
			hij is tot de conclusie gekomen dat zij iets ging doen
			hij is van mening gebleven dat zij iets ging doen
			hij heeft van mening geleken dat zij iets ging doen
			hij is van mening geraakt dat zij iets ging doen
			hij is van mening geweest dat zij iets ging doen
```

## ec91

Expressions headed by a verb, taking (1) a variable direct object, and (2) a predicative complement headed by a fixed preposition taking a complement consisting of a fixed determiner and a modifiable noun.

```
			hij heeft iemand in de stemming gebracht
			iets is in iemands belang gebleven
			hij heeft iemand in gevaar gebracht
			hij heeft iemand in de problemen gebracht
			hij heeft iemand voor een probleem gesteld
			hij heeft iets in première gebracht
			hij heeft iemand in dienst gehad
			hij heeft iemand in verlegenheid gebracht
			hij heeft iemand onder behandeling gesteld
			hij heeft iemand in moeilijkheden gebracht
```

## ec92

Expressions headed by a verb, taking a locative/directional complement headed by a fixed preposition taking (1) a modifier constisting of a modifiable adjective, and (2) a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft dicht bij het vuur gezeten
			hij is scherp uit de hoek gekomen
			iets heeft hoog in het vaandel gestaan
			hij is kort door de bocht gegaan
			hij heeft stevig in zijn schoenen gestaan
			hij heeft diep in de buidel getast
			hij heeft stevig in het zadel gezeten
			iets heeft vers in het geheugen gelegen
			hij heeft strak in het pak gezeten
			hij heeft zwak in zijn schoenen gestaan
```

## ec93

Expressions headed by a verb, taking (1) a variable indirect object, (2) a variable direct object, and (3) a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft iemand iets aan de hand gedaan
			hij heeft iemand iets in handen gegeven
			hij heeft iemand iets op het hart gedrukt
			hij heeft iemand iets onder de aandacht gebracht
			hij heeft iemand iets in het vooruitzicht gesteld
			hij heeft iemand iets voor de voeten geworpen
			hij heeft iemand iets in de mond gelegd
			hij heeft iemand iets in de schoenen geschoven
			hij heeft iemand iets aan het verstand gebracht
			hij heeft iemand iets in onderpand gegeven
```

## ec94

Expressions headed by a verb, taking a locative/directional complement consisting of two fixed components.

```
			iets is aan kant geweest
			hij is ten onder gegaan
			hij is ter sprake gekomen
			hij is te ver gegaan
			iets heeft ter discussie gestaan
			iets is ter tafel gekomen
			iets is in werking getreden
			hij is te hulp gekomen
			hij is ten val gekomen
			hij is te voet gegaan
```

## ec95

Expressions headed by a verb, taking a PP-argument headed by a fixed preposition taking a complement consisting of a modifiable noun.

```
			hij heeft aan de eisen voldaan
			hij is op veel bezwaren gestuit
```

## ec96

Expressions headed by a verb, taking a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner and a modifiable noun.

```
			hij heeft in de problemen gezeten
			hij heeft onder druk gestaan
			het is onder druk gekomen
			hij heeft onder vuur gelegen
			hij heeft in iemands belangstelling gestaan
			hij is in de problemen gekomen
			iets heeft op de agenda gestaan
			hij is voor de rechter verschenen
			hij is voor de rechter gekomen
			hij heeft boven de partijen gestaan
```

## ec97

Expressions headed by a verb, taking a modifier headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft met vuur gespeeld
			hij heeft op zijn kop gekregen
			hij heeft met de eer gestreken
			hij heeft geschitterd door afwezigheid
			hij heeft iets over één kam geschoren
			zij hebben in onmin geleefd
			hij heeft met verlies gedraaid
			hij heeft in alle toonaarden ontkend
			zij hebben in vrede geleefd
			iets is naar wens verlopen
```

## ec98

Expressions headed by a verb, taking a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner, an unmodifiable adjective and an unmodifiable noun.

```
			iets is uit een goed hart gekomen
			hij heeft voor hetere vuren gestaan
			hij heeft tussen twee vuren gezeten
			hij heeft voor een dichte deur gestaan
			hij heeft voor een gesloten deur gestaan
			hij heeft achter gesloten deuren gezeten
			iets is uit onverwachte hoek gekomen
			zij hebben op gespannen voet gestaan
			zij hebben op gespannen voet geleefd
			hij heeft op grote voet geleefd
```

## ec99

Expressions headed by a verb, taking a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed pronoun.

```
			iets heeft uit elkaar gelegen
			iets is voor elkaar gekomen
			iets heeft door elkaar gelopen
			zij hebben tegenover elkaar gestaan
			zij zijn uit elkaar gegaan
			iets is uit elkaar gevallen
			hij is in elkaar gezakt
			hij is in elkaar gestort
			zij zijn tot elkaar gekomen
			iets is uit elkaar gespat
```

## ec100

Expressions headed by a verb, taking (1) a variable direct object, and (2) a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed pronoun.

```
			hij heeft iets voor elkaar gekregen
			hij heeft iemand in elkaar geslagen
			hij heeft iemand bij elkaar gebracht
			hij heeft iets bij elkaar gehouden
			hij heeft iets in elkaar gezet
			hij heeft iets uit elkaar gehaald
			hij heeft iets bij elkaar gekregen
			hij heeft iets uit elkaar gehouden
			hij heeft iets door elkaar gehaald
			hij heeft iemand tot elkaar gebracht
```

## ec101

Expressions headed by a fixed noun, taking a modifier consisting of an unmodifiable adjective.

```
			achtergestelde lening
			collectieve arbeidsovereenkomst
			hoger personeel
			centraal figuur
			gerechtelijk vooronderzoek
			korte broek
			vliegende brigade
			sterke man
			vaste baan
			vuile was
```

## ec102

Expressions headed by a verb, taking (1) a variable direct object, (2) a predicative complement headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun, and (3) a PP-argument consisting of a fixed preposition and a variable complement.

```
			hij heeft iemand in aanraking gebracht met iets
			hij heeft iemand in verband gebracht met iets
			hij heeft iets in dienst gesteld van iets
			hij heeft iemand in contact gebracht met iemand
			hij heeft iets in overeenstemming gebracht met iets
			hij heeft iemand in bescherming genomen tegen iets
			hij heeft iemand op de hoogte gebracht van iets
			hij heeft iets in mindering gebracht op iets
			hij heeft iemand in kennis gesteld van iets
			hij heeft iemand op de hoogte gehouden van iets
```

## ec103

Expressions headed by a verb, taking a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner, a modifiable noun and a PP-modifier consisting of a fixed preposition and a variable complement.

```
			hij heeft onder invloed van iets gestaan
			hij heeft onder druk gestaan van iets
			hij heeft onder toezicht gestaan van iemand
```

## ec104

Expressions headed by a verb, taking (1) a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner and a modifiable noun, and (2) a PP-argument consisting of a fixed preposition and a variable complement.

```
			iets is in handen gebleven van iemand
			hij heeft in contact gestaan met iemand
			hij heeft in verband gestaan met iets
			hij is in contact gebleven met iemand
			hij heeft onder controle gestaan van iemand
			hij heeft onder leiding gestaan van iemand
			iets heeft in geen verhouding gestaan tot iets
			iets heeft in verhouding gestaan tot iets
			hij heeft onder verdenking gestaan van iets
			iets is in handen gekomen van iemand
```

## ec105

Expressions headed by a verb, taking (1) a locative/directional complement consisting of two fixed components, and (2) a PP-argument consisting of a fixed preposition and a variable complement.

```
			iets heeft ten grondslag gelegen aan iets
			hij heeft te boek gestaan als
			hij heeft van doen gehad met iemand
			hij is ten prooi gevallen aan iemand
			hij is te buiten gegaan aan iets
			hij is ten strijde getrokken tegen iets
			hij heeft te koop gelopen met iets
			hij is van leer getrokken tegen iets
			hij is te hoop gelopen tegen iets
			hij is te kort geschoten in iets
```

## ec106

Expressions headed by a verb, taking (1) a variable direct object, and (2) a modifier headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft iemand op zijn woord geloofd
			hij heeft iets met rust gelaten
			hij heeft iets van de daken geschreeuwd
			hij heeft iets in de kiem gesmoord
			hij heeft iets op zijn beloop gelaten
			hij heeft iets in bewaring gegeven
			hij heeft iemand van alle blaam gezuiverd
			hij heeft iemand aan de vergetelheid ontrukt
			hij heeft iets op maat gemaakt
			hij heeft iets in één oogopslag gezien
```

## ec107

Expressions headed by a verb, taking (1) a variable direct object, and (2) a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner and a modifiable noun.

```
			hij heeft iemand onder druk gezet
			hij heeft iets op de kaart gezet
			hij heeft iets op de agenda gezet
			hij heeft iets op de agenda geplaatst
			hij heeft iemand voor de rechter gedaagd
			hij heeft iemand voor de rechter gesleept
			hij heeft iets in zijn hoofd gehaald
			iets heeft iemand op het spoor gezet
			iets heeft iemand op het spoor gebracht
			hij heeft iets onder de aandacht gebracht
```

## ec108

Expressions headed by a verb, taking (1) a variable direct object, and (2) a predicative complement consisting of an adverb.

```
			hij heeft iets overeind gehouden
			hij heeft iets achterwege gelaten
```

## ec109

Expressions headed by a verb, taking (1) a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun, and (2) a PP-argument consisting of a fixed preposition and a variable complement.

```
			hij is door het vuur gegaan voor iemand
			hij is in aanraking gekomen met iets
			hij heeft in de rij gestaan voor iets
			hij heeft aan tafel gezeten met iemand
			hij is in zee gegaan met iemand
			hij heeft aan het hoofd gestaan van iets
			hij is over de brug gekomen met iets
			hij heeft in zijn maag gezeten met iets
			hij heeft aan de basis gestaan van iets
			hij is in botsing gekomen met iemand
```

## ec110

Expressions headed by a verb, taking (1) a variable direct object, and (2) a predicative complement consisting of two fixed components.

```
			hij heeft iets te boek gesteld
			hij heeft iemand te woord gestaan
			hij heeft iets ter discussie gesteld
			iets heeft iets tot gevolg gehad
			hij heeft iemand te hulp geroepen
			hij heeft iemand ten voorbeeld gesteld
			hij heeft iets te koop gezet
			hij heeft iets te niet gedaan
			hij heeft iets ten gehore gebracht
			hij heeft iets ten doel gehad
```

## ec111

Expressions headed by a verb, taking a direct object consisting of a fixed determiner, an unmodifiable noun and a modifier headed by a fixed preposition taking a complement consisting of a fixed determiner, an unmodifiable adjective and an unmodifiable noun.

```
			iets is een druppel op een gloeiende plaat gebleken
			iets is liefde op het eerste gezicht gebleken
			hij heeft de kip met de gouden eieren geslacht
			hij is baas in eigen huis gebleven
			iets heeft een druppel op een gloeiende plaat geleken
			iets is een druppel op een gloeiende plaat geweest
			iets heeft liefde op het eerste gezicht geweest geleken
			iets is liefde op het eerste gezicht geweest
			hij is baas in eigen huis geweest
```

## ec112

Expressions headed by a verb, taking (1) a variable direct object, and (2) a locative/directional complement headed by a fixed preposition taking (1) a modifier constisting of a modifiable adjective, and (2) a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft iemand diep in de ogen gekeken
			hij heeft iets hoog in het vaandel gehad
			hij heeft iets hoog in het vaandel geschreven
```

## ec113

Expressions headed by a fixed noun, taking a modifier consisting of a modifiable adjective.

```
			goede naam
			warm onthaal
			grote mond
			groot woord
			zware slag
			diepe kloof
			zwarte dag
			grote dag
			donkere dag
			verhoogd risico
```

## ec114

Expressions headed by a verb, taking a PP-argument headed by a fixed preposition taking a complement consisting of a fixed determiner, an unmodifiable modifier and an unmodifiable noun.

```
			hij heeft aan het langste eind getrokken
			hij heeft aan het kortste eind getrokken
			hij is tot volle wasdom gekomen
			hij heeft op het juiste paard gewed
			hij heeft op het verkeerde paard gewed
```

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



## ec116

Expressions headed by a verb, taking (1) a variable direct object, and (2) a predicative complement consisting of a modifiable adjective.

```
			hij heeft iemand staande gehouden
			hij heeft iets duidelijk gemaakt
			hij heeft iemand welkom geheten
			hij heeft iets aannemelijk gemaakt
			hij heeft iets beschikbaar gesteld
			hij heeft iets kracht bijgezet
			hij heeft iets goed gezien
```

## ec117

Expressions headed by a verb, taking (1) an indirect object consisting of a fixed determiner and an unmodifiable noun, and (2) a direct object consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft de kat de bel aangebonden
			hij heeft iemands naam alle eer aangedaan
			hij heeft de waarheid geweld aangedaan
			hij heeft de werkelijkheid geweld aangedaan
			hij heeft zijn ogen de kost gegeven
			hij heeft de belofte gestand gedaan
```

## ec118

Expressions headed by a verb, taking (1) a variable indirect object, and (2) a predicative complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft iemand een hak gezet
			iets heeft iemand veel parten gespeeld
			iets heeft iemand goed gedaan
```

## ec119

Expressions headed by a fixed preposition taking a complement consisting of a fixed determiner, an unmodifiable adjective and an unmodifiable noun.

```
			hij deed iets op eigen kracht
			hij deed iets met andere ogen
			hij deed iets in grote lijnen
			hij deed iets met gemengde gevoelens
			hij deed iets aan de lopende band
			hij deed iets achter gesloten deuren
			hij deed iets op volle kracht
			hij deed iets met volle kracht
			hij deed iets met groot genoegen
			hij deed iets tot iemands groot genoegen
```

## ec122

Expressions headed by an unmodifiable noun, taking (1) a fixed determiner, (2) a modifier headed by an unmodifiable adjective, and (3) a modifier headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			dat is de gewoonste zaak van de wereld
			dat is een oude rot in het vak
			dat is een vreemde eend in de bijt
			dat is de normaalste zaak van de wereld
```

## ec123

Expressions headed by an unmodifiable noun, taking (1) a fixed determiner, and (2) a modifier headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			het zwaard van Damocles
			de wortel van het kwaad
			de wolf in schaapskleren
			de waan van de dag
			het voorportaal van de hel
			voer voor psychologen
			de val van de Muur
			de toren van Pisa
			een spervuur van vragen
			de slag bij Waterloo
```

## ec124

Expressions headed by a verb, taking a direct object consisting of a fixed determiner, an unmodifiable noun and a modifier headed by a fixed preposition taking variable complement.

```
			n.a.hij heeft de kloof tussen iets overbrugd
			hij heeft het gezicht van iets bepaald
			iets heeft een koers van iets genoteerd
			iets heeft een overzicht van iets gegeven
			hij heeft de kunst van iets verstaan
			hij heeft de kloof tussen iets gedicht
			hij heeft de kloof met iets gedicht
			iets heeft zwart van iets gezien
			iets heeft de geest van iets geademd
			hij heeft de geur van iets opgesnoven
```


```
[pos='VERB']
 -obj-> ([pos='NOUN' & xpos='.*number=sing.*']
   -nmod-> ([]
     -case-> [pos='ADP'] ) )  
```

## ec125

Expressions headed by an unmodifiable noun, taking a modifier headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			ziekte van Alzheimer
			wisseling van de wacht
			vrijheid van meningsuiting
			verschil van mening
			uitzondering op de regel
			teken aan de wand
			surseance van betaling
			storm van protest
			stok achter de deur
			stand van zaken
```

## ec126

Expressions headed by a verb, taking (1) a direct object consisting of a modifiable noun, and (2) a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft olie op het vuur gegooid
			hij heeft boter op het hoofd gehad
			hij heeft roet in het eten gegooid
			hij heeft gewicht in de schaal gelegd
			hij heeft zout in de wonden gewreven
			hij heeft zout in de wonden gestrooid
			hij heeft water in de wijn gedaan
			hij heeft brood op de plank gehad
			hij heeft kleur op de wangen gehad
			hij heeft kleur op zijn wangen gekregen
```

## ec127

Expressions headed by a verb, taking a direct object consisting of a fixed determiner, an unmodifiable noun and a modifier headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij heeft de tijd van zijn leven gehad
			hij heeft een zucht van verlichting geslaakt
			hij heeft het voordeel van de twijfel gekregen
			hij heeft de sterren van de hemel gespeeld
			hij is de macht over het stuur verloren
			hij is de macht over het stuur kwijtgeraakt
			hij heeft een dijk van een stem gehad
			hij heeft alle geluk van de wereld gehad
			hij heeft een slag om de arm gehouden
			hij heeft een hart van steen gehad
```

## ec128

Expressions headed by a fixed preposition taking a complement consisting of a fixed determiner, an unmodifiable noun, and a modifier headed by a fixed preposition taking a complement consisting of a fixed determiner and an unmodifiable noun.

```
			hij deed iets met kennis van zaken
			hij deed iets op slag van rust
			hij deed iets over de rug van anderen
			hij deed iets op hoop van zegen
			hij deed iets in het hol van de leeuw
			hij deed iets uit de grond van zijn hart
			hij deed iets in het holst van de nacht
			hij deed iets na verloop van tijd
```

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
			hij is zo fris als een hoentje
			het is zo vast als een huis
```

```
[pos='ADJ']
 -advmod-> ([lemma='zo|even' & pos='ADV']
   -advcl-> ([pos='NOUN']
     -mark-> [lemma='als' & pos='SCONJ'];
     -det-> [pos='DET'] ) )  
```


https://corpora.ato2.ivdnt.org/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&number=20&patt=%28%5Bpos%3D%27ADJ%27%5D%0A+-advmod-%3E+%28%5Blemma%3D%27zo%7Ceven%27+%26+pos%3D%27ADV%27%5D%0A+++-advcl-%3E+%28%5Bpos%3D%27NOUN%27%5D%0A+++++-mark-%3E+%5Blemma%3D%27als%27+%26+pos%3D%27SCONJ%27%5D%3B%0A+++++-det-%3E+%5Bpos%3D%27DET%27%5D+%29+%29++%29&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D


## ec131

Expressions headed by a verb, taking (1) a locative/directional complement consisting of two fixed components, and (2) an indirect object consisting of the preposition &quot;aan&quot; and a variable complement.

```
			iets is ten goede gekomen aan iemand
			iets is ten deel gevallen aan iemand
			iets is te beurt gevallen aan iemand
```

## ec132

Expressions headed by a verb, taking a locative/directional complement headed by a fixed preposition taking a complement consisting of a fixed determiner, an unmodifiable noun and a PP-modifier consisting of a fixed preposition and a variable complement.

```
			iets heeft in het teken van iets gestaan
			hij heeft aan het roer van iets gestaan
			hij heeft aan het begin van iets gestaan
			iets heeft in het verlengde van iets gelegen
			hij is in de ban gebleken van iets
			hij is onder de vleugels van iemand gebleven
			hij is in de ban gebleven van iets
			hij heeft in de ban geleken van iets
			hij is in de ban geraakt van iets
			hij is in de ban geweest van iets
```

## ec133

Expressions headed by a verb, taking a direct object consisting of a modifiable noun.

```
			hij heeft een rol gespeeld
			hij heeft een rol vervuld
			hij heeft indruk gemaakt
			hij heeft een concert gegeven
			hij heeft een beslissing genomen
			hij heeft geen beleid gevoerd
			hij heeft geen beleid gemaakt
			hij heeft geen voordeel genoten
			hij heeft een fout gemaakt
			hij heeft veel problemen gehad
```

## ec136

Expressions headed by a verb, taking (1) a direct object consisting of a fixed determiner and a modifiable noun, and (2) an indirect object consisting of the preposition &quot;aan&quot; and a variable complement.

```
			hij heeft de prioriteit gegeven aan iets
			hij heeft een bezoek gebracht aan iemand
			hij heeft zijn deelneming betuigd aan iemand
			hij heeft een hommage gebracht aan iemand
```

## ec137

Expressions headed by a verb, taking (1) a variable indirect object, (2) a direct object consisting of a modifiable noun, and (3) a variable verbal complement consisting of a (om)-te-infinitive clause.

```
			hij heeft iemand de kans gegeven om iets te doen
			hij heeft iemand de opdracht gegeven om iets te doen
			hij heeft iemand de ruimte gegeven om iets te doen
			hij heeft iemand het advies gegeven om iets te doen
			hij heeft iemand de moed gegeven om iets te doen
			hij heeft iemand de inspiratie geven om iets te doen
			hij heeft iemand de kracht gegeven om iets te doen
			hij heeft iemand het bevel gegeven om iets te doen
```

## ec138

Expressions headed by a verb, taking (1) a variable indirect object, (2) a variable direct object, and (3) a predicative complement consisting of a modifiable adjective.

```
			hij heeft iemand iets duidelijk gemaakt
			hij heeft iemand iets kwalijk genomen
```

## ec139

Expressions headed by a verb, taking (1) a variable indirect object, (2) a direct object consisting of a modifiable noun, and (3) a variable verbal complement consisting of a subordinate clause.

```
			hij heeft iemand de hoop gegeven dat zij iets wil doen
			hij heeft iemand de belofte gedaan dat zij iets wil doen
```

## ec140

Expressions headed by a verb, taking a direct object constisting of an unmodifiable adjective and an unmodifiable noun.

```
			hij heeft een vrije trap genomen
			hij heeft een strafbaar feit gepleegd
			hij heeft een eeuwig leven gehad
			hij heeft een gele kaart gegeven
			hij heeft een rode kaart gegeven
			hij heeft een aanvullend pensioen gehad
			hij heeft een absolute meerderheid gehad
			hij heeft een blauwe plek gehad
			hij heeft een gezond verstand gehad
			hij heeft een staande ovatie gegeven
```
