<!-- QueryBuilder.vue 
 Gebaseerd op grew conllu-editcomponent, zie https://github.com/kirianguiller/reactive-dep-tree 
-->
<template>

            <div :class="'tokenEditor' + ' ' + polarityClass(t.polarity)">
              <div> <input size="10" :class="propertyStyle(t.id,'deprel')" v-model="deprel"/> <input type="checkbox" v-model="deprel_active"/> 
              </div>
              <div> <input size="10" :class="propertyStyle(t.id,'upos')" v-model="upos"/>  <input type="checkbox" v-model="upos_active"/></div>
              <div> <input size="10" :class="propertyStyle(t.id,'form')" v-model="form"/> <input type="checkbox" v-model="form_active"/></div>
              <div> <input size="10" :class="propertyStyle(t.id,'lemma')" v-model="lemma"/>  <input type="checkbox" v-model="lemma_active"/></div>
              
            
              <div> <input size="10" :class="propertyStyle(t.id,'deprel')" v-model="token_order"/> </div>
            </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useQueryStore, twoWayComputedTokenField,   tokenFieldActive, tokenFieldActiveAll   } from './QueryStore';
const store = useQueryStore;

import GrewTree from './GrewTree.vue';

import { ref, onMounted, watch, useTemplateRef, nextTick } from 'vue';


export default {
  name: 'TokenEditor',

  components: {

  },
  props: {
    t:  {
       //type: TokenState,
       value : null
    }
  },

  async mounted() {
    await nextTick();
  },

  data() {
    return {
     
      
      propertyActive: {
        'Deprel' : true,
        'UPoS' : true,
        'Lemma' : false,
        'Form' : false
      },
  
      tokenProperties: ['Deprel', 'UPoS', 'Form', 'Lemma'],
     
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
      'isActive'

    ]),
 
    
    form : twoWayComputedTokenField('form'),
    lemma: twoWayComputedTokenField('lemma'),
    upos: twoWayComputedTokenField('upos'),
    deprel: twoWayComputedTokenField('deprel'),
    
    form_active: tokenFieldActive('form'),
    lemma_active: tokenFieldActive('lemma'),
    upos_active: tokenFieldActive('upos'),
    deprel_active: tokenFieldActive('deprel'),

   

    token_order : {
       get() { if (!this.currentToken || this.currentToken.tokenOrder == -1) return ''; return this.currentToken.tokenOrder},
       set(v)  { console.log('yep'); this.updateTokenOrder(this.currentTokenId,  v) },
    },
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
      'getRoot',

      'getKeepRoot',
      'getIgnoreInterpunction'
    ]),
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