import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
axios.get('http://localhost:8081/profile');

function App(this: any) {
  const [person, setPerson] = useState({
    firstName: "No Name",
    lastName: "Does not exist"
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          <button onClick={() => {
              axios.get('http://localhost:8081/profile').then((r) => {
                setPerson(r.data);
                debugger; 
              });
            }}>{person.firstName} {person.lastName}</button>
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
