import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import CarsPage from '../pages/CarsPage';
import CarDetailPage from '../pages/CarDetailPage';
import AdminPage from '../pages/AdminPage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/cars/:id" element={<CarDetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
