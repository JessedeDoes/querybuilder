export function conlluToBlackLab(conllu) {
  // --- 1. parse tokens -------------------------------------------------
  const useLemma = false;
  const toks = {};                      // id → token object
  // console.log(conllu)
  conllu.split('\n').forEach(line => {
    if (!line || line.startsWith('#')) return;
    const c = line.split('\t');
    if (!/^\d+$/.test(c[0])) return;    // skip empty/group tokens
    toks[c[0]] = {
      id:     c[0],
      form:   c[1],
      lemma:  c[2],
      upos:   c[3],
      head:   c[6],
      rel:    c[7],
      kids:   []                         // will fill in a moment
    };
  });

  // --- 2. build child lists -------------------------------------------
  Object.values(toks).forEach(t => {
    if (t.head !== '0' && toks[t.head]) toks[t.head].kids.push(t);
  });

  // --- 3. find the (single) root --------------------------------------
  const root = Object.values(toks).find(t => t.head === '0');
  if (!root) return '';                 // malformed input

  // --- 4. helpers ------------------------------------------------------
  const esc = s => s.replace(/'/g, "\\'");

  function tokPattern(t) {
    const props = [];
    // console.log(t)
    const useLemma = hasProperty(t.id,'LEMMA')
    const usePoS =  hasProperty(t.id,'UPOS')
    const useRel =  hasProperty(t.id,'DEPREL')
    if (useLemma && t.lemma && t.lemma !== '_')
      props.push(`lemma='${esc(t.lemma)}'`);
    if (usePoS && t.upos  && t.upos  !== '_')
      props.push(`pos='${esc(t.upos)}'`);
    const propStr = props.length ? ` [${props.join(' & ')}]` : '_';
    return `${propStr}`;
  }

  function walk(t,indent) {
    if (!t.kids.length) return tokPattern(t);

    // recurse for each child; wrap the child subtree in (…) if it
    // itself has children, to preserve operator precedence.
    const childBits = t.kids.map(k => {
      const sub = walk(k,indent+2);
      const wrapped = k.kids.length ? `(${sub})` : sub;
      const useRel =  hasProperty(k.id,'DEPREL')
      const rel = useRel? k.rel : ''
      return `${" ".repeat(indent)} -${rel}-> ${wrapped}`;
    });

    return `${tokPattern(t)}\n${childBits.join(';\n')}`;
  }

  // --- 5. stitch together ---------------------------------------------
  return `${walk(root,0)}`; // of ^--> ${} als je het patroon als root wilt hebben
}
