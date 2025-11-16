// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axiosInstance from './shared/axiosInstance';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import '../styles/admin.css';
// import {
//   FaUser,
//   FaEdit,
//   FaTrash,
//   FaIndustry,
//   FaWarehouse,
//   FaCubes,
//   FaClipboardList,
//   FaSignOutAlt,
//   FaUserCircle
// } from 'react-icons/fa';

// const Inspectors = () => {
//  const [inspectors, setInspectors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('inspectors'); // 'inspectors' or 'profile'
//   const [showModal, setShowModal] = useState(false);
//   const [showEditProfileModal, setShowEditProfileModal] = useState(false);
//   const [newInspector, setNewInspector] = useState({ username: '', password: '', email: '', mobileNum: '' });
//   const [adminDetails, setAdminDetails] = useState({
//     username: localStorage.getItem('username'),
//     email: localStorage.getItem('email'),
//     mobileNum: localStorage.getItem('mobileNumber') || ''
//   });

//   const token = localStorage.getItem('token');
//   const navigate = useNavigate();

//   // Fetch inspectors
//   const fetchInspectors = async () => {
//     try {
//       const res = await axiosInstance.get('/user/get-all', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setInspectors(res.data);
//     } catch (err) {
//       toast.error('Failed to load inspectors', { position: 'top-center' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === 'inspectors') {
//       fetchInspectors();
//     }
//   }, [activeTab]);

//   // Create Inspector
//   const handleCreateInspector = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axiosInstance.post('/create-inspector', newInspector, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       toast.success(response.data.statusMsg || 'Inspector created successfully!', {
//         position: 'top-center',
//         autoClose: 1500
//       });

//       setTimeout(() => {
//         setShowModal(false);
//         setNewInspector({ username: '', password: '', email: '', mobileNum: '' });
//         fetchInspectors();
//       }, 1600);
//     } catch (error) {
//       toast.error(error.response?.data?.errorMessage || 'Failed to create inspector', {
//         position: 'top-center'
//       });
//     }
//   };

//   // Delete Inspector
//   const handleDeleteInspector = async (id) => {
//     try {
//       await axiosInstance.delete(`/user/delete/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       toast.success('Inspector deleted successfully!', {
//         position: 'top-center',
//         autoClose: 1500
//       });

//       setTimeout(() => fetchInspectors(), 1600);
//     } catch (err) {
//       toast.error('Failed to delete inspector', { position: 'top-center' });
//     }
//   };

  


//   return (
//     <div className="admin-dashboard">


//       {/* Main Content */}
//       <div className="main-content">
        
//           <>
//             <div className="header">
//               <h2>Manage Inspectors</h2>
//               <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Inspector</button>
//             </div>

//             <div className="inspectors-list">
//               {loading ? (
//                 <p>Loading...</p>
//               ) : (
//                 <table className="inspectors-table">
//                   <thead>
//                     <tr>
//                       <th>Username</th>
//                       <th>Email</th>
//                       <th>Mobile</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                 <tbody>
//                 {inspectors.map((insp, index) => (
//                   <tr key={insp.id || insp.email || index}>
//                     <td>{insp.username}</td>
//                     <td>{insp.email}</td>
//                     <td>{insp.mobileNum || 'N/A'}</td>
//                     <td className="actions">
//                       <FaEdit className="action-icon edit" title="Edit" />
//                       <FaTrash
//                         className="action-icon delete"
//                         title="Delete"
//                         onClick={() => handleDeleteInspector(insp.id)}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//                 </table>
//               )}
//             </div>
//           </>
        
//       </div>

