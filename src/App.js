import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Appbar from './Components/Appbar';
import Register from './Components/Auth/register';
import Login from './Components/Auth/login';
import CreateFreelancer from './Components/FreeLancer/CreateFreeLancer';
import CreatePost from './Components/Posts/CreatePost';
import DashboardFreelancer from './Components/FreeLancer/DashboardFreelancer';
import MyPosts from './Components/FreeLancer/MyPosts';
import ClientView from './Components/Posts/ClientView';
import PostList from './Components/Posts/PostList';
import CreateDemand from './Components/Demand/CreateDemand';
import MyServices from './Components/FreeLancer/MyServices';
import DemandList from './Components/FreeLancer/DemandList';
import AuthProvider from './Components/Auth/AuthContext';
import PrivateRoute from './Components/Auth/PrivateRoute';
import MyDemands from './Components/Demand/MyDemands';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Appbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />  
          <Route path="/CreateFreelancer" element={<PrivateRoute element={<CreateFreelancer />} />} />
          <Route path="/CreatePost" element={<PrivateRoute element={<CreatePost />} />} />
          <Route path="/DashboardFreelancer" element={<PrivateRoute element={<DashboardFreelancer />} />} />
          <Route path="/MyPosts" element={<PrivateRoute element={<MyPosts />} />} />
          <Route path="/ClientView" element={<PrivateRoute element={<ClientView />} />} />
          <Route path="/PostList" element={<PrivateRoute element={<PostList />} />} />
          <Route path="/CreateDemand" element={<PrivateRoute element={<CreateDemand />} />} />
          <Route path="/MyServices" element={<PrivateRoute element={<MyServices />} />} />
          <Route path="/DemandList" element={<PrivateRoute element={<DemandList />} />} />
          <Route path="/MyDemands" element={<PrivateRoute element={<MyDemands />} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
