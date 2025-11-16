import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Vendor.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../shared/axiosInstance';

const AddMaterial = ({ onAdded }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    materialId: '',
    materialDesc: '',
    type: ''
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
        'http://localhost:8020/api/v1/material/save',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(response.data?.statusMsg || 'Material added successfully!', {
        position: 'top-center',
        autoClose: 1500
      });

      setFormData({ materialId: '', materialDesc: '', type: '' });

      
  setTimeout(() => {
  onAdded?.();
  }, 1600);

    } catch (error) {
      toast.error(error.response?.data?.errorMessage || 'Failed to add material', {
        position: 'top-center'
      });
    }
  };

  const handleCancel = () => {
    setFormData({ materialId: '', materialDesc: '', type: '' });
  };

  return (
    <div className="vendor-form-wrap">
      <form onSubmit={handleSubmit} className="vendor-form dark">
        <div className="form-item">
          <label>Material ID</label>
          <input
            type="text"
            name="materialId"
            placeholder="e.g., MAT-10001"
            value={formData.materialId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Description</label>
          <input
            type="text"
            name="materialDesc"
            placeholder="e.g., Mild Steel Plate"
            value={formData.materialDesc}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Type</label>
          <input
            type="text"
            name="type"
            placeholder="e.g., Raw"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">Add Material</button>
          <button type="button" className="btn-ghost" onClick={handleCancel}>Cancel</button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddMaterial;