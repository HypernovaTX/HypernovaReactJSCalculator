///WIP
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

        function addZero(check = inputValues[inputGroup]) {
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

        //ADD
        if (input.match(CalcEdit.rep_operator())) {
            CalcLogic.addOperator(input, inputValues[inputGroup]);
        } else {
            addFloat(input);
        }
        
        //this.setState({ inputValues, inputGroup, answered });
    }

    static roundStringNum(input = '') {
        return parseFloat(input).toFixed(12).toString();
    }

    static addOperator(currentInput = '', lastInput = '', inputValues: string[], inputGroup: number, answered: number) {
        if (answered === 2) {
            return;
        }
        if (lastInput.match(CalcEdit.rep_operator())) {
            inputValues[inputGroup] = currentInput;
        } else {
            CalcEdit.roundStringNum();
            inputGroup ++;
            if (inputGroup >= 3) {
                inputValues = [self.calculate(false)[0], currentInput, '']
                inputGroup = 1;
            } else {
                inputValues = [inputValues[inputGroup - 1], currentInput];
            }
        }
        answered = 0;
    }

}