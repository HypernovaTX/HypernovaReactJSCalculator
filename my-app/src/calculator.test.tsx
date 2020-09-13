import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import 'jest-canvas-mock';
import { Calculator } from './calculator';

let container: Element | DocumentFragment | null;

beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
});
  
afterEach(() => {
    if (container !== null) { document.body.removeChild(container); }
    container = null;
});

test('Render test', () => {
    act(() => {
        ReactDOM.render(<Calculator showDisplay={true} />, container);
    });
    let displayText;
    if (container !== null) { displayText = container?.querySelector('.calc-display-inner > .calc-display-text'); }
    else { displayText = {textContent: ''}}
    expect(displayText?.textContent).toBe('0');
});