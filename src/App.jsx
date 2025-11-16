// import { useSelector } from 'react-redux';
// import { Navigate, Route, Routes } from 'react-router-dom';
// import './App.css';
// import Login from './auth/Login';
// import Register from './auth/Register';
// import Home from './pages/Home';
// import PrivateRoute from './components/PrivateRoute';
// import AddVendor from './components/Vendor/AddVendor';
// import EditVendor from './components/Vendor/EditVendor';
// import AddPlant from './components/Plant/AddPlant';
// import PlantList from './components/Plant/PlantList';
// import EditPlant from './components/Plant/EditPlant';
// import AddMaterial from './components/Material/AddMaterial';
// import MaterialList from './components/Material/MaterialList';
// import EditMaterial from './components/Material/EditMaterial';
// import AddMaterialCharacteristics from './components/MaterialInspectionCharacteristics/AddMaterialCharacteristics';
// import CharacteristicsList from './components/MaterialInspectionCharacteristics/CharacteristicsList';
// import EditCharacteristics from './components/MaterialInspectionCharacteristics/EditCharacteristics';
// import InspectionLotList from './components/InspectionLot/InspectionLotList';
// import AddInspectionActuals from './components/InspectionActuals/AddInspectionActuals';
// import EditInspectionLot from './components/InspectionLot/EditInspectionLot';
// import AdminDashboard from './auth/AdminDashboard';
// import VendorList from './components/Vendor/VendorList';
// import Inspectors from './components/InspectorsList';
// import Layout from './components/Layout/layout';
// import ProfileMenu from './layouts/ProfileMenu';
// import About from './pages/About';

// function App() {
//   const isAuthenticated = useSelector(state => state.user.isAuthenticated);

//   return (
//     <div className="app-container">
//       <Routes>

//         <Route element={<Layout />}>
//           <Route path="/vendor-list" element={<VendorList />} />
//           <Route path="/inspection-lot-list" element={<InspectionLotList />} />
//           <Route path="/plant-list" element={<PlantList />} />
//           <Route path="/material-list" element={<MaterialList />} />
//           <Route path="/inspectors" element={<Inspectors />} />
//           <Route path="profile" element={<ProfileMenu />} />
//         </Route>

//         <Route path="/" element={<Navigate to="/login" />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/add-vendor" element={<AddVendor />} />
//         <Route path="/edit-vendor/:id" element={<EditVendor />} />
//         <Route path="/add-plant" element={<AddPlant />} />
//         <Route path="/plant-list" element={<PlantList />} />
//         <Route path="/edit-plant/:id" element={<EditPlant />} />
//         <Route path="/add-material" element={<AddMaterial />} />
//         <Route path="/material-list" element={<MaterialList />} />
//         <Route path="/edit-material/:id" element={<EditMaterial />} />
//         <Route path="/add-material-characteristics" element={<AddMaterialCharacteristics />} />
//         <Route path="/material-characteristics/:materialId" element={<CharacteristicsList />} />
//         <Route path="/edit-characteristics/:id" element={<EditCharacteristics />} />
//         <Route path="/inspection-lot-list" element={<InspectionLotList />} />
//         <Route path="/edit-inspection-lot/:id" element={<EditInspectionLot />} />
//         <Route path="/add-inspection-actuals/:id" element={<AddInspectionActuals />} />
//         {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}

//         <Route path="/layout" element={<Layout />} />
//         <Route path="/about" element={<About />} />



//         <Route
//           path="/home/*"
//           element={
//             <PrivateRoute>
//               <Home />
//             </PrivateRoute>
//           }
//         />
//       </Routes>
//     </div>
//   );
// }

// export default App;

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
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main app (protect Layout if needed) */}
        {/* If you need auth protection, wrap Layout with PrivateRoute like:
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}> */}
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardInsideLayout />} />
          <Route path="vendor-list" element={<VendorList />} />
          <Route path="inspection-lot-list" element={<InspectionLotList />} />
          <Route path="plant-list" element={<PlantList />} />
          <Route path="material-list" element={<MaterialList />} />
          <Route path="inspectors" element={<Inspectors />} />
          <Route path="profile" element={<ProfileMenu />} />
          <Route path="materials/graph/:lotId" element={<MaterialGraphRoute />} />
        </Route>

        {/* Feature pages (if they are separate views) */}
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

        {/* Catch-all: redirect unknown routes to dashboard or login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;