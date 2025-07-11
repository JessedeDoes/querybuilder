import { defineStore } from 'pinia';

import {
  ReactiveSentence,
  SentenceSVG,
  SentenceCaretaker,
  defaultSentenceSVGOptions
} from 'dependencytreejs/lib';

import { tokenJson_T, nodesJson_T, groupsJson_T, metaJson_T, sentenceJson_T, treeJson_T } from 'conllup/lib';
/**
 * ----------------------------
 *  Typings
 * ----------------------------
 */


export type FieldName = 'form' | 'lemma' | 'upos' | 'feats' | 'deprel' | 'xpos' | 'misc' | 'deps';
export type Polarity = 'positive' | 'negative'
const potato = '😶'
const norel = '[relation]'

export interface FieldState {
  value: string;
  active: boolean;
}


export type TokenFields = Record<FieldName, FieldState>;


export interface TokenState {

  id: number;
  head: number;
  tokenOrder: number;
  polarity: Polarity,
  fields: TokenFields,
  children : TokenState[]
 }

/** Root‑level store shape. */
export interface QueryState {
 
  tokens: TokenState[];
 
  currentTokenId: number | null;
  keepRoot: boolean;
  ignoreInterpunction: boolean;
  createCaptures: boolean;
  query: string;
  manualQuery: boolean;
 
  //reactiveSentence: ReactiveSentence
}

function isTokenReachable(state, tokens: TokenState[], id: number): boolean {
  const token = tokens.find(t => t.id == id)
  if (token) {
    if (token.head == 0) return true;
    if (token.head < 0) return false;
    else if ((state.ignoreInterpunction && token.fields['deprel'].value == 'punct') ||  !token.head || token.head == -1) return false;
    else return isTokenReachable(state, tokens, token.head)
  }
  return false
}

