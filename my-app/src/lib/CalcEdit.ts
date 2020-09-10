///Work in progress
import { CalcLogic } from './CalcLogic';

export class CalcEdit {
    static rep_operator() { return /^[\+\-\*\/]*$/; }
    static rep_decimal() { return /\./; }

    //main input function
    static addValue(input = '1', inputValues: string[], inputGroup: number, answered: number) {
        inputValues[inputGroup] = inputValues[inputGroup] || '';

        //ADD
        if (input.match(CalcEdit.rep_operator())) {
            return CalcEdit.addOperator(input, inputValues, inputGroup, answered);
        } else {
            return CalcEdit.addFloat(input, inputValues, inputGroup, answered);
        }
    }

    /** Used to filter number of decimals
     * @param {string} input - The number (in string) that goes in
     * @returns {string} - The filter number (in string)
     * @constant {number} threshold - The max number of digits for output (you can ajust it within this function)
     */
    static roundStringNum(input = '') {
        const threshold = 12;
        return parseFloat(input).toFixed(threshold).toString();
    }

    /** Add an OPERATOR (+, -, *, /) to the equation (inputValues)
     * @param {string} currentInput - The operator that is added to the equation
     * @param {string[]} inputValues - (from STATE) array of numbers and operaters
     * @param {number} inputGroup - (from STATE) current position of the array from inputValues
     * @param {number} answered - (from STATE) has the equation ended of not
     * @returns {object} - As in { inputValues, inputGroup, answered }
     * NOTE: This function is primarily used by the function "AddValue"
     */
    static addOperator(currentInput = '', inputValues: string[], inputGroup: number, answered: number) {
        //Find out the last input (constant)
        const lastInput = inputValues[inputGroup];

        //don't do anything if there's error
        if (answered === 2) { return { inputValues, inputGroup, answered }; }
        
        //overwrite the OPERATOR if the last one is an OPERATOR
        if (lastInput.match(CalcEdit.rep_operator())) { inputValues[inputGroup] = currentInput; }
        //add OPERATOR if the last input is a number
        else {
            CalcEdit.roundStringNum();
            inputGroup ++;
            //calculate if there's already a pending equation before adding an OPERATOR
            if (inputGroup >= 3) {
                inputValues = [CalcLogic.calculate(false, inputValues, inputGroup, answered).inputValues[0], currentInput, ''];
                inputGroup = 1;
            }
            //if not, just add an OPERATOR
            else { inputValues = [inputValues[inputGroup - 1], currentInput]; }
        }
        answered = 0;
        return { inputValues, inputGroup, answered };
    }

    /** Add a value to the float ("0-9" and ".") to the equation (inputValues)
     * @param {string} currentInput - The value that is added to the equation
     * @param {string[]} inputValues - (from STATE) array of numbers and operaters
     * @param {number} inputGroup - (from STATE) current position of the array from inputValues
     * @param {number} answered - (from STATE) has the equation ended of not
     * @returns {object} - As in { inputValues, inputGroup, answered }
     * NOTE: This function is primarily used by the function "AddValue"
     */
    static addFloat(currentInput = '', inputValues: string[], inputGroup: number, answered: number) {
        //When there's error, just do nothing and return as it is
        if (answered === 2) { return { inputValues, inputGroup, answered }; }

        //Clear the equation if it's already solved and the user attempt to add a number instead of an operator
        if (answered === 1) {
            inputGroup = 0;
            inputValues = ['0'];
            answered = 0;
        }

        //Jump to the next index of the equation if the current index of the equation is an operator
        if (inputValues[inputGroup].match(CalcEdit.rep_operator()) && inputValues[inputGroup] !== '') {
            inputGroup ++;
            inputValues[inputGroup] = '';
        }

        //Find out what kind of input need to add to the current index of the equation (inputValues)
        //Then run the right function to get the expected return result
        if (currentInput === '0') { return CalcEdit.addZero(inputValues, inputGroup, answered); }
        else if (currentInput.match(CalcEdit.rep_decimal())) { return CalcEdit.addDecimal(inputValues, inputGroup, answered); }
        else { return CalcEdit.addNumber(currentInput, inputValues, inputGroup, answered); }
    }

    /** Add a ZERO to the equation (inputValues)
     * @param {string[]} inputValues - (from STATE) array of numbers and operaters
     * @param {number} inputGroup - (from STATE) current position of the array from inputValues
     * @param {number} answered - (from STATE) has the equation ended of not
     * @returns {object} - As in { inputValues, inputGroup, answered }
     * NOTE: this will be primarily used by the function "addFloat"
     */
    static addZero(inputValues: string[], inputGroup: number, answered: number) {
        //Find out the current index of the equation (inputValues)
        const currentValue = inputValues[inputGroup];

        //Add the ZERO if the condition is correct
        //Do not add ZERO if it's ERROR or the current value is just plain "0"
        if ((currentValue.match(CalcEdit.rep_decimal()) || currentValue.charAt(0) !== '0')
        && (currentValue !== '0')
        && (answered !== 2)) {
            inputValues[inputGroup] += '0';
        }

        return { inputValues, inputGroup, answered };
    }

    /** Add a DECIMAL to the equation (inputValues)
     * @param {string[]} inputValues - (from STATE) array of numbers and operaters
     * @param {number} inputGroup - (from STATE) current position of the array from inputValues
     * @param {number} answered - (from STATE) has the equation ended of not
     * @returns {object} - As in { inputValues, inputGroup, answered}
     * NOTE: this will be primarily used by the function "addFloat"
     */
    static addDecimal(inputValues: string[], inputGroup: number, answered: number) {
        //Find out the current index of the equation (inputValues)
        const currentValue = inputValues[inputGroup];

        //Add the DECIMAL point as long there's none found in the current index of the equation (inputValues)
        if (!currentValue.match(CalcEdit.rep_decimal()) && answered !== 2) {
            inputValues[inputGroup] += '.';
        }

        return { inputValues, inputGroup, answered };
    }

    /** Add a NUMBER (except zero) to the equation (inputValues)
     * @param {string} currentInput - The number (in string) that is added to the equation
     * @param {string[]} inputValues - (from STATE) array of numbers and operaters
     * @param {number} inputGroup - (from STATE) current position of the array from inputValues
     * @param {number} answered - (from STATE) has the equation ended of not
     * @returns {object} - As in { inputValues, inputGroup, answered }
     * @constant {number} currentValue - The max number of char (including ".") for the current index of inputValues
     * NOTE: this will be primarily used by the function "addFloat"
     */
    static addNumber(currentInput = '', inputValues: string[], inputGroup: number, answered: number) {
        //Find out the current index of the equation (inputValues)
        const currentValue = inputValues[inputGroup];
        const maxChar = 14;

        //Overwrite if the current index of the equation (inputValues) is plain ZERO or just empty before adding a number
        if (currentValue === '0' || currentValue === '') { inputValues[inputGroup] = ''; }

        //Add the number to the current index of the equation (inputValues)
        if (inputValues[inputGroup].length < maxChar) { inputValues[inputGroup] += currentInput; }

        return { inputValues, inputGroup, answered };
    }
}