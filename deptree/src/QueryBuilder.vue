<!-- QueryBuilder.vue -->
<template>
  <div class="query-builder">
    <textarea
      v-model="localSentence"
      rows="2"
      placeholder="Type any sentence…"
      class="sentence-input"
    ></textarea>

    <div class="actions">
      <button :disabled="isEmpty" @click="emitParse">Parse</button>
      <button :disabled="isEmpty" @click="clear">Clear</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useQueryStore } from './QueryStore';
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import {
  ReactiveSentence,
  SentenceSVG,
  SentenceCaretaker,
  defaultSentenceSVGOptions
} from 'dependencytreejs/lib';

export default {
  name: 'QueryBuilder',

  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      localSentence: this.modelValue,
    };
  },

  computed: {
    isEmpty() {
      return !this.localSentence.trim();
    },

    // tap into the pinia store
    ...mapState(useQueryStore, [
      'currentTokenId',
      'query',
      'hasParse',
    ]),

    
  },

  watch: {
    modelValue(val) {
      this.localSentence = val;
    },
    localSentence(val) {
      this.$emit('update:modelValue', val);
    },
  },

  methods: {
    ...mapActions(useQueryStore, [
      'setParse',
      'setQuery',
      'setTokens',
      'setCurrentTokenId',
    ]),

    /**
     * Fire the parse event upward and seed store with dummy values so the
     * example is self‑contained. In a real app, the parent would parse the
     * sentence and then commit proper tokens/query back into the store.
     */
    emitParse() {
      const trimmed = this.localSentence.trim();
      this.$emit('parse', trimmed);

      // demo – create two dummy tokens
      this.setTokens([
        {
          id: 1,
          head: 0,
          fields: {
            lemma: { value: 'een', active: true },
            upos: { value: 'DET', active: true },
            feats: { value: '_', active: false },
            deprel: { value: 'det', active: false },
          },
        },
        {
          id: 2,
          head: 1,
          fields: {
            lemma: { value: trimmed.split(' ')[0] || '', active: true },
            upos: { value: 'NOUN', active: true },
            feats: { value: '_', active: false },
            deprel: { value: 'root', active: true },
          },
        },
      ]);

      this.setCurrentTokenId(2);
      this.setParse({ sentence: trimmed, dummy: true });
      this.setQuery(`lemma='${trimmed.split(' ')[0]}'`);
    },

    clear() {
      this.localSentence = '';
      this.setTokens([]);
      this.setQuery('');
      this.setParse(null);
      this.setCurrentTokenId(null);
    },
  },
};
</script>

<style scoped>
.query-builder {
  max-width: 500px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: system-ui, sans-serif;
}

.sentence-input {
  width: 100%;
  font: inherit;
  padding: 0.4rem;
  margin-bottom: 0.5rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

button {
  padding: 0.4rem 1rem;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