function conlluToBlackLab(state: QueryState) {
  
  const tokens: TokenState[] = state.tokens
  const ignoreInterpunction: boolean=state.ignoreInterpunction
  const keepRoot: boolean= state.keepRoot
  const createCaptures: boolean=state.createCaptures

  console.log(`Options: ignore interpunction: ${ignoreInterpunction} keep root: ${keepRoot}`)
  tokens.forEach(t => t.children = [])
  
  
  tokens.forEach(t => {
    if (t.head != 0) {
       const head = tokens.find(t1 => t1.id == t.head)
       if (head)  {
     
        head.children.push(t) 
       }
     }
  });

  // --- 3. find the (single) root --------------------------------------
  const root = tokens.find(t => t.head == 0);
  if (!root) return '';                 // malformed input
  
  
  const tokensWithOrder = tokens.filter(t => isTokenReachable(state, tokens, t.id) && t.tokenOrder != -1 && t.polarity == 'positive')
  
  const hasTokenOrder = tokensWithOrder.length > 1

  // --- 4. helpers ------------------------------------------------------
  const esc = s => s.replace(/'/g, "\\'") // .replace(/\|/g,'\\|');
  const escfeats = s => s.replace(/'/g, "\\'").replace(/\|/g,'\\|');
  function tokPattern(t: TokenState) {
    const props : string[] = [];
    // console.log(t)
    const useLemma = t.fields.lemma.active
    const usePoS =  t.fields.upos.active
    const useForm =  t.fields.form.active
    const useFeats = t.fields.feats.active

    const capturePrefix = (t.polarity == 'positive' && isTokenReachable(state,tokens,t.id)) &&  ((t.tokenOrder != -1) || createCaptures) ? `n${t.id}:` : ''
    
    if (useLemma && t.fields.lemma.value && t.fields.lemma.value !== '_')
      props.push(`lemma='${esc(t.fields.lemma.value)}'`);
    if (useForm && t.fields.form.value && t.fields.form.value !== '_')
      props.push(`word='${esc(t.fields.form.value)}'`);
    if (usePoS && t.fields.upos.value && t.fields.upos.value !== '_')
      props.push(`pos='${esc(t.fields.upos.value)}'`);
    if (useFeats && t.fields.feats.value && t.fields.feats.value !== '_')
      props.push(`xpos='.*${escfeats(t.fields.feats.value)}.*'`); // verbeteren in corpora: dit moet ook feats heten. evenzo pos->upos
     // bovendien moet je dit per feature doen, meerdere clauses, anders niet volgorde-onafhankelijk 
    const propStr = props.length ? `[${props.join(' & ')}]` : '[]'; // AHEM: zou _ moeten zijn
    return `${capturePrefix}${propStr}`;
  }

  function walk(t: TokenState, indent: number) {
    if (!(t.children.length > 0)) return tokPattern(t);

    // recurse for each child; wrap the child subtree in (…) if it
    // itself has children, to preserve operator precedence.

  
    function dropPunct(t: TokenState):boolean {return (ignoreInterpunction && t.fields['deprel'].value === 'punct')}
    const positiveChildren = t.children.filter(t => t.polarity == 'positive' && !dropPunct(t)).map(k => {
      const sub = walk(k,indent+2);
      const wrapped = k.children.length > 0 ? `(${sub})` : sub;
      const useRel =  k.fields.deprel.active
      const rel = useRel? k.fields.deprel.value : ''
      return `${" ".repeat(indent)} -${rel}-> ${wrapped}`;
    });

    const negativeChildren = t.children.filter(t => t.polarity == 'negative').map(k => {
      const sub = walk(k,indent+2);
      const wrapped = k.children.length > 0 ? `(${sub})` : sub;
      const useRel =  k.fields.deprel.active
      const rel = useRel? k.fields.deprel.value : ''
      return `${" ".repeat(indent)} !-${rel}-> ${wrapped}`;
    });

    const children = [...positiveChildren, ...negativeChildren]
    return `${tokPattern(t)}\n${children.join(';\n')} `;
  }

  const sorted = tokensWithOrder.sort( (t1,t2) => t1.tokenOrder - t2.tokenOrder)
  const orderPart = hasTokenOrder? ' :: ' + sorted.slice(0,-1).map((t,i) => `start(n${t.id}) < start(n${sorted[i+1].id})`).join(' & ') : ''
  console.log(`order clause: ${orderPart}`)
  // --- 5. stitch together ---------------------------------------------
   const rootPart = keepRoot? '^--> '  : '' 
  return `${rootPart}${walk(root,0)} ${orderPart}`; // of ^--> ${} als je het patroon als root wilt hebben
}

function findToken(reactiveSentence: ReactiveSentence, tokenId)  {
  const nodesJson = reactiveSentence.state.treeJson.nodesJson
  const id =  Object.keys(nodesJson).find(i => nodesJson[i].ID == tokenId) 
  return nodesJson[id]
}

const defaultpropertyActive =  {
  'deprel' : true,
  'upos' : true,
  'lemma' : false,
  'form' : false
}

function emptyToken() {
  function f(x: string) {
    const isActive = x in defaultpropertyActive?defaultpropertyActive[x]:false;
    return {
      active: isActive,
      value: ''
    }
  }

  const ts: TokenState =  {
    id: -1,
    head: -1,
    polarity: 'positive',
    fields: {
      'form' : f('form'),
      'lemma' : f('lemma'),
      'upos' : f('upos'),
      'xpos' : f('xpos'),
      'deprel': f('deprel'),
      'feats' : f('feats'),
      'deps': f('deps'),
      'misc' : f('misc')
    },
    tokenOrder: -1,
    children: []
  }
  return ts
}

function  initialTokens() {
  const ts1 = emptyToken();
  ts1.id =1;
  const ts2 = emptyToken();
  ts2.id = 2;
  ts1.head = 2;
  ts2.head = 0;
  ts2.fields['deprel'].value = 'root'
  return [ts1,ts2]
} 


 // import 
  export interface featuresJson_T {
  [key: string]: string;
}

function getField(t: TokenState, field: string) {
  if (field in t.fields && t.fields[field].value != '') return t.fields[field].value; return `[${field}]`
}

function truncate(s, n) {
  if (s.length <= n) return s;
  return s.slice(0, n - 3) + '...';
}

function getFieldTruncated(t: TokenState, field: string) {
   const z = field in t.fields && t.fields[field].value != ''?  t.fields[field].value: `[${field}]`
   return truncate(z,12)
}

function getFeats(t: TokenState) {
  const field = t.fields.feats.value
  return field.replace(/[^|=]=/g, '')
}

function getField2(t: TokenState, field: string) {
  if (field == 'deprel' && t.fields[field].value == 'root') return '';
  if (field in t.fields && t.fields[field].active && t.fields[field].value != '') return t.fields[field].value; return norel
}

function tokenToGrewJson(token: TokenState, isCurrentToken: boolean=false): tokenJson_T {
  console.log(isCurrentToken)
  return {
    ID: String(token.id),
    FORM: isCurrentToken? ('☛' + getFieldTruncated(token,'form')) : getField(token, 'form'),
    LEMMA: getField(token, 'lemma'),
    UPOS: getField(token, 'upos'),
    XPOS: getField(token, 'xpos'),
    FEATS: {},
    HEAD: token.head,
    DEPREL: (token.polarity=='negative'? '🚫 ': '') + getField2(token, 'deprel'),
    DEPS: {},
    MISC: isCurrentToken? {'highlight' : 'darkblue'} : {}
  }
}

function tokensToGrewJson(tokens: TokenState[], currentTokenId: Number=-10): nodesJson_T {
   let x = {}
   tokens.forEach(token => {
    const tGrew = tokenToGrewJson(token, token.id == currentTokenId)
    x[tGrew.ID] = tGrew
   })
   return x
}

function sentenceJsonFromTokens(tokens: TokenState[], currentTokenId: Number=-10): sentenceJson_T {
  const grewTokens = tokensToGrewJson(tokens,currentTokenId)
  const x: sentenceJson_T = {
    treeJson : {
      nodesJson: grewTokens,
      groupsJson: {}
    },
    metaJson: {} // dit zal vast wel op zijn minst een sentence id en een text moeten bevatten
  }
  return x
}

/*
  public fromSentenceJson(sentenceJson: sentenceJson_T): void {
    this.state = JSON.parse(JSON.stringify(sentenceJson));
    this.notify();
  }
*/

const fields = ["deprel", "upos", "feats", "form", "lemma"];

function createTokenFields() {
  const x = {}
  fields.forEach(f => x[f] = twoWayComputedTokenField(f))
  return x;
}

export const tokenFields = createTokenFields()

function createTokenFieldsActive() {
  const x = {}
  fields.forEach(f => x[f + '_active'] = tokenFieldActive(f))
  return x;
}

export const tokenFieldsActive = createTokenFieldsActive()

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


/**
 * ----------------------------
 *  Pinia Store
 * ----------------------------
 */

type fx = (number,string) => boolean;
export const useQueryStore = defineStore('query', {
  /** state ---------------------- */
  state: (): QueryState => ({
    tokens: initialTokens(),
    currentTokenId: 1,
    keepRoot: false,
    ignoreInterpunction: true,
    createCaptures: false,
    query: '',
    manualQuery: false
  }),


  /** getters -------------------- */
  
 
  getters: {
   
    getKeepRoot(state) : boolean { return state.keepRoot },
    getCreateCaptures(state) : boolean { return state.createCaptures },
    getIgnoreInterpunction(state): boolean { 
      if (!state) 
      console.log("state not initialized");
     console.log('in getter: ' + state.ignoreInterpunction)
      return state.ignoreInterpunction},
    currentToken(state): TokenState | undefined {
   
      return state.tokens.find(t => t.id === state.currentTokenId);
    },
    grewTokens(state) {
      return tokensToGrewJson(state.tokens,Number(state.currentTokenId))
    },
    grewSentence(state) {
      return sentenceJsonFromTokens(state.tokens,Number(state.currentTokenId))
    },
    computedQuery(state) {
      console.log('change to computed query...')
      state.manualQuery = false;
      return conlluToBlackLab(state)
    },

    getQuery(state) : string { 
      console.log(`getQuery: ${state.manualQuery}, query now ${state.query}`)
      return state.manualQuery ? state.query : this.computedQuery;},
    
    isActive(state) : fx {
      const f =  (id: number,property: string) => {
        const token = state.tokens.find(t => t.id == id)
        if (token && isTokenReachable(state, state.tokens, id)) {
          const r = token.fields[property].active && token.fields[property].value != ''
          return r
        }
       
        return false
      }
      return f
    },
    allTokensOrdered(state): boolean {
      let b=true
      const s = new Set(state.tokens.map(t => t.tokenOrder == -1))
   
      
      state.tokens.forEach(t => {if (t.tokenOrder == -1) return b=false })
      console.log(`allOrdered b=${b}? s=`)
      console.log(s)
      return b
    },
    sortIsIndeterminate(state) {
      const s = new Set(state.tokens.map(t => t.tokenOrder == -1))
      console.log(`Indeterminate? ${s.size} ${s}`)
      return s.size > 1 || s.size == 0
    },
  },

  /** actions -------------------- */
  actions: {
   
    setKeepRoot(b: boolean) {
      this.keepRoot = b
    },
    setIgnoreInterpunction(b: boolean) {
      this.ignoreInterpunction = b;
    },
    setCreateCaptures(b: boolean) {
      this.createCaptures = b;
    },
    resetTokens() {
      this.tokens = initialTokens() 
    },

    setTokens(tokens: TokenState[]) {
      this.tokens = tokens;
      //const grewSentence = sentenceJsonFromTokens(tokens)
    },

    setGrewTokens() {
      return;
      const grewSentence = sentenceJsonFromTokens(this.tokens,Number(this.currentTokenId))
      console.log('setting grew tokens')
      console.log(grewSentence)
      this.reactiveSentence.fromSentenceJson(grewSentence)
    },

    setTokensFromConllu(conllu: string) {
      const tokens: TokenState[] = [];                      
      
      conllu.split('\n').forEach(line => {
        if (!line || line.startsWith('#')) return;
        const c = line.split('\t');
        if (!/^\d+$/.test(c[0])) return;    

        const token:TokenState = {
          id:     Number(c[0]),
          head:   Number(c[6]),
          tokenOrder: -1,
          polarity: 'positive',
          fields: {
            form:   { value: c[1], active: false },
            lemma:  { value: c[2], active: false },
            upos:   { value: c[3], active: true },
            xpos:   { value: c[4], active: true },
            feats:  { value: c[5], active: false },
            deprel: { value: c[7], active: true }, 
            deps: { value: c[8], active: false },
            misc: { value: c[9], active: false },
          },
          children: []
        };
        tokens.push(token)
      });

      this.setTokens(tokens)
    },
   
    setCurrentTokenId(id: number | null) {
      this.currentTokenId = id;
      
    },

    nextToken() {
      if (this.currentTokenId < this.tokens.length)
        this.currentTokenId = this.currentTokenId +1 
    },

    previousToken() {
      if (this.currentTokenId > 1)
        this.currentTokenId = this.currentTokenId -1
    },

    insertEmptyToken() {
      this.insertEmptyTokenAt(this.currentTokenId - 1)
    },

    deleteToken() { 
      this.tokens.splice(this.currentTokenId - 1, 1);
      const tid = this.currentTokenId
      this.tokens.forEach(t => { if (t.head == tid) t.head = -1} )  
     
      
      this.fixTokenIds()
      
      
    }, 
    
    insertEmptyTokenAfter() {
      this.insertEmptyTokenAt(this.currentTokenId)
    },
    insertEmptyTokenAt(index: number) {
      function f(x: string) {
        return {
          active: true,
          value: ''
        }
      }

      const fields = ['form', 'lemma', 'upos', 'xpos', 'deprel', 'deps', ]
      const ts: TokenState =  emptyToken()
      this.tokens.splice(index,0,ts)
      this.fixTokenIds()
     
    },
    fixTokenIds() {
      const idMapping = {}
      for (const [i, token] of this.tokens.entries()) {
        idMapping[token.id] = i+1
        token.id = i+1
      }
      for (const [i, token] of this.tokens.entries()) {
        if (token.head == -1 || token.head == 0) {
        } else {
          token.head = idMapping[token.head]
        }
      }
      console.log('New token array')
      console.log(this.tokens)
    },

    updateTokenField(
      id: number,
      field: FieldName,
      newValue: string,
      newActive?: boolean,
    ) {
      const token = this.tokens.find(t => t.id === id);
      if (!token) return;
      token.fields[field].value = newValue.trim();
      if (newActive !== undefined) token.fields[field].active = newActive;
   
 
     
    },

    updateTokenOrder(id: number, order: number) {
      const token = this.tokens.find(t => t.id === id);
      if (!token) return;
      console.log(`tokenOrder ${id} ${order}`)
        if (order.toString().match('[0-9]+')) {
          token.tokenOrder = Number(order);
        } else {
          token.tokenOrder = -1
        }
        
      },

      updateTokenPolarity(id: number, p: Polarity) {
        const token = this.tokens.find(t => t.id === id);
        if (!token) return;
          if (p.toString().match('(positive)|(negative)')) {
            token.polarity = p;
          } else {
           
          }
         
         
        },

    setFieldActiveAllTokens(field: FieldName) {
      const self = this
      
    function  set() 
      {
      
        self.tokens.forEach(token => token.fields[field.toLowerCase()].active = true)
        
      }
      set()
      return set;
    },
    propertyIndeterminate(field: FieldName) {
      
      const s = new Set(this.tokens.map(t => t.fields[field.toLowerCase()].active))
      return s.size > 1
    },
    propertyAllSet(field: FieldName)  {
      const s = new Set(this.tokens.map(t => t.fields[field.toLowerCase()].active))
      return s.size == 1 && s[0] == true
    },
    setFieldInActiveAllTokens(field: FieldName) {
      const self = this
    function  set() 
      {
        self.tokens.forEach(token => token.fields[field.toLowerCase()].active = false)

      }
      set()
      return set;
    },

    removeOrderAllTokens() {
      this.tokens.forEach(t => t.tokenOrder = -1)
    },
    setOrderAllTokens() {
      this.tokens.forEach(t => t.tokenOrder = t.id)
    },
    setTokenFieldActive(
      id: number,
      field: FieldName,
      newValue: boolean,
    ) {
      const token = this.tokens.find(t => t.id === id);
      if (!token) return;
      token.fields[field].active = newValue;
    },
    children(t: TokenState) {
      return this.tokens.filter(x => x.head == t.id)
    },
    removeRelIn(tid: number = this.currentTokenId) {
      const t = this.tokens.find(t => t.id == tid)
      delete t.head
      this.children(t).forEach(x => this.removeRelIn(x.id))
    },
    removeRel() {
      // console.log(`store: removing rel from ${this.currentTokenId}`)
      this.removeRelIn(this.currentTokenId);
      console.log(`removeRel: rel removed from token ${this.currentTokenId}`)
   
    },
    // to handle multiple root situation
    setRoot(id: number) {
      console.log(id)
      console.log(`setRoot ${id}`)
      const token = this.tokens.find(t => t.id == id);
      token.head = 0;
      token.deprel = 'root'
      const oldRoot = this.tokens.find(t => t.id != id && t.head == 0);
      if (oldRoot) 
        oldRoot.head = -1;

    
    },
    hasCycles() {

    },
    isDescendant(t: TokenState, h:number): boolean {
      const head = this.tokens.find(t => t.id == h)
      if (head && t.id == head.head) return true;
      const children = this.tokens.filter(t1 => t1.head == t.id)
      console.log(`children of ${t.id}`)
      console.log(children.map(c => c.id).join(', '))
      console.log(`Descendant? [${this.tokens.map(t => t.head + '->' + t.id)}] ${t.id} ${h} ${children.map(t1 => t1.id)}`)
      children.forEach(c => {if (this.isDescendant(c,h)) return true })
      return false;
    },
    // todo check cycles.....
    setHead(id: number, head_id: number) {
      console.log(`sethead id=${id} head=${head_id}`)
      console.log(this.tokens)
      const token = this.tokens.find(t => t.id == id);
      if (!token) return;
      console.log(`sethead id=${id} head=${head_id} token=${token.id}`)
      if (this.isDescendant(token, head_id)) {
        console.log('Cycle danger!')
        const th = this.tokens.find(t => t.id == head_id)
        if (th) th.head = -1
      }
      token.head = head_id;

      console.log(`sethead id=${id} head=${head_id} token=${token.id},${token.head}`)
 
    },

 
    updateQuery() {
      //this.query = conlluToBlackLab(this.tokens,this.ignoreInterpunction, this.keepRoot)
    },
   
    setQuery(q: string) {
      this.query = q;
      this.manualQuery  = true;
    },
  },
});