//       {/* Modal for Add Inspector */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h3>Add Inspector</h3>
//             <form onSubmit={handleCreateInspector} className="modal-form">
//               <input
//                 type="text"
//                 placeholder="Username"
//                 value={newInspector.username}
//                 onChange={(e) => setNewInspector({ ...newInspector, username: e.target.value })}
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={newInspector.password}
//                 onChange={(e) => setNewInspector({ ...newInspector, password: e.target.value })}
//                 required
//               />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={newInspector.email}
//                 onChange={(e) => setNewInspector({ ...newInspector, email: e.target.value })}
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Mobile Number"
//                 value={newInspector.mobileNum}
//                 onChange={(e) => setNewInspector({ ...newInspector, mobileNum: e.target.value })}
//               />
//               <div className="modal-actions">
//                 <button type="submit" className="btn-primary">Register</button>
//                 <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Modal for Edit Profile */}
//       {showEditProfileModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h3>Edit Profile</h3>
//             <form onSubmit={handleUpdateProfile} className="modal-form">
//               <input
//                 type="text"
//                 placeholder="Username"
//                 value={adminDetails.username}
//                 onChange={(e) => setAdminDetails({ ...adminDetails, username: e.target.value })}
//                 required
//               />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={adminDetails.email}
//                 onChange={(e) => setAdminDetails({ ...adminDetails, email: e.target.value })}
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Mobile Number"
//                 value={adminDetails.mobileNum}
//                 onChange={(e) => setAdminDetails({ ...adminDetails, mobileNum: e.target.value })}
//               />
//               <div className="modal-actions">
//                 <button type="submit" className="btn-primary">Save Changes</button>
//                 <button type="button" className="btn-secondary" onClick={() => setShowEditProfileModal(false)}>Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <ToastContainer />
//     </div>
//   );
// };


// export default Inspectors;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './shared/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/admin.css';
import {
  FaUser,
  FaEdit,
  FaTrash,
  FaIndustry,
  FaWarehouse,
  FaCubes,
  FaClipboardList,
  FaSignOutAlt,
  FaUserCircle
} from 'react-icons/fa';

