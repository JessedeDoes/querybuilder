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

