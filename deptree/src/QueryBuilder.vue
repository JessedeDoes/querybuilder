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
      <button :disabled="isEmpty" @click="parse">Parse</button>
      <button :disabled="isEmpty" @click="clear">Clear</button>
    </div>

    <div xml:id="treeWrapper" id="treeWrapper" style="padding: 1em; overflow-x: scroll">
        <svg width="1200px" height="600px" ref="svgEl" class="tree"></svg>
     </div>

     <div :style="{display: 'block'}">
      <form>
        
      </form>
     </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useQueryStore } from './QueryStore';
import { conlluToBlackLab } from './util'
import { ref, onMounted, watch, useTemplateRef } from 'vue';
import axios from 'axios';
import {
  ReactiveSentence,
  SentenceSVG,
  SentenceCaretaker,
  defaultSentenceSVGOptions
} from 'dependencytreejs/lib';

let reactiveSentence;    // will hold the current tree
let sentenceSvg;         // DependencyTreeJS renderer
let caretaker;


export default {
  name: 'QueryBuilder',

  props: {
    modelValue: {
      type: String,
      default: 'mooie zin',
    },
  },

  mounted() {
    // this.reactiveSentence = new ReactiveSentence();

    this.parse()
  },



  data() {
    return {
      localSentence: this.modelValue,
      blacklabQuery: null,

      language: 'Dutch',
      languages : {
      "Dutch" : "nl",
      "English" : "en",
      "German" : "de",
      "French" : "fr",
      "Japanese" : "ja",
      "Czech" : "cs",
      "Russian": "ru",
      "Latin" : "la",
      "All" : "_"
      },
      
    };
  },

  computed: {
    isEmpty() {
      return !this.localSentence.trim();
    },

    reactiveSentence() {return  new ReactiveSentence() },
    sentenceSvg() {
      const svgEl = this.$refs.svgEl
      console.log(svgEl)
      const opts = defaultSentenceSVGOptions();
      opts.interactive = true;  
      opts.shownFeatures = ["LEMMA","UPOS"]
      return new SentenceSVG(
        svgEl,
        this.reactiveSentence,
       opts
     );
    },

    // tap into the pinia store
    ...mapState(useQueryStore, [
      'currentTokenId',
      'query',
      'hasParse',
      'currentToken'
    ]),

    lemma : {
       
       get() { if (!this.currentToken) return ''; console.log(this.currentToken); return this.currentToken.fields.lemma.value},
       set(v)  { updateTokenField(setCurrentTokenId, 'lemma', v) },
    }
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
      'updateTokenField'
    ]),

    /**
     * Fire the parse event upward and seed store with dummy values so the
     * example is self‑contained. In a real app, the parent would parse the
     * sentence and then commit proper tokens/query back into the store.
     */
    /*
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

      //this.setCurrentTokenId(2);
      //this.setParse({ sentence: trimmed, dummy: true });
      //this.setQuery(`lemma='${trimmed.split(' ')[0]}'`);
    },
    */
    async  parse() {

      try {
   

          const url = `https://lindat.mff.cuni.cz/services/udpipe/api/process` +
                `?tokenizer&tagger&parser&model=${this.languages[this.language]}` +
                `&data=${encodeURIComponent(this.localSentence)}`;

          const { data } = await axios.get(url);

          if (!data.result) throw new Error('Unexpected UDPipe response');

          const conllu = data.result // .split('\n').map(x => x + "optional=false").join('\n')      // CoNLL-U string
          // console.log(conllu)
          this.reactiveSentence.fromSentenceConll(conllu);

        
          // this.blacklabQuery = conlluToBlackLab(conllu);
        } catch (e) {
      console.log('Exception')
      console.log(e)
        // error.value = 'Could not parse sentence – ' + e.message;
      } finally {
      
       }
    },

    clear() {
      this.localSentence = 'Bruine bonen met spek';
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

