import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import 'jest-canvas-mock';
import { Calculator } from './calculator';
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
Enzyme.configure({ adapter: new Adapter() })

const wrapper = mount(<Calculator showDisplay={true}/>)
test('Render test', () => {
    expect(wrapper.find('.calc-display-text').text()).toBe('0');
});

//const wrapper = mount(<Calculator showDisplay={true}/>)
test('Input "1"', () => {
    const calcButtons = wrapper.find('.calc-button');
    calcButtons.forEach(eachButton => {
        if (eachButton.text() === '1') { eachButton.simulate('click'); }
    });
    expect(wrapper.find('.calc-display-text').text()).toBe('1');
});