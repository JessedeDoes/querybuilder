<!-- QBE.vue 
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

    <QueryBuilder/>

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
import QueryBuilder from './QueryBuilder.vue'
import { ref, onMounted, watch, useTemplateRef, nextTick } from 'vue';
import axios from 'axios';


export default {
  name: 'QBE',

  components: {
    GrewTree, TokenEditor, TokenDisplay, QueryBuilder
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
    
    blacklabQuery: {
      get()  { console.log('getting query'); return this.computedQuery },
      set(v) { console.log('setting query'); this.setQuery(v)}
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
