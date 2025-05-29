import { defineStore } from 'pinia';

import {
  ReactiveSentence,
  SentenceSVG,
  SentenceCaretaker,
  defaultSentenceSVGOptions
} from 'dependencytreejs/lib';
/**
 * ----------------------------
 *  Typings
 * ----------------------------
 */

/** The canonical set of field names every token can carry. */
export type FieldName = 'form' | 'lemma' | 'upos' | 'feats' | 'deprel' | 'xpos' | 'misc' | 'deps';

/** State for a single linguistic field (value + whether it is active in the query). */
export interface FieldState {
  value: string;
  active: boolean;
}

/** All four fields bundled together. */
export type TokenFields = Record<FieldName, FieldState>;

/** State for one token (node) in the dependency tree. */
export interface TokenState {
  /** integer ID of the token (1‑based like in CoNLL‑U) */
  id: number;
  /** head ID (0 = root) */
  head: number;
  /** linguistic fields */
  fields: TokenFields,
  children : TokenState[]
 }

/** Root‑level store shape. */
export interface QueryState {
  /** ordered list of tokens we are editing */
  tokens: TokenState[];
  /** which token is currently being edited (null = none) */
  currentTokenId: number | null;
  /** original parse object (whatever structure your parser returns) */
  parse: unknown | null;
  /** latest generated BlackLab query */
  query: string;
  // currentToken: TokenState
  reactiveSentence: ReactiveSentence
}

