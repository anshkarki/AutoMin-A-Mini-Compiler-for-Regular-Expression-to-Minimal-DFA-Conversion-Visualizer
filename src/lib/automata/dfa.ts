// Subset Construction - Convert NFA to DFA

import { Automaton, State, Transition, EPSILON } from './types';

// Compute epsilon closure of a set of states
function epsilonClosure(states: Set<number>, transitions: Transition[]): Set<number> {
  const closure = new Set(states);
  const stack = Array.from(states);
  
  while (stack.length > 0) {
    const state = stack.pop()!;
    
    for (const t of transitions) {
      if (t.from === state && t.symbol === EPSILON && !closure.has(t.to)) {
        closure.add(t.to);
        stack.push(t.to);
      }
    }
  }
  
  return closure;
}

// Get all states reachable from a set of states on a given symbol
function move(states: Set<number>, symbol: string, transitions: Transition[]): Set<number> {
  const result = new Set<number>();
  
  for (const state of states) {
    for (const t of transitions) {
      if (t.from === state && t.symbol === symbol) {
        result.add(t.to);
      }
    }
  }
  
  return result;
}

// Convert Set to a unique string key for hashing
function setToKey(set: Set<number>): string {
  return Array.from(set).sort((a, b) => a - b).join(',');
}

export function nfaToDfa(nfa: Automaton): Automaton {
  const dfaStates: Map<string, number> = new Map();
  const dfaTransitions: Transition[] = [];
  const dfaStateList: State[] = [];
  const acceptStates: number[] = [];
  
  let stateCounter = 0;
  const unmarkedStates: Set<number>[] = [];
  
  // Start with epsilon closure of NFA start state
  const startClosure = epsilonClosure(new Set([nfa.startState]), nfa.transitions);
  const startKey = setToKey(startClosure);
  
  dfaStates.set(startKey, stateCounter);
  unmarkedStates.push(startClosure);
  
  const isFinalState = (nfaStates: Set<number>): boolean => {
    for (const state of nfaStates) {
      if (nfa.acceptStates.includes(state)) {
        return true;
      }
    }
    return false;
  };
  
  dfaStateList.push({
    id: stateCounter,
    isStart: true,
    isFinal: isFinalState(startClosure),
  });
  
  if (isFinalState(startClosure)) {
    acceptStates.push(stateCounter);
  }
  
  stateCounter++;
  
  while (unmarkedStates.length > 0) {
    const currentNfaStates = unmarkedStates.shift()!;
    const currentDfaState = dfaStates.get(setToKey(currentNfaStates))!;
    
    for (const symbol of nfa.alphabet) {
      const moveResult = move(currentNfaStates, symbol, nfa.transitions);
      
      if (moveResult.size === 0) {
        continue;
      }
      
      const closure = epsilonClosure(moveResult, nfa.transitions);
      const closureKey = setToKey(closure);
      
      let targetDfaState: number;
      
      if (!dfaStates.has(closureKey)) {
        targetDfaState = stateCounter++;
        dfaStates.set(closureKey, targetDfaState);
        unmarkedStates.push(closure);
        
        const isFinal = isFinalState(closure);
        dfaStateList.push({
          id: targetDfaState,
          isStart: false,
          isFinal,
        });
        
        if (isFinal) {
          acceptStates.push(targetDfaState);
        }
      } else {
        targetDfaState = dfaStates.get(closureKey)!;
      }
      
      dfaTransitions.push({
        from: currentDfaState,
        to: targetDfaState,
        symbol,
      });
    }
  }
  
  return {
    states: dfaStateList,
    transitions: dfaTransitions,
    startState: 0,
    acceptStates,
    alphabet: nfa.alphabet,
  };
}
