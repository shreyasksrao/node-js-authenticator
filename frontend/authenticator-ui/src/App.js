/*jshint esversion: 8 */
import './App.css';
import React, { Fragment, useState } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/common/Navbar';
import LoginForm from './components/Forms/LoginForm';

function App() {
  const actionLinks = [{title: 'Home', href: '/'}, {title: 'Contact Us', href: '/'}];
  return (
    <Router>
      <div className="App">
        <Navbar title='F2K Technology' actions={actionLinks}/>
        <div className='container'>
          <Routes>
                <Route path='/' element={ 
                  <Fragment>
                      <h1>Hello From Shreyas</h1>
                  </Fragment>
                }/>
                <Route path='/login' element={<LoginForm />} />
                <Route path="*" element={
                    <main style={{ padding: "1rem" }}>
                      <p>There's nothing here!</p>
                    </main>
                }/>
          </Routes>
        </div>
        
      </div>
    </Router>
  );
}

export default App;
