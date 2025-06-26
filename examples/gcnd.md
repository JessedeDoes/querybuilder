# UD versie van GCND-dialectconstructies

Zie voor de Alpino-versie https://portal.clarin.ivdnt.org/gcnd-frontend/GCND/static/files/dialectconstructies.pdf 

## Subjectverdubbeling

voorbeeld: ik loop ik


query: 

```[pos='VERB']
 -nsubj-> [pos='PRON'];
 -nsubj-> [pos='PRON']  
```

## Subject in objectvorm

voorbeeld: hem loopt
! query aanpassen 

```
[pos='VERB']
 -nsubj-> [word='hem' & pos='PRON']  
```


De algemenere query 

```
[pos='VERB']
 -nsubj-> [pos='PRON' & xpos='.*Case=Acc.*']  
```

faalt wegens veel tagfouten van "je"

## Presentatief het

(https://portal.clarin.ivdnt.org/gcnd-frontend/GCND/static/files/dialectconstructies.pdf#page=9.45)

Voorbeeld: _het komen ginder twee duitsers_

De aanvankelijke parse slaat nergens op. 

![image](https://github.com/user-attachments/assets/e5cf52ee-8d0b-4cc2-82cc-c88e4d0055dd)


Onderzoek welke relatie tussen 'het' en het hoofdwerkwoord uit de alpino-ud-conversie komt door de query vereenvoudigen, de relatie open te laten en in het frontend te groeperen:

![image](https://github.com/user-attachments/assets/e1517729-7780-46c3-8dd4-d30c4039dcd3)

![image](https://github.com/user-attachments/assets/2aa27f17-85f1-4cb2-9afb-1205d67d34c2)

Overeenkomstig de `mod` die in de alpino-analyses gekozen is, geeft `obl` deze gevallen terug. 

Willen we dat overigens wel? in het Duits werkt het zo:

![image](https://github.com/user-attachments/assets/4d7e39bc-705b-47bb-8a20-eb38775828c5)



![image](https://github.com/user-attachments/assets/61ee5aa4-97c2-474a-ab5b-2fd869fe3230)

# sat, tag etc

- Geen verschil in UD tussen tag en sat!
- positie van constituenten is lastig te bevragen
   
## Aanloopconstructies

![image](https://github.com/user-attachments/assets/cb48f681-1194-4c08-acb0-162d531c13e4)

## Hanging topic

Lastig te vinden door het constituentpositieprobleem.
Poging:

![image](https://github.com/user-attachments/assets/cecd44f3-d190-48d8-9584-f11264528b0d)

```
[pos='VERB']
 -parataxis-> (n3:[pos='NOUN']
   -nmod:poss|det-> [];
   !-case-> [] );
 -nsubj-> n5:[pos='PRON' & xpos='.*Person=3\|PronType=Prs.*']   :: start(n3) < start(n5)
```

## Tussenwerpsels en aansporingen 

Alweer lastig...

![image](https://github.com/user-attachments/assets/6eccba2b-206f-485c-a125-af1a8b877463)

## Inversieloos V-later-dan-2 / V>2 / Noninverted V3

![image](https://github.com/user-attachments/assets/16be44ef-d3c5-4b22-a32b-697db04a9685)

## ja ik, nee het, etc

![image](https://github.com/user-attachments/assets/a25a0f39-0037-463a-9cb3-5f2f57ec18ac)

```
[pos='INTJ']
 -fixed-> [pos='PRON' & xpos='.*prontype=prs.*']  
```
## V2-bijzinnen - pseudodirecte rede

Voor het Engels ccomp, bijvoorbeeld:
```
[lemma='say|know' & pos='VERB']
 -nsubj-> [pos='PRON'];
 -ccomp-> ([pos='VERB']
   !--> [pos='SCONJ'];
   !--> [word='wh.*' & pos='PRON|adv'] )  
```
![image](https://github.com/user-attachments/assets/b17d9672-dfa7-4fdc-8e49-ed6470be3c4e)

Voor het nederlands: parataxis

![image](https://github.com/user-attachments/assets/4051e296-3fcf-4f92-ba61-19817594e1ef)

Querybenadering:
```
[lemma='zeggen|weten' & pos='VERB']
 -nsubj-> [];
 -parataxis-> ([pos='VERB']
   !-mark-> [pos='SCONJ'];
   !--> [word='w.*' & pos='PRON|adv'] );
 !-ccomp-> []  
```
![image](https://github.com/user-attachments/assets/7faa8e2b-0c32-4f65-888a-b60bfc108531)


Ook Duits doet ccomp:

![image](https://github.com/user-attachments/assets/fac97e56-5669-41ca-9743-319f5cccf064)

## Afwijkende comparatieve voegwoorden (of, als, gelijk als, gelijk of dat)

Hier mis je wel de expliciete markering van vergelijkingsconstructies die Alpino wel heeft. 
```
[word='meer|minder' & pos='PRON']
 -advcl-> ([pos='NOUN']
   -mark-> [pos='SCONJ'] )  
```
(En groepeer op de conjunctie)

Of met adjectieven:

```
[pos='ADJ' & xpos='.*Degree=Cmp.*']
 -advcl-> ([]
   -mark-> [pos='SCONJ'] )  
```
![image](https://github.com/user-attachments/assets/87a2de95-dd96-46f7-bec7-37d0374e310e)


![image](https://github.com/user-attachments/assets/f8d2a4ad-ce62-4bd2-ae9d-b3a576fec900)

Voor meerwoordige voegwoorden bijvoorbeeld:

```
[pos='ADJ' & xpos='.*Degree=Cmp.*']
 -advcl-> ([]
   -mark-> ([pos='SCONJ']
     -fixed-> [] ) )  
```

## Directe rede ingeleid door van

(Versie in gcnd-gretelverhaal is wat te breed, het afhankelijke werkwoord moet finiet zijn)

![image](https://github.com/user-attachments/assets/53b65eae-f56e-4c20-91bb-6ed1e2fb12ad)

```
[]
 -ccomp-> ([pos='verb' & xpos='.*verbform=fin.*']
   -mark-> [word='van'] )  
```

## expletief dat

### Na onderschikkend voegwoord

```
[pos='sconj']
 -fixed-> [word='dat']  
```

### Na vraagwoord

Geen fixed, annotatie lijkt nogal wild te varieren.

## Beknopte bijzinnen ingeleid door voor of van in plaats van om
```
[pos='VERB']
 -mark-> [pos='ADP'];
 -mark-> [word='te' & pos='ADP']  
```
Groepeer op het voorzetsel 
![image](https://github.com/user-attachments/assets/0561a4fd-3bf8-4154-9ecb-4b92c5363297)

## Afhankelijke ja/nee-vragen ingeleid door als ipv of
```
[pos='VERB']
 -advmod-> [pos='ADV'];
 -ccomp-> ([pos='VERB' & xpos='.*verbform=fin.*']
   -mark-> [pos='SCONJ'  & lemma != 'dat'] )
```

# Negatieverschijnselen

## Dubbele negatie

### a en ... niet
 ```
[pos='VERB']
 -advmod-> [word='en'];
 -advmod-> [word='niet']  
```

### b niemand ... niet (etc)

```
[pos='VERB']
 --> [lemma='niemand|niets|nooit' & pos='PRON'];
 -advmod-> [lemma='niet' & pos='ADV']  
```


## Doen-replieken

Iets als
```
[lemma='doen' & pos='VERB' & xpos='.*verbform=fin.*']
 -nsubj-> [pos='PRON' & xpos='.*PronType=Prs.*'];
 !-(obj|iobj|obl|advmod|advcl|ccomp|xcomp)-> []  
```

# Andere

## Woordherhaling

## Spiegelconstructies


```
n2:[pos='VERB']
 -nsubj-> n1:[pos='PRON'];
 -parataxis-> n3:[pos='VERB'];
 -parataxis-> (n6:[pos='VERB']
   -nsubj-> n7:[pos='PRON'] )   :: start(n1) < start(n2) & start(n2) < start(n3) & start(n3) < start(n6) & start(n6) < start(n7) & n2.lemma=n6.lemma
```
Hierarchie kan zo zijn:

![image](https://github.com/user-attachments/assets/5dc7ccad-90bb-4a15-babe-6d050a6144e9)

Of zo:

![image](https://github.com/user-attachments/assets/ae2727db-39da-4181-a99b-502942eb436e)


De query is dan iets als:
```
n3:[lemma='komen' & pos='VERB']
 -parataxis-> (n2:[lemma='zeggen' & pos='VERB']
   -nsubj-> n1:[lemma='ik' & pos='PRON'] );
 -parataxis-> (n4:[lemma='zeggen' & pos='VERB']
   -nsubj-> n5:[lemma='ik' & pos='PRON'] )  :: n2.lemma = n4.lemma
```

## Apokoinou

Wordt in de alpino-annotatie via het categorielabel gevonden, is in de ud-annotatie hier onvindbaar.


## exclamatieve infinitiefzinnen 

De voor de hand liggend oplossing (infinitief met een subject, geen hulp of koppen werkwoord)

```
n3:[pos='VERB' & xpos='.*VerbForm=Inf.*']
 -nsubj-> n1:[pos='PRON'];
 !-aux|cop-> n2:[pos='AUX']  
```

Werkt niet door tagfouten
