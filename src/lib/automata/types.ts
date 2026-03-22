// Core automata types for the regex compiler

export interface State {
  id: number;
  isStart?: boolean;
  isFinal?: boolean;
}

export interface Transition {
  from: number;
  to: number;
  symbol: string; // 'ε' for epsilon transitions
}

export interface Automaton {
  states: State[];
  transitions: Transition[];
  startState: number;
  acceptStates: number[];
  alphabet: string[];
}

export interface NFAFragment {
  start: number;
  end: number;
  states: State[];
  transitions: Transition[];
}

export interface DFAState {
  id: number;
  nfaStates: Set<number>;
  isStart?: boolean;
  isFinal?: boolean;
}

export interface CompilationResult {
  regex: string;
  postfix: string;
  nfa: Automaton;
  dfa: Automaton;
  minimizedDfa: Automaton;
  error?: string;
}

export const EPSILON = 'ε';
export const CONCAT = '.';
export const UNION = '|';
export const KLEENE = '*';
export const PLUS = '+';
export const OPTIONAL = '?';
export const LPAREN = '(';
export const RPAREN = ')';
