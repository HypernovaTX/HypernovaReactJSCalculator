import React, { useState } from 'react';
import { stringify } from 'querystring';
import { exit } from 'process';
type Props = {showDisplay: boolean};
type State = {inputValues: string[], inputGroup: number, answered: boolean};
export class Calculator extends React.Component<Props, State> {
    constructor(p: Props) {
        super(p);
        this.state = {
            inputValues: ['0'],
            inputGroup: 0,
            answered: false
        }
        this.addValue = this.addValue.bind(this);
        this.renderButtons = this.renderButtons.bind(this);
        this.flipValue = this.flipValue.bind(this);
    }
    /* To-dos (09/01/2020)
    - Add a function to check for largest numbers with "Number.MAX_SAFE_INTEGER"
    - Add a feature where when inputting numbers, the input will stop when it reaches the largest number
    - If the answer is beyond the largest number, it will return as "out of bound"
    */

    //main input function
    addValue(input = '1') {
        let tmpIndex = this.state.inputGroup;
        let tmpVal = this.state.inputValues;
        if (tmpVal[tmpIndex] == undefined) {
            tmpVal[tmpIndex] = '';
        }

        //SPECIAL PURPOSE INPUTS
        if (input == '±') {
            this.flipValue();
        }
        
        //---- Handles the format ----//
        //If it's an operator: + - * /
        if (input.match(/^[\+\-\*\/]*$/)) {
            //previous input is an operator
            if (tmpVal[tmpIndex].match(/^[\+\-\*\/]*$/)) { 
                tmpVal[tmpIndex] = input;
            }
            //previous input is NOT an operator
            else { 
                let roundNum = parseFloat(tmpVal[tmpIndex]);
                tmpVal[tmpIndex] = roundNum.toString(); //need to round the numbers (to prevent something like: "x.000...")
                tmpIndex ++;
                if (tmpIndex >= 3) {
                    tmpVal[0] = this.calculate();
                    tmpVal[1] = input;
                    tmpVal[2] = '';
                    tmpIndex = 1;
                } else {
                    tmpVal[tmpIndex] = input;
                }
            }

            this.setState({answered: false});
        }
        //NOT an operator (numbers, decimals)
        else {
            //overwrite last answered equation
            //console.log("IsAnswered = " + this.state.answered.toString()); //debug use
            if (this.state.answered == true) {
                this.clearAll();
                tmpIndex = 0;
                tmpVal = [''];
            }
            //reformat a new set of numbers if the previous input is an operator
            if (tmpVal[tmpIndex].match(/^[\+\-\*\/]*$/) && tmpVal[tmpIndex] != '') {
                tmpIndex ++;
                tmpVal[tmpIndex] = '';
            }
            //add the number from the input (also make sure we don't get 000...)
            if (input != '0') {
                if (parseFloat(tmpVal[tmpIndex]) == 0 && tmpVal[tmpIndex] != "0." && input != '.') {
                    tmpVal[tmpIndex] = input;
                } else {
                    if (input == '.' && !(tmpVal[tmpIndex].match(/\./))) {
                        tmpVal[tmpIndex] += input;
                    }
                    else if (input != '.') {
                        tmpVal[tmpIndex] += input;
                    }
                }
            } else if (input == '0' && (tmpVal[tmpIndex].match(/\./) || tmpVal[tmpIndex] == '' || tmpVal[tmpIndex] != '0')) {
                tmpVal[tmpIndex] += input;
            }
        }
        
        //tmpVal.push(input); //old method to insert inputs into array
        this.setState({inputValues: tmpVal, inputGroup: tmpIndex});
    }

    calculate(endEquation = false) {
        let firstVal = parseFloat(this.state.inputValues[0]);
        let numOperator = this.state.inputValues[1];
        let secondVal = parseFloat(this.state.inputValues[2]);
        let answer = 0;
        
        //Prevent multi "=" button bug
        //console.log('2ndval = ' + secondVal); //debug purpose
        if (secondVal.toString() == 'NaN') {
            this.setState({inputValues: [firstVal.toString()]});
            return this.state.inputValues[0];
        }

        //do the calculation
        switch (numOperator) {
            case ('+'): answer = firstVal + secondVal; break;
            case ('-'): answer = firstVal - secondVal; break;
            case ('*'): answer = firstVal * secondVal; break;
            case ('/'): answer = firstVal / secondVal; break;
        }


        this.setState({inputValues: [answer.toString()], inputGroup: 1});
        if (endEquation == true) {
            this.setState({answered: true, inputGroup: 0});
        }
        
        return answer.toString();
    }

    //when "<x|" is pressed
    deleteValues() {
        let tmpIndexD = this.state.inputGroup;
        let tmpValD = this.state.inputValues;
        if (tmpValD[tmpIndexD] == '') {
            tmpIndexD -= 1;
        }
        if (tmpIndexD >= 0) {
            tmpValD[tmpIndexD] = tmpValD[tmpIndexD].slice(0, -1);
            if (tmpValD[0] == '') {
                tmpValD[0] = '0';
            }
            this.setState({inputValues: tmpValD, inputGroup: tmpIndexD});
        }
    }

    //When "C" is pressed
    clearAll() {
        this.setState({inputValues: ['0'], inputGroup: 0, answered: false});
    }

    //pretty obvious
    squareRoot() {
        let SRvalue = 0;
        SRvalue = (this.state.inputGroup == 2) ? Math.sqrt(parseInt(this.calculate())) : Math.sqrt(parseInt(this.state.inputValues[0]));
        this.setState({inputValues: [SRvalue.toString()]});
    }

    //flip between +/- 
    flipValue() {
        let chk_index = this.state.inputGroup;
        let tmp_index = (chk_index == 1) ? 0 : chk_index;
        let map_values = this.state.inputValues; 
        let tmp_value = map_values[tmp_index];
        let rxp_minus = /\-/;
        
        function hasMinus(value = '') {
            return value.match(rxp_minus);
        }
        function removeMinus(value = '') {
            return value.replace(rxp_minus, '');
        }

        if (tmp_value != '0') {
            map_values[tmp_index] = (hasMinus(tmp_value))
                ? removeMinus(tmp_value) : `-${tmp_value}`;
            this.setState({inputValues: map_values});
        }
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
            if (element != '') {
                
            } else {
                
            }
        }
        return contentResult;
    }
    
    render() {
        let display = <React.Fragment/>;
        let calcAnswer = this.state.inputValues.join('');

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