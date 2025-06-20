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
      Parsing language: <select v-model="language"><option v-for="name in Object.keys(languages)" :key="name" :value="name">{{ name }}</option></select> 
      <button :disabled="isEmpty" @click="parse">Go</button>
      <button :disabled="isEmpty" @click="resetTokens">Reset</button>
    </div>
    </div>
    <h3>Edit query</h3>

    <div class="queryEditing">
    <div style="overflow-x: auto">
      
    <div xml:id="treeWrapper" id="treeWrapper" style="padding-left: 4em !important; padding-top: 1em; padding-bottom: 1em; overflow-x: auto">
      <GrewTree v-if="!oldTree"/>
        <svg v-else width="1200px" height="800px" ref="svgEl" class="tree"></svg>
     </div>

     <div :style="{display: 'block', overflowX: auto}">
      <!--
      Token id: <button  @click="previousToken">&lt;</button> {{ currentTokenId }} <button value="previous" @click="nextToken">&gt;</button>
      -->
      <div class='flexParent'>
           <div class="flexChild tokenHeader">
              <div v-for="p in tokenProperties" :index="p" class="tokenPropertyHeader">{{ p }} 
                </div>
      
              <div class="b">Order</div>
          </div>
          <div class="flexChild tokenHeader">
              <div v-for="p in tokenProperties" :index="p" class="tokenPropertyHeader">
                <input type="checkbox" :indeterminate="propertyIndeterminate(p)" v-model="propertyActive[p]" @change="toggleFieldActiveAllTokens(p)"> 
           
              </div>
      
              <div class="b"></div>
          </div>
         
          <template v-for="t in tokens" :index="t.id">

            <TokenEditor :t=currentToken v-if="currentTokenId == t.id"/>
            <TokenDisplay v-else :t=t  @click="() => setCurrentTokenId(t.id)"/>

        </template>
        
      </div>
      <div class="tokenTop">
                <span @click="reversePolarity" title="reverse polarity">+/− {{ (token_polarity == 'positive')? '(make  constraint negative)' : '(make constraint positive)' }}</span> 
                | <span title="unlink" style="height: 14pt; color: black" @click='noRel'>⛓️‍💥 (unlink)</span>
                | <span @click="deleteToken" title="delete node">🗑️ (delete token)</span> 
                | <span class="left" @click="insertEmptyToken" title="insert node left">↲ (insert left)</span> 
                | <span @click="insertEmptyTokenAfter" class="right" title="insert node right"> ↳ (insert right)</span>
              </div>
              <div class="tokenTop">
                Options: pattern root is sentence root <input type="checkbox" v-model="keepRoot" title="pattern root is sentence root"></input> 
                | ignore punctuation <input type="checkbox" v-model="ignoreInterpunction" title="pattern root is sentence root"></input> 
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
const store = useQueryStore;

import GrewTree from './GrewTree.vue';
import TokenEditor from './TokenEditor.vue';
import TokenDisplay from './TokenDisplay.vue';
import { ref, onMounted, watch, useTemplateRef, nextTick } from 'vue';
import axios from 'axios';
import {
  ReactiveSentence,
  SentenceSVG,
  SentenceCaretaker,
  defaultSentenceSVGOptions
} from 'dependencytreejs/lib';


export function twoWayComputedTokenField(field) {
  // ⬇ ordinary *function* expressions ⇒ their `this` is dynamic
  return {
    get() {
      // Vue will later invoke this as  get.call(componentProxy)
      return this.currentToken
        ? this.currentToken.fields[field].value
        : '';
    },
    set(v) {
      if (this.currentTokenId != null)
        this.updateTokenField(this.currentTokenId, field, v);
    },
  };
}

export function tokenFieldActive(field) {
  return {
    
       get() { if (!this.currentToken ) return ''; return this.currentToken.fields[field].active},
       set(v)  { this.setTokenFieldActive(this.currentTokenId, field, v) },
    }
}

export function tokenFieldActiveAll(field) {
  return {
       get() { return this.propertyAllSet(field)},
       set(v)  { if (v) this.setFieldActiveAllTokens(field); else this.setFieldInactiveActiveAllTokens(field) }
    }
}

