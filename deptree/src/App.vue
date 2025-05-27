<template>
  <main class="wrapper">
    <h1 style="font-size: 14pt; margin-bottom: 1em">Example-based query building prototype</h1>

    <!-- input box -->
    <form @submit.prevent="parse">
      <textarea v-model="sentence"
                placeholder="Type any sentence …"
                rows="2"></textarea>
             
      <select v-model="language"><option v-for="name in Object.keys(languages)" :key="name" :value="name">{{ name }}</option></select>
      
      <button :disabled="loading || !sentence.trim()">Parse</button>
      
    </form>

    <!-- show errors -->
    <p v-if="error" class="error">{{ error }}</p>

    <!-- SVG target for DependencyTreeJS -->
     <div xml:id="treeWrapper" id="treeWrapper" style="padding: 1em; overflow-x: scroll">
        <svg width="1200px" height="600px" ref="svgEl" class="tree"></svg>
     </div>
    <!-- generated BlackLab query -->
    <section v-if="blacklabQuery">
      <h2>Query</h2>
      <code class="query">{{ blacklabQuery }}</code>
      <form @submit.prevent="search"><button>Search</button></form>
    </section>
  </main>
  <QueryBuilder/>
</template>

<script setup>
// https://github.com/kirianguiller/reactive-dep-tree
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import {
  ReactiveSentence,
  SentenceSVG,
  SentenceCaretaker,
  defaultSentenceSVGOptions
} from 'dependencytreejs/lib';


import QueryBuilder from './QueryBuilder.vue';

const sentence  = ref('Het is goed dat je fietst');
const language = ref('Dutch')
const languages = {
  "Dutch" : "nl",
  "English" : "en",
  "German" : "de",
  "French" : "fr",
  "Japanese" : "ja",
  "Czech" : "cs",
  "Russian": "ru",
  "Latin" : "la",
  "All" : "_"
}

const loading  = ref(false);
const error    = ref(null);
const svgEl    = ref(null);

let reactiveSentence;    // will hold the current tree
let sentenceSvg;         // DependencyTreeJS renderer
let caretaker;
const blacklabQuery = ref('');

const opts = defaultSentenceSVGOptions();
opts.interactive = true;  
opts.shownFeatures = ["LEMMA","UPOS"]

function findToken(tokenId)  {
  const nodesJson = reactiveSentence.state.treeJson.nodesJson
  const id =  Object.keys(nodesJson).find(i => nodesJson[i].ID == tokenId) 
  return nodesJson[id]
}

function hasProperty(tokenId, property)  {
  const t = findToken(tokenId)
  const key = `MISC.${property}_Active`
  return (key in t && (t[key])) || (!(key in t ) && (property == "UPOS" || property == "DEPREL"))
}

function updateQuery()
{
  const conllu = reactiveSentence.exportConll()
  blacklabQuery.value = conlluToBlackLab(conllu)
}

