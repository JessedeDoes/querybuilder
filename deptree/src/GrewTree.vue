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
import { layoutStore } from './box-watching/LayoutStore'
const { boxes } = storeToRefs(layoutStore());
import {
  ReactiveSentence,
  SentenceSVG,
  defaultSentenceSVGOptions,

  SVG_CONFIG,

  type TokenLike, // <- helper type from dependencytreejs ¹
} from 'dependencytreejs_fork/lib';
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
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); } 
/* ------------------------------------------------------------------ *
 * DOM refs & DTJS instances
 * ------------------------------------------------------------------ */
const svgEl            = useTemplateRef('svgElement')
const reactiveSentence = new ReactiveSentence();
let   svgRenderer: SentenceSVG | null = null;
async function renderTree() {
  if (!svgRenderer) return;
  
  await nextTick()
  reactiveSentence.fromSentenceJson(grewSentence.value);
  console.log(boxes)
  
  svgRenderer.presetLocations = boxes.value // gebeurt te vaak?? pas doen als ALLE boxes klaar zijn...
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
watch(boxes, renderTree, { deep: true });
</script>

<style scoped>
.grew-tree {
  max-height: 500px;
  overflow-x: auto;
  display: block;
  
  background: #fff;
}
</style>

