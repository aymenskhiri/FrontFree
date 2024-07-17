// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Appbar from './Components/Appbar';
import Register from './Components/Auth/register';
import Login from './Components/Auth/login';

function App() {
  return (
    <Router>
        <Appbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
    </Router>
  );
}

export default App;