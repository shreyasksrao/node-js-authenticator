/*jshint esversion: 8 */
import './App.css';
import React from "react";
import Home from './components/Pages/Home';
import Error from './components/Pages/Error';
import { Routes, Route } from 'react-router-dom';
import UserLogin from './components/Pages/UserLogin';
import RequireAuth from './components/common/RequireAuth';


function App() {
  return (
    <div className="App wrapper"> 
      <Routes>
        <Route path='/login' element={<UserLogin />} />
        <Route path='/error' element={<Error />} />
        <Route exact path='/*' element={<Home />} />
      </Routes>
    </div> 
  );
}

export default App;
