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
  type TokenLike, // <- helper type from dependencytreejs ¹
} from 'dependencytreejs/lib';

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
/* ------------------------------------------------------------------ *
 * Utility: convert our TokenState[] into DTJS‑compatible tokens
 * ------------------------------------------------------------------ */

function renderTree() {
  if (!svgRenderer) return;
  
  reactiveSentence.fromSentenceConll(example);
  reactiveSentence.fromSentenceJson(grewSentence.value);
  svgRenderer.refresh();
}

/* ------------------------------------------------------------------ *
 * Mount / reactive updates
 * ------------------------------------------------------------------ */
onMounted(async () => {
  await nextTick();
  if (!svgEl.value) return;
  
  const opts = {
    ...defaultSentenceSVGOptions(),
    interactive: false,
    arcHeight: 40,
    shownFeatures: ['FORM', 'UPOS'],
  } as const;

  svgRenderer = new SentenceSVG(svgEl.value, reactiveSentence, opts);
  const ssvg = svgEl.value;
  const self = qs;
  
  ssvg.addEventListener('svg-drop', e => {
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

     ssvg.addEventListener('svg-click', e => {

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
  border: 1px solid #ccc;
  background: #fff;
}
</style>

