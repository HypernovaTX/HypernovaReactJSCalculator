import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import 'jest-canvas-mock';
import { Calculator } from './calculator';
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })

//Test keypad sequence: 'C⌫√+789-456*123/±0.='

function reset_calculator() {
    const CLEAR = wrapper.find('.calc-button');
    CLEAR.forEach(eachButton => {
        if (eachButton.text() === 'C') { eachButton.simulate('click'); }
    });
}

const wrapper = mount(<Calculator showDisplay={true}/>)
test('1 - Render test', () => {
    expect(wrapper.find('.calc-display-text').text()).toBe('0');
});

test('2 - Input "1"', () => {
    const calcButtons = wrapper.find('.calc-button');
    calcButtons.forEach(eachButton => {
        if (eachButton.text() === '1') { eachButton.simulate('click'); }
    });
    expect(wrapper.find('.calc-display-text').text()).toBe('1');

    reset_calculator();
});

test('3 - Do "1 + 23"', () => {
    const calcButtons_1 = wrapper.find('.calc-button');
    calcButtons_1.forEach(eachButton => {
        if (eachButton.text() === '1') { eachButton.simulate('click'); }
    });
    expect(wrapper.find('.calc-display-text').text()).toBe('1');
    const calcButtons_plus23equal = wrapper.find('.calc-button');
    calcButtons_plus23equal.forEach(eachButton => {
        if (eachButton.text() === '+') { eachButton.simulate('click'); }
        if (eachButton.text() === '2') { eachButton.simulate('click'); }
        if (eachButton.text() === '3') { eachButton.simulate('click'); }
        if (eachButton.text() === '=') { eachButton.simulate('click'); }
    });
    expect(wrapper.find('.calc-display-text').text()).toBe('24');

    reset_calculator();
});

test('4 - Do squareroot of "8 * 2"', () => {
    const calcButtons_8times2 = wrapper.find('.calc-button');
    calcButtons_8times2.forEach(eachButton => {
        if (eachButton.text() === '8') { eachButton.simulate('click'); }
        if (eachButton.text() === '*') { eachButton.simulate('click'); }
        if (eachButton.text() === '2') { eachButton.simulate('click'); }
    });
    const calcButtons_sqrt = wrapper.find('.calc-button');
    calcButtons_sqrt.forEach(eachButton => {
        if (eachButton.text() === '√') { eachButton.simulate('click'); }
    });
    expect(wrapper.find('.calc-display-text').text()).toBe('4');

    reset_calculator();
});

test('5 - Do squareroot of "-1"', () => {
    const calcButtons_negative1 = wrapper.find('.calc-button');
    calcButtons_negative1.forEach(eachButton => {
        if (eachButton.text() === '1') { eachButton.simulate('click'); }
        if (eachButton.text() === '±') { eachButton.simulate('click'); }
    });
    expect(wrapper.find('.calc-display-text').text()).toBe('(-1)');
    const calcButtons_sqrt = wrapper.find('.calc-button');
    calcButtons_sqrt.forEach(eachButton => {
        if (eachButton.text() === '√') { eachButton.simulate('click'); }
    });
    expect(wrapper.find('.calc-display-text').text()).toBe('ERROR');

    reset_calculator();
});