onMounted(() => {
  
  // prepare empty sentence + SVG renderer
  reactiveSentence = new ReactiveSentence();
  sentenceSvg      = new SentenceSVG(
    svgEl.value,
    reactiveSentence,
    opts
  );
  caretaker = new SentenceCaretaker(reactiveSentence);
 
 
  // drop listener
  sentenceSvg.addEventListener('svg-drop', e => {
  /*  Library supplies:
   *    e.detail.dragged   ← id of the dependent token being dragged
   *    e.detail.droppedOn ← id of the token we dropped onto    */
 
  //console.log(e)
  //console.log(e.detail)

  const depId   = e.detail.hovered;
  const headId  = e.detail.dragged;
  // console.log(`dragged ${dragged} hovered ${hovered}`)

  if (!depId || !headId) return;
  // alert(`whoosh! ${depid} ${headId}`)
  const nodesJson = reactiveSentence.state.treeJson.nodesJson

  const oldTokId   =  Object.keys(nodesJson).find(i => nodesJson[i].ID == depId)
                     
  if (!oldTokId) return;
  const oldTok = nodesJson[oldTokId]

  if (!oldTok || oldTok.HEAD === headId) return;      // nothing to change

  // make a shallow copy with a new HEAD value
  const newTok  = { ...oldTok, HEAD: headId };

  // save to the undo stack _before_ mutating
  caretaker.backup();

  // DependencyTreeJS will emit update notifications → SVG + BlackLab refresh
  reactiveSentence.updateToken(newTok);
  updateQuery()
});

// text edit listener
function makeSvgTextEditable(svgText,tokenId,targetLabel) {
      svgText.addEventListener('click', () => {
        const bbox = svgText.getBBox();
        const container = document.getElementById("treeWrapper") // svgText.closest('div'); // niet goed, neem altijd zelfde ding
        // console.log(container)
        const svgRect = svgText.ownerSVGElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const divje = document.createElement('div');
          divje.tabIndex = 0
          divje.style.position = 'fixed';
          divje.style.left = `${bbox.x + svgRect.left}px`; // - containerRect.left
          divje.style.top = `${bbox.y + svgRect.top  - bbox.height}px`; // - containerRect.top
          divje.style.border = '1pt solid #000';
          divje.style.zIndex = 1000
          divje.style.backgroundColor = '#eee'
          divje.style.padding = '1em'

        const input = document.createElement('input');
          input.type = 'text';
          input.setAttribute('size', '15')
          input.value = svgText.textContent.trim();
          input.style = {};
          input.style.fontSize = '11pt' // `${svgText.getAttribute('font-size') || 11}pt`;
          // input.style.fontFamily = svgText.getAttribute('font-family') || 'sans-serif';
        
          input.style.width = `${bbox.width + 25}px`;
          input.style.height = `${bbox.height + 15}px`;
          input.style.border = 'solid'
          input.style.padding = '4px';
          input.style.backgroundColor = '#eee'

        let deleteRelButton

        
        container.appendChild(divje)
        const label = document.createElement("label");
        const label0 = document.createElement("span");
        const label0Content = document.createTextNode(`${targetLabel.toLowerCase()}: `);
        divje.appendChild(label0);
        
        divje.appendChild(input);


        label0.appendChild(label0Content)
        
        const checkbox = document.createElement("input");
        checkbox.type="checkbox";
        checkbox.id=`${tokenId}.${targetLabel}`;
        checkbox.name=`${tokenId}.${targetLabel}`;
        const token = findToken(tokenId)
        if (Object.keys(token).includes(`MISC.${targetLabel}_Active`)) {
          // alert('whoohoo ' + findToken(tokenId)['MISC.Active'])  
          checkbox.checked = token[`MISC.${targetLabel}_Active`]
        } else {
          // console.log(Object.keys(token))
          checkbox.checked = targetLabel != 'LEMMA'
        }

        const textContent = document.createTextNode(`include in query? `);

        label.appendChild(checkbox);
        label.appendChild(textContent);

        divje.appendChild(label)
        divje.appendChild(checkbox)

        if (targetLabel == 'DEPREL') {
          deleteRelButton = document.createElement('button')
          deleteRelButton.innerHTML = ' delete relation '
          deleteRelButton.addEventListener('click', e =>  { removeDepRel(tokenId) } )
          divje.appendChild(deleteRelButton)
        }
        divje.focus()
        // input.focus();

        function finish(reason) {
          console.log(`finish (${reason}) called,  label=${targetLabel} value=${input.value} MISC.Active=${token['MISC.Active']} checked=${checkbox.checked}!`)
          //svgText.textContent = input.value;
          // updateToken(tokenId,targetLabel,input.value)
          // updateToken(tokenId, 'MISC.Active', checkbox.value)
          updateQuery() // dit werkt niet zonder updateToken, dus zo moet je het aanpakken
          try {
            console.log('trying to close div')
            divje.style.backgroundColor = 'pink'
            console.log(divje.style)
            divje.style.display = 'none'
            divje.remove(); }
          catch(e) {
            console.log(e)
            divje.destroy();
          }
        }
        checkbox.addEventListener('change', e =>  { updateToken(tokenId, `MISC.${targetLabel}_Active`, checkbox.checked) } )
        // input.addEventListener('blur', finish);
        //divje.addEventListener('blur', finish);
        divje.addEventListener('mouseout', (e) =>  { 
          const toElement = e.relatedTarget;
           if (!toElement || !divje.contains(toElement)) {
    // Mouse truly left the parent
            console.log('Mouse truely left parent!');
            finish(`div mouseout, related Target=${toElement.tagName}`)
            }
           } )
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {  updateToken(tokenId,targetLabel,input.value); finish('input keydown') }  else svgText.textContent = input.value;
        });
        divje.addEventListener('keydown', (e) => {
          if (e.key == 'Escape') finish('div keydown');
        });
      });
    }

