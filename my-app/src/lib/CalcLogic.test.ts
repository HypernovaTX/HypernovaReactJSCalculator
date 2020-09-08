import { CalcLogic } from './CalcLogic';

test('1 - Filter the inputs within the min/max safe float values', () => {
    const inputs = ['0.000000000000000023', '1986.64', '921432523523096655555555324'];
    const results = ['0', '1986.64', 'OUT OF BOUND'];
    inputs.forEach((get, current) => {
        const test = CalcLogic.filterMinMax(get);
        expect(test).toBe(results[current]);
    });
});

test('2 - Calculate 9 x 9 and get 81 as the answer', () => {
    const inputs = ['9', '*', '9'];
    const results = '81';
    const test = CalcLogic.calculate(false, inputs, 2, 0);
    expect(test.inputValues[0]).toBe(results);
});

test('3 - Divided by zero', () => {
    const inputs = ['83183333', '/', '0'];
    const results = 'ERROR';
    const test = CalcLogic.calculate(false, inputs, 2, 0);
    expect(test.inputValues[0]).toBe(results);
});

test('4 - Squareroot of 16', () => {
    const inputs = ['12', '+', '4'];
    const results = '4';
    const test = CalcLogic.squareRoot(inputs, 2, 0);
    expect(test.inputValues[0]).toBe(results);
});