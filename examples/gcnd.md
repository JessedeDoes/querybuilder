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

Voorbeeld: _het komen ginder twee duitsers_

De aanvankelijke parse slaat nergens op. 

![image](https://github.com/user-attachments/assets/e5cf52ee-8d0b-4cc2-82cc-c88e4d0055dd)


Onderzoek welke relatie tussen 'het' en het hoofdwerkwoord uit de alpino-ud-conversie komt door de query vereenvoudigen, de relatie open te laten en in het frontend te groeperen:

![image](https://github.com/user-attachments/assets/e1517729-7780-46c3-8dd4-d30c4039dcd3)

![image](https://github.com/user-attachments/assets/2aa27f17-85f1-4cb2-9afb-1205d67d34c2)

Overeenkomstig de `mod` die in de alpino-analyses gekozen is, geeft `obl` deze gevallen terug. 

Willen we dat overigens wel? in het duits werkt het zo:

![image](https://github.com/user-attachments/assets/4d7e39bc-705b-47bb-8a20-eb38775828c5)



![image](https://github.com/user-attachments/assets/61ee5aa4-97c2-474a-ab5b-2fd869fe3230)


