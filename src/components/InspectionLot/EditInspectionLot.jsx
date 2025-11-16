import React, { useEffect, useState } from 'react';
import '../../styles/Vendor.css'; // reuse styles
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../shared/axiosInstance';

const EditInspectionLot = ({ id, onUpdated }) => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    result: '',
    remarks: '',
    date: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized: Please login first.', { position: 'top-center' });
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await axiosInstance.get(`http://localhost:8020/api/v1/inspection/lot/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const lot = res.data?.data || res.data;

        setFormData({
          result: lot?.result ?? '',
          remarks: lot?.remarks ?? '',
          date: lot?.inspectionEndDate ?? '' // or creationDate if needed
        });
      } catch (error) {
        toast.error(error.response?.data?.errorMessage || 'Failed to load inspection lot', {
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
      const payload = { id, ...formData };
      const response = await axiosInstance.put(
        'http://localhost:8020/api/v1/inspection/lot/edit',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(response.data?.statusMsg || 'Inspection lot updated successfully!', {
        position: 'top-center',
        autoClose: 1200
      });

      const updated = response.data?.data || payload;

      setTimeout(() => {
        onUpdated?.(updated);
      }, 600);
    } catch (error) {
      toast.error(error.response?.data?.errorMessage || 'Failed to update inspection lot', {
        position: 'top-center'
      });
    }
  };

  if (loading) {
    return (
      <div className="vendor-form-wrap">
        <div className="vendor-form dark" style={{ padding: 12 }}>
          <div style={{ color: '#cbd5e1' }}>Loading inspection lot details…</div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="vendor-form-wrap">
      <form onSubmit={handleSubmit} className="vendor-form dark">
        <div className="form-item">
          <label>Result</label>
          <input
            type="text"
            name="result"
            placeholder="e.g., PASS / FAIL"
            value={formData.result}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Remarks</label>
          <input
            type="text"
            name="remarks"
            placeholder="Enter remarks"
            value={formData.remarks}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
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

export default EditInspectionLot;