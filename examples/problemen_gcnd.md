# Rarigheden met negatie

```
[pos='verb']
 -nsubj-> [];
 !-nsubj-> []  
```

Geeft resultaten http://svotmc10.ivdnt.loc/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&number=20&patt=%5Bpos%3D%27verb%27%5D%0A+-nsubj-%3E+%5B%5D%3B%0A+%21-%28~%28nsubj%29%29-%3E+%5B%5D++&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D

```
[pos='verb']
 -nsubj-> _;
 !-nsubj-> _  
```

kom ik niet doorheen


Maar:
```
([] -nsubj-> [] ; !-nsubj-> []) within <s/> 
```

geen resultaten (http://svotmc10.ivdnt.loc/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&number=20&patt=%28%5B%5D+-nsubj-%3E+%5B%5D+%3B+%21-nsubj-%3E+%5B%5D%29+within+%3Cs%2F%3E+&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D)




```([] --> []) within <s/>```

 meer resultaten dan zonder de within??? en wat klopt?


32,763 resultaten voor `([] -nsubj-> []) within <s/>`
http://svotmc10.ivdnt.loc/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&number=20&patt=%28%5B%5D+-nsubj-%3E+%5B%5D%29+within+%3Cs%2F%3E&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D

31,885 voor `([] -nsubj-> [])` 
http://svotmc10.ivdnt.loc/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&number=20&patt=+%28%5B%5D+-nsubj-%3E+%5B%5D%29+%0A&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D



```[pos="NOUN"] -(~(amod))-> []```
http://svotmc10.ivdnt.loc/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&group=capture%3Arel%3Ai%3Aamod%3Atarget&number=100&patt=%5Bpos%3D%22NOUN%22%5D+-%28~%28amod%29%29-%3E+%5B%5D&sort=identity&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D

Geeft van alles terug, en zoals je zou verwachten geen amod

Bij
```
[pos="NOUN"] 
--> [];
!-(~(amod))-> []
```
verwacht ik: alleen maar amod relaties, maar dat is niet het resultaat van
http://svotmc10.ivdnt.loc/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&group=capture%3Arel%3Ai%3Arel%3Atarget&number=20&patt=%5Bpos%3D%22NOUN%22%5D+%0A--%3E+%5B%5D%3B%0A%21-%28~%28amod%29%29-%3E+%5B%5D&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D





# Problemen met de root-relatie 

^--> [pos='NOUN']
 -amod-> ([pos='ADJ']
   -advmod-> [pos='ADJ'];
   -advmod-> [pos='ADJ'] );
 -amod-> [pos='ADJ']  


http://svotmc10.ivdnt.loc/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&number=20&patt=%28%5E--%3E+%5Bpos%3D%27NOUN%27%5D%0A+-amod-%3E+%28%5Bpos%3D%27ADJ%27%5D%0A+++-advmod-%3E+%5Bpos%3D%27ADJ%27%5D%3B%0A+++-advmod-%3E+%5Bpos%3D%27ADJ%27%5D+%29%3B%0A+-amod-%3E+%5Bpos%3D%27ADJ%27%5D++%29&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D


# Probleempje met volgorde-restricties (met name als twee 'identieke' descendants???

```
n2:[pos='noun']
 -case-> n1:[pos='ADP'];
 -case-> n3:[pos='ADP']   :: start(n1) < start(n2) & start(n2) < start(n3)
```

Geeft geen hits in http://svotmc10.ivdnt.loc/blacklab-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Dutch%22%29&first=0&number=20&patt=%28%28n2%3A%5Bpos%3D%22noun%22%5D%29+-case-%3E+%28n1%3A%5Bpos%3D%22ADP%22%5D%29+%3B+-case-%3E+%28n3%3A%5Bpos%3D%22ADP%22%5D%29%29+%3A%3A+%28%28start%28n1%29+%3C+start%28n2%29%29+%26+%28start%28n2%29+%3C+start%28n3%29%29%29&adjusthits=true&withspans=true&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D

```
n2:[pos='noun']
 -case-> n1:[lemma='tussen' & pos='ADP'];
 -case-> n3:[lemma='in' & pos='ADP']  
```

geeft wel hits, dus het zal wel iets met die identieke constraints te maken hebben


