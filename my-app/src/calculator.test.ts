import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {Calculator} from './calculator';
const calc = new Calculator({
    showDisplay: true
});
type State = {inputValues: string[], inputGroup: number, answered: number};
//UNIT TESTS

test('Filter the inputs properly', () => {
    const inputs = ['0.000000000000000023', '1986.64', '921432523523096655555555324'];
    const results = ['0', '1986.64', 'OUT OF BOUND'];
    inputs.forEach((get, current) => {
        const test = calc.filterMinMax(get);
        expect(test).toBe(results[current]);
    });
});

test('Calculate 9 x 9', () => {
    calc.setState({ inputValues: ['9', '*', '9'], inputGroup: 2});
    const results = '81';
    const test = calc.calculate(false);
    expect(test).toBe(results);
});