export default {
  name: 'QueryBuilder',

  components: {
    GrewTree, TokenEditor, TokenDisplay
  },
  props: {
    modelValue: {
      type: String,
      default: 'bruine bonen met spek',
    },
  },

  async mounted() {
    await nextTick();
    this.parse()
    //this.resetTokens()
    
  },

  data() {
    return {
      localSentence: this.modelValue,
      
      propertyActive: {
        'Deprel' : true,
        'UPoS' : true,
        'Lemma' : false,
        'Form' : false
      },
      language: 'Dutch',
      searchLanguage : 'Dutch',
      tokenProperties: ['Deprel', 'UPoS', 'Form', 'Lemma'],
      onlyShortSentences: false,
      languages : {
      "Dutch" : "nl",
      "English" : "en",
      "German" : "de",
      "French" : "fr",
      "Italian" : "it",
      "Latin" : "la",
      'Ancient Greek' : 'grc',
      'Sanskrit' : 'sa',
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
      },
      oldTree: false

    };
  },

  computed: {
    isEmpty() {
      return !this.localSentence.trim();
    },

    ...mapState(useQueryStore, [
      'currentTokenId',
      'currentToken',
      'tokens',
      'query',
      'getQuery',
      'computedQuery',
      'isActive'

    ]),
    // volgende is redelijk debiel en laat zien dat we vue 3 niet snappen..
    
    ignoreInterpunction: {
      get() { return this.getIgnoreInterpunction},
      set(v) {this.setIgnoreInterpunction(v); this.updateQuery() }
    },
   
    keepRoot: {
      get() { return this.getKeepRoot},
      set(v) {this.setKeepRoot(v); this.updateQuery() }
    },
    
    blacklabQuery: {
      get()  { console.log('getting query'); return this.computedQuery },
      set(v) { console.log('setting query'); this.setQuery(v)}
    },
    
    /*
    
    form : twoWayComputedTokenField('form'),
    lemma: twoWayComputedTokenField('lemma'),
    upos: twoWayComputedTokenField('upos'),
    deprel: twoWayComputedTokenField('deprel'),
    
    form_active: tokenFieldActive('form'),
    lemma_active: tokenFieldActive('lemma'),
    upos_active: tokenFieldActive('upos'),
    deprel_active: tokenFieldActive('deprel'),
    */

    form_all_active: tokenFieldActiveAll('form'),
    lemma_all_active: tokenFieldActiveAll('lemma'),
    upos_all_active: tokenFieldActiveAll('upos'),
    deprel_all_active: tokenFieldActiveAll('deprel'),

    /*
    token_order : {
       get() { if (!this.currentToken || this.currentToken.tokenOrder == -1) return ''; return this.currentToken.tokenOrder},
       set(v)  { console.log('yep'); this.updateTokenOrder(this.currentTokenId,  v) },
    },
    */
    token_polarity : {
       get() { if (!this.currentToken) return null; return this.currentToken.polarity },
       set(v)  { console.log('yep'); this.updateTokenPolarity(this.currentTokenId,  v) },
    },
  
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
      'nextToken',
      'previousToken',
      'setHead',
      'updateQuery',
      'setTokenFieldActive',
      'setRoot',
      'removeRel',
      'setFieldActiveAllTokens',
      'setFieldInActiveAllTokens',
      'propertyIndeterminate',
      'propertyAllSet',
      'insertEmptyToken',
      'insertEmptyTokenAfter',
      'deleteToken',
      'resetTokens',
      'setKeepRoot',
      'setIgnoreInterpunction',
      'getRoot',

      'getKeepRoot',
      'getIgnoreInterpunction'
    ]),
    toggleFieldActiveAllTokens(p) {
  
      const self=this;
      const b = this.propertyActive[p]
    
      if (b) self.setFieldActiveAllTokens(p); else self.setFieldInActiveAllTokens(p)
      
      return f;
    },
    activeAll(p) {
      return this.setFieldActiveAllTokens(p)
    },
    inActiveAll(p) {
      return this.setFieldInActiveAllTokens(p)
    },
    propertyStyle(id, property) {
      const f = this.isActive
      return f(id,property)? 'property_active' : 'property_inactive'
    },

    polarityClass(s) {
      if (s == 'negative') {
        return 'negativePolarity'
      } else return 'positivePolarity'
    },
    
    valueOrPlaceHolder(t,p) {
      if (t.fields[p].value.length > 0) return  t.fields[p].value;
      return `[${p}]`
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
          
        
          this.setTokensFromConllu(conllu)
          this.setCurrentTokenId(1)
        
          this.updateQuery()
       } catch (e) {
        console.log('!! Parsing Exception')
        console.log(e)
        this.resetTokens()
       
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
      const pattern =  encodeURIComponent(`(${this.blacklabQuery}) ${length_part}`)

 
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
<style lang="scss">
  @use "./styles/querybuilder.scss" as *;
</style>