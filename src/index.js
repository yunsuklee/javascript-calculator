import React from 'react';
import ReactDOM, { render } from 'react-dom';
import './CSS/main.css';

const numbers = [
  {
    id: "seven",
    value: 7,
  },
  {
    id: "eight",
    value: 8,
  },
  {
    id: "nine",
    value: 9,
  },
  {
    id: "four",
    value: 4,
  },
  {
    id: "five",
    value: 5,
  },
  {
    id: "six",
    value: 6,
  },
  {
    id: "one",
    value: 1,
  },
  {
    id: "two",
    value: 2,
  },
  {
    id: "three",
    value: 3,
  },
  {
    id: "zero",
    value: 0,
  },
  {
    id: "decimal",
    value: '.',
  },
];

const symbols = [
  {
    id: "clear",
    string: 'AC',
  },
  {
    id: "divide",
    string: '÷',
  },
  {
    id: "multiply",
    string: '×',
  },
  {
    id: "subtract",
    string: '-',
  },
  {
    id: "add",
    string: '+',
  },
  {
    id: "equals",
    string: '=',
  },
];

class Number extends React.Component {
  handleClick = (event) => {
    event.preventDefault();

    switch(event.target.id) {
      case "zero":
        this.props.updateDisplay("0");
        break;
      case "one":
        this.props.updateDisplay("1");
        break;
      case "two":
        this.props.updateDisplay("2");
        break;
      case "three":
        this.props.updateDisplay("3");
        break;
      case "four":
        this.props.updateDisplay("4");
        break;
      case "five":
        this.props.updateDisplay("5");
        break;
      case "six":
        this.props.updateDisplay("6");
        break;
      case "seven":
        this.props.updateDisplay("7");
        break;
      case "eight":
        this.props.updateDisplay("8");
        break;
      case "nine":
        this.props.updateDisplay("9");
        break;
      case "decimal":
        this.props.updateDisplay(".");
        break;
      default:
        return;
    }
  }

  render() {
    return (
      <button 
        className="number"
        id={this.props.numberId}
        onClick={this.handleClick}
      >
        {this.props.numberValue}
      </button>
    );
  }
}

class NumPad extends React.Component {
  render() {
    const numPad = this.props.numbersList.map((currNumber, i, numbersList) => {
      return (
        <Number
          numberId={numbersList[i].id}
          numberValue={numbersList[i].value}
          updateDisplay={this.props.updateDisplay}
          key={i}
        />
      );
    });
    return <div id="num-pad">{numPad}</div>;
  }
}

class Symbol extends React.Component {
  handleClick = (event) => {
    event.preventDefault();

    switch(event.target.id) {
      case "add":
        this.props.updateDisplay("+");
        break;
      case "subtract":
        this.props.updateDisplay("-");
        break;
      case "multiply":
        this.props.updateDisplay("×");
        break;
      case "divide":
        this.props.updateDisplay("÷");
        break;
      case "clear":
        this.props.updateDisplay("");
        break;
      case "equals":
        this.props.updateDisplay("=");
        break;
      default:
        return;
    }
  }

  render() {
    return (
      <button
        className="symbol"
        id={this.props.symbolId}
        onClick={this.handleClick}
      >
        {this.props.symbol}
      </button>
    );
  }
}

class SymbolsPad extends React.Component {
  render() {
    const signsPad = this.props.symbolsList.map((currSymbol, i, symbolsList) => {
      return (
        <Symbol
          symbolId={symbolsList[i].id}
          symbol={symbolsList[i].string}
          updateDisplay={this.props.updateDisplay}
          key={i}
        />
      );
    });
    return <div id={this.props.containerId}>{signsPad}</div>;
  }
}

class App extends React.Component {
  state = {
    display: '0',
    operating: '',
    calculated: false
  }
  
