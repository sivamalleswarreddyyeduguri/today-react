import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './auth/Login';
import Register from './auth/Register';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import AddVendor from './components/Vendor/AddVendor';
import EditVendor from './components/Vendor/EditVendor';
import AddPlant from './components/Plant/AddPlant';
import PlantList from './components/Plant/PlantList';
import EditPlant from './components/Plant/EditPlant';
import AddMaterial from './components/Material/AddMaterial';
import MaterialList from './components/Material/MaterialList';
import EditMaterial from './components/Material/EditMaterial';
import AddMaterialCharacteristics from './components/MaterialInspectionCharacteristics/AddMaterialCharacteristics';
import CharacteristicsList from './components/MaterialInspectionCharacteristics/CharacteristicsList';
import EditCharacteristics from './components/MaterialInspectionCharacteristics/EditCharacteristics';
import InspectionLotList from './components/InspectionLot/InspectionLotList';
import AddInspectionActuals from './components/InspectionActuals/AddInspectionActuals';
import EditInspectionLot from './components/InspectionLot/EditInspectionLot';
import VendorList from './components/Vendor/VendorList';
import Inspectors from './components/InspectorsList';
import Layout, { DashboardInsideLayout } from './components/Layout/layout';
import ProfileMenu from './layouts/ProfileMenu';
import About from './pages/About';
import MaterialGraphRoute from './components/Material/MaterialGraphRoute';

function App() {
  return (
    <div className="app-container">
      <Routes>
        {/* Default redirect / to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route
          path="/login"
          element={
            localStorage.getItem('token') ? <Navigate to="/home" replace /> : <Login />
          }
        />
        <Route path="/register" element={<Register />} />

        {/* Main layout */}
        <Route path="/home" element={<Layout />}>
          <Route index element={<DashboardInsideLayout />} />
          <Route path="vendor-list" element={<VendorList />} />
          <Route path="inspection-lot-list" element={<InspectionLotList />} />
          <Route path="plant-list" element={<PlantList />} />
          <Route path="material-list" element={<MaterialList />} />
          <Route path="inspectors" element={<Inspectors />} />
          <Route path="profile" element={<ProfileMenu />} />
          <Route path="materials/graph/:lotId" element={<MaterialGraphRoute />} />
        </Route>

        {/* Feature pages */}
        <Route path="/add-vendor" element={<AddVendor />} />
        <Route path="/edit-vendor/:id" element={<EditVendor />} />
        <Route path="/add-plant" element={<AddPlant />} />
        <Route path="/edit-plant/:id" element={<EditPlant />} />
        <Route path="/add-material" element={<AddMaterial />} />
        <Route path="/edit-material/:id" element={<EditMaterial />} />
        <Route path="/add-material-characteristics" element={<AddMaterialCharacteristics />} />
        <Route path="/material-characteristics/:materialId" element={<CharacteristicsList />} />
        <Route path="/edit-characteristics/:id" element={<EditCharacteristics />} />
        <Route path="/edit-inspection-lot/:id" element={<EditInspectionLot />} />
        <Route path="/add-inspection-actuals/:id" element={<AddInspectionActuals />} />

        <Route path="/about" element={<About />} />

        {/* Optional: Legacy private section */}
        <Route
          path="/home/*"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
