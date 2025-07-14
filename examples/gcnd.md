# Algemene problemen

* Zoek naar ww me precies 1,2 etc subjecten
* Iets met constituenten en constituentlabels
* Zoek naar een bepaalde structuur 'en verder niets'  

# UD versie van GCND-dialectconstructies

Zie voor de Alpino-versie https://portal.clarin.ivdnt.org/gcnd-frontend/GCND/static/files/dialectconstructies.pdf 

## Subjectverdubbeling

voorbeeld: ik loop ik


query: 

```[upos='VERB']
 -nsubj-> [upos='PRON'];
 -nsubj-> [upos='PRON']  
```

**Issue**: het is nu niet mogelijk naar _precies twee subjecten_ te zoeken; deze query matcht ook gevallen met drie subjecten.

## Subject in objectvorm

voorbeeld: hem loopt
! query aanpassen 

```
[upos='VERB']
 -nsubj-> [word='hem' & upos='PRON']  
```


De algemenere query 

```
[upos='VERB']
 -nsubj-> [upos='PRON' & feats='.*Case=Acc.*']  
```

faalt wegens veel tagfouten van "je"

**Issue**: PoS features niet erg precies getagd (zie ook verderop mbt verbform).

## Presentatief het

(https://portal.clarin.ivdnt.org/gcnd-frontend/GCND/static/files/dialectconstructies.pdf#page=9.45)

Voorbeeld: _het komen ginder twee duitsers_

De aanvankelijke parse slaat nergens op. 

<img width="50%" src="https://github.com/user-attachments/assets/e5cf52ee-8d0b-4cc2-82cc-c88e4d0055dd"/>


Onderzoek welke relatie tussen 'het' en het hoofdwerkwoord uit de alpino-ud-conversie komt door de query vereenvoudigen, de relatie open te laten en in het frontend te groeperen:

<img width="50%" src="https://github.com/user-attachments/assets/e1517729-7780-46c3-8dd4-d30c4039dcd3"/>

<img width="50%" src="https://github.com/user-attachments/assets/2aa27f17-85f1-4cb2-9afb-1205d67d34c2"/>

Overeenkomstig de `mod` die in de alpino-analyses gekozen is, geeft `obl` deze gevallen terug. 

Willen we dat overigens wel? in het Duits werkt het zo:

<img width="50%" src="https://github.com/user-attachments/assets/4d7e39bc-705b-47bb-8a20-eb38775828c5"/>



<img width="35%" src="https://github.com/user-attachments/assets/61ee5aa4-97c2-474a-ab5b-2fd869fe3230"/>

# sat, tag etc

- Geen verschil in UD tussen tag en sat!
- positie van constituenten is lastig te bevragen
   
## Aanloopconstructies (2.1.a)

Dit is _sat_ in Alpino.

<img width="50%" src="https://github.com/user-attachments/assets/cb48f681-1194-4c08-acb0-162d531c13e4"/>


Een poging (die maar een deel van de gevallen dekt, PROPN en object):

```
n4:[upos='VERB']
 -parataxis-> (n1:[upos='PROPN']
 );
 -obj-> n3:[word='die' & upos='PRON']   :: start(n1) < start(n3) & start(n3) < start(n4)
```
<img width="40%" alt="image" src="https://github.com/user-attachments/assets/e9ea176b-23eb-4acf-95a3-0319353c9739" />

Voor NOUN en subject bijvoorbeeld

```
n4:[upos='VERB']
 -parataxis-> (n1:[upos='NOUN']
 );
 -nsubj-> n3:[word='die' & upos='PRON']   :: start(n1) < start(n3) & start(n3) < start(n4)
```

## Hanging topic (2.1.b)

Lastig te vinden door het constituentpositieprobleem.
Poging:

<img width="50%" src="https://github.com/user-attachments/assets/cecd44f3-d190-48d8-9584-f11264528b0d"/>

```
[upos='VERB']
 -parataxis-> (n3:[upos='NOUN']
   -nmod:poss|det-> [];
   !-case-> [] );
 -nsubj-> n5:[upos='PRON' & feats='.*Person=3\|PronType=Prs.*']   :: start(n3) < start(n5)
```

<img width="40%" alt="image" src="https://github.com/user-attachments/assets/b47f2135-c785-42e3-a30e-22e77945eb98" />

## Tussenwerpsels en aansporingen  (2.1.c)

Alweer lastig een precieze query op te stellen.

<img width="50%" src="https://github.com/user-attachments/assets/6eccba2b-206f-485c-a125-af1a8b877463"/>

In het geval van een enkel woord kan je wel eisen dat het aan het begin val de zin staat:

```
<s> rspan(((n5:[]) -parataxis-> (n1:[upos='ADV'])) :: (start(n1) < start(n5)),'all')
```

## Inversieloos V-later-dan-2 / V>2 / Noninverted V3 (2.1.d)

<img width="50%" src="https://github.com/user-attachments/assets/16be44ef-d3c5-4b22-a32b-697db04a9685"/>

Gaat niet echt lekker!

```
^--> n5:[upos='VERB' & feats='.*=fin.*']
 -advmod|obl-> n1:[upos='ADV|NOUN'];
 -nsubj-> n2:[];
 !-mark-> [];
 !-aux-> []   :: start(n1) < start(n2) & start(n2) < start(n5)
```

is een poging maar vindt niet veel.

Je ziet dat de query wel redelijk voor het Engels werkt:

https://corpora.ato2.ivdnt.org/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22English%22%29&first=20&number=20&patt=%28%5E--%3E+%28%28n5%3A%5Bupos%3D%27VERB%27+%26+feats%3D%27.%2A%3Dfin.%2A%27%5D%29+-advmod%7Cobl-%3E+%28n1%3A%5Bupos%3D%27ADV%7CNOUN%27%5D%29+%3B+-nsubj-%3E+%28n2%3A%5B%5D%29+%3B+%21-mark-%3E+%5B%5D+%3B+%21-aux-%3E+%5B%5D%29%29+%3A%3A+%28%28start%28n1%29+%3C+start%28n2%29%29+%26+%28start%28n2%29+%3C+start%28n5%29%29%29&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D 


## Ingebedde dislocaties (2.1.e)

(CGN syntactische annotatie, https://taalmaterialen.ivdnt.org/wp-content/uploads/documentatie/cgn_website/doc_Dutch/topics/annot/syntax/syn_prot.pdf)

_wat vindt u d’r eigenlijk van dat zulke zinnen dat die zo geanalyseerd worden?_

Op grond van

<img width="40%" src="https://github.com/user-attachments/assets/91b16785-1a7f-48e4-a175-6368d8db285e" />

Verwacht je een UD-structuur als

<img width="915" height="221" alt="image" src="https://github.com/user-attachments/assets/3502b960-6719-4496-b425-aedc4c575059" />

En dus een query als

```
(^--> [upos='VERB']
 -mark-> ([upos='SCONJ']
 );
 -parataxis-> [upos='NOUN'];
 -mark-> [upos='SCONJ']  )
```

Niets zinnigs gevonden.


## ja ik, nee het, etc (2.1.f)

<img width="35%" src="https://github.com/user-attachments/assets/a25a0f39-0037-463a-9cb3-5f2f57ec18ac"/>

```
^--> [upos='INTJ']
 -fixed-> [upos='PRON']  
```

Deze query vindt trouwens ook nog deze gevallen:

<img width="40%" src="https://github.com/user-attachments/assets/2443cb11-cee8-4bd3-96a4-3676f1532edb" />


## V2-bijzinnen - pseudodirecte rede (2.2)

! query in xpath-stuk is fout, verbeteren!


Voor het Engels ccomp, bijvoorbeeld:
```
[lemma='say|know' & upos='VERB']
 -nsubj-> [upos='PRON'];
 -ccomp-> ([upos='VERB']
   !--> [upos='SCONJ'];
   !--> [word='wh.*' & upos='PRON|adv'] )  
```
<img width="50%" src="https://github.com/user-attachments/assets/b17d9672-dfa7-4fdc-8e49-ed6470be3c4e"/>

Voor het nederlands: parataxis, op grond van de Alpino-annotatierichtlijn verwachten we voor UD:

<img width="50%" alt="image" src="https://github.com/user-attachments/assets/f3e906f4-9d17-4bde-9373-23ebac76f97d" />


Querybenadering:
```
^--> n4:[upos='VERB']
 -parataxis-> (n2:[lemma='zeggen' & upos='VERB']
   -nsubj-> [upos='PRON'] );
 -nsubj-> [upos='PRON'];
 -obj-> [upos='PRON'];
 -advmod-> [upos='ADV']   :: start(n2) < start(n4)
```

Hoe zie je het verschil met de gewone directe rede?

In ieder geval vind je een paar matchende gevallen door twee keer 'hij' te vragen:

```
^--> n4:[upos='VERB']
 -parataxis-> (n2:[lemma='zeggen' & upos='VERB']
   -nsubj-> [lemma='hij' & upos='PRON'] );
 -nsubj-> [lemma='hij' & upos='PRON']   :: start(n2) < start(n4)
```


Net als het Engels doet ook Duits _ccomp_:

<img width="50%" src="https://github.com/user-attachments/assets/fac97e56-5669-41ca-9743-319f5cccf064"/>

## Intercalaties (2.3)

Hier loop je weer tegen het constituent-probleem aan, waardoor een algemene query niet goed op te stellen is.

Afgaande op een verwachte structuur als

<img width="50%" src="https://github.com/user-attachments/assets/fc383ad6-27bb-450f-b554-2efbe8f0381b" />

kan je bepaalde deelklasse wel vinden met een query als

```
^--> n7:[upos='VERB']
 -advmod-> n1:[upos='ADV'];
 -parataxis-> (n4:[upos='VERB']
 )   :: start(n1) < start(n4) & start(n4) < start(n7)
 ```

# Complementizer-fenomenen

## Afwijkende comparatieve voegwoorden (of, als, gelijk als, gelijk of dat) (3.1)

Hier mis je wel de expliciete markering van vergelijkingsconstructies die Alpino wel heeft. 
```
[word='meer|minder' & upos='PRON']
 -advcl-> ([upos='NOUN']
   -mark-> [upos='SCONJ'] )  
```
(En groepeer op de conjunctie)

Of met adjectieven:

```
[upos='ADJ' & feats='.*Degree=Cmp.*']
 -advcl-> ([]
   -mark-> [upos='SCONJ'] )  
```
<img width="50%" src="https://github.com/user-attachments/assets/87a2de95-dd96-46f7-bec7-37d0374e310e"/>


<img width="50%" src="https://github.com/user-attachments/assets/f8d2a4ad-ce62-4bd2-ae9d-b3a576fec900"/>

Voor meerwoordige voegwoorden bijvoorbeeld:

```
[upos='ADJ' & feats='.*Degree=Cmp.*']
 -advcl-> ([]
   -mark-> ([upos='SCONJ']
     -fixed-> [] ) )  
```

## Directe rede ingeleid door van (3.2)

(Versie in gcnd-gretelverhaal is wat te breed, het afhankelijke werkwoord moet finiet zijn)

<img width="50%" src="https://github.com/user-attachments/assets/53b65eae-f56e-4c20-91bb-6ed1e2fb12ad"/>

```
[upos='VERB']
 -ccomp-> ([]
   -mark-> [lemma='van'] )  
```

Waarmee dus ook wat te veel opgehaald wordt.

Preciezer is

```
([upos='VERB']
 -ccomp-> ([upos != 'verb' | feats = '.*=fin.*']
   -mark-> [lemma='van'] )  )
```

## expletief dat (3.3)

### Na onderschikkend voegwoord

```
[upos='sconj']
 -fixed-> [word='dat']  
```

### Na vraagwoord

Geen fixed, annotatie lijkt nogal wild te varieren.

## Beknopte bijzinnen ingeleid door voor of van in plaats van om
```
[upos='VERB']
 -mark-> [upos='ADP'];
 -mark-> [word='te' & upos='ADP']  
```
Groepeer op het voorzetsel 
<img width="50%" src="https://github.com/user-attachments/assets/0561a4fd-3bf8-4154-9ecb-4b92c5363297"/>

## Afhankelijke ja/nee-vragen ingeleid door als ipv of
```
[upos='VERB']
 -advmod-> [upos='ADV'];
 -ccomp-> ([upos='VERB' & feats='.*verbform=fin.*']
   -mark-> [upos='SCONJ'  & lemma != 'dat'] )
```

# Negatieverschijnselen

## Dubbele negatie

### a en ... niet
 ```
[upos='VERB']
 -advmod-> [word='en'];
 -advmod-> [word='niet']  
```

### b niemand ... niet (etc)

```
[upos='VERB']
 --> [lemma='niemand|niets|nooit' & upos='PRON'];
 -advmod-> [lemma='niet' & upos='ADV']  
```


## Doen-replieken

Iets als
```
[lemma='doen' & upos='VERB' & feats='.*verbform=fin.*']
 -nsubj-> [upos='PRON' & feats='.*PronType=Prs.*'];
 !-(obj|iobj|obl|advmod|advcl|ccomp|xcomp)-> []  
```

# Andere

## Woordherhaling

## Spiegelconstructies


```
n2:[upos='VERB']
 -nsubj-> n1:[upos='PRON'];
 -parataxis-> n3:[upos='VERB'];
 -parataxis-> (n6:[upos='VERB']
   -nsubj-> n7:[upos='PRON'] )   :: start(n1) < start(n2) & start(n2) < start(n3) & start(n3) < start(n6) & start(n6) < start(n7) & n2.lemma=n6.lemma
```
Hierarchie kan zo zijn:

<img width="50%" src="https://github.com/user-attachments/assets/5dc7ccad-90bb-4a15-babe-6d050a6144e9"/>

Of zo:

<img width="50%" src="https://github.com/user-attachments/assets/ae2727db-39da-4181-a99b-502942eb436e"/>


De query is dan iets als:
```
n3:[lemma='komen' & upos='VERB']
 -parataxis-> (n2:[lemma='zeggen' & upos='VERB']
   -nsubj-> n1:[lemma='ik' & upos='PRON'] );
 -parataxis-> (n4:[lemma='zeggen' & upos='VERB']
   -nsubj-> n5:[lemma='ik' & upos='PRON'] )  :: n2.lemma = n4.lemma
```

## Apokoinou

Wordt in de alpino-annotatie via het categorielabel gevonden, is in de ud-annotatie hier onvindbaar.


## exclamatieve infinitiefzinnen 

De voor de hand liggend oplossing (infinitief met een subject, geen hulp of koppen werkwoord)

```
n3:[upos='VERB' & feats='.*VerbForm=Inf.*']
 -nsubj-> n1:[upos='PRON'];
 !-aux|cop-> n2:[upos='AUX']  
```

Werkt niet door tagfouten in verbform
```
^--> [upos='VERB' & feats='.*inf.*']
 -nsubj-> [lemma='jij|ik|gij' & upos='PRON'];
 !-aux-> []  
```
geeft een paar resultaten

Alternatief voor gevallen met foute verbform:

```
^--> [upos='VERB' & feats='.*plur.*pres.*']
 -nsubj-> [lemma='jij|ik|gij' & upos='PRON'];
 !-aux-> []  
```

## Circumpositie
```
n2:[upos='NOUN']
 -case-> n1:[upos='ADP'];
 -case-> n3:[upos='ADP']   :: start(n3) < start(n2) & start(n2) < start(n1)
```

De versie uit de querybuilder (n1 en n3 omgekeerd) werkt niet vanwege een complexe blacklab-kwestie (https://github.com/instituutnederlandsetaal/BlackLab/issues/453)



