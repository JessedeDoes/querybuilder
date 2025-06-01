<!-- QueryBuilder.vue 
 Gebaseerd op grew conllu-editcomponent, zie https://github.com/kirianguiller/reactive-dep-tree 
-->
<template>
  <div class="query-builder">



    <h2>Query building prototype</h2>
    <h3>Enter sentence</h3>
    
    <div class="sentenceEditing">
    <textarea
      v-model="localSentence"
      rows="2"
      placeholder="Type any sentence…"
      class="sentence-input"
    ></textarea>
    <button :disabled="isEmpty" @click="clear">Clear</button>
    </div>


    <h3>Parse sentence</h3>
    <div class="queryEditing">
    <div class="actions">
      Parsing language: <select v-model="language"><option v-for="name in Object.keys(languages)" :key="name" :value="name">{{ name }}</option></select> <button :disabled="isEmpty" @click="parse">Go</button>
    </div>
    </div>
    <h3>Edit query</h3>

    <div class="queryEditing">
    <div style="overflow-x: auto">
    <div xml:id="treeWrapper" id="treeWrapper" style="padding: 1em; overflow-x: auto">
        <svg width="1200px" height="600px" ref="svgEl" class="tree"></svg>
     </div>

     <div :style="{display: 'block', overflowX: auto}">
      Token id: <button  @click="previousToken">&lt;</button> {{ currentTokenId }} <button value="previous" @click="nextToken">&gt;</button>
      <div class='flexParent'>
           <div class="flexChild tokenHeader">
              <div class="b">Actions</div>
              <div class="b">Form</div>
              <div class="b">Lemma</div>
              <div class="b">Upos</div>
              <div class="b">Deprel</div>
              <div class="b">Order</div>
          </div>
         
          <template v-for="t in tokens" :index="t.id">
            <div v-if="currentTokenId == t.id" class="tokenEditor">
              <div class="tokenTop"><span class="left" @click="notImplemented" title="insert node left">↲</span> 
                <span @click="reversePolarity" title="reverse polarity">{{ (token_polarity == 'positive')? '(+)' : '(-)' }}</span> 
                <span title="unlink" style="height: 14pt; color: black" @click='noRel'>⛓️‍💥</span>
                <span @click="notImplemented" title="delete node">🗑️</span> 
                <span @click="notImplemented" class="right" title="insert node right"> ↳</span></div>
              <div> <input size="10" :class="propertyStyle(t.id,'form')" v-model="form"/> <input type="checkbox" v-model="form_active"/></div>
              <div> <input size="10" :class="propertyStyle(t.id,'lemma')" v-model="lemma"/>  <input type="checkbox" v-model="lemma_active"/></div>
              <div> <input size="10" :class="propertyStyle(t.id,'upos')" v-model="upos"/>  <input type="checkbox" v-model="upos_active"/></div>
              <div> <input size="10" :class="propertyStyle(t.id,'deprel')" v-model="deprel"/> <input type="checkbox" v-model="deprel_active"/> 
               </div>
              <div> <input size="10" :class="propertyStyle(t.id,'deprel')" v-model="token_order"/> </div>
            </div>
            <div v-else @click="() => setCurrentTokenId(t.id)" class="tokenDisplay">
              <div><span style="display: block; height:14pt"></span> </div>
              <div :class="propertyStyle(t.id,'form')">{{ t.fields['form'].value }}</div>
              <div :class="propertyStyle(t.id,'lemma')">{{ t.fields['lemma'].value }}</div>
              <div :class="propertyStyle(t.id,'upos')">{{ t.fields['upos'].value }}</div>
              <div :class="propertyStyle(t.id,'deprel')">{{ t.fields['deprel'].value }}</div>
              <div :class="propertyStyle(t.id,'deprel')"><span style="display: block; height:14pt">{{ (t.tokenOrder != -1)? t.tokenOrder: '' }}</span></div>
             </div>
        </template>
        
      </div>
     </div>
    </div>  
    </div>

     <h3>Query corpus</h3>
     <div class="queryEditing">
     <textarea rows="5" cols="80" v-model="blacklabQuery"/>
     Corpus: <select v-model="corpus"><option v-for="name in Object.keys(corpora)" :key="name" :value="name">{{ name }}</option></select> 
     Search language: <select v-model="searchLanguage"><option v-for="name in Object.keys(languages)" :key="name" :value="name">{{ name }}</option></select> 
     Limit to short sentences: <input type="checkbox" v-model="onlyShortSentences"/> <span> </span>
     <button @click="search">Search</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useQueryStore } from './QueryStore';

