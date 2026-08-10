# ADS2 Mid-term Coursework

## Postfix++ Calculator Design

I made the calculator as a small interpreter for Postfix++. It reads one line at a time, splits the line into tokens, and then deals with each token from left to right. A token can be a number, a variable from `A` to `Z`, an arithmetic operator, or the assignment operator `=`.

The main data structure is a stack. When the interpreter reads a number or variable, it pushes it onto the stack. When it reads an arithmetic operator, it pops two operands, applies the operator, and pushes the result back. The result of a calculation is therefore left at the top of the stack.

The second data structure is a symbol table for variables. I used a JavaScript object for this because the variable names are only `A` to `Z`, so the table stays very small. The key is the variable name and the value is the number stored for that variable.

## Algorithm

1. Create an empty stack for the current input line.
2. Split the line into tokens.
3. For each token from left to right:
   - If it is a number, push it onto the stack.
   - If it is a variable name from `A` to `Z`, push it onto the stack.
   - If it is `+`, `-`, `*`, or `/`, pop two operands, convert variables to their stored values, evaluate the operation, and push the numeric result.
   - If it is `=`, pop a value and a variable name, then insert or update the variable in the symbol table.
4. Return the stack after the line has been evaluated. I reverse it only when displaying the answer, because the coursework notation shows the stack top on the left.

For subtraction and division, the order matters. In the expression `A B -`, `B` is popped first as the right operand and `A` is popped second as the left operand, so the result is `A - B`.

## Error Handling

I added basic error handling so that invalid input does not just give an incorrect answer. The interpreter reports errors for:

- Unknown tokens.
- Variables outside the `A` to `Z` namespace.
- Use of a variable before assignment.
- Operators with too few operands.
- Assignment where the left side is not a valid variable.
- Division by zero.

## Complexity

If an input line contains `n` tokens, the interpreter processes each token once, so the time complexity is `O(n)`. The stack can grow to at most `n` items for a single line, so the stack space complexity is `O(n)`. The symbol table holds at most 26 variables, so I treated its space usage as `O(1)` for this coursework.

## JavaScript Implementation

```javascript
class PostfixPlusPlusCalculator {
  constructor() {
    this.symbols = {};
  }

  isNumber(token) {
    return /^-?\d+(\.\d+)?$/.test(token);
  }

  isVariable(token) {
    return /^[A-Z]$/.test(token);
  }

  isOperator(token) {
    return ["+", "-", "*", "/"].includes(token);
  }

  valueOf(token) {
    if (typeof token === "number") {
      return token;
    }

    if (this.isNumber(token)) {
      return Number(token);
    }

    if (this.isVariable(token)) {
      if (!(token in this.symbols)) {
        throw new Error(`Variable ${token} has not been assigned a value`);
      }
      return this.symbols[token];
    }

    throw new Error(`Invalid value: ${token}`);
  }

  applyOperator(operator, left, right) {
    switch (operator) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        if (right === 0) {
          throw new Error("Division by zero");
        }
        return left / right;
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
  }

  evaluate(line) {
    const stack = [];
    const tokens = line.trim().split(/\s+/).filter(Boolean);

    for (const token of tokens) {
      if (this.isNumber(token) || this.isVariable(token)) {
        stack.push(token);
        continue;
      }

      if (this.isOperator(token)) {
        if (stack.length < 2) {
          throw new Error(`Operator ${token} needs two operands`);
        }
        const right = this.valueOf(stack.pop());
        const left = this.valueOf(stack.pop());
        stack.push(this.applyOperator(token, left, right));
        continue;
      }

      if (token === "=") {
        if (stack.length < 2) {
          throw new Error("Assignment needs a variable and a value");
        }
        const valueToken = stack.pop();
        const variable = stack.pop();
        if (!this.isVariable(variable)) {
          throw new Error("The left side of assignment must be A-Z");
        }
        this.symbols[variable] = this.valueOf(valueToken);
        continue;
      }

      throw new Error(`Unknown token: ${token}`);
    }

    return stack.slice().reverse().map((token) => this.valueOf(token));
  }
}
```

## Example Session

```text
> A 2 =
[]
> B 3 =
[]
> A B *
[6]
> 3 4 5 + *
[27]
```

## Five-minute Video Link

Paste your recorded video link here before submission:

`VIDEO_LINK_HERE`
