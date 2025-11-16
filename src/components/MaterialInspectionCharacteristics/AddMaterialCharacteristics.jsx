import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Vendor.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../shared/axiosInstance';

const AddMaterialCharacteristics = ({ materialId, onAdded }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    charDesc: '',
    utl: '',
    ltl: '',
    uom: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!materialId) {
      toast.error('Material ID is missing. Cannot add characteristic.', { position: 'top-center' });
      return;
    }

    const upper = parseFloat(formData.utl);
    const lower = parseFloat(formData.ltl);

    if (isNaN(upper) || isNaN(lower)) {
      toast.error('Please enter valid numeric values for tolerance limits.', { position: 'top-center' });
      return;
    }

    if (lower > upper) {
      toast.error('Lower tolerance limit must be less than or equal to upper tolerance limit', {
        position: 'top-center'
      });
      return;
    }

    if (!token) {
      toast.error('Unauthorized: Please login first.', { position: 'top-center' });
      navigate('/login');
      return;
    }

    try {
      const response = await axiosInstance.post(
        'http://localhost:8020/api/v1/material/material-char/save',
        { ...formData, matId: String(materialId) },  // 🔒 ensure id is string if backend expects that
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(response.data?.statusMsg || 'Material Characteristic added successfully!', {
        position: 'top-center',
        autoClose: 1200
      });

      setFormData({
        charDesc: '',
        utl: '',
        ltl: '',
        uom: ''
      });

      // ✅ notify parent to close modal + refresh list
      setTimeout(() => {
        onAdded?.(response.data?.data); // optional: pass created char if you want optimistic UI later
      }, 600);

    } catch (error) {
      toast.error(error.response?.data?.errorMessage || 'Failed to add characteristic', {
        position: 'top-center'
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      charDesc: '',
      utl: '',
      ltl: '',
      uom: ''
    });
  };

  return (
    <div className="vendor-form-wrap">
      <form onSubmit={handleSubmit} className="vendor-form dark">
        <div className="form-item">
          <label>Characteristic Description</label>
          <input
            type="text"
            name="charDesc"
            value={formData.charDesc}
            onChange={handleChange}
            required
            minLength={5}
            maxLength={256}
            placeholder="e.g., Tensile Strength"
          />
        </div>

        <div className="form-item">
          <label>Upper Tolerance Limit</label>
          <input
            type="number"
            name="utl"
            value={formData.utl}
            onChange={handleChange}
            required
            placeholder="e.g., 100"
          />
        </div>

        <div className="form-item">
          <label>Lower Tolerance Limit</label>
          <input
            type="number"
            name="ltl"
            value={formData.ltl}
            onChange={handleChange}
            required
            placeholder="e.g., 80"
          />
        </div>

        <div className="form-item">
          <label>Unit of Measurement</label>
          <input
            type="text"
            name="uom"
            value={formData.uom}
            onChange={handleChange}
            required
            placeholder="e.g., MPa"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">Add Characteristic</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddMaterialCharacteristics;
