import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../components/shared/axiosInstance';
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

const AdminDashboard = () => {
  const [inspectors, setInspectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inspectors'); // 'inspectors' or 'profile'
  const [showModal, setShowModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [newInspector, setNewInspector] = useState({ username: '', password: '', email: '', mobileNum: '' });
  const [adminDetails, setAdminDetails] = useState({
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email'),
    mobileNum: localStorage.getItem('mobileNumber') || ''
  });

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch inspectors
  const fetchInspectors = async () => {
    try {
      const res = await axiosInstance.get('/user/get-all', {
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
    if (activeTab === 'inspectors') {
      fetchInspectors();
    }
  }, [activeTab]);

  // Create Inspector
  const handleCreateInspector = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/create-inspector', newInspector, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(response.data.statusMsg || 'Inspector created successfully!', {
        position: 'top-center',
        autoClose: 1500
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
      await axiosInstance.delete(`/user/delete/${id}`, {
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

  // Update Admin Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put('/user/update-admin', adminDetails, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(response.data.statusMsg || 'Profile updated successfully!', {
        position: 'top-center',
        autoClose: 1500
      });

      setTimeout(() => {
        setShowEditProfileModal(false);
        localStorage.setItem('username', adminDetails.username);
        localStorage.setItem('email', adminDetails.email);
        localStorage.setItem('mobile number', adminDetails.mobileNum);
      }, 1600);
    } catch (error) {
      toast.error(error.response?.data?.errorMessage || 'Failed to update profile', {
        position: 'top-center'
      });
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <ul className="sidebar-menu">
          <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            <FaUserCircle /> Profile
          </li>
          <li className={activeTab === 'inspectors' ? 'active' : ''} onClick={() => setActiveTab('inspectors')}>
            <FaUser /> Inspectors
          </li>
          <li><FaIndustry /> <Link to="/vendor-list">Vendor</Link></li>
          <li><FaWarehouse /> <Link to="/plant-list">Plant</Link></li>
          <li><FaCubes /> <Link to="/material-list">Material</Link></li>
          <li><FaClipboardList /> <Link to="/inspection-lot-list">Inspection Lot</Link></li>
        </ul>
        <div className="logout-section" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === 'profile' ? (
          <div className="profile-details">
            <h2>Admin Profile</h2>
            <p><strong>Username:</strong> {adminDetails.username}</p>
            <p><strong>Email:</strong> {adminDetails.email}</p>
            <p><strong>Mobile:</strong> {adminDetails.mobileNum || 'N/A'}</p>
            <button className="edit-profile-btn" onClick={() => setShowEditProfileModal(true)}>Edit Profile</button>
          </div>
        ) : (
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
                      <FaEdit className="action-icon edit" title="Edit" />
                      <FaTrash
                        className="action-icon delete"
                        title="Delete"
                        onClick={() => handleDeleteInspector(insp.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal for Add Inspector */}
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

      {/* Modal for Edit Profile */}
      {showEditProfileModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Profile</h3>
            <form onSubmit={handleUpdateProfile} className="modal-form">
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

export default AdminDashboard;