import React, { useState, useEffect } from 'react';
import '../../styles/Vendor.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../shared/axiosInstance';

const AddInspectionActuals = ({ lotId, onAdded }) => {
  const [formData, setFormData] = useState({
    lotId: lotId ?? '',
    charId: '',       
    maxMeas: '',
    minMeas: ''
  });

  const [chars, setChars] = useState([]);    
  const [loading, setLoading] = useState(false);
  const [loadingChars, setLoadingChars] = useState(false);

  useEffect(() => {
    if (lotId != null) {
      setFormData(f => ({ ...f, lotId }));
    }
  }, [lotId]);

  useEffect(() => {
    const fetchChars = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Unauthorized: Please login first.', { position: 'top-center' });
        return;
      }
      setLoadingChars(true);
      try {
        const res = await axiosInstance.get(
          `http://localhost:8020/api/v1/inspection/get-all-char/${lotId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = Array.isArray(res.data?.data) ? res.data.data
                   : Array.isArray(res.data) ? res.data
                   : [];

  
        setChars(data);
      } catch (err) {
        toast.error(
          err.response?.data?.errorMessage || 'Failed to load characteristics.',
          { position: 'top-center' }
        );
        setChars([]);
      } finally {
        setLoadingChars(false);
      }
    };

    fetchChars();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(f => ({
      ...f,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized: Please login first.', { position: 'top-center' });
      return;
    }

    if (!formData.lotId || !formData.charId || formData.maxMeas === '' || formData.minMeas === '') {
      toast.error('Please fill all fields correctly.', { position: 'top-center' });
      return;
    }

    const max = parseFloat(formData.maxMeas);
    const min = parseFloat(formData.minMeas);
    if (Number.isNaN(max) || Number.isNaN(min)) {
      toast.error('Measurements must be numeric.', { position: 'top-center' });
      return;
    }
    if (min > max) {
      toast.error('Lower tolerance limit cannot be greater than upper tolerance limit.', { position: 'top-center' });
      return;
    }

    const payload = {
      lotId: Number(formData.lotId),
      charId: Number(formData.charId),  
      maxMeas: max,
      minMeas: min
    };

    try {
      setLoading(true);

      const res = await axiosInstance.post(
        'http://localhost:8020/api/v1/inspection/save/lot/actu',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(res.data?.statusMsg || 'Inspection Actuals added successfully!', {
        position: 'top-center',
        autoClose: 1200
      });

      setTimeout(() => {
        onAdded?.(res.data?.data || payload);
      }, 600);
    } catch (error) {
      toast.error(error.response?.data?.errorMessage || 'Failed to add inspection actuals', {
        position: 'top-center'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      lotId: lotId ?? '',
      charId: '',
      maxMeas: '',
      minMeas: ''
    });
  };

  return (
    <div className="vendor-form-wrap">
      <form onSubmit={handleSubmit} className="vendor-form dark">
        <div className="form-item">
          <label>Lot ID</label>
          <input
            type="number"
            name="lotId"
            value={formData.lotId ?? ''} // controlled
            onChange={handleChange}
            required
            disabled
          />
        </div>

        <div className="vendor-form">
          <label>Characteristic</label>
          <select
            name="charId"
            value={formData.charId ?? ''} // controlled
            onChange={handleChange}
            required
            disabled={loadingChars}
          >
            <option value="" disabled>{loadingChars ? 'Loading...' : '-- Select Characteristic --'}</option>
            {chars.map((c) => (
              <option key={c.characteristicId} value={c.characteristicId}>
                {c.characteristicDescription}
              </option>
            ))}
          </select>
        </div>

        <div className="form-item">
          <label>Upper Tolerance Limit</label>
          <input
            type="number"
            step="0.01"
            name="maxMeas"
            value={formData.maxMeas}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Lower Tolerance Limit</label>
          <input
            type="number"
            step="0.01"
            name="minMeas"
            value={formData.minMeas}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary" disabled={loading || loadingChars}>
            {loading ? 'Saving...' : 'Add Actuals'}
          </button>
          <button type="button" onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddInspectionActuals;
