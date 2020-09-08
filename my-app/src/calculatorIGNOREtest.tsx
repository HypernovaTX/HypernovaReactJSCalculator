import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-canvas-mock';
Enzyme.configure({ adapter: new Adapter() });
/*
import Calculator from './calculator';
const calc_class = shallow(<Calculator showDisplay={true}/>);
const calc_instance = calc_class.instance() as Calculator;


test('Filter the inputs within the min/max safe float values', () => {
    const inputs = ['0.000000000000000023', '1986.64', '921432523523096655555555324'];
    const results = ['0', '1986.64', 'OUT OF BOUND'];
    inputs.forEach((get, current) => {
        const test = calc_instance.filterMinMax(get);
        expect(test).toBe(results[current]);
    });
});

test('Calculate 9 x 9 and get 81 as the answer', () => {
    
    calc_class.setState({ inputValues: ['9', '*', '9'], inputGroup: 2});
    const results = ['81'];
    calc_instance.calculate(false);
    expect(calc_class.state('inputValues')).toBe(results);
});*/