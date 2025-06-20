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
function renderTree() {
  if (!svgRenderer) return;
  
 
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

