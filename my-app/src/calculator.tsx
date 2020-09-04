import React, { useState } from 'react';
import { stringify } from 'querystring';
import { exit, nextTick } from 'process';
type Props = {showDisplay: boolean};
type State = {inputValues: string[], inputGroup: number, answered: number};
export class Calculator extends React.Component<Props, State> {
    constructor(p: Props) {
        super(p);
        this.state = {
            inputValues: ['0'],
            inputGroup: 0,
            answered: 0 //0 - false, 1 - true, 2 - alt true
        }
        this.addValue = this.addValue.bind(this);
        this.renderButtons = this.renderButtons.bind(this);
        this.flipValue = this.flipValue.bind(this);
    }
    /* To-dos (09/01/2020)
    - DONE - Add a function to check for largest numbers with "Number.MAX_SAFE_INTEGER"
    - DONE - Add a feature where when inputting numbers, the input will stop when it reaches the largest number
    - DONE - Fix the bug where any number below 0.1 doesn't work
    - If the answer is beyond the largest number, it will return as "out of bound"
    - Add the lowest limit for decimals
    - DONE - Fix squareroot of NaN and negative numbers
    - DONE - User should not be able to delete the message "ERROR" using backspace
    */

    //main input function
    addValue(input = '1') {
        const self = this;
        const rep_operator = /^[\+\-\*\/]*$/;
        const rep_decimal = /\./;
        const calculate = () => this.calculate(false);
        let { inputGroup, inputValues, answered } = self.state;
        inputValues[inputGroup] = inputValues[inputGroup] || '';

        function roundStringNum(input = '') {
            return parseFloat(input).toString();
        }

        function addOperator(currentInput = '', lastInput = '') {
            if (answered === 2) {
                return;
            }
            if (lastInput.match(rep_operator)) {
                inputValues[inputGroup] = currentInput;
            } else {
                roundStringNum();
                inputGroup ++;
                if (inputGroup >= 3) {
                    inputValues = [self.calculate(false), currentInput, '']
                    inputGroup = 1;
                } else {
                    inputValues = [inputValues[inputGroup - 1], currentInput];
                }
            }
            answered = 0;
        }

        function addFloat(currentInput = '') {
            if (answered === 2) {
                return;
            }

            if (answered === 1) {
                inputGroup = 0;
                inputValues = ['0'];
                answered = 0;
                console.log(self.clearAll);
            }
            if (inputValues[inputGroup].match(rep_operator) && inputValues[inputGroup] !== '') {
                inputGroup ++;
                inputValues[inputGroup] = '';
            }
            if (currentInput === '0') {
                addZero();
            } else if (currentInput.match(rep_decimal)) {
                addDecimal();
            } else {
                addNumber(currentInput);
            }
        }

        function addZero(check = inputValues[inputGroup]) {
            if (check === '0' || answered === 2) {
                return;
            }
            if (check.match(rep_decimal)
            || check.charAt(0) !== '0') {
                inputValues[inputGroup] += '0';
            }
        }

        function addDecimal(check = inputValues[inputGroup]) {
            if (!check.match(rep_decimal) && answered !== 2) {
                inputValues[inputGroup] += '.';
            }
        }

        function addNumber(currentInput = '', check = inputValues[inputGroup]) {
            if (check === '0' || check === '') {
                inputValues[inputGroup] = '';
            }
            if (inputValues[inputGroup].length < 14) {
                inputValues[inputGroup] += currentInput;
            }
        }

        //ADD
        if (input.match(rep_operator)) {
            addOperator(input, inputValues[inputGroup]);
        } else {
            addFloat(input);
        }
        
        this.setState({ inputValues, inputGroup, answered });
    }

    //Ensure the input does not exceed the max number
    trimNum(input = '0') {
        return Math.min(parseFloat(input), 99999999999999);
    }

