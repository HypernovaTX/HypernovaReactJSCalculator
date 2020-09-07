import React from 'react'; //, { useState }
import { isNull } from 'util';
//import { stringify } from 'querystring';
//import { exit, nextTick } from 'process';
type Props = {showDisplay: boolean};
type State = {
    inputValues: string[],
    inputGroup: number,
    answered: number,
    fontSize: number,
    fontPadding: number
};

export class Calculator extends React.Component<Props, State> {
    private calcDisplayOuter: React.RefObject<HTMLDivElement>;

    constructor(p: Props) {
        super(p);
        this.state = {
            inputValues: ['0'],
            inputGroup: 0,
            answered: 0, //0 - false, 1 - true, 2 - alt true
            fontSize: 32,
            fontPadding: 4
        }

        this.addValue = this.addValue.bind(this);
        this.filterMinMax = this.filterMinMax.bind(this);
        this.calculate = this.calculate.bind(this);
        this.deleteValues = this.deleteValues.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this.squareRoot = this.squareRoot.bind(this);
        this.flipValue = this.flipValue.bind(this);
        this.formatThousands = this.formatThousands.bind(this);
        this.formatNumbers = this.formatNumbers.bind(this);
        this.renderButtons = this.renderButtons.bind(this);

        this.calcDisplayOuter = React.createRef();
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
        if (inputValues[inputGroup].length < 14) {
            this.adjustFontSize(inputValues, true);
        }
    }

