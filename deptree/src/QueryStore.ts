import { defineStore } from 'pinia';

/**
 * ----------------------------
 *  Typings
 * ----------------------------
 */

/** The canonical set of field names every token can carry. */
export type FieldName = 'lemma' | 'upos' | 'feats' | 'deprel';

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
  fields: TokenFields;
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
  currentToken: TokenState
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
    currentTokenId: null,
    parse: null,
    query: '',
  }),

  /** getters -------------------- */
  getters: {
    /** quick lookup of the token currently being edited */
    currentToken(state): TokenState | undefined {
      alert('getting current token')
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

    /** Point the editor at a different token. */
    setCurrentTokenId(id: number | null) {
      this.currentTokenId = id;
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
    },

    /** Store the raw parse object (or null to clear). */
    setParse(parse: unknown | null) {
      this.parse = parse;
    },

    /** Save the latest BlackLab pattern text. */
    setQuery(q: string) {
      this.query = q;
    },
  },
});

