export class CalcLogic {
    /** solve the equation (inputValues)
     * @param {Boolean} endEquation - whether mark the calculation as a solution or not
     * @param {Array} inputValues - (from STATE) array of numbers and operaters
     * @param {Number} inputGroup - (from STATE) current position of the array from inputValues
     * @param {Number} answered - (from STATE) has the equation ended of not
     * @returns {Object} - As in { inputValues, inputGroup, answered}
     */
    static calculate(endEquation = false, inputValues: string[], inputGroup: number, answered: number) {
        const value_1 = parseFloat(inputValues[0]);
        const operator = inputValues[1];
        const value_2 = parseFloat(inputValues[2]);
        let solution = 0;
        let output = '';
        
        //Don't calculate if the 2nd number doesn't exists
        if (Number.isNaN(value_2)) {
            return { inputValues, inputGroup, answered };
        }

        //do the calculation
        switch (operator) {
            case ('+'): solution = value_1 + value_2; break;
            case ('-'): solution = value_1 - value_2; break;
            case ('*'): solution = value_1 * value_2; break;
            case ('/'): {
                solution = NaN;
                output = "ERROR";
                answered = 2;

                //Run divide and make sure it is not divided by zero
                if (value_2 !== 0) { solution = value_1 / value_2; }
                break;
            }
        }

        //prevent the number exceeding the safe integer territory
        if (!Number.isNaN(solution)) {
            output = CalcLogic.filterMinMax(solution.toString());
        }
        
        inputValues = [output];
        inputGroup = 1;
        //end the equation
        if (endEquation === true && answered === 0) {
            answered = 1;
            inputGroup = 0;
        }
        
        return { inputValues, inputGroup, answered };
    }

    /** Square root the equation (inputValues)
     * @param {Array} inputValues - (from STATE) array of numbers and operaters
     * @param {Number} inputGroup - (from STATE) current position of the array from inputValues
     * @param {Number} answered - (from STATE) has the equation ended of not
     * @returns {Object} - As in { inputValues, inputGroup, answered}
     */
    static squareRoot(inputValues: string[], inputGroup: number, answered: number) {
        let solution = 0;

        //Pre-calculate if there's an unfinished equation
        solution = parseFloat((inputGroup === 2)
            ? CalcLogic.calculate(false, inputValues, inputGroup, answered).inputValues[0]
            : inputValues[0]);
        
        //Don't do anything if there's an error
        if (solution < 0 || answered === 2) {
            answered = 2;
            inputValues = ["ERROR"];
        }

        //Do the square root
        else {
            answered = 1;
            let rawOutput = this.filterMinMax(Math.sqrt(solution).toString());
            if (rawOutput === "OUT OF BOUND") {
                answered = 2; //error
            }
            inputValues = [rawOutput];
        }
        return { inputValues, inputGroup, answered };
    }

    /**
     * Filter the input number between the lowest and highest safe float
     * @param {string} input - numbers in string
     * @returns {string} - filtered float safe numbers in string
     */
    static filterMinMax(input = '0') {
        let getFloat = parseFloat(input);
        let decimals = 0;
        if (isNaN(getFloat)) { return 'ERROR' ;}
        if (input.match(/\./)) { decimals = Math.min(10, input.split('.')[1].length) || 0; }
        if (getFloat < 0.0000000001) { return '0'; }
        if (getFloat >= Number.MAX_SAFE_INTEGER) { return 'OUT OF BOUND'; }
        return getFloat.toFixed(decimals).toString();
    }
}