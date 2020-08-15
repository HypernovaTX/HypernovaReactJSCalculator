import React, { useState } from 'react';
import { type } from 'os';
type Props = {showDisplay: boolean};
type State = {inputValues: string[]};
export class Calculator extends React.Component<Props, State> {
    constructor(p: Props) {
        super(p);
        this.state = {
            inputValues: []
        }
        this.addValue = this.addValue.bind(this);
        this.renderButtons = this.renderButtons.bind(this);
        this.flipValue = this.flipValue.bind(this);
    }

    addValue(input = '1') {
        let tmp = this.state.inputValues;
        tmp.push(input);
        this.setState({inputValues: tmp});
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
        let buttonContent = '789+456-123x0.±/';
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