    //self explainatory function
    calculate(endEquation = false) {
        let { inputValues, inputGroup, answered } = this.state;
        const value_1 = parseFloat(inputValues[0]);
        const operator = inputValues[1];
        const value_2 = parseFloat(inputValues[2]);
        let solution = 0;
        let output = '';
        
        //Prevent multi "=" button bug
        if (Number.isNaN(value_2)) {
            this.setState({ inputValues });
            return inputValues[0];
        }

        //do the calculation
        switch (operator) {
            case ('+'): solution = value_1 + value_2; break;
            case ('-'): solution = value_1 - value_2; break;
            case ('*'): solution = value_1 * value_2; break;
            case ('/'): {
                if (value_2 !== 0) {
                    solution = value_1 / value_2;
                } else {
                    solution = NaN;
                    output = "ERROR";
                    answered = 2;
                }
                break;
            }
        }

        //prevent the number exceeding the safe integer territory
        if (!Number.isNaN(solution)) {
            output = (solution > Number.MAX_SAFE_INTEGER) ? "Out of Bound" : solution.toString();
        }
        
        inputValues = [output];
        inputGroup = 1;
        if (endEquation == true && answered == 0) {
            answered = 1;
            inputGroup = 0;
        }
        this.setState({ inputValues, inputGroup, answered });
        
        return output;
    }

    //when "<x|" is pressed
    deleteValues() {
        let { inputGroup, inputValues, answered } = this.state;
        if (answered === 2) {
            return;
        }
        if (inputValues[inputGroup] == '') {
            inputGroup -= 1;
        }
        if (inputGroup >= 0) {
            inputValues[inputGroup] = inputValues[inputGroup].slice(0, -1);
            if (inputValues[0] == '') {
                inputValues[0] = '0';
            }
            this.setState({ inputValues, inputGroup });
        }
    }

    //When "C" is pressed
    clearAll() {
        this.setState({ inputValues: ['0'], inputGroup: 0, answered: 0 });
    }

    //pretty obvious
    squareRoot() {
        let { inputValues, inputGroup, answered } = this.state;
        let solution = 0;
        solution = parseInt((inputGroup === 2) ? this.calculate() : inputValues[0]);
        if (solution < 0 || answered === 2) {
            answered = 2;
            inputValues = ["ERROR"];
        } else {
            answered = 1;
            inputValues = [Math.sqrt(solution).toString()];
        }
        this.setState({ inputValues, inputGroup, answered });
    }

    //flip between +/- 
    flipValue() {
        const { inputGroup, inputValues, answered } = this.state;
        const index = (inputGroup == 1) ? 0 : inputGroup;
        const value = parseFloat(inputValues[index]);

        inputValues[index] = (answered === 2) ? inputValues[index] : `${-1 * value}`;
        this.setState({ inputValues });
    }

    renderButtons() {
        const buttonContent = 'C⌫√+789-456*123/±0.=';
        let contentResult = [];
        for (let i = 0; i < buttonContent.length; i++) {
            const element = buttonContent.charAt(i);
            switch (element) {
                case ('C'): contentResult.push(<div className='calc-button' onClick={() => this.clearAll()}>{element}</div>); break;
                case ('='): contentResult.push(<div className='calc-button' onClick={() => this.calculate(true)}>{element}</div>); break;
                case ('±'): contentResult.push(<div className='calc-button' onClick={() => this.flipValue()}>{element}</div>); break;
                case ('√'): contentResult.push(<div className='calc-button' onClick={() => this.squareRoot()}>{element}</div>); break;
                case ('⌫'): contentResult.push(<div className='calc-button' onClick={() => this.deleteValues()}>{element}</div>); break;
                default: contentResult.push(<div className='calc-button' onClick={() => this.addValue(element)}>{element}</div>); break;
            }
        }
        return contentResult;
    }

    formatNumbers() {
        const { inputValues } = this.state;
        const options = { 
            minimumFractionDigits: 2,
            maximumFractionDigits: 2 
        };
        const rep_negative = /\-\d*(\.?\d+)/;
        let contentResult: JSX.Element[] = [];
        inputValues.forEach((getNum, index) => {
            let formatted = Number(getNum).toLocaleString('en');
            if (index == 1) {
                formatted = getNum; //if this is an operator
            } else if (formatted.match(rep_negative)) {
                formatted = `(${formatted})`;
            }
            contentResult.push(<span className="calc-display-text">{formatted}</span>);
        });
        return contentResult;
    }
    
    render() {
        const calcAnswer = this.formatNumbers(); //this.state.inputValues.join('');
        let display = <React.Fragment/>;
        

        if (this.props.showDisplay) {
            display = <div className='calc-display'>
                {calcAnswer}
            </div>;
        }
        return ( //insert table between <div>
            <div className='calc-body'>
                {display}
                <div className='calc-keypad'>
                    {this.renderButtons()}
                </div>
            </div>
        );
    }
}