// Thompson's Construction - Build NFA from postfix regex

import { 
  Automaton, 
  NFAFragment, 
  State, 
  Transition, 
  EPSILON, 
  CONCAT, 
  UNION, 
  KLEENE, 
  PLUS, 
  OPTIONAL 
} from './types';

let stateCounter = 0;

function createState(isFinal = false): State {
  return {
    id: stateCounter++,
    isFinal,
  };
}

function createSymbolNFA(symbol: string): NFAFragment {
  const start = createState();
  const end = createState();
  
  return {
    start: start.id,
    end: end.id,
    states: [start, end],
    transitions: [{ from: start.id, to: end.id, symbol }],
  };
}

function concatenate(first: NFAFragment, second: NFAFragment): NFAFragment {
  // Connect first's end to second's start with epsilon
  const transitions = [
    ...first.transitions,
    ...second.transitions,
    { from: first.end, to: second.start, symbol: EPSILON },
  ];
  
  return {
    start: first.start,
    end: second.end,
    states: [...first.states, ...second.states],
    transitions,
  };
}

function union(first: NFAFragment, second: NFAFragment): NFAFragment {
  const start = createState();
  const end = createState();
  
  const transitions = [
    ...first.transitions,
    ...second.transitions,
    { from: start.id, to: first.start, symbol: EPSILON },
    { from: start.id, to: second.start, symbol: EPSILON },
    { from: first.end, to: end.id, symbol: EPSILON },
    { from: second.end, to: end.id, symbol: EPSILON },
  ];
  
  return {
    start: start.id,
    end: end.id,
    states: [start, end, ...first.states, ...second.states],
    transitions,
  };
}

function kleeneStar(fragment: NFAFragment): NFAFragment {
  const start = createState();
  const end = createState();
  
  const transitions = [
    ...fragment.transitions,
    { from: start.id, to: fragment.start, symbol: EPSILON },
    { from: start.id, to: end.id, symbol: EPSILON },
    { from: fragment.end, to: fragment.start, symbol: EPSILON },
    { from: fragment.end, to: end.id, symbol: EPSILON },
  ];
  
  return {
    start: start.id,
    end: end.id,
    states: [start, end, ...fragment.states],
    transitions,
  };
}

function plusOperator(fragment: NFAFragment): NFAFragment {
  const start = createState();
  const end = createState();
  
  const transitions = [
    ...fragment.transitions,
    { from: start.id, to: fragment.start, symbol: EPSILON },
    { from: fragment.end, to: fragment.start, symbol: EPSILON },
    { from: fragment.end, to: end.id, symbol: EPSILON },
  ];
  
  return {
    start: start.id,
    end: end.id,
    states: [start, end, ...fragment.states],
    transitions,
  };
}

function optional(fragment: NFAFragment): NFAFragment {
  const start = createState();
  const end = createState();
  
  const transitions = [
    ...fragment.transitions,
    { from: start.id, to: fragment.start, symbol: EPSILON },
    { from: start.id, to: end.id, symbol: EPSILON },
    { from: fragment.end, to: end.id, symbol: EPSILON },
  ];
  
  return {
    start: start.id,
    end: end.id,
    states: [start, end, ...fragment.states],
    transitions,
  };
}

export function buildNFA(postfix: string): Automaton {
  stateCounter = 0;
  const stack: NFAFragment[] = [];
  const alphabet = new Set<string>();
  
  for (const char of postfix) {
    switch (char) {
      case CONCAT: {
        const second = stack.pop()!;
        const first = stack.pop()!;
        stack.push(concatenate(first, second));
        break;
      }
      case UNION: {
        const second = stack.pop()!;
        const first = stack.pop()!;
        stack.push(union(first, second));
        break;
      }
      case KLEENE: {
        const fragment = stack.pop()!;
        stack.push(kleeneStar(fragment));
        break;
      }
      case PLUS: {
        const fragment = stack.pop()!;
        stack.push(plusOperator(fragment));
        break;
      }
      case OPTIONAL: {
        const fragment = stack.pop()!;
        stack.push(optional(fragment));
        break;
      }
      default: {
        stack.push(createSymbolNFA(char));
        alphabet.add(char);
        break;
      }
    }
  }
  
  const result = stack.pop()!;
  
  // Mark start and final states
  const states: State[] = result.states.map(s => ({
    ...s,
    isStart: s.id === result.start,
    isFinal: s.id === result.end,
  }));
  
  return {
    states,
    transitions: result.transitions,
    startState: result.start,
    acceptStates: [result.end],
    alphabet: Array.from(alphabet),
  };
}
