import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Desktop/Dashboard';
import Login from './Desktop/login';
import Bienvenido from '../src/Mobil/bienvenido';
import DashboardMeseros from './Meseros/DashboardMeseros';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/bienvenido" element={<Bienvenido />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
        <Route path='/meseros' element={<DashboardMeseros/>}></Route>
      </Routes>
    </Router>
  );
};

export default App;
