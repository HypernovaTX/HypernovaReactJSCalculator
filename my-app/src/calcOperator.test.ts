import {inputOperator} from './calcOperator';

test('Test calculator operator', () => {
    let result = inputOperator('3 * 3');
    expect(result).toBe(9);
});
  