  updateDisplay = (input) => {
    if (input.match(/\d|\./)) {
      this.numberParse(input);
    } else {
      this.operatorParse(input);
    }
  }  
  numberParse = (input) => {
    let aux;

    if (this.state.calculated) {
      if (input === '.') {
        aux = '0' + input;
        input = aux;
      } else {
        aux = input;
      }
      
      this.setState({
        display: aux,
        operating: input,
        calculated: false
      });
    } else {
      if (input === '.' && this.state.display.match(/\./)) {
        aux = this.state.display;
        return;
      } else if (this.state.display === '0' && input !== '.') {
        aux = input;
      } else if (this.state.display.match(/[×÷+-]/)) {
        aux = input;
      } else {
        aux = this.state.display + input;
      }
  
      this.setState({
        display: aux,
        operating: this.state.operating + input
      });
    }
  }
  operatorParse = (input) => {
    if (input === "") {
      this.setState({
        display: "0",
        operating: '',
        calculated: false
      });
    }
    else if (this.state.calculated) {
      if (input !== "=") {
        this.setState({
          display: input,
          operating: this.state.display + input,
          calculated: false
        });
      }
    } else {
      switch(input) {
        case "×":
        case "÷":
        case "+":
          if (this.state.display.match(/[×÷+-]/)) {
            this.setState({
              display: input,
              operating: this.state.operating.replace(/[×÷+-]+$/, input)
            });
          } else {
            this.setState({
              display: input,
              operating: this.state.operating + input,
            });
          }
          break;
          case "-":
            if (this.state.operating.match(/[×÷+-]{2}$/)) {
              this.setState({
                display: input,
                operating: this.state.operating.replace(/[×÷+-]$/, input)
              });
            } else {
              this.setState({
                display: input,
                operating: this.state.operating + input,
            });
          }
          break;
        case "=":
          if (!this.state.calculated) this.calculateResult();      
          break;
        default:
          return;
      }
    }
  }
  calculateResult = () => {
    let nums = [];
    let ops;
    nums.push(...this.state.operating.split(/[×÷+-]/));
    ops = this.state.operating.match(/[×÷+-]/g);

    // In case a single operation is entered
    if ((nums[0] === '' && nums[1] === '') || 
    (nums[0] === '' && ops === null)) {
      this.setState({
        display: NaN,
        operating: '=' + NaN,
        calculated: true
      });
      return;
    // In case a single number is entered
    } else if (ops === null || nums.length === 1) {
      this.setState({
        operating: this.state.operating + '=' + this.state.display,
        calculated: true
      });
      return;
    }
    let result = nums.shift();
    let currentOp, aux;

    if (this.state.operating[0] === '-') {
      ops.shift();
      result = '-' + nums.shift();
    }

    while(nums.length) {
      console.log("lol");

      if (ops.length) currentOp = ops.shift();
      if (nums.length) aux = nums.shift();
      if (nums.length && aux === '') aux = nums.shift();

      switch(currentOp) {
        case '+':
          if (result.match(/\./) || aux.match(/\./)) {
            result = parseFloat(result) + parseFloat(aux);
            result = result.toPrecision(3);
          } else {
            result = parseInt(result) + parseInt(aux);
          }
          break;
        case '-':
          if (result.match(/\./) || aux.match(/\./)) {
            result = parseFloat(result) - parseFloat(aux);
            result = result.toPrecision(3);
          } else {
            result = parseInt(result) - parseInt(aux);
          }
          break;
        case '×':
          if (result.match(/\./) || aux.match(/\./)) {
            result = parseFloat(result) * parseFloat(aux);
            result = result.toPrecision(3);
          } else {
            result = parseInt(result) * parseInt(aux);
          }
          break;
        case '÷':
          if (result.match(/\./) || aux.match(/\./)) {
            result = parseFloat(result) / parseFloat(aux);
            result = result.toPrecision(3);
          } else {
            result = parseInt(result) / parseInt(aux);
          }
          break;
        default:
          return;
      }
      
      result = result.toString();
    }

    if (result.match(/\./)) {
      console.log("lol");

      let decimal = false;

      for (let i = result.indexOf('.') + 1; i < result.length; i++) {
        console.log(i);

        if (result[i] !== '0') {
          decimal = true;
          break;
        }
      }

      if (!decimal) {
        result = parseInt(result);
        result = result.toString();
      }
    }

    if (ops.length) {
      result = '-' + result;
    }

    this.setState({
      display: result,
      operating: this.state.operating + '=' + result,
      calculated: true
    });
  }

  render() {
    const sym1 = symbols.slice(0,2);
    const sym2 = symbols.slice(2,);

    return (
      <div id="calculator">
        <div id="screen">
          <div id="operation">{this.state.operating}</div>
          <div id="display">{this.state.display}</div>
        </div>
        <div id="buttons">
          <SymbolsPad
            symbolsList={sym1}
            containerId="sym-pad-1"
            updateDisplay={this.updateDisplay}
          />
          <SymbolsPad
            symbolsList={sym2}
            containerId="sym-pad-2"
            updateDisplay={this.updateDisplay}
          />
          <NumPad 
            numbersList={numbers}
            updateDisplay={this.updateDisplay}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("root")
);