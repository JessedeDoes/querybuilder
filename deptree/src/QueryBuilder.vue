<!-- QueryBuilder.vue 
// https://github.com/kirianguiller/reactive-dep-tree 
-->
<template>
  <div class="query-builder">
    <select v-model="language"><option v-for="name in Object.keys(languages)" :key="name" :value="name">{{ name }}</option></select>
      
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

    <div xml:id="treeWrapper" id="treeWrapper" style="padding: 1em; overflow-x: auto">
        <svg width="1200px" height="600px" ref="svgEl" class="tree"></svg>
     </div>

     <div :style="{display: 'block'}">
      <button  @click="previousToken">&lt;</button>{{ currentTokenId }}
      <button value="previous" @click="nextToken">&gt;</button><br/>
      <table>
        <tr>
          <td>
            <table>
              <tr><td class="b">Form</td></tr> 
              <tr><td class="b">Lemma</td></tr>
              <tr><td class="b">Upos</td></tr> 
              <tr><td class="b">Deprel</td></tr> 
          </table></td>
          <td v-for="t in tokens" :index="t.id">
      <table v-if="currentTokenId == t.id" class="tokenEditor">
        <tr><td></td> <td><input v-model="form"/></td> <td><input type="checkbox" v-model="form_active"/></td>  </tr>
        <tr><td></td> <td><input v-model="lemma"/></td>  <td><input type="checkbox" v-model="lemma_active"/></td> </tr>
        <tr><td></td> <td><input v-model="upos"/></td>  <td><input type="checkbox" v-model="upos_active"/></td> </tr>
        <tr><td></td> <td><input v-model="deprel"/></td> <td><input type="checkbox" v-model="deprel_active"/> <button @click='noRel'>X</button></td>  </tr>
      </table>
      <table v-else @click="() => setCurrentTokenId(t.id)" class="tokenDisplay">
        <tr><td>{{ t.fields['form'].value }}</td></tr>
        <tr><td>{{ t.fields['lemma'].value }}</td></tr>
        <tr><td>{{ t.fields['upos'].value }}</td></tr>
        <tr><td>{{ t.fields['deprel'].value }}</td></tr>
      </table>
    </td>
       </tr>
    </table>
     </div>
     <h3>Query</h3>
     <textarea rows="5" cols="80" v-model="query"/>
     <button @click="search">Search</button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useQueryStore } from './QueryStore';

import { ref, onMounted, watch, useTemplateRef } from 'vue';
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

    reactiveSentence() { 
      const r =   new ReactiveSentence() 
      const svgEl = this.$refs.svgEl
      console.log(svgEl)
      const opts = defaultSentenceSVGOptions();
      opts.interactive = true;  
      opts.shownFeatures = ['FORM'] // ["LEMMA","UPOS"]
      const ssvg = new SentenceSVG(
        svgEl,
        r,
       opts
     );
     const self = this;

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
      
      
      //console.log(self.setHead)
      self.setHead(depId,headId)
      }
     });

     ssvg.addEventListener('svg-click', e => {
      /*
  let textElem
  if (e.detail.event) {
    console.log()
    textElem = e.detail.event.srcElement
  } else {
    return;
  }
    if (textElem) {
    makeSvgTextEditable(textElem,tokenId, targetLabel)
    return;
  }
  */
     const { targetLabel, clicked: tokenId } = e.detail;

     //this.setReactiveSentence(r)
     self.setCurrentTokenId(Number(tokenId))
     })
     return r;
    },

    sentenceSvg() {
      
    },

    // tap into the pinia store
    ...mapState(useQueryStore, [
      'currentTokenId',
      'query',
      'hasParse',
      'currentToken',
      'tokens'
    ]),

    form : {
       get() { if (!this.currentToken) return '';  return this.currentToken.fields.form.value},
       set(v)  { this.updateTokenField(this.currentTokenId, 'form', v) },
    },
    lemma : {
       get() { if (!this.currentToken) return ''; return this.currentToken.fields.lemma.value},
       set(v)  { this.updateTokenField(this.currentTokenId, 'lemma', v) },
    },
    upos : {
       get() { if (!this.currentToken) return ''; return this.currentToken.fields.upos.value},
       set(v)  { this.updateTokenField(this.currentTokenId, 'upos', v) },
    },
    deprel : {
       get() { if (!this.currentToken) return; return this.currentToken.fields.deprel.value},
       set(v)  { this.updateTokenField(this.currentTokenId, 'deprel', v) },
    },
    form_active : {
       get() { if (!this.currentToken) return ''; return this.currentToken.fields.form.active},
       set(v)  { this.setTokenFieldActive(this.currentTokenId, 'form', v) },
    },
    lemma_active : {
       get() { if (!this.currentToken) return ''; return this.currentToken.fields.lemma.active},
       set(v)  { this.setTokenFieldActive(this.currentTokenId, 'lemma', Boolean(v)) },
    },
    upos_active : {
       get() { if (!this.currentToken) return '';  return this.currentToken.fields.upos.active},
       set(v)  { this.setTokenFieldActive(this.currentTokenId, 'upos', v) },
    },
    deprel_active : {
       get() { if (!this.currentToken) return ''; return this.currentToken.fields.deprel.active},
       set(v)  { this.setTokenFieldActive(this.currentTokenId, 'deprel', v) },
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
      'updateTokenField',
      'setTokensFromConllu',
      'setReactiveSentence',
      'nextToken',
      'previousToken',
      'setHead',
      'updateQuery',
      'setTokenFieldActive',
      'setRoot',
      'removeRel'
    ]),

    noRel() {
      console.log(`removing rel from ${this.currentTokenId}`)
      this.removeRel()
    },
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
          this.setReactiveSentence(this.reactiveSentence)
          this.setTokensFromConllu(conllu)
          this.setCurrentTokenId(1)
          // this.blacklabQuery = conlluToBlackLab(conllu);
          this.updateQuery()
        } catch (e) {
      console.log('!!!!!!!!!!!!!!!!!¡!!!!!!Exception')
      console.log(e)
        // error.value = 'Could not parse sentence – ' + e.message;
      } finally {
      
       }
    },

    search(e) {
      e.preventDefault()
      const lang = this.language
      // alert(`${lang} ${lang=='All'}`)
      const groupByLanguage = lang=='All'
      const length_part = ' within <s sentence_length=in[5,14]/>'
      const pattern =  encodeURIComponent(`_with-spans(${this.query}) ${length_part}`)

  // alert(`searching for ${pattern}`)
      const langFilter = `languageName:"${lang}"`
      const filterOrGroup = groupByLanguage ? `group=${encodeURIComponent('field:languageName:i')}` : `filter=${encodeURIComponent(langFilter)}` ;

      const url = `http://svotmc10.ivdnt.loc/corpus-frontend/UD_TEI_ALLSENTENCES/search/hits?first=0&number=20&patt=${pattern}&${filterOrGroup}&adjusthits=yes&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D`
      console.log(url)
      window.open(url,'blacklab')
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
  max-width: 1200px;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: system-ui, sans-serif;
}

.b {
  font-weight: bold;
}
.tokenEditor {
  background-color: bisque;
}
.tokenDisplay {
  color: #808080;
  background-color: aliceblue;
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

