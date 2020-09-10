///Work in progress
import { CalcLogic } from './CalcLogic';

export class CalcEdit {
    static rep_operator() { return /^[\+\-\*\/]*$/; }
    static rep_decimal() { return /\./; }

    //main input function
    static addValue(input = '1', inputValues: string[], inputGroup: number, answered: number) {
        inputValues[inputGroup] = inputValues[inputGroup] || '';

        function addFloat(currentInput = '') {
            if (answered === 2) {
                return;
            }

            if (answered === 1) {
                inputGroup = 0;
                inputValues = ['0'];
                answered = 0;
                //console.log(self.clearAll);
            }
            if (inputValues[inputGroup].match(CalcEdit.rep_operator()) && inputValues[inputGroup] !== '') {
                inputGroup ++;
                inputValues[inputGroup] = '';
            }
            if (currentInput === '0') {
                addZero();
            } else if (currentInput.match(CalcEdit.rep_decimal())) {
                addDecimal();
            } else {
                addNumber(currentInput);
            }
        }

        //ADD
        if (input.match(CalcEdit.rep_operator())) {
            return CalcEdit.addOperator(input, inputValues, inputGroup, answered);
        } else {
            addFloat(input);
        }
    }

    /** Used to filter number of decimals
     * @param {String} input - The number (in String) that goes in
     * @returns {String} - The filter number (in String)
     * @constant {Number} threshold - The max number of digits for output (you can ajust it within this function)
     */
    static roundStringNum(input = '') {
        const threshold = 12;
        return parseFloat(input).toFixed(threshold).toString();
    }

    /** Add an operator (+, -, *, /) to the equation (inputValues)
     * @param {String} currentInput - The operator that is added to the equation
     * @param {String[]} inputValues - (from STATE) array of numbers and operaters
     * @param {Number} inputGroup - (from STATE) current position of the array from inputValues
     * @param {Number} answered - (from STATE) has the equation ended of not
     * @returns {Object} - As in { inputValues, inputGroup, answered}
     */
    static addOperator(currentInput = '', inputValues: string[], inputGroup: number, answered: number) {
        //Find out the last input (constant)
        const lastInput = inputValues[inputGroup];

        //don't do anything if there's error
        if (answered === 2) {
            return { inputValues, inputGroup, answered };
        }
        
        //overwrite the operater if the last one is an operator
        if (lastInput.match(CalcEdit.rep_operator())) {
            inputValues[inputGroup] = currentInput;
        }

        //add operator if the last input is a number
        else {
            CalcEdit.roundStringNum();
            inputGroup ++;
            //calculate if there's already a pending equation before adding an operator
            if (inputGroup >= 3) {
                inputValues = [CalcLogic.calculate(false, inputValues, inputGroup, answered).inputValues[0], currentInput, ''];
                inputGroup = 1;
            }
            //if not, just add an operator
            else {
                inputValues = [inputValues[inputGroup - 1], currentInput];
            }
        }
        answered = 0;
        return { inputValues, inputGroup, answered };
    }

    static addZero(inputValues: String[], inputGroup: Number) {
        const

        if (check === '0' || answered === 2) {
            return;
        }
        if (check.match(CalcEdit.rep_decimal())
        || check.charAt(0) !== '0') {
            inputValues[inputGroup] += '0';
        }
    }

    function addDecimal(check = inputValues[inputGroup]) {
        if (!check.match(CalcEdit.rep_decimal()) && answered !== 2) {
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
}