function removeDepRel(tokenId) {
  const t = findToken(tokenId)
  // if ('HEAD' in t) delete t['HEAD']
  t['HEAD']  = '_'
  reactiveSentence.updateToken(t);
}

function updateToken(tokenId, targetLabel, targetValue) {
  
  console.log(`update Token: ${tokenId} ${targetLabel} ${targetValue}`)
  const nodesJson = reactiveSentence.state.treeJson.nodesJson

  const oldTokId   =  Object.keys(nodesJson).find(i => nodesJson[i].ID == tokenId)
                     
  if (!oldTokId) return;
  const oldTok = nodesJson[oldTokId]
  const oldValue = oldTok[targetLabel];

  /* --- quick UI: browser prompt --------------------------------------- */
 
  if (targetValue === null || targetValue === oldValue) return;   // cancel / no change

  /* --- commit change --------------------------------------------------- */
  const newTok = { ...oldTok, [targetLabel]: targetValue };
  console.log(newTok)
  caretaker.backup();                       // for undo / redo
  reactiveSentence.updateToken(newTok);
  //console.log(`Should be updated now .... `)
  // console.log(reactiveSentence.state.treeJson.nodesJson)
  updateQuery()
}

sentenceSvg.addEventListener('svg-click', e => {
  let textElem
  if (e.detail.event) {
    console.log()
    textElem = e.detail.event.srcElement
  } else {
    return;
  }
  
  
  const { targetLabel, clicked: tokenId } = e.detail;
  if (textElem) {
    makeSvgTextEditable(textElem,tokenId, targetLabel)
    return;
  }
  //alert(`${targetLabel} ${tokenId}`)
  // pick which fields you allow users to edit
  if (!['FORM', 'LEMMA', 'UPOS', 'DEPREL', 'UFEATS'].includes(targetLabel)) return;

  //console.log(reactiveSentence.state)
  // fetch the current token + value
  const newValue = window.prompt(`New ${targetLabel}:`, oldValue);


  const nodesJson = reactiveSentence.state.treeJson.nodesJson

  const oldTokId   =  Object.keys(nodesJson).find(i => nodesJson[i].ID == tokenId)
                     
  if (!oldTokId) return;
  const oldTok = nodesJson[oldTokId]
  const oldValue = oldTok[targetLabel];

  /* --- quick UI: browser prompt --------------------------------------- */
  
  if (newValue === null || newValue === oldValue) return;   // cancel / no change

  /* --- commit change --------------------------------------------------- */
  const newTok = { ...oldTok, [targetLabel]: newValue };
  //console.log(newTok)
  caretaker.backup();                       // for undo / redo
  reactiveSentence.updateToken(newTok);
  //console.log(`Should be updated now .... `)
  // console.log(reactiveSentence.state.treeJson.nodesJson)
  updateQuery()
});
  parse()
});




/* ------------------------------------------------------------------ *
 * 1. Fetch parse from UDPipe REST service (English model by default) *
 * ------------------------------------------------------------------ */
async function parse() {
  error.value   = null;
  loading.value = true;

  console.log(`language=${language.value}`)
  try {
    // UDPipe endpoint: tokenizer + tagger + parser
    const url = `https://lindat.mff.cuni.cz/services/udpipe/api/process` +
                `?tokenizer&tagger&parser&model=${languages[language.value]}` +
                `&data=${encodeURIComponent(sentence.value)}`;

    const { data } = await axios.get(url);

    if (!data.result) throw new Error('Unexpected UDPipe response');

    const conllu = data.result // .split('\n').map(x => x + "optional=false").join('\n')      // CoNLL-U string
    // alert(conllu)
    reactiveSentence.fromSentenceConll(conllu);

    // Generate BlackLab query
    blacklabQuery.value = conlluToBlackLab(conllu);
  } catch (e) {
    error.value = 'Could not parse sentence – ' + e.message;
  } finally {
    loading.value = false;
  }
}
// http://svotmc10.ivdnt.loc/corpus-frontend/UD_TEI_ALLSENTENCES/search/hits?filter=languageName%3A%28%22Russian%22%29&first=0&group=field%3AlanguageName%3Ai&number=20&patt=_with-spans%28%5B%5D+within+%3Cs+sentence_length%3Din%5B5%2C14%5D%2F%3E%29&adjusthits=yes&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D
function search(e) {
  
  e.preventDefault()
  const lang = language.value
  // alert(`${lang} ${lang=='All'}`)
  const groupByLanguage = lang=='All'
  const length_part = ' within <s sentence_length=in[5,14]/>'
  const pattern =  encodeURIComponent(`_with-spans(${blacklabQuery.value}) ${length_part}`)

  // alert(`searching for ${pattern}`)
  const langFilter = `languageName:"${language.value}"`
  const filterOrGroup = groupByLanguage ? `group=${encodeURIComponent('field:languageName:i')}` : `filter=${encodeURIComponent(langFilter)}` ;

  const url = `http://svotmc10.ivdnt.loc/corpus-frontend/UD_TEI_ALLSENTENCES/search/hits?first=0&number=20&patt=${pattern}&${filterOrGroup}&adjusthits=yes&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D`
  console.log(url)
  window.open(url,'blacklab')
}



