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

    //main input function
    addValue(input = '1') {
        const self = this;
        const rep_operator = /^[\+\-\*\/]*$/;
        const rep_decimal = /\./;
        let { inputGroup, inputValues, answered } = self.state;
        inputValues[inputGroup] = inputValues[inputGroup] || '';

        function roundStringNum(input = '') {
            return parseFloat(input).toFixed(12).toString();
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

    //Check and see the input does not exceed the min/max number
    filterMinMax(input = '0') {
        const { answered } = this.state;
        let getFloat = parseFloat(input);
        let decimals = 0;
        if (input.match(/\./)) {
            decimals = input.split('.')[1].length || 0;
        }
        if (getFloat < 0.000000000001) {
            return '0';
        }
        if (getFloat >= Number.MAX_SAFE_INTEGER) {
            this.setState({ answered: 2 });
            return 'OUT OF BOUND';
        }
        return getFloat.toFixed(decimals).toString();
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
            output = this.filterMinMax(solution.toString()); //(solution > Number.MAX_SAFE_INTEGER) ? "Out of Bound" : solution.toString();
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
        const rep_negative = /\-\d*(\.?\d+)/;
        const rep_decimal = /\./;
        let contentResult: JSX.Element[] = [];

        function formatThousands(input = '0') {
            const explode = input.split('.')[1] || '';
            let specialDecimal = '';
            if (input.match(rep_decimal) && explode.length === 0) {
                specialDecimal = '.';
            }
            const options = { 
                minimumFractionDigits: explode.length
            };
            return input.replace(/\B(?=(\d{3})+(?!\d))/g, " ");//Number(input).toLocaleString('en', options) + specialDecimal;
        }

        inputValues.forEach((getValue, index) => {
            let formatted = formatThousands(getValue);
            if (index == 1) {
                formatted = getValue; //if this is an operator
            } else if (formatted.match(rep_negative)) {
                formatted = `(${formatted})`;
            }
            contentResult.push(<span className="calc-display-text">{formatted}</span>);
        });
        return contentResult;
    }
    
    render() {
        const calcAnswer = this.formatNumbers(); //this.state.inputValues.join(''); //
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