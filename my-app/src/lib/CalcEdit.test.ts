import { CalcEdit } from './CalcEdit';

test('1 - Add number 0 to 0, expect 0', () => {
    const add = '0';
    const equationAndExpect = ['0'];
    const test = CalcEdit.addValue(add, equationAndExpect, 0, 0);
    expect(test.inputValues).toStrictEqual(equationAndExpect);
});

test('2 - Add number 8 to "10 +", expect "10 + 8"', () => {
    const add = '8';
    const equation = ['10', '+'];
    const expectedAnswer = ['10', '+', '8'];
    const test = CalcEdit.addValue(add, equation, 1, 0);
    expect(test.inputValues).toStrictEqual(expectedAnswer);
});

test('3 - Overwrite the equation if answered', () => {
    const add = '1';
    const equation = ['777'];
    const expectedAnswer = ['1'];
    const test = CalcEdit.addValue(add, equation, 0, 1);
    expect(test.inputValues).toStrictEqual(expectedAnswer);
});

test('4 - Add "/" to "3 * 5", expect "15 /"', () => {
    const add = '/';
    const equation = ['3', '*', '5'];
    const expectedAnswer = ['15', '/', ''];
    const test = CalcEdit.addValue(add, equation, 2, 0);
    expect(test.inputValues).toStrictEqual(expectedAnswer);
});

test('4 - Add "/" to "3 * 5", expect "15 /"', () => {
    const add = '/';
    const equation = ['3', '*', '5'];
    const expectedAnswer = ['15', '/', ''];
    const test = CalcEdit.addValue(add, equation, 2, 0);
    expect(test.inputValues).toStrictEqual(expectedAnswer);
});

test('5 - Round 1.0000001000001 to 1.0000001', () => {
    const input = '1.0000001000001';
    const expectedAnswer = '1.0000001';
    const test = CalcEdit.roundStringNum(input);
    expect(test).toBe(expectedAnswer);
});

test('6 - Delete a value from "4 - 2", expect "4 -"', () => {
    const equation = ['4', '-', '2'];
    const expectedAnswer = ['4', '-', ''];
    const test = CalcEdit.deleteValues(equation, 2, 0);
    expect(test.inputValues).toStrictEqual(expectedAnswer);
});