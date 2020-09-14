import React from 'react';
import { CalcLogic } from './lib/CalcLogic';
import { CalcEdit } from './lib/CalcEdit';
type Props = { showDisplay: boolean };
type State = {
    inputValues: string[],  //The EQUATION in arrays (example: ["123", "+", "456"])
    inputGroup: number,     //The current array index of the equation
    answered: number,       //Solved state of the equation (0 - unsolved, 1 - solved, 2- ERROR)
    fontSize: number,       //The size of the font for the calculator display
    fontPadding: number     //The spacing on the display between the valus of the equations
};

export class Calculator extends React.Component<Props, State> {
    private calcDisplayOuter: React.RefObject<HTMLDivElement>;

    constructor(p: Props) {
        super(p);
        this.state = {
            inputValues: ['0'],
            inputGroup: 0,
            answered: 0, //0 - false, 1 - true, 2 - ERROR
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
        this.adjustFontSize = this.adjustFontSize.bind(this);

        this.calcDisplayOuter = React.createRef();
    }

    /** The main function to add value to the equation (inputValues)
     * @param {string} input - The value to add to the equation (inputValues)
    */
    addValue(input = '1') {
        let { inputGroup, inputValues, answered } = this.state;

        //call the external function to add the value
        const addedValue = CalcEdit.addValue(input, inputValues, inputGroup, answered);
        this.setState({
            inputValues: addedValue.inputValues,
            inputGroup: addedValue.inputGroup,
            answered: addedValue.answered
        });

        //Resize the font if needed
        if (inputValues[inputGroup].length <= 14) {
            this.adjustFontSize(inputValues, true);
        }
    }

    //Check and see the input does not exceed the min/max number
    filterMinMax(input = '0') {
        return CalcLogic.filterMinMax(input);
    }

    /** The main function to calculate the equation (inputValues)
     * @param {string} input - The value to add to the equation (inputValues)
    */
    calculate(endEquation = false) {
        let { inputValues, inputGroup, answered } = this.state;
        
        let output = CalcLogic.calculate(endEquation, inputValues, inputGroup, answered ) ;
        if (output.inputValues[0] === "OUT OF BOUND") {
            output.answered = 2;
        }

        this.setState({
            inputValues: output.inputValues,
            inputGroup: output.inputGroup,
            answered: output.answered
        });
        this.adjustFontSize(output.inputValues, true);

        return output.inputValues;
    }

    //when "⌫" is pressed
    deleteValues() {
        const { inputGroup, inputValues, answered } = this.state;
        const output = CalcEdit.deleteValues(inputValues, inputGroup, answered);
        this.setState({
            inputValues: output.inputValues,
            inputGroup: output.inputGroup,
            answered: output.answered
        });
        this.adjustFontSize(inputValues, true);
    }

    //When "C" is pressed
    clearAll() {
        this.setState({ inputValues: ['0'], inputGroup: 0, answered: 0 , fontSize: 32});
    }

    //pretty obvious
    squareRoot() {
        const { inputValues, inputGroup, answered } = this.state;
        const output = CalcLogic.squareRoot(inputValues, inputGroup, answered);
        this.setState({
            inputValues: output.inputValues,
            inputGroup: output.inputGroup,
            answered: output.answered
        });
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

    //Add "," for each thousands on the displayed numbers (will not affect inputValues)
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

    //Render the buttons on the calculator
    renderButtons() {
        const buttonContent = 'C⌫√+789-456*123/±0.=';
        const contentResult = [];
        const knownButtons: {[k: string]: ((e: string) => JSX.Element)} = {
            "C": (ele: string) => <div className='calc-button' key={'calc-button-' + ele} onClick={() => this.clearAll()}>{ele}</div>,
            "=": (ele: string) => <div className='calc-button' key={'calc-button-' + ele} onClick={() => this.calculate()}>{ele}</div>,
            "±": (ele: string) => <div className='calc-button' key={'calc-button-flip'} onClick={() => this.flipValue()}>{ele}</div>,
            "√": (ele: string) => <div className='calc-button' key={'calc-button-sqr' + ele} onClick={() => this.squareRoot()}>{ele}</div>,
            "⌫": (ele: string) => <div className='calc-button' key={'calc-button-del'} onClick={() => this.deleteValues()}>{ele}</div>,
            "+": (ele: string) => <div className='calc-button' key={'calc-button-' + ele} onClick={() => this.addValue(ele)}>{ele}</div>
        }
        
        for (let i = 0; i < buttonContent.length; i++) {
            let charValue = buttonContent.charAt(i);
            let element = charValue in knownButtons ? charValue : '+';
            let button = knownButtons[element];
            contentResult.push(button(charValue));

        }
        return contentResult;
    }

    //Fine tuning the display of the calculator
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
                <span className="calc-display-text" key={getValue + index.toString()} style={spanStyle}>
                    {formatted}
                </span>
            );
        });
        return contentResult;
    }

    //Resize the font of the display so the equation fits in the calculator display container
    adjustFontSize(inputValues = [''], copy = false) {
        let { fontSize, fontPadding } = this.state;
        inputValues = (copy) ? inputValues : this.state.inputValues;
        let textWidth = 0;
        let testSize = fontSize;
        const self = this;
        const outerWidth = this.calcDisplayOuter.current?.clientWidth || 0;
        const rep_negative = /\-\d*(\.?\d+)/;

        function get_tex_width(txt = '', font='') {
            let element = document.createElement('canvas');
            let context = element.getContext("2d");
            if (context !== null && context !== undefined) {
                context.font = font;
                return context.measureText(txt).width;
            } else {
                return 0;
            }
        }

        function inputValuesWidth(size = 32) {
            let outputWidth = 16; //Give some small roomes for the text to wiggle
            inputValues.forEach((value) => {
                if (value.match(rep_negative)) {
                    value = `(${value})`;
                }
                outputWidth += get_tex_width(
                    self.formatThousands(value),
                    size.toString() + "px 'Segoe UI'"
                );
                outputWidth += fontPadding * 2;
            });
            return outputWidth;
        }

        textWidth = inputValuesWidth(fontSize);

        if (outerWidth <= 0) {
            return; //exit if it's a test
        }

        if (inputValuesWidth(testSize) <= outerWidth) {
            fontSize = 32;
            this.setState({ fontSize });
        }
        while (inputValuesWidth(testSize) > outerWidth) {
            testSize --;
        }
        while (inputValuesWidth(testSize) < outerWidth && testSize < 32) {
            testSize ++;
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
            display = <div className='calc-display-outer' key='calcDisplayOuter' ref={this.calcDisplayOuter}>
                <div className='calc-display' key='calcDisplay'>
                    <div className='calc-display-inner' key='calcDisplayInner' style={styleDisplayFont}>
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