    //Check and see the input does not exceed the min/max number
    filterMinMax(input = '0') {
        let getFloat = parseFloat(input);
        let decimals = 0;
        if (input.match(/\./)) {
            decimals = Math.min(10, input.split('.')[1].length) || 0;
        }
        if (getFloat < 0.0000000001) {
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
        if (endEquation === true && answered === 0) {
            answered = 1;
            inputGroup = 0;
        }
        this.setState({ inputValues, inputGroup, answered });
        this.adjustFontSize(inputValues, true);

        return output;
    }

    //when "<x|" is pressed
    deleteValues() {
        let { inputGroup, inputValues, answered } = this.state;
        if (answered === 2) {
            return;
        } else {
            answered = 0;
        }
        if (inputValues[inputGroup] === '') {
            inputGroup -= 1;
        }
        if (inputGroup >= 0) {
            inputValues[inputGroup] = inputValues[inputGroup].slice(0, -1);
            if (inputValues[0] === '') {
                inputValues[0] = '0';
            }
            this.setState({ inputValues, inputGroup });
        }
        this.adjustFontSize(inputValues, true);
    }

    //When "C" is pressed
    clearAll() {
        this.setState({ inputValues: ['0'], inputGroup: 0, answered: 0 , fontSize: 32});
    }

    //pretty obvious
    squareRoot() {
        let { inputValues, inputGroup, answered } = this.state;
        let solution = 0;
        solution = parseFloat((inputGroup === 2) ? this.calculate(false) : inputValues[0]);
        if (solution < 0 || answered === 2) {
            answered = 2;
            inputValues = ["ERROR"];
        } else {
            answered = 1;
            let rawOutput = this.filterMinMax(Math.sqrt(solution).toString());
            inputValues = [rawOutput];
        }
        this.setState({ inputValues, inputGroup, answered });
        this.adjustFontSize(inputValues, true);
    }

    //flip between +/- 
    flipValue() {
        const { inputGroup, inputValues, answered } = this.state;
        const index = (inputGroup === 1) ? 0 : inputGroup;
        const value = parseFloat(inputValues[index]);

        inputValues[index] = (answered === 2) ? inputValues[index] : `${-1 * value}`;
        this.setState({ inputValues });
        this.adjustFontSize(inputValues, true);
    }

    formatThousands(input = '0') {
        const firstHalf = input.split('.')[0] || input;
        const secondHalf = input.split('.')[1] || '';
        const rep_decimal = /\./;
        let pointDecimal = '';
        if (input.match(rep_decimal)) {
            pointDecimal = '.';
        }
        return firstHalf.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + pointDecimal + secondHalf;//Number(input).toLocaleString('en', options) + specialDecimal;
    }

    renderButtons() {
        const buttonContent = 'C⌫√+789-456*123/±0.=';
        let contentResult = [];
        for (let i = 0; i < buttonContent.length; i++) {
            const element = buttonContent.charAt(i);
            switch (element) {
                case ('C'):
                    contentResult.push(
                    <div className='calc-button' key={'calc-button-' + element} onClick={() => this.clearAll()}>
                        {element}
                    </div>);
                    break;
                case ('='):
                    contentResult.push(
                    <div className='calc-button' key={'calc-button-' + element} onClick={() => this.calculate(true)}>
                        {element}
                    </div>);
                    break;
                case ('±'):
                    contentResult.push(
                    <div className='calc-button' key={'calc-button-flip'} onClick={() => this.flipValue()}>
                        {element}
                    </div>);
                    break;
                case ('√'):
                    contentResult.push(
                    <div className='calc-button' key={'calc-button-sqr' + element} onClick={() => this.squareRoot()}>
                        {element}
                    </div>);
                    break;
                case ('⌫'):
                    contentResult.push(
                    <div className='calc-button' key={'calc-button-del'} onClick={() => this.deleteValues()}>
                        {element}
                    </div>);
                    break;
                default:
                    contentResult.push(
                    <div className='calc-button' key={'calc-button-' + element} onClick={() => this.addValue(element)}>
                        {element}
                    </div>);
                    break;
            }
        }
        return contentResult;
    }

    

    formatNumbers() {
        const { inputValues, fontPadding } = this.state;
        const rep_negative = /\-\d*(\.?\d+)/;
        const spanStyle = {
            paddingLeft: fontPadding,
            paddingRight: fontPadding
        }
        let contentResult: JSX.Element[] = [];

        inputValues.forEach((getValue, index) => {
            let formatted = this.formatThousands(getValue);
            if (index === 1) {
                formatted = getValue; //if this is an operator
            } else if (formatted.match(rep_negative)) {
                formatted = `(${formatted})`;
            }
            contentResult.push(
                <span className="calc-display-text" key={formatted + index.toString()} style={spanStyle}>
                    {formatted}
                </span>
            );
        });
        return contentResult;
    }

    adjustFontSize(inputValues = [''], copy = false) {
        let { fontSize, fontPadding } = this.state;
        inputValues = (copy) ? inputValues : this.state.inputValues;
        let textWidth = 0;
        let testSize = fontSize;
        const self = this;
        const outerWidth = this.calcDisplayOuter.current?.clientWidth || 0;

        function get_tex_width(txt = '', font='') {
            let element = document.createElement('canvas');
            let context = element.getContext("2d");
            if (!isNull(context)) {
                context.font = font;
                return context.measureText(txt).width;
            } else {
                return 0;
            }
        }

        function inputValuesWidth(size = 32) {
            let outputWidth = 16; //Give some small roomes for the text to wiggle
            inputValues.forEach((value) => {
                outputWidth += get_tex_width(
                    self.formatThousands(value),
                    size.toString() + "px 'Segoe UI'"
                );
                outputWidth += fontPadding * 2;
            });
            return outputWidth;
        }

        textWidth = inputValuesWidth(fontSize);

        console.log('display outer - ' + outerWidth);
        console.log('text width - ' + textWidth);

        if (inputValuesWidth(testSize) <= outerWidth) {
            fontSize = 32;
            this.setState({ fontSize });
            console.log('GENERAL text length is smaller than display');
        }
        while (inputValuesWidth(testSize) > outerWidth) {
            testSize --;
            console.log('Current text length is smaller than display');
        }
        while (inputValuesWidth(testSize) < outerWidth && testSize < 32) {
            testSize ++;
            console.log('Text length is LARGER than display');
        }
        fontSize = testSize;
        
        this.setState({ fontSize });
    }
    
    render() {
        //const calcAnswer = this.state.inputValues.join('');
        let display = <React.Fragment/>;
        
        const styleDisplayFont = {
            fontSize: this.state.fontSize.toString() + 'px'
        }

        if (this.props.showDisplay) {
            display = <div id='calc-display-outer' key='calcDisplayOuter' ref={this.calcDisplayOuter}>
                <div id='calc-display' key='calcDisplay'>
                    <div id='calc-display-inner' key='calcDisplayInner' style={styleDisplayFont}>
                        { this.formatNumbers() }
                    </div>
                </div>
            </div>;
        }

        return ( //insert table between <div>
            <div className='calc-body' key='calcMainBody'>
                {display}
                <div className='calc-keypad' key='calcKeyBody'>
                    {this.renderButtons()}
                </div>
            </div>
        );
    }
}