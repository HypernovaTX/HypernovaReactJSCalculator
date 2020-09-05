import {Calculator} from './calculator';
const calc = new Calculator({
    showDisplay: true
});
//UNIT TESTS

test('Filter 0.000000000000000023 to 0', () => {
    const test = calc.filterMinMax('0.000000000000000023');
    expect(test).toBe('0');
});
