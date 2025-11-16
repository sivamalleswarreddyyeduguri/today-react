import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Vendor.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../shared/axiosInstance';

const AddVendor = ({ onAdded }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
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
        'http://localhost:8020/api/v1/vendor/save',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(response.data.statusMsg || 'Vendor added successfully!', {
        position: 'top-center',
        autoClose: 1500
      });

      setFormData({
        name: '',
        phoneNumber: '',
        email: '',
        state: '',
        city: ''
      });

      // Let parent close modal + refresh list
     
  setTimeout(() => {
  onAdded?.();
 }, 1600);

    } catch (error) {
      toast.error(error.response?.data?.errorMessage || 'Failed to add vendor', {
        position: 'top-center'
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      phoneNumber: '',
      email: '',
      state: '',
      city: ''
    });
  };

  return (
    <div className="vendor-form-wrap">
      <form onSubmit={handleSubmit} className="vendor-form dark">
        <div className="form-item">
          <label>Vendor Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g., Acme Supplies"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="e.g., 9876543210"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="e.g., vendor@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>State</label>
          <input
            type="text"
            name="state"
            placeholder="e.g., Maharashtra"
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
            placeholder="e.g., Pune"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">Add Vendor</button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddVendor;