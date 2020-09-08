export class CalcLogic {
    //solve the equation from: inputValues['number', 'operator', 'number']
    static calculate(endEquation = false, inputValues: string[], inputGroup: number, answered: number ) {
        const value_1 = parseFloat(inputValues[0]);
        const operator = inputValues[1];
        const value_2 = parseFloat(inputValues[2]);
        let solution = 0;
        let output = '';
        

        //Prevent multi "=" button bug
        if (Number.isNaN(value_2)) {
            return { inputValues, inputGroup, answered };
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
            output = CalcLogic.filterMinMax(solution.toString());
        }
        
        inputValues = [output];
        inputGroup = 1;
        if (endEquation === true && answered === 0) {
            answered = 1;
            inputGroup = 0;
        }
        
        return { inputValues, inputGroup, answered };
    }

    //squareroot inputValues
    static squareRoot(inputValues: string[], inputGroup: number, answered: number) {
        let solution = 0;
        solution = parseFloat((inputGroup === 2)
            ? CalcLogic.calculate(false, inputValues, inputGroup, answered).inputValues[0]
            : inputValues[0]);
        if (solution < 0 || answered === 2) {
            answered = 2;
            inputValues = ["ERROR"];
        } else {
            answered = 1;
            let rawOutput = this.filterMinMax(Math.sqrt(solution).toString());
            if (rawOutput === "OUT OF BOUND") {
                answered = 2;
            }
            inputValues = [rawOutput];
        }
        return { inputValues, inputGroup, answered };
    }

    //Check and see the input does not exceed the min/max number
    static filterMinMax(input = '0') {
        let getFloat = parseFloat(input);
        let decimals = 0;
        if (input.match(/\./)) {
            decimals = Math.min(10, input.split('.')[1].length) || 0;
        }
        if (getFloat < 0.0000000001) {
            return '0';
        }
        if (getFloat >= Number.MAX_SAFE_INTEGER) {
            return 'OUT OF BOUND';
        }
        return getFloat.toFixed(decimals).toString();
    }
}