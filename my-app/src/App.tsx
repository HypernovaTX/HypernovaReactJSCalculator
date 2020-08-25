import React, { useState } from 'react';
//import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import {Calculator} from './calculator';
axios.get('http://localhost:8081/profile');

function App(this: any) {
  const [person, setPerson] = useState({
    firstName: "No Name",
    lastName: "Does not exist"
  });

  return (
    <div className="App">
      <Calculator showDisplay={true}/>
    </div>
  );
}

export default App;