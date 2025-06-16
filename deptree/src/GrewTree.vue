<template>
  <!-- DependencyTreeJS owns the SVG contents; we only provide the shell -->
  <svg ref="svgElement" class="grew-tree" width="100%" height="500" />
</template>

<script setup lang="ts">
/* ---------------------------------------------------------------------
 * GrewTree.vue
 * ------------------------------------------------------------------ */
import { onMounted, ref, watch, nextTick, useTemplateRef } from 'vue';
import { storeToRefs } from 'pinia';
import { useQueryStore } from './QueryStore';

import {
  ReactiveSentence,
  SentenceSVG,
  defaultSentenceSVGOptions,

  SVG_CONFIG,

  type TokenLike, // <- helper type from dependencytreejs ¹
} from 'dependencytreejs/lib';
import {
  sentenceConllToJson,
  sentenceJsonToConll,
  emptyTreeJson,
  returnTokensInOrder,
  getNodeFromTreeJson,
} from 'conllup/lib/conll';
/* ------------------------------------------------------------------ *
 * Store bindings
 * ------------------------------------------------------------------ */
const qs = useQueryStore();
const { tokens } = storeToRefs(qs);
const { grewSentence }  =  storeToRefs(qs)

/* ------------------------------------------------------------------ *
 * DOM refs & DTJS instances
 * ------------------------------------------------------------------ */
const svgEl            = useTemplateRef('svgElement')
const reactiveSentence = new ReactiveSentence();
let   svgRenderer: SentenceSVG | null = null;
const SVG_CONFIG = {
  startTextY: 10,
  textgraphdistance: 10,
  dragclickthreshold: 400, // ms
  arrowheadsize: 5,
  gapX: 18,
  sizeFontY: 18,
  reverseArcThreshold: 20, // pixels below tokens mouth need to be to reverse the arc
};
const example=`# source = Enhanced/WS-U-E-A-0000000226/WS-U-E-A-0000000226.p.2.s.1.xml
# sent_id = WS-U-E-A-0000000226.p.2.s.1
# text = Pieter van den Hoogenband moet het doen met zilver
# auto = ALUD2.8.5
# meta_source = pre-sonar500
# meta_type = WS-U-E-A
# meta_description = Auto cues
1	Pieter	Pieter	PROPN	SPEC|deeleigen	_	7	nsubj	7:nsubj	_
2	van	van	PROPN	SPEC|deeleigen	_	1	flat	1:flat	_
3	den	den	PROPN	SPEC|deeleigen	_	1	flat	1:flat	_
4	Hoogenband	Hoogenband	PROPN	SPEC|deeleigen	_	1	flat	1:flat	_
5	moet	moeten	AUX	WW|pv|tgw|ev	Number=Sing|Tense=Pres|VerbForm=Fin	7	aux	7:aux	_
6	het	het	PRON	VNW|pers|pron|stan|red|3|ev|onz	Person=3|PronType=Prs	7	obj	7:obj	_
7	doen	doen	VERB	WW|inf|vrij|zonder	VerbForm=Inf	0	root	0:root	_
8	met	met	ADP	VZ|init	_	9	case	9:case	_
9	zilver	zilver	NOUN	N|soort|ev|basis|onz|stan	Gender=Neut|Number=Sing	7	obl	7:obl:met	_
`

function drawTree(ssgv: SentenceSVG) {

  ssgv.clearTree();
  ssgv.populateOrderOfTokens();
  ssgv.populateLevels();
  populateTokenSVGs(ssgv);
  ssgv.drawRelations();
  ssgv.drawEnhancedRelations();
  ssgv.adaptSvgCanvas();
  ssgv.showhighlights();

    if (ssgv.options.matches.length > 0) {
      ssgv.showmatches();
    }

    if (ssgv.options.packages !== null) {
      ssgv.showpackages();
    }

    if (ssgv.options.interactive) {
      ssgv.snapSentence.addClass('interactive');
      ssgv.attachDraggers();
      ssgv.attachEvents();
      ssgv.attachHovers();
    }
    if (ssgv.teacherTreeJson) {
      ssgv.showDiffs(ssgv.teacherTreeJson);
    }
}

function populateTokenSVGs(ssgv: SentenceSVG): void {
    let runningX = 0;
    const maxLevelY = Math.max(...ssgv.levelsArray, 2); // 2 would be the minimum possible level size
    const offsetY = SVG_CONFIG.startTextY + maxLevelY * ssgv.options.arcHeight;

    let tokenSvgIndex = 0;
    for (const tokenJsonIndex of ssgv.orderOfTokens) {
      const tokenJson = getNodeFromTreeJson(ssgv.treeJson, tokenJsonIndex);
      if (tokenJson) {
        const tokenSVG = new TokenSVG(tokenJson, ssgv);
        ssgv.tokenSVGs.push(tokenSVG);
        tokenSVG.createSnap(ssgv.snapSentence, ssgv.options.shownFeatures, runningX, offsetY);
        tokenSVG.ylevel = ssgv.levelsArray[tokenSvgIndex];
        runningX += 300 // tokenSVG.width;
        tokenSvgIndex += 1;
      }
    }
  }

function renderTree() {
  if (!svgRenderer) return;
  
  //reactiveSentence.fromSentenceConll(example);
  reactiveSentence.fromSentenceJson(grewSentence.value);
  svgRenderer.refresh();
  //drawTree(svgRenderer)
}

/* ------------------------------------------------------------------ *
 * Mount / reactive updates
 * ------------------------------------------------------------------ */
onMounted(async () => {
  await nextTick();
  if (!svgEl.value) return;
  
  const opts = {
    ...defaultSentenceSVGOptions(),
    interactive: true,
    arcHeight: 40,
    shownFeatures: ['FORM', 'MISC.HIGHLIGHT'],
  } as const;

  svgRenderer = new SentenceSVG(svgEl.value, reactiveSentence, opts);

  reactiveSentence.sentenceSVG = svgRenderer

  const self = qs;
  
  svgRenderer.addEventListener('svg-drop', e => {
      const depId   = e.detail.hovered;
      const headId  = e.detail.dragged;
      console.log(e.detail);
      const treeNode = e.detail.treeNode
      if (e.detail.isRoot)
         self.setRoot(headId);
      else {
      
      console.log(`depId ${depId} headId ${headId}`)
      if (!depId || !headId) return;
     
      self.setHead(depId,headId)
      }
  });

  svgRenderer.addEventListener('svg-click', e => {
      const { targetLabel, clicked: tokenId } = e.detail;
      self.setCurrentTokenId(Number(tokenId))
  })
   
  
  renderTree();
});

// Re‑render whenever the token array changes
watch(grewSentence, renderTree, { deep: true });
</script>

<style scoped>
.grew-tree {
  max-height: 500px;
  overflow-x: auto;
  display: block;
  
  background: #fff;
}
</style>

