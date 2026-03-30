// DFA Simulator - Test strings against the automaton

import { Automaton } from './types';

export interface SimulationStep {
  position: number;
  currentState: number;
  symbol: string;
  nextState: number | null;
}

export interface SimulationResult {
  accepted: boolean;
  steps: SimulationStep[];
  finalState: number;
}

export function simulateDFA(dfa: Automaton, input: string): SimulationResult {
  const steps: SimulationStep[] = [];
  let currentState = dfa.startState;
  
  // Build transition lookup
  const transitionMap = new Map<string, number>();
  for (const t of dfa.transitions) {
    transitionMap.set(`${t.from},${t.symbol}`, t.to);
  }
  
  for (let i = 0; i < input.length; i++) {
    const symbol = input[i];
    const key = `${currentState},${symbol}`;
    const nextState = transitionMap.get(key);
    
    steps.push({
      position: i,
      currentState,
      symbol,
      nextState: nextState ?? null,
    });
    
    if (nextState === undefined) {
      // No transition - rejected
      return {
        accepted: false,
        steps,
        finalState: currentState,
      };
    }
    
    currentState = nextState;
  }
  
  const accepted = dfa.acceptStates.includes(currentState);
  
  return {
    accepted,
    steps,
    finalState: currentState,
  };
}
