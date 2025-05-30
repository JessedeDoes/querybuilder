# Example based query building prototype

Gebaseerd op grew conllu-editcomponent, zie https://github.com/kirianguiller/reactive-dep-tree 

## To do:

* Token geheel uitsluiten
* uitgesloten properties anders weergeven dan ingeschakelde (done)
* onbereikbare nodes markeren (done)
* volgorderestricties
* negatie
* features aanzetten
* nice to have
  * "top node is really sentence root" boolean option
  * boolean voor sentence length filter
  * boolean exclude punct
  * status styling binnen de grew treeview
  * taalidentificatie

## Use scenario

### 1. enter a sentence, choose language, and parse
![image](https://github.com/user-attachments/assets/31c4b235-8229-4171-abc2-641c9c278042)
### 2. edit the query

* Token properties (including the dependency label)  can be set in the "matrix" below the parse
   * the checkbox to the right of a token property determines whether the property will be part of the query
* Editing the tree
	* Delete an edge in the 'matrix' by pressing the 'x' button to the right of deprel
	* Drag from 'head' to 'dependent' to create a new edge

In this case:




 
  




