// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Appbar from './Components/Appbar';
import Register from './Components/Auth/register';
import Login from './Components/Auth/login';
import CreateFreelancer from './Components/FreeLancer/CreateFreeLancer';
import CreatePost from './Components/Posts/CreatePost';
import DashboardFreelancer from './Components/FreeLancer/DashboardFreelancer'
import MyPosts from './Components/FreeLancer/MyPosts'
import ClientView from './Components/Posts/ClientView';
import PostList from './Components/Posts/PostList';
import CreateDemand from './Components/Demand/CreateDemand';




function App() {
  return (
    <Router>
        <Appbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/CreateFreelancer" element={<CreateFreelancer />} />
          <Route path="/CreatePost" element={<CreatePost />} />
          <Route path="/DashboardFreelancer" element={<DashboardFreelancer />} />
          <Route path="/MyPosts" element={<MyPosts />} />          
          <Route path="/ClientView" element={<ClientView />} /> 
          <Route path="/PostList" element={<PostList />} />
          <Route path="/CreateDemand" element={<CreateDemand />} />  
  

   


        </Routes>
    </Router>
  );
}

export default App;
