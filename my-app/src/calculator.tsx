import React, { useState } from 'react';
import { stringify } from 'querystring';
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
        let tmpVal = this.state.inputValues
        if (tmpVal[tmpIndex] == undefined) {
            tmpVal[tmpIndex] = '';
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
                tmpVal[tmpIndex] = roundNum.toString();
                tmpIndex ++;
                tmpVal[tmpIndex] = input;
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
                if (tmpVal[tmpIndex] == '0' && input != '.') {
                    tmpVal[tmpIndex] = input;
                } else {
                    tmpVal[tmpIndex] += input;
                }
            } else if (input == '0' && tmpVal[tmpIndex].match(/\./)) {
                tmpVal[tmpIndex] += input;
            }
        }
        
        //tmpVal.push(input); //old method to insert inputs into array
        this.setState({inputValues: tmpVal, inputGroup: tmpIndex});
    }

    assemble() {

    }

    flipValue() {
        let tmp = this.state.inputValues;
        if (this.state.inputValues[0] != "-") {
            tmp.unshift('-');
        } else {
            tmp.shift();
        }
        this.setState({inputValues: tmp});
    }

    renderButtons() {
        let buttonContent = '789+456-123*±0./';
        let contentResult = [];
        for (let i = 0; i < buttonContent.length; i++) {
            const element = buttonContent.charAt(i);
            if (element != '±') {
                contentResult.push(<div className='calc-button' onClick={() => this.addValue(element)}>{element}</div>);
            } else {
                contentResult.push(<div className='calc-button' onClick={() => this.flipValue()}>{element}</div>);
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