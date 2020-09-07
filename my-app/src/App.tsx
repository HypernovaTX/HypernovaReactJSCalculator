import React from 'react'; //, { useState }
//import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import {Calculator} from './calculator';
axios.get('http://localhost:8081/profile');

function App(this: any) {
  return (
    <div className="App">
      <Calculator showDisplay={true}/>
    </div>
  );
}

export default App;