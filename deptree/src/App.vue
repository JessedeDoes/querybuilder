<template>
  <main class="wrapper">
    <h1>Interactive dependency tree → BlackLab query</h1>

    <!-- input box -->
    <form @submit.prevent="parse">
      <textarea v-model="sentence"
                placeholder="Type any sentence …"
                rows="2"></textarea>
      <button :disabled="loading || !sentence.trim()">Parse</button>
    </form>

    <!-- show errors -->
    <p v-if="error" class="error">{{ error }}</p>

    <!-- SVG target for DependencyTreeJS -->
    <svg ref="svgEl" class="tree"></svg>

    <!-- generated BlackLab query -->
    <section v-if="blacklabQuery">
      <h2>BlackLab dependency query</h2>
      <code class="query">{{ blacklabQuery }}</code>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import {
  ReactiveSentence,
  SentenceSVG,
  SentenceCaretaker,
  defaultSentenceSVGOptions
} from 'dependencytreejs/lib';

const sentence = ref('Ik ben geen hond');
const loading  = ref(false);
const error    = ref(null);
const svgEl    = ref(null);

let reactiveSentence;    // will hold the current tree
let sentenceSvg;         // DependencyTreeJS renderer
let caretaker;
const blacklabQuery = ref('');

const opts = defaultSentenceSVGOptions();
opts.interactive = true;  

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
 
  console.log(e)
  console.log(e.detail)

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

sentenceSvg.addEventListener('svg-click', e => {
  const { targetLabel, clicked: tokenId } = e.detail;
  //alert(`${targetLabel} ${tokenId}`)
  // pick which fields you allow users to edit
  if (!['FORM', 'LEMMA', 'UPOS', 'DEPREL'].includes(targetLabel)) return;

  console.log(reactiveSentence.state)
  // fetch the current token + value
  const nodesJson = reactiveSentence.state.treeJson.nodesJson

  const oldTokId   =  Object.keys(nodesJson).find(i => nodesJson[i].ID == tokenId)
                     
  if (!oldTokId) return;
  const oldTok = nodesJson[oldTokId]
  const oldValue = oldTok[targetLabel];

  /* --- quick UI: browser prompt --------------------------------------- */
  const newValue = window.prompt(`New ${targetLabel}:`, oldValue);
  if (newValue === null || newValue === oldValue) return;   // cancel / no change

  /* --- commit change --------------------------------------------------- */
  const newTok = { ...oldTok, [targetLabel]: newValue };
  console.log(newTok)
  caretaker.backup();                       // for undo / redo
  reactiveSentence.updateToken(newTok);
  console.log(`Should be updated now .... `)
  console.log(reactiveSentence.state.treeJson.nodesJson)
  updateQuery()
});

});




/* ------------------------------------------------------------------ *
 * 1. Fetch parse from UDPipe REST service (English model by default) *
 * ------------------------------------------------------------------ */
async function parse() {
  error.value   = null;
  loading.value = true;

  try {
    // UDPipe endpoint: tokenizer + tagger + parser
    const url = `https://lindat.mff.cuni.cz/services/udpipe/api/process` +
                `?tokenizer&tagger&parser&model=english` +
                `&data=${encodeURIComponent(sentence.value)}`;

    const { data } = await axios.get(url);

    if (!data.result) throw new Error('Unexpected UDPipe response');

    const conllu = data.result;            // CoNLL-U string
    reactiveSentence.fromSentenceConll(conllu);

    // Generate BlackLab query
    blacklabQuery.value = conlluToBlackLab(conllu);
  } catch (e) {
    error.value = 'Could not parse sentence – ' + e.message;
  } finally {
    loading.value = false;
  }
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
    if (useLemma && t.lemma && t.lemma !== '_')
      props.push(`lemma='${esc(t.lemma)}'`);
    if (t.upos  && t.upos  !== '_')
      props.push(`pos='${esc(t.upos)}'`);
    const propStr = props.length ? ` [${props.join(' & ')}]` : '';
    return `${propStr}`;
  }

  function walk(t,indent) {
    if (!t.kids.length) return tokPattern(t);

    // recurse for each child; wrap the child subtree in (…) if it
    // itself has children, to preserve operator precedence.
    const childBits = t.kids.map(k => {
      const sub = walk(k,indent+2);
      const wrapped = k.kids.length ? `(${sub})` : sub;
      return `${" ".repeat(indent)} -${k.rel}-> ${wrapped}`;
    });

    return `${tokPattern(t)} ${childBits.join(';\n')}`;
  }

  // --- 5. stitch together ---------------------------------------------
  return `^--> ${walk(root,0)}`;
}

</script>

<style scoped>
.wrapper { max-width: 800px; margin: auto; padding: 2rem; font: 16px/1.4 system-ui; }
textarea { width: 100%; font: inherit; margin-bottom: 0.5rem; }
button   { padding: 0.4rem 1rem; font-weight: 600; }
.tree    { width: 100%; min-height: 180px; border: 1px solid #ddd; margin-top: 1.5rem; }
.error   { color: red; }
.query   { display: block; white-space: pre; background: #f6f8fa; padding: 0.75rem; }
</style>