const Inspectors = () => {
  const [inspectors, setInspectors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Inspector modal
  const [showModal, setShowModal] = useState(false);
  const [newInspector, setNewInspector] = useState({
    username: '',
    password: '',
    email: '',
    mobileNum: ''
  });

  // Admin profile (your old modal)—optional keep or remove
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [adminDetails, setAdminDetails] = useState({
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email'),
    mobileNum: localStorage.getItem('mobileNumber') || ''
  });

  // NEW: Edit Inspector modal
  const [showEditInspectorModal, setShowEditInspectorModal] = useState(false);
  const [editInspector, setEditInspector] = useState({
    id: '',
    username: '',
    email: '',
    mobileNum: ''
    // password: '' // optional: usually you don’t edit password here
  });

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch inspectors
  const fetchInspectors = async () => {
    try {
      const res = await axiosInstance.get('/api/v1/user/get-all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInspectors(res.data);
    } catch (err) {
      toast.error('Failed to load inspectors', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspectors();
    // If you previously depended on activeTab, you can remove it now
  }, []);

  // Create Inspector
  const handleCreateInspector = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/v1/admin/create-inspector', newInspector, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(response.data.statusMsg || 'User created successfully!', {
        position: 'top-center',
        autoClose: 1000
      });

      setTimeout(() => {
        setShowModal(false);
        setNewInspector({ username: '', password: '', email: '', mobileNum: '' });
        fetchInspectors();
      }, 1600);
    } catch (error) {
      toast.error(error.response?.data?.errorMessage || 'Failed to create inspector', {
        position: 'top-center'
      });
    }
  };

  // Delete Inspector
  const handleDeleteInspector = async (id) => {
    try {
      await axiosInstance.delete(`/api/v1/admin/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Inspector deleted successfully!', {
        position: 'top-center',
        autoClose: 1500
      });

      setTimeout(() => fetchInspectors(), 1600);
    } catch (err) {
      toast.error('Failed to delete inspector', { position: 'top-center' });
    }
  };

  // NEW: Open Edit Inspector modal
  const openEditInspector = (insp) => {
    setEditInspector({
      id: insp.id,
      username: insp.username || '',
      email: insp.email || '',
      mobileNum: insp.mobileNum || ''
    });
    setShowEditInspectorModal(true);
  };

  // NEW: Update Inspector
  const handleUpdateInspector = async (e) => {
    e.preventDefault();
    try {
      // Adjust endpoint/payload to match your API
      // Option A: PUT /user/update/{id}
      const response = await axiosInstance.put(`/api/v1/admin/update/${editInspector.id}`, {
        username: editInspector.username,
        email: editInspector.email,
        mobileNum: editInspector.mobileNum
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(response.data?.statusMsg || 'User updated successfully!', {
        position: 'top-center',
        autoClose: 1000
      });

      setTimeout(() => {
        setShowEditInspectorModal(false);
        fetchInspectors();
      }, 1600);
    } catch (error) {
      // If your backend expects PUT /user/update with id in body:
      // try sending { id: editInspector.id, ... } to `/user/update`
      toast.error(error.response?.data?.errorMessage || 'Failed to update inspector', {
        position: 'top-center'
      });
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Main Content */}
      <div className="main-content">
        <>
          <div className="header">
            <h2>Manage Inspectors</h2>
            <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Inspector</button>
          </div>

          <div className="inspectors-list">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="inspectors-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inspectors.map((insp, index) => (
                    <tr key={insp.id || insp.email || index}>
                      <td>{insp.username}</td>
                      <td>{insp.email}</td>
                      <td>{insp.mobileNum || 'N/A'}</td>
                      <td className="actions">
                        {/* ADD onClick to open edit modal */}
                        <FaEdit
                          className="action-icon edit"
                          title="Edit"
                          onClick={() => openEditInspector(insp)}
                          style={{ cursor: 'pointer' }}
                        />
                        <FaTrash
                          className="action-icon delete"
                          title="Delete"
                          onClick={() => handleDeleteInspector(insp.id)}
                          style={{ cursor: 'pointer', marginLeft: 12 }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      </div>

      {/* Modal: Add Inspector */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Inspector</h3>
            <form onSubmit={handleCreateInspector} className="modal-form">
              <input
                type="text"
                placeholder="Username"
                value={newInspector.username}
                onChange={(e) => setNewInspector({ ...newInspector, username: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newInspector.password}
                onChange={(e) => setNewInspector({ ...newInspector, password: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newInspector.email}
                onChange={(e) => setNewInspector({ ...newInspector, email: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={newInspector.mobileNum}
                onChange={(e) => setNewInspector({ ...newInspector, mobileNum: e.target.value })}
              />
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Register</button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Inspector (NEW) */}
      {showEditInspectorModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Inspector</h3>
            <form onSubmit={handleUpdateInspector} className="modal-form">
              <input
                type="text"
                placeholder="Username"
                value={editInspector.username}
                onChange={(e) => setEditInspector({ ...editInspector, username: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={editInspector.email}
                onChange={(e) => setEditInspector({ ...editInspector, email: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={editInspector.mobileNum}
                onChange={(e) => setEditInspector({ ...editInspector, mobileNum: e.target.value })}
              />
              {/* Optional: password field if you need to reset inspector's password here */}
              {/* <input
                type="password"
                placeholder="New Password (optional)"
                value={editInspector.password || ''}
                onChange={(e) => setEditInspector({ ...editInspector, password: e.target.value })}
              /> */}

              <div className="modal-actions">
                <button type="submit" className="btn-primary">Save Changes</button>
                <button type="button" className="btn-secondary" onClick={() => setShowEditInspectorModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* (Optional) Modal for Admin Profile - if you still use it */}
      {showEditProfileModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Profile</h3>
            <form /* onSubmit={handleUpdateProfile} */ className="modal-form">
              <input
                type="text"
                placeholder="Username"
                value={adminDetails.username}
                onChange={(e) => setAdminDetails({ ...adminDetails, username: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={adminDetails.email}
                onChange={(e) => setAdminDetails({ ...adminDetails, email: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={adminDetails.mobileNum}
                onChange={(e) => setAdminDetails({ ...adminDetails, mobileNum: e.target.value })}
              />
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Save Changes</button>
                <button type="button" className="btn-secondary" onClick={() => setShowEditProfileModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Inspectors;
