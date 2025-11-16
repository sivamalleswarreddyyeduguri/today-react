

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import Header from '../layouts/Header';
import VendorList from '../components/Vendor/VendorList'; // Adjust path if needed
import PlantList from '../components/Plant/PlantList';
import MaterialList from '../components/Material/MaterialList';
import InspectionLotList from '../components/InspectionLot/InspectionLotList';

const Home = () => {
  return (
    <div className="home-container">
      <Header />
      <Navbar />
      <div className="home-content">
        <Routes>
          <Route
            path="/vendor-list"
            element={<VendorList />} 
          />
           <Route
            path="/plant-list"
            element={<PlantList />} 
          />
          <Route
            path="/material-list"
            element={<MaterialList/>} 
          />
          <Route
            path="/inspection-lot-list"
            element={<InspectionLotList/>} 
          />
          <Route
            path="/"
            element={
              <>
                <h2>Welcome to Material Inspection Management System</h2>
                <p>Select a module from the navigation bar.</p>
              </>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default Home;