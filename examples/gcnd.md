=Subjectverdubbeling

voorbeeld: ik loop ik


query: 

```[pos='VERB']
 -nsubj-> [pos='PRON'];
 -nsubj-> [pos='PRON']  
```

=Subject in objectvorm

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

=Presentatief het

Voorbeeld: het komen ginder twee duitsers

De initiele parse slaat nergens op. Onderzoek welke relatie 