/* ------------------------------------------------------------------ *
 * 2. Extremely simple CoNLL-U ➜ BlackLab dependency query generator  *
 *    (Each arc becomes  “_<deprel>-> 'FORM'”  and arcs are joined by ;) *
 *    Perfectly adequate for demos, not linguistically complete!      *
 * ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ *
 *  Recursive CoNLL-U ➜ BlackLab relations query                       *
 * ------------------------------------------------------------------ */
 function conlluToBlackLab(conllu) {
  // --- 1. parse tokens -------------------------------------------------
  const useLemma = false;
  const toks = {};                      // id → token object
  // console.log(conllu)
  conllu.split('\n').forEach(line => {
    if (!line || line.startsWith('#')) return;
    const c = line.split('\t');
    if (!/^\d+$/.test(c[0])) return;    // skip empty/group tokens
    toks[c[0]] = {
      id:     c[0],
      form:   c[1],
      lemma:  c[2],
      upos:   c[3],
      head:   c[6],
      rel:    c[7],
      kids:   []                         // will fill in a moment
    };
  });

  // --- 2. build child lists -------------------------------------------
  Object.values(toks).forEach(t => {
    if (t.head !== '0' && toks[t.head]) toks[t.head].kids.push(t);
  });

  // --- 3. find the (single) root --------------------------------------
  const root = Object.values(toks).find(t => t.head === '0');
  if (!root) return '';                 // malformed input

  // --- 4. helpers ------------------------------------------------------
  const esc = s => s.replace(/'/g, "\\'");

  function tokPattern(t) {
    const props = [];
    // console.log(t)
    const useLemma = hasProperty(t.id,'LEMMA')
    const usePoS =  hasProperty(t.id,'UPOS')
    const useRel =  hasProperty(t.id,'DEPREL')
    if (useLemma && t.lemma && t.lemma !== '_')
      props.push(`lemma='${esc(t.lemma)}'`);
    if (usePoS && t.upos  && t.upos  !== '_')
      props.push(`pos='${esc(t.upos)}'`);
    const propStr = props.length ? ` [${props.join(' & ')}]` : '_';
    return `${propStr}`;
  }

  function walk(t,indent) {
    if (!t.kids.length) return tokPattern(t);

    // recurse for each child; wrap the child subtree in (…) if it
    // itself has children, to preserve operator precedence.
    const childBits = t.kids.map(k => {
      const sub = walk(k,indent+2);
      const wrapped = k.kids.length ? `(${sub})` : sub;
      const useRel =  hasProperty(k.id,'DEPREL')
      const rel = useRel? k.rel : ''
      return `${" ".repeat(indent)} -${rel}-> ${wrapped}`;
    });

    return `${tokPattern(t)}\n${childBits.join(';\n')}`;
  }

  // --- 5. stitch together ---------------------------------------------
  return `${walk(root,0)}`; // of ^--> ${} als je het patroon als root wilt hebben
}

</script>

<style scoped>
.wrapper { max-width: 100%; margin: auto; padding: 2rem; font: 16px/1.4 system-ui; }
textarea { width: 100%; font: inherit; margin-bottom: 0.5rem; }
button   { padding: 0.4rem 1rem; font-weight: 600; }
.tree    { width: auto; min-height: 180px; border: 0px solid #ddd; margin-top: 1.5rem }
.error   { color: red; }
.query   { display: block; white-space: pre; background: #f6f8fa; padding: 0.75rem; }
</style>

