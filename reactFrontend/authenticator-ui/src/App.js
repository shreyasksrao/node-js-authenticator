/*jshint esversion: 8 */
import './App.css';
import React, { useState } from "react";
import Router from 'react-router-dom';
import LoginForm from './components/Forms/LoginForm';

function App() {
  const [ username, setUsername ] = useState(null);

  return (
    <Router>
      <div className="App">
      </div>
    </Router>
  );
}

export default App;
