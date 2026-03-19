// Utility for basic Python simulation without arbitrary execution

export function simulatePythonOutput(code: string): string {
    // 1. Extract content inside print()
    const match = code.match(/print\((.*)\)/);
  
    if (!match) return "";
  
    const expression = match[1].trim();
  
    // 2. Handle simple string outputs exactly 
    if (/^["'].*["']$/.test(expression)) {
      return expression.slice(1, -1);
    }
  
    // 3. Handle string concatenation outputs
    if (expression.includes("+") && (expression.includes('"') || expression.includes("'"))) {
      const parts = expression.split("+").map(p => p.trim().replace(/['"]/g, ""));
      return parts.join("");
    }
  
    // 4. Handle math operations safely using strict function wrapper
    if (/^[0-9+\-*/\s]+$/.test(expression)) {
      try {
        // Safe evaluation of purely math characters
        return Function(`"use strict"; return (${expression})`)().toString();
      } catch {
        return "";
      }
    }
  
    // Default fallback to raw expression
    return expression;
}
