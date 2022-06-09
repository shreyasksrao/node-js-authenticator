/*jshint esversion: 8 */
import './App.css';
import React, { Fragment, useState } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import UserLogin from './components/Pages/UserLogin';
import Home from './components/Pages/Home';

function App() {
  return (
    <Router>
      <div className="App"> 
        <Routes>
          <Route path='/' element={ 
            <Home />
          }/>
          <Route 
            path='/login' 
            element={<UserLogin />} />
          <Route path="*" element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }/>
        </Routes>
      </div> 

    </Router>
  );
}

export default App;
