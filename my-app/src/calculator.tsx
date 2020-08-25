import React, { useState } from 'react';
type Props = {showDisplay: boolean};
type State = {inputValues: string[], inputGroup: number};
export class Calculator extends React.Component<Props, State> {
    constructor(p: Props) {
        super(p);
        this.state = {
            inputValues: [],
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
        
        //determine if it's a number or an operator 
        if (input.match(/^[\+\-\*\/]*$/)) {
            if (tmpVal[tmpIndex].match(/^[\+\-\*\/]*$/)) {
                tmpVal[tmpIndex] = input;
            } else {
                tmpIndex ++;
                tmpVal[tmpIndex] = input;
            }
        } else {
            if (tmpVal[tmpIndex].match(/^[\+\-\*\/]*$/)) {
                tmpIndex ++;
                tmpVal[tmpIndex] = '';
            }
            tmpVal[tmpIndex] += input;
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
        let buttonContent = '789+456-123*0.±/';
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