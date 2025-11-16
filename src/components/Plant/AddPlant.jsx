// import React, { useState } from 'react';
// // import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import '../../styles/Vendor.css'; // Reusing same CSS
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import axiosInstance from '../shared/axiosInstance';

// const AddPlant = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     plantId: '',
//     plantName: '',
//     state: '',
//     city: ''
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');

//     if (!token) {
//       toast.error('Unauthorized: Please login first.', { position: 'top-center' });
//       navigate('/login');
//       return;
//     }

//     try {
//       const response = await axiosInstance.post(
//         'http://localhost:8020/api/v1/plant/save',
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       toast.success(response.data.statusMsg || 'Plant added successfully!', {
//         position: 'top-center',
//         autoClose: 2000
//       });

//       setFormData({
//         plantId: '',
//         plantName: '',
//         state: '',
//         city: ''
//       });

//     } catch (error) {
//       toast.error(error.response?.data?.errorMessage || 'Failed to add plant', {
//         position: 'top-center'
//       });
//     }
//   };

//   const handleCancel = () => {
//     setFormData({
//       plantId: '',
//       plantName: '',
//       state: '',
//       city: ''
//     });
//   };

//   return (
//     <div className="vendor-container">
//       <nav className="vendor-nav">
//         <button onClick={() => navigate(-1)}>Back</button>
//         <button onClick={() => navigate('/plant-list')}>View Plants</button>
//         <button onClick={() => navigate('/home')}>Home</button>
//         <button onClick={() => navigate('/logout')}>Logout</button>
//       </nav>

//       <h2>Add Plant</h2>
//       <form onSubmit={handleSubmit} className="vendor-form">
//         <label>
//           Plant ID:
//           <input type="text" name="plantId" value={formData.plantId} onChange={handleChange} required />
//         </label>
//         <label>
//           Plant Name:
//           <input type="text" name="plantName" value={formData.plantName} onChange={handleChange} required />
//         </label>
//         <label>
//           State:
//           <input type="text" name="state" value={formData.state} onChange={handleChange} required />
//         </label>
//         <label>
//           City:
//           <input type="text" name="city" value={formData.city} onChange={handleChange} required />
//         </label>
//         <div className="form-buttons">
//           <button type="submit">Add Plant</button>
//           <button type="button" onClick={handleCancel}>Cancel</button>
//         </div>
//       </form>
//       <ToastContainer />
//     </div>
//   );
// };

// export default AddPlant;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Vendor.css'; // Reuse dark form styles
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../shared/axiosInstance';

const AddPlant = ({ onAdded }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    plantName: '',
    state: '',
    city: ''
  });

  const handleChange = (e) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Unauthorized: Please login first.', { position: 'top-center' });
      navigate('/login');
      return;
    }

    try {
      const response = await axiosInstance.post(
        'http://localhost:8020/api/v1/plant/save',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(response.data?.statusMsg || 'Plant added successfully!', {
        position: 'top-center',
        autoClose: 1500
      });

      // Reset form
      setFormData({ plantName: '', state: '', city: '' });

     
  setTimeout(() => {
  onAdded?.();
  }, 1600);

    } catch (error) {
      toast.error(error.response?.data?.errorMessage || 'Failed to add plant', {
        position: 'top-center'
      });
    }
  };

  const handleCancel = () => {
    setFormData({ plantName: '', state: '', city: '' });
  };

  return (
    <div className="vendor-form-wrap">
      <form onSubmit={handleSubmit} className="vendor-form dark">
        <div className="form-item">
          <label>Plant Id</label>
          <input
            type="text"
            name="plantId"
            placeholder="e.g., P4001"
            value={formData.plantId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Plant Name</label>
          <input
            type="text"
            name="plantName"
            placeholder="e.g., Rayalaseema TPS"
            value={formData.plantName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>State</label>
          <input
            type="text"
            name="state"
            placeholder="e.g., Andhra Pradesh"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>City</label>
          <input
            type="text"
            name="city"
            placeholder="e.g., Kadapa"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">Add Plant</button>
          <button type="button" className="btn-ghost" onClick={handleCancel}>Cancel</button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddPlant;