import React, { useState } from 'react';
import { stringify } from 'querystring';
import { exit } from 'process';
type Props = {showDisplay: boolean};
type State = {inputValues: string[], inputGroup: number};
export class Calculator extends React.Component<Props, State> {
    constructor(p: Props) {
        super(p);
        this.state = {
            inputValues: ['0'],
            inputGroup: 0
        }
        this.addValue = this.addValue.bind(this);
        this.renderButtons = this.renderButtons.bind(this);
        this.flipValue = this.flipValue.bind(this);
    }

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
                    tmpVal[0] = this.calculate(true);
                    tmpVal[1] = input;
                    tmpVal[2] = '';
                    tmpIndex = 1;
                } else {
                    tmpVal[tmpIndex] = input;
                }
            }
        }
        //NOT an operator (numbers, decimals)
        else {
            //reformat a new set of numbers if the previous input is an operator
            if (tmpVal[tmpIndex].match(/^[\+\-\*\/]*$/)) {
                tmpIndex ++;
                tmpVal[tmpIndex] = '';
            }
            //add the number from the input (also make sure we don't get 000...)
            if (input != '0') {
                if (parseFloat(tmpVal[tmpIndex]) == 0 && input != '.') {
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

    calculate(endEquation = false, operator = '') {
        let firstVal = parseFloat(this.state.inputValues[0]);
        let numOperator = this.state.inputValues[1];
        let secondVal = parseFloat(this.state.inputValues[2]);
        let answer = 0;
        
        console.log('2ndval = ' + secondVal);
        if (secondVal.toString() == 'NaN') {
            this.setState({inputValues: [firstVal.toString()]});
            return this.state.inputValues[0];
        }

        switch (numOperator) {
            case ('+'): answer = firstVal + secondVal; break;
            case ('-'): answer = firstVal - secondVal; break;
            case ('*'): answer = firstVal * secondVal; break;
            case ('/'): answer = firstVal / secondVal; break;
        }

        if (endEquation == true) {
            this.setState({inputValues: [answer.toString()], inputGroup: 1});
        } else {
            this.setState({inputValues: [answer.toString(), operator]});
        }
        
        return answer.toString();
    }

    clearAll() {
        this.setState({inputValues: ['0'], inputGroup: 0});
    }

    squareRoot() {
        let SRvalue = 0;
        if (this.state.inputGroup == 2) {
            SRvalue = Math.sqrt(parseInt(this.calculate(true)));
        } else {
            SRvalue = Math.sqrt(parseInt(this.state.inputValues[0]));
        }
        this.setState({inputValues: [SRvalue.toString()]});
    }

    //flip between +/-
    flipValue() { 
        let tmpValF = this.state.inputValues;
        let tmpIndexF = this.state.inputGroup;
        if (tmpValF[tmpIndexF] != "0") {
            if (tmpIndexF != 1) {
                if (tmpValF[tmpIndexF].match(/\-/)) {
                    tmpValF[tmpIndexF] = tmpValF[tmpIndexF].replace(/\-/, '');
                } else {
                    tmpValF[tmpIndexF] = '-' + tmpValF[tmpIndexF];
                }
            }
            else {
                if (tmpValF[0].match(/\-/)) {
                    tmpValF[0] = tmpValF[0].replace(/\-/, '');
                } else {
                    tmpValF[0] = '-' + tmpValF[0];
                }
            }
        }
        this.setState({inputValues: tmpValF});
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