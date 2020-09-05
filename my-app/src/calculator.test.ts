import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import {Calculator} from './calculator';
const calc = new Calculator({
    showDisplay: true
});
//UNIT TESTS

test('Filter the inputs properly', () => {
    const inputs = ['0.000000000000000023', '1986.64', '921432523523096655555555324'];
    const results = ['0', '1986.64', 'OUT OF BOUND'];
    inputs.forEach((get, current) => {
        const test = calc.filterMinMax(get);
        expect(test).toBe(results[current]);
    });
});
