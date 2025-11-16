import React, { useEffect, useState } from 'react';
import '../../styles/Vendor.css'; // reuse styles
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../shared/axiosInstance';

const EditMaterial = ({ id, onUpdated }) => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    materialDesc: '',
    type: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized: Please login first.', { position: 'top-center' });
      setLoading(false); // prevent stuck loader if no token
      return;
    }

    (async () => {
      try {
        const res = await axiosInstance.get(`http://localhost:8020/api/v1/material/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const m = res.data?.data || res.data;

        setFormData({
          materialDesc: m?.materialDesc ?? '',
          type: m?.type ?? ''
        });
      } catch (error) {
        toast.error(error.response?.data?.errorMessage || 'Failed to load material', {
          position: 'top-center'
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (e) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized: Please login first.', { position: 'top-center' });
      return;
    }

    try {
      const payload = { materialId: id, ...formData };
      const response = await axiosInstance.put(
        'http://localhost:8020/api/v1/material/edit',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(response.data?.statusMsg || 'Material updated successfully!', {
        position: 'top-center',
        autoClose: 1200
      });

      // If backend returns the updated material, pass it up (optional for optimistic UI)
      const updated = response.data?.data || payload;

      // ✅ notify parent so MaterialList can close modal + refetch via refreshKey
      setTimeout(() => {
        onUpdated?.(updated);
      }, 600);
    } catch (error) {
      toast.error(error.response?.data?.errorMessage || 'Failed to update material', {
        position: 'top-center'
      });
    }
  };

  if (loading) {
    return (
      <div className="vendor-form-wrap">
        <div className="vendor-form dark" style={{ padding: 12 }}>
          <div style={{ color: '#cbd5e1' }}>Loading material details…</div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="vendor-form-wrap">
      <form onSubmit={handleSubmit} className="vendor-form dark">
        <div className="form-item">
          <label>Material Description</label>
          <input
            type="text"
            name="materialDesc"
            placeholder="e.g., Mild Steel Plate IS2062"
            value={formData.materialDesc}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Material Type</label>
          <input
            type="text"
            name="type"
            placeholder="e.g., Raw Material"
            value={formData.type}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">Save Changes</button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default EditMaterial;