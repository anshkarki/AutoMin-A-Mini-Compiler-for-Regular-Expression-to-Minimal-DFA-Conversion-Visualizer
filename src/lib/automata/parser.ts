// Regex Parser - Handles preprocessing and infix to postfix conversion

import { CONCAT, UNION, KLEENE, PLUS, OPTIONAL, LPAREN, RPAREN } from './types';

const OPERATORS = new Set([UNION, KLEENE, PLUS, OPTIONAL, CONCAT]);
const UNARY_OPERATORS = new Set([KLEENE, PLUS, OPTIONAL]);

function getPrecedence(op: string): number {
  switch (op) {
    case UNION: return 1;
    case CONCAT: return 2;
    case KLEENE:
    case PLUS:
    case OPTIONAL:
      return 3;
    default: return 0;
  }
}

function isOperand(char: string): boolean {
  return !OPERATORS.has(char) && char !== LPAREN && char !== RPAREN;
}

// Add explicit concatenation operators
export function addConcatOperators(regex: string): string {
  let result = '';
  
  for (let i = 0; i < regex.length; i++) {
    const current = regex[i];
    result += current;
    
    if (i + 1 < regex.length) {
      const next = regex[i + 1];
      
      // Add concat operator between:
      // - operand followed by operand
      // - operand followed by (
      // - ) followed by operand
      // - ) followed by (
      // - unary operator followed by operand
      // - unary operator followed by (
      
      const currentIsOperandOrClosing = 
        isOperand(current) || 
        current === RPAREN || 
        UNARY_OPERATORS.has(current);
      
      const nextIsOperandOrOpening = 
        isOperand(next) || 
        next === LPAREN;
      
      if (currentIsOperandOrClosing && nextIsOperandOrOpening) {
        result += CONCAT;
      }
    }
  }
  
  return result;
}

// Shunting-yard algorithm for infix to postfix conversion
export function infixToPostfix(regex: string): string {
  const output: string[] = [];
  const operatorStack: string[] = [];
  
  const preprocessed = addConcatOperators(regex);
  
  for (const token of preprocessed) {
    if (isOperand(token)) {
      output.push(token);
    } else if (token === LPAREN) {
      operatorStack.push(token);
    } else if (token === RPAREN) {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== LPAREN) {
        output.push(operatorStack.pop()!);
      }
      operatorStack.pop(); // Remove the '('
    } else if (OPERATORS.has(token)) {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== LPAREN &&
        getPrecedence(operatorStack[operatorStack.length - 1]) >= getPrecedence(token)
      ) {
        output.push(operatorStack.pop()!);
      }
      operatorStack.push(token);
    }
  }
  
  while (operatorStack.length > 0) {
    output.push(operatorStack.pop()!);
  }
  
  return output.join('');
}

// Validate regex syntax
export function validateRegex(regex: string): { valid: boolean; error?: string } {
  if (!regex || regex.length === 0) {
    return { valid: false, error: 'Empty regex' };
  }
  
  let parenCount = 0;
  
  for (let i = 0; i < regex.length; i++) {
    const char = regex[i];
    
    if (char === LPAREN) {
      parenCount++;
    } else if (char === RPAREN) {
      parenCount--;
      if (parenCount < 0) {
        return { valid: false, error: 'Unmatched closing parenthesis' };
      }
    }
    
    // Check for invalid operator placement
    if (UNARY_OPERATORS.has(char)) {
      if (i === 0 || regex[i - 1] === LPAREN || regex[i - 1] === UNION) {
        return { valid: false, error: `Invalid placement of '${char}'` };
      }
    }
    
    if (char === UNION) {
      if (i === 0 || i === regex.length - 1) {
        return { valid: false, error: "Invalid placement of '|'" };
      }
      if (regex[i - 1] === LPAREN || regex[i + 1] === RPAREN) {
        return { valid: false, error: "Invalid placement of '|'" };
      }
    }
  }
  
  if (parenCount !== 0) {
    return { valid: false, error: 'Unmatched opening parenthesis' };
  }
  
  return { valid: true };
}
