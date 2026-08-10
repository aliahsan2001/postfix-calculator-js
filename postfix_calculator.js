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

function formatStack(stack) {
  return `[${stack.join(" ")}]`;
}

const readline = require("readline");
const calculator = new PostfixPlusPlusCalculator();

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> "
});

console.log("Postfix++ Calculator");
console.log("Type an expression, or type exit to quit.");
terminal.prompt();

terminal.on("line", (line) => {
  const expression = line.trim();

  if (expression.toLowerCase() === "exit") {
    terminal.close();
    return;
  }

  if (!expression) {
    terminal.prompt();
    return;
  }

  try {
    console.log(formatStack(calculator.evaluate(expression)));
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }

  terminal.prompt();
});