//import { ContextMenu, ContextMenuGroup, ContextMenuSeparator, ContextMenuItem } from '@imengyu/vue3-context-menu';
//import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
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
      default: 'bruine bonen met spek',
    },
  },

  mounted() {
    this.parse()
  },

  data() {
    return {
      localSentence: this.modelValue,
      

      language: 'Dutch',
      searchLanguage : 'Dutch',
      onlyShortSentences: false,
      languages : {
      "Dutch" : "nl",
      "English" : "en",
      "German" : "de",
      "French" : "fr",
      "Italian" : "it",
      "Latin" : "la",
      "Spanish" : "es",
      "Japanese" : "ja",
      'Chinese' : 'zh',
      "Czech" : "cs",
      "Polish" : "pl",
      "Russian": "ru",
      "Slovenian" : "sl",
      "Finnish" : "fi",
      "Estonian" : "et",
      "Hungarian" : "hu",
      "All" : "_"
      },
      corpus: "UD 2.16",
      corpora : {
        "UD 2.16" : "http://svotmc10.ivdnt.loc/corpus-frontend/UD_TEI_ALLSENTENCES/",
        "GCND" : "http://svotmc10.ivdnt.loc/blacklab-frontend/GCND_UD/"
      }
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
      
      
     
      self.setHead(depId,headId)
      }
     });

     ssvg.addEventListener('svg-click', e => {

     const { targetLabel, clicked: tokenId } = e.detail;


     self.setCurrentTokenId(Number(tokenId))
     })
     return r;
    },

    sentenceSvg() {
      
    },

    ...mapState(useQueryStore, [
      'currentTokenId',
      'currentToken',
      'tokens',
      'query',
      'getQuery',
      'isActive'
    ]),

    blacklabQuery: {
      get()  { return this.getQuery },
      set(v) { this.setQuery(v)}
    },
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
    token_order : {
       get() { if (!this.currentToken || this.currentToken.tokenOrder == -1) return ''; return this.currentToken.tokenOrder},
       set(v)  { console.log('yep'); this.updateTokenOrder(this.currentTokenId,  v) },
    },
    token_polarity : {
       get() { if (!this.currentToken) return null; return this.currentToken.polarity },
       set(v)  { console.log('yep'); this.updateTokenPolarity(this.currentTokenId,  v) },
    },

    form_active : {
       get() { if (!this.currentToken ) return ''; return this.currentToken.fields.form.active},
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
      'setQuery',
      'setTokens',
      'setCurrentTokenId',
      'updateTokenField',
      'updateTokenOrder',
      'updateTokenPolarity',
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

    propertyStyle(id, property) {
      const f = this.isActive
      return f(id,property)? 'property_active' : 'property_inactive'
    },
    
    noRel() {
      console.log(`removing rel from ${this.currentTokenId}`)
      this.removeRel()
    },
    notImplemented() {
          alert('Not implemented')
        }
        ,
    reversePolarity() {
      if (this.token_polarity == 'negative') this.token_polarity = 'positive'; else this.token_polarity = 'negative'
    },

    async  parse() {

      try {
   

          const url = `https://lindat.mff.cuni.cz/services/udpipe/api/process` +
                `?tokenizer&tagger&parser&model=${this.languages[this.language]}` +
                `&data=${encodeURIComponent(this.localSentence)}`;

          const { data } = await axios.get(url);

          if (!data.result) throw new Error('Unexpected UDPipe response');

          const conllu = data.result 
        
          this.reactiveSentence.fromSentenceConll(conllu);
          this.setReactiveSentence(this.reactiveSentence)
          this.setTokensFromConllu(conllu)
          this.setCurrentTokenId(1)
        
          this.updateQuery()
       } catch (e) {
        console.log('!!!!!!!!!!!!!!!!!¡!!!!!!Exception')
        console.log(e)
      
      } finally {
      
       }
    },

    search(e) {
      e.preventDefault()
      const lang = this.searchLanguage;
      const corpusURL = this.corpora[this.corpus]
    
      const groupByLanguage = lang=='All'
      let length_part = ' within <s sentence_length=in[5,14]/>'
      if (this.corpus != "UD 2.16" || !this.onlyShortSentences) length_part = "";
      const pattern =  encodeURIComponent(`_with-spans(${this.blacklabQuery}) ${length_part}`)

 
      const langFilter = `languageName:"${lang}"`
      let filterOrGroup = groupByLanguage ? `group=${encodeURIComponent('field:languageName:i')}` : `filter=${encodeURIComponent(langFilter)}` ;
      if (this.corpus != "UD 2.16") filterOrGroup = "";
      let url = `${corpusURL}/search/hits?first=0&number=20&patt=${pattern}&${filterOrGroup}&adjusthits=yes&interface=%7B%22form%22%3A%22search%22%2C%22patternMode%22%3A%22expert%22%7D`
      url = url.replaceAll('&&', '&')
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
  max-width: 1500px;
  padding: 1rem;
  border: 1px solid #ddd;
  background-color: aliceblue;
  border-radius: 8px;
  font-family: verdana, system-ui, sans-serif;
  font-size: 11pt
}

.b {
  font-style: italic;
}

.tokenTop {
  display: flex; justify-content: space-between; width: 100%; 
  background-color: darkblue; color: white; font-weight: bold;
  padding-left: 3pt; padding-right: 3pt;
}
.left {
  text-align: left;
}

.right {
  text-align: right;
}
.tokenHeader {
  padding-right: 1em;
}

.tokenEditor {
  background-color: lightblue;
  flex: 0 0 auto
}

.token {
  width: 12em;
  flex-grow: 0;
  flex: 0 0 auto
}

.tokenDisplay {
  color: #808080;
  background-color: aliceblue;
  width: auto;
  overflow: hidden;
  flex: 0 0 auto;
  padding-left: 4pt;
  padding-right: 4pt;
}


.property_active {
  color: #606060;
  font-weight: bold;

}
.property_inactive {
  color: #808080;
}
h3 {
  margin-top: 1em;
}

.queryEditing {
  border: 1px solid #000000;
  border-radius: 8px;
  background-color: white;
  padding: 1em;
  margin-top: 0em;
  margin-bottom: 0em;
  overflow-x: auto;
  max-width: 1500px;
}

.flexParent {
  display: flex;
  flex-grow: 0 0 auto;
  column-gap: 4pt;
}


.sentence-input {
  width: 100%;
  font: inherit;
  padding: 0.4rem;
  margin-bottom: 0.5rem;
}

textarea {
 border: 1px solid #ddd
}

.actions {
  display: flex;
  gap: 0.5rem;
}

button {
  padding: 0.2rem 0.5rem;
  xbackground-color: lightblue;
  xborder-color: lightblue;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

