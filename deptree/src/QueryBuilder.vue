<!-- QueryBuilder.vue 
 Gebaseerd op grew conllu-editcomponent, zie https://github.com/kirianguiller/reactive-dep-tree 
-->
<template>
  

    <div class="queryEditing">
    <div style="overflow-x: auto">
      
    <div xml:id="treeWrapper" id="treeWrapper" style="padding-left: 4em !important; padding-top: 1em; padding-bottom: 1em; overflow-x: visible">
      <GrewTree/>
    
     </div>

     <div :style="{display: 'block', overflowX: visible}">
      <!--
      Token id: <button  @click="previousToken">&lt;</button> {{ currentTokenId }} <button value="previous" @click="nextToken">&gt;</button>
      -->
      <div class='flexParent'>
           <div class="flexChild tokenHeader">
              <div v-for="p in tokenProperties" :index="p" class="tokenPropertyHeader">{{ p }} 
                </div>
      
              <div class="b">order</div>
          </div>
          <div class="flexChild tokenHeader">
              <div v-for="p in tokenProperties" :index="p" class="tokenPropertyHeader">
                <input type="checkbox" :indeterminate="propertyIndeterminate(p)" v-model="propertyActive[p]" @change="toggleFieldActiveAllTokens(p)"> 
              </div>
      
              <div class="b"><input type="checkbox" :indeterminate="sortIsIndeterminate" v-model="tokensOrdered"> </div>
          </div>
         
          <template v-for="t in tokens" :index="t.id">

            <TokenEditor :data-id="t.id" :t=currentToken v-if="currentTokenId == t.id" v-report-box="'' + t.id"/>
            <TokenDisplay :data-id="t.id"  v-else :t=t  @click="() => setCurrentTokenId(t.id)" v-report-box="'' + t.id"/>

        </template>
        
      </div>
      <div class="tokenTop">
                Actions: <span @click="reversePolarity" title="reverse polarity">+/− {{ (token_polarity == 'positive')? '(make  constraint negative)' : '(make constraint positive)' }}</span> 
                | <span title="unlink" style="height: 14pt; color: black" @click='noRel'>⛓️‍💥 (unlink)</span>
                | <span @click="deleteToken" title="delete node">🗑️ (delete token)</span> 
                | <span class="left" @click="insertEmptyToken" title="insert node left">↲ (insert left)</span> 
                | <span @click="insertEmptyTokenAfter" class="right" title="insert node right"> ↳ (insert right)</span>
              </div>
              <div class="tokenTop">
                Options: pattern root is sentence root <input type="checkbox" v-model="keepRoot" title="pattern root is sentence root"></input> 
                | ignore punctuation <input type="checkbox" v-model="ignoreInterpunction" title="pattern root is sentence root"></input>
                | label query tokens <input type="checkbox" v-model="createCaptures" title="label query tokens"></input> 
              </div>
     </div>
    </div>  
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useQueryStore, twoWayComputedTokenField,   tokenFieldActive, tokenFieldActiveAll,    tokenFields, tokenFieldsActive } from './QueryStore';
const store = useQueryStore;

import GrewTree from './GrewTree.vue';
import TokenEditor from './TokenEditor.vue';
import TokenDisplay from './TokenDisplay.vue';
import { ref, onMounted, watch, useTemplateRef, nextTick } from 'vue';

export default {
  name: 'QueryBuilder',

  components: {
    GrewTree, TokenEditor, TokenDisplay
  },
  props: {
    
  },

  async mounted() {
    //await nextTick();
    this.resetTokens();
    // this.parse()
    //this.resetTokens()
    
  },

  data() {
    return {
      
      sortActive: false,
      propertyActive: {
        'deprel' : true,
        'upos' : true,
        'lemma' : false,
        'form' : false
      },

      tokenProperties: Object.keys(tokenFields) // ['Deprel', 'UPoS', 'Form', 'Lemma'],


    };
  },

  computed: {


    ...mapState(useQueryStore, [
      'currentTokenId',
      'currentToken',
      'tokens',
      'query',
      'getQuery',
      'computedQuery',
      'getIgnoreInterpunction',
      'getKeepRoot',
      'createCaptures',
      'isActive',
      'allTokensOrdered',
      'sortIsIndeterminate'
    ]),
    // volgende is redelijk debiel en laat zien dat we vue 3 niet snappen..
    
    tokensOrdered : {
      get() { return this.allTokensOrdered },
      set(v) { if (v) this.setOrderAllTokens(); else this.removeOrderAllTokens() }
    },
    ignoreInterpunction: {
      get() { console.log('getting ignoreinterpunction'); return this.getIgnoreInterpunction},
      set(v) {this.setIgnoreInterpunction(v); this.updateQuery() }
    },
   
    keepRoot: {
      get() { return this.getKeepRoot},
      set(v) {this.setKeepRoot(v); this.updateQuery() }
    },
    
    createCaptures: {
      get() { return this.createCaptures},
      set(v) {this.setCreateCaptures(v); this.updateQuery() }
    },
    blacklabQuery: {
      get()  { console.log('getting query'); return this.computedQuery },
      set(v) { console.log('setting query'); this.setQuery(v)}
    },
    

    ...tokenFields, 
    ...tokenFieldsActive,

    token_polarity : {
       get() { if (!this.currentToken) return null; return this.currentToken.polarity },
       set(v)  { console.log('yep'); this.updateTokenPolarity(this.currentTokenId,  v) },
    },
  
  },

  watch: {

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
      'setCreateCaptures',
      'getRoot',
      'setOrderAllTokens',
      'removeOrderAllTokens'


    
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
  },
};
</script>
<style lang="scss">
  @use "./styles/querybuilder.scss" as *;
</style>