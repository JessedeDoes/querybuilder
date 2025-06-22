<template>
            <div @click="() => setCurrentTokenId(t.id)" :class="'tokenDisplay' + ' ' + polarityClass(t.polarity)">
              <div :class="propertyStyle(t.id,'deprel')">{{valueOrPlaceHolder(t,'deprel') }}</div>
              <div :class="propertyStyle(t.id,'upos')">{{valueOrPlaceHolder(t,'upos') }}</div>
              <div :class="propertyStyle(t.id,'feats')">{{valueOrPlaceHolder(t,'feats') }}</div>
              <div :class="propertyStyle(t.id,'form')">{{ valueOrPlaceHolder(t,'form') }}</div>
              <div :class="propertyStyle(t.id,'lemma')">{{ valueOrPlaceHolder(t,'lemma') }}</div>
              
              
              <div :class="propertyStyle(t.id,'deprel')"><span style="display: block; height:14pt">{{ (t.tokenOrder != -1)? t.tokenOrder: '~' }}</span></div>
             </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useQueryStore, twoWayComputedTokenField,   tokenFieldActive, tokenFieldActiveAll, tokenFields, tokenFieldsActive   } from './QueryStore';



export default {
  name: 'TokenDisplay',

  components: {

  },
  props: {
    t:  {
       //type: TokenState,
       value : null
    }
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
    
    ...tokenFields, 
    ...tokenFieldsActive,


    token_order : {
       get() { if (!this.currentToken || this.currentToken.tokenOrder == -1) return ''; return this.currentToken.tokenOrder},
       set(v)  { console.log('yep'); this.updateTokenOrder(this.currentTokenId,  v) },
    },
    token_polarity : {
       get() { if (!this.currentToken) return null; return this.currentToken.polarity },
       set(v)  { console.log('yep'); this.updateTokenPolarity(this.currentTokenId,  v) },
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
      let v = t.fields[p].value
      if (p == 'feats')
         v = v.replace(/[^|=]+=/g, '').replace(/\|/g,',')

      if (v.length > 0) return v;
      return `[${p}]`
    },
  },
};
</script>

<style lang="scss">
  @use "./styles/querybuilder.scss" as *;
</style>
