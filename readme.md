# Example based query building prototype

Concept van GrETEL, natuurlijk.

Implementatie met behulp van de grew conllu-weergavecomponent, zie https://github.com/kirianguiller/DependencyTreeJS

Let op, er wordt nu een fork gebruikt, https://github.com/JessedeDoes/DependencyTreeJS

Probeer uit op [http://svotmc10.ivdnt.loc/blacklab-frontend/UD_TEI_ALLSENTENCES/static/qbe/index.html](https://corpora.ato2.ivdnt.org/blacklab-frontend/UD_TEI_ALLSENTENCES/static/qbe/index.html)

## How to use

### 1. enter a sentence, choose language, and parse
<img src="https://github.com/user-attachments/assets/a2fa22de-e609-4b44-955f-f6092f482442" width="400px"/>

### 2. edit the query

* Token properties (including the dependency label)  can be set in the "matrix" below the parse
   * the checkbox to the right of a token property determines whether the property will be part of the query. By default, dependency label and UPoS are included in the query
* Editing the tree
	* Delete an edge in the 'matrix' by pressing the 'x' button to the right of deprel
	* Drag from 'head' to 'dependent' to create a new edge
        * To make a token root, drag upwards. In order for q query to be generated, there must be exactly one root token	

In this case the subject is irrelevant and can be dropped, and including the lemma 'way' in the query is essential:

<img src="https://github.com/user-attachments/assets/686e4fe6-7cdb-469b-a7fc-2a6ad8fd0ede" width="400px"/>

### 3. Search the corpus

(http://svotmc10.ivdnt.loc/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22English%22%29&first=0&number=20&patt=_with-spans%28+%5Bpos%3D%27VERB%27%5D%0A+-obj-%3E+%28+%5Blemma%3D%27way%27+%26+pos%3D%27NOUN%27%5D%0A+++-nmod%3Aposs-%3E++%5Bpos%3D%27PRON%27%5D%29%3B%0A+-obl-%3E+%28+%5Bpos%3D%27NOUN%27%5D%0A+++-case-%3E++%5Bpos%3D%27ADP%27%5D%29%29&adjusthits=yes&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D)

![image](https://github.com/user-attachments/assets/e50d1b6e-ae67-4eae-94a2-e5a27f46ce22)

## To do:

- [x] Token geheel weggooien
- [ ] Net als bij gretel ipv de checkboxes driewaard =/is niet/niet meegenomen
- [ ] token met recursief alle descendants weggooien
- [x] uitgesloten properties anders weergeven dan ingeschakelde (done)
- [x] onbereikbare nodes markeren (done)
- [x] volgorderestricties
- [x] negatie
- [ ] check op resultaat parser: bij meerdere zinnen in de parse gaat het mis
- [ ] PoS features (number, tense, etc...) netjes opnemen in matrix
- [ ] Use something more like the token boxes in the blacklab frontend advance query builder
      
* nice to have
  - [x] "top node is really sentence root" boolean option
  - [x] boolean voor sentence length filter
  - [x] boolean exclude punct
  - [ ] status en polarity dependent styling binnen de grew treeview
  - [x] matrix alignen met treeview nodes (niet per se nodig voor queries, wel als je een corpus zou willen taggen)
  - [ ] Multiword tokens!
  - [ ] Enhanced dependencies?
  - [ ] Taalidentificatie

* problems
   - No way to produce disjunctive queries like below:
```
([pos="verb" & lemma="geven"] -iobj-> []) | ([pos="verb" & lemma="geven"] -obl-> [] -case-> "aan")
```




# Voorbeelden van problemen met cross-language zoeken

Attributief adjectief
* Wij verwachten amod
* Japans doet acl
* Chinees (棕色的书) doet amod zonder 的, maar met word het NOUN -nmod-> ADJ -case-> 的(PART)






 
  




