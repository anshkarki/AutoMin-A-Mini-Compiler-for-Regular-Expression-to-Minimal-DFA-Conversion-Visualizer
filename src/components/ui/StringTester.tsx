// String Tester Component

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Automaton } from '@/lib/automata/types';
import { simulateDFA, SimulationResult } from '@/lib/automata/compiler';

interface StringTesterProps {
  dfa: Automaton | null;
}

export function StringTester({ dfa }: StringTesterProps) {
  const [testString, setTestString] = useState('');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [history, setHistory] = useState<Array<{ input: string; accepted: boolean }>>([]);
  
  const handleTest = () => {
    if (!dfa || testString === '') return;
    
    const simResult = simulateDFA(dfa, testString);
    setResult(simResult);
    
    setHistory(prev => [
      { input: testString, accepted: simResult.accepted },
      ...prev.slice(0, 9),
    ]);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && dfa) {
      handleTest();
    }
  };
  
  if (!dfa) {
    return (
      <div className="p-6 rounded-xl border border-border bg-card/50">
        <p className="text-muted-foreground text-sm text-center">
          Compile a regex to test strings
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter test string..."
          className={cn(
            "flex-1 px-4 py-3 rounded-lg",
            "bg-card border border-border font-mono",
            "placeholder:text-muted-foreground/50",
            "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
            "transition-all duration-200"
          )}
        />
        <button
          onClick={handleTest}
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-lg font-medium",
            "bg-secondary text-secondary-foreground",
            "hover:bg-secondary/80 transition-colors",
          )}
        >
          <Play className="w-4 h-4" />
          Test
        </button>
      </div>
      
      {/* Result */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={testString + result.accepted}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "p-4 rounded-lg border-2",
              result.accepted 
                ? "bg-success/10 border-success/50" 
                : "bg-destructive/10 border-destructive/50"
            )}
          >
            <div className="flex items-center gap-3">
              {result.accepted ? (
                <CheckCircle2 className="w-6 h-6 text-success" />
              ) : (
                <XCircle className="w-6 h-6 text-destructive" />
              )}
              <div>
                <p className={cn(
                  "font-semibold",
                  result.accepted ? "text-success" : "text-destructive"
                )}>
                  {result.accepted ? 'Accepted' : 'Rejected'}
                </p>
                <p className="text-sm text-muted-foreground font-mono">
                  "{testString}" → Final state: q{result.finalState}
                </p>
              </div>
            </div>
            
            {/* Trace */}
            {result.steps.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1 text-xs font-mono">
                <span className="text-muted-foreground">Trace:</span>
                <span className="px-1.5 py-0.5 rounded bg-secondary">q{dfa.startState}</span>
                {result.steps.map((step, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <span className="text-primary">{step.symbol}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <span className={cn(
                      "px-1.5 py-0.5 rounded",
                      step.nextState !== null ? "bg-secondary" : "bg-destructive/20"
                    )}>
                      {step.nextState !== null ? `q${step.nextState}` : '∅'}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* History */}
      {history.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            History
          </p>
          <div className="flex flex-wrap gap-2">
            {history.map((item, i) => (
              <motion.button
                key={`${i}-${item.input}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setTestString(item.input)}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono",
                  "border transition-colors hover:bg-secondary/50",
                  item.accepted 
                    ? "border-success/30 text-success" 
                    : "border-destructive/30 text-destructive"
                )}
              >
                {item.accepted ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <XCircle className="w-3 h-3" />
                )}
                "{item.input || 'ε'}"
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
