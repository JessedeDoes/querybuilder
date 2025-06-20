<template>
            <div @click="() => setCurrentTokenId(t.id)" :class="'tokenDisplay' + ' ' + polarityClass(t.polarity)">
              <div :class="propertyStyle(t.id,'deprel')">{{valueOrPlaceHolder(t,'deprel') }}</div>
              <div :class="propertyStyle(t.id,'upos')">{{valueOrPlaceHolder(t,'upos') }}</div>
              <div :class="propertyStyle(t.id,'form')">{{ valueOrPlaceHolder(t,'form') }}</div>
              <div :class="propertyStyle(t.id,'lemma')">{{ valueOrPlaceHolder(t,'lemma') }}</div>
              
              
              <div :class="propertyStyle(t.id,'deprel')"><span style="display: block; height:14pt">{{ (t.tokenOrder != -1)? t.tokenOrder: '~' }}</span></div>
             </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useQueryStore  } from './QueryStore';

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
  },
};
</script>

<style scoped>
.query-builder {
  max-width: 1500px;
  padding: 1rem;
  border: 1px solid #ddd;
  background-color: aliceblue;
  border-radius: 2px;
  font-family: verdana, system-ui, sans-serif;
  font-size: 11pt
}

.tokenPropertyHeader {
  font-style: normal
}

.tokenTop {
  xdisplay: flex; justify-content: space-between; width: 100%; 
  font-weight: normal;
  padding-left: 3pt; padding-right: 3pt;
  margin-top: 6pt;
}
.left {
  text-align: left;
}

.right {
  text-align: right;
}
.tokenHeader {
  padding-right: 4pt;
}

.tokenEditor {
  background-color: #d0d0ff;
  flex: 0 0 auto;
  border-style: solid;
  border-color: grey;
  border-width: 1pt;
  padding: 2pt

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
  min-width: 4em;
  flex: 0 0 auto;
  padding-left: 4pt;
  padding-right: 4pt;
    flex: 0 0 auto;
  border-style: solid;
  border-color: grey;
  border-width: 1pt;
  padding: 2pt

}

.tokenDisplay div  {
  height: 1.5em;
  vertical-align: top;

}

.tokenHeader div {
  height: 1.5em;
  vertical-align: top;
 
}

.tokenEditor div {
  height: 1.5em;
  vertical-align: top;
}

.property_active {
  color: #606060;
  font-weight: bold;

}
.property_inactive {
  color: #808080;
}

.togglePropertyButton {
  xbackground-color: #d0d0ff;
  border-style: solid;
  border-color:#808080;
  border-width: .5pt;
  padding-left: 3pt;
  padding-right: 3pt;
  border-radius: 2px;
  background-color: #eeeeee;
}
h3 {
  margin-top: 1em;
}

.queryEditing {
  border: 1px solid #000000;
  border-radius: 2px;
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
  margin-top: 4pt;
}

.tokenEditor input {
  background-color: aliceblue;
  border-style: solid;
  border-color: darkgrey;
  border-width: 1pt;
}


.negativePolarity::before {
  content: "🚫"; 
  position: absolute;
  transform: translate(-4pt, 0pt);
  font-size: 3rem;
  
 


  color: rgba(255, 0, 0, 0.2); /* soft red tint */
  pointer-events: none;
  z-index: 10000;
  text-align: center;
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



