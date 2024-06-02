import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Desktop/Dashboard';
import Login from './Desktop/login';
import Bienvenido from '../src/Mobil/bienvenido';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/bienvenido" element={<Bienvenido />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Bienvenido />} />
      </Routes>
    </Router>
  );
};

export default App;