function conlluToBlackLab(tokens: TokenState[]) {



  tokens.forEach(t => t.children = [])
  
  // --- 2. build child lists -------------------------------------------
  tokens.forEach(t => {
    if (t.head != 0) {
       const head = tokens.find(t1 => t1.id == t.head)
       if (head)  {
        //console.log(`found ${head}`)
        head.children.push(t) 
       }
     }
  });

  // --- 3. find the (single) root --------------------------------------
  const root = tokens.find(t => t.head == 0);
  if (!root) return '';                 // malformed input

  // --- 4. helpers ------------------------------------------------------
  const esc = s => s.replace(/'/g, "\\'");

  function tokPattern(t: TokenState) {
    const props : string[] = [];
    // console.log(t)
    const useLemma = t.fields.lemma.active
    const usePoS =  t.fields.upos.active
    const useForm =  t.fields.form.active
    if (useLemma && t.fields.lemma.value && t.fields.lemma.value !== '_')
      props.push(`lemma='${esc(t.fields.lemma.value)}'`);
    if (useForm && t.fields.form.value && t.fields.form.value !== '_')
      props.push(`word='${esc(t.fields.lemma.value)}'`);
    if (usePoS && t.fields.upos.value && t.fields.upos.value !== '_')
      props.push(`pos='${esc(t.fields.upos.value)}'`);
    const propStr = props.length ? ` [${props.join(' & ')}]` : '_';
    return `${propStr}`;
  }

  function walk(t: TokenState,indent: number) {
    if (!(t.children.length > 0)) return tokPattern(t);

    // recurse for each child; wrap the child subtree in (…) if it
    // itself has children, to preserve operator precedence.
    const childBits = t.children.map(k => {
      const sub = walk(k,indent+2);
      const wrapped = k.children.length > 0 ? `(${sub})` : sub;
      const useRel =  k.fields.deprel.active
      const rel = useRel? k.fields.deprel.value : ''
      return `${" ".repeat(indent)} -${rel}-> ${wrapped}`;
    });

    return `${tokPattern(t)}\n${childBits.join(';\n')}`;
  }

  // --- 5. stitch together ---------------------------------------------
  return `${walk(root,0)}`; // of ^--> ${} als je het patroon als root wilt hebben
}

function findToken(reactiveSentence: ReactiveSentence, tokenId)  {
  const nodesJson = reactiveSentence.state.treeJson.nodesJson
  const id =  Object.keys(nodesJson).find(i => nodesJson[i].ID == tokenId) 
  return nodesJson[id]
}
function updateTokenInReactiveSentence(reactiveSentence: ReactiveSentence, tokenId: number, targetLabelLC: string, targetValue: string) {
  const targetLabel = targetLabelLC.toUpperCase()

  //console.log(`update Token in tree: ${tokenId} ${targetLabel} ${targetValue}`)
  const nodesJson = reactiveSentence.state.treeJson.nodesJson
  //console.log(nodesJson)
  const oldTokId   =  Object.keys(nodesJson).find(i => nodesJson[i].ID == tokenId)
                     
  if (!oldTokId)  {
    //console.log(`Cannot update: ${tokenId} not found`)
    return;
  }
 

  const oldTok = nodesJson[oldTokId]
  const oldValue = oldTok[targetLabel];

  /* --- quick UI: browser prompt --------------------------------------- */
 
  if (targetValue === null || targetValue === oldValue) return;   // cancel / no change

  /* --- commit change --------------------------------------------------- */
  const newTok = { ...oldTok, [targetLabel]: targetValue };
  //console.log('newTok=')
  //console.log(newTok)
  
  reactiveSentence.updateToken(newTok);
  //console.log(`Should be updated now .... `)
  // console.log(reactiveSentence.state.treeJson.nodesJson)
  // updateQuery()
}

function removeRelInReactiveSentence(reactiveSentence: ReactiveSentence, tokenId: number) {
  const nodesJson = reactiveSentence.state.treeJson.nodesJson
  //console.log(nodesJson)
  const oldTokId   =  Object.keys(nodesJson).find(i => nodesJson[i].ID == tokenId)
                     
  if (!oldTokId)  {
    //console.log(`Cannot update: ${tokenId} not found`)
    return;
  }
 

  const oldTok = nodesJson[oldTokId]
  const newTok =  { ...oldTok }
  newTok['HEAD']  = '_'
  //oldTok['HEAD'] = '_'
  console.log(`${oldTok['HEAD']} --> ${newTok['HEAD']}`)
  console.log(newTok)
  reactiveSentence.updateToken(newTok);
}

function setHeadInReactiveSentence(reactiveSentence: ReactiveSentence, tokenId: number, headId: number) {
  const nodesJson = reactiveSentence.state.treeJson.nodesJson

  const oldTokId   =  Object.keys(nodesJson).find(i => nodesJson[i].ID == tokenId)
                     
  if (!oldTokId) return;
  const oldTok = nodesJson[oldTokId]

  if (!oldTok || oldTok.HEAD === headId) return;      // nothing to change

  // make a shallow copy with a new HEAD value
  const newTok  = { ...oldTok, HEAD: headId };

  // save to the undo stack _before_ mutating
  // caretaker.backup();

  // DependencyTreeJS will emit update notifications → SVG + BlackLab refresh
  reactiveSentence.updateToken(newTok);
}



/**
 * ----------------------------
 *  Pinia Store
 * ----------------------------
 */
export const useQueryStore = defineStore('query', {
  /** state ---------------------- */
  state: (): QueryState => ({
    tokens: [],
    currentTokenId: 1,
    parse: null,
    query: '',
    reactiveSentence: null
  }),

  /** getters -------------------- */
  getters: {
    /** quick lookup of the token currently being edited */
    currentToken(state): TokenState | undefined {
      //console.log('getting current token')
      return state.tokens.find(t => t.id === state.currentTokenId);
    },
    hasParse: state => Boolean(state.parse),
  },

  /** actions -------------------- */
  actions: {
    /** Replace the entire token list (e.g. after a fresh parse). */
    setTokens(tokens: TokenState[]) {
      this.tokens = tokens;
    },

    setReactiveSentence(r: ReactiveSentence) {
      //console.log('setting reactive sentence:')
      //console.log(r)
      this.reactiveSentence = r
    },

    setTokensFromConllu(conllu: string) {
      const tokens: TokenState[] = [];                      // id → token object
      //console.log('Tokens from:' + conllu)
      conllu.split('\n').forEach(line => {
        if (!line || line.startsWith('#')) return;
        const c = line.split('\t');
        if (!/^\d+$/.test(c[0])) return;    // skip empty/group tokens

        const token:TokenState = {
          id:     Number(c[0]),
          head:   Number(c[6]),
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
      //console.log("Tokens now:") 
      //console.log(tokens)
      this.setTokens(tokens)
    },
    /** Point the editor at a different token. */
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

    /** Generic field updater for a token. */
    updateTokenField(
      id: number,
      field: FieldName,
      newValue: string,
      newActive?: boolean,
    ) {
      const token = this.tokens.find(t => t.id === id);
      if (!token) return;
      token.fields[field].value = newValue;
      if (newActive !== undefined) token.fields[field].active = newActive;
      //console.log(`Updating token ${id}: ${field}=${newValue}`)
      updateTokenInReactiveSentence(this.reactiveSentence, id, field, newValue)
      this.updateQuery()
    },

    setTokenFieldActive(
      id: number,
      field: FieldName,
      newValue: boolean,
    ) {
      const token = this.tokens.find(t => t.id === id);
      if (!token) return;
      token.fields[field].active = newValue;
      this.updateQuery()
    },

    removeRel() {
      console.log(`store: removing rel from ${this.currentTokenId}`)
      const token = this.currentToken
      delete token.head;
  
      removeRelInReactiveSentence(this.reactiveSentence, this.currentTokenId)
      this.updateQuery()
    },

    setRoot(id: number) {
      console.log(id)
      console.log(`setRoot ${id}`)
      const token = this.tokens.find(t => t.id == id);
      token.head = 0;
      token.deprel = 'root'
      setHeadInReactiveSentence(this.reactiveSentence, id, 0)
      updateTokenInReactiveSentence(this.reactiveSentence, id, 'deprel', 'root')
      this.updateQuery()
    },

    setHead(id: number, head_id: number) {
      console.log(`sethead id=${id} head=${head_id}`)
      console.log(this.tokens)
      const token = this.tokens.find(t => t.id == id);
      if (!token) return;
      console.log(`sethead id=${id} head=${head_id} token=${token.id}`)
      token.head = head_id;
      console.log(`sethead id=${id} head=${head_id} token=${token.id},${token.head}`)
      setHeadInReactiveSentence(this.reactiveSentence, id, head_id)
      this.updateQuery()
    },

    /** Store the raw parse object (or null to clear). */
    setParse(parse: unknown | null) {
      this.parse = parse;
    },

    updateQuery() {
      this.query = conlluToBlackLab(this.tokens)
    },
    /** Save the latest BlackLab pattern text. */
    setQuery(q: string) {
      this.query = q;
    },
  },
});

