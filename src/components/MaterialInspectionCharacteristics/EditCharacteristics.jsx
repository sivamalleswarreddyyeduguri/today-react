// import React from 'react';
// import { useParams } from 'react-router-dom';
// import EntityEditForm from '../shared/EntityEditForm';

// const EditCharacteristics = () => {
//   const { id } = useParams();

//   return (
//     <EntityEditForm
//       title="Edit Material Characteristic"
//       fetchUrl={`http://localhost:8020/api/v1/material/ch/${id}`}
//       updateUrl="http://localhost:8020/api/v1/material/material-char/edit"
//       redirectUrl="/characteristics-list"
//       fields={[
//         { name: 'characteristicDescription', label: 'Description', type: 'text' },
//         { name: 'upperToleranceLimit', label: 'Upper Tolerance Limit', type: 'number' },
//         { name: 'lowerToleranceLimit', label: 'Lower Tolerance Limit', type: 'number' },
//         { name: 'unitOfMeasure', label: 'Unit of Measurement', type: 'text' },
//         // { name: 'matId', label: 'Material ID', type: 'text', disabled: true }
//       ]}
//       entityKey="charId"
//     />
//   );
// };

// export default EditCharacteristics;

import React, { useEffect, useState } from 'react';
import '../../styles/Vendor.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../shared/axiosInstance';

const EditCharacteristics = ({ id, onUpdated }) => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    charDesc: '',
    utl: '',
    ltl: '',
    uom: '',
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
        const res = await axiosInstance.get(`http://localhost:8020/api/v1/material/ch/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const c = res.data?.data || res.data;

        setFormData({
          charDesc: c?.charDesc ?? c?.characteristicDescription ?? '',
          utl: c?.utl ?? c?.upperToleranceLimit ?? '',
          ltl: c?.ltl ?? c?.lowerToleranceLimit ?? '',
          uom: c?.uom ?? c?.unitOfMeasure ?? '',
          matId: c?.matId ?? ''   // if backend requires for update today, send it
        });
      } catch (error) {
        toast.error(error.response?.data?.errorMessage || 'Failed to load characteristic', {
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

    // validate numbers
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

    try {
      // 🔁 Match backend DTO exactly
      const payload = {
        characteristicId: Number(id),     // ✅ backend field name
        charDesc: formData.charDesc,
        utl: Number(formData.utl),
        ltl: Number(formData.ltl),
        uom: formData.uom,
        // If backend still requires matId, include it
      };

      const response = await axiosInstance.put(
        'http://localhost:8020/api/v1/material/material-char/edit',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(response.data?.statusMsg || 'Characteristic updated successfully!', {
        position: 'top-center',
        autoClose: 1200
      });

      const updated = response.data?.data || payload;

      setTimeout(() => {
        onUpdated?.(updated); // close modal + refresh list
      }, 600);
    } catch (error) {
      toast.error(error.response?.data?.errorMessage || 'Failed to update characteristic', {
        position: 'top-center'
      });
    }
  };

  if (loading) {
    return (
      <div className="vendor-form-wrap">
        <div className="vendor-form dark" style={{ padding: 12 }}>
          <div style={{ color: '#cbd5e1' }}>Loading characteristic details…</div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="vendor-form-wrap">
      <form onSubmit={handleSubmit} className="vendor-form dark">
        <div className="form-item">
          <label>Description</label>
          <input
            type="text"
            name="charDesc"
            placeholder="e.g., Tensile Strength"
            value={formData.charDesc}
            onChange={handleChange}
            required
            minLength={5}
            maxLength={256}
          />
        </div>

        <div className="form-item">
          <label>Upper Tolerance Limit</label>
          <input
            type="number"
            name="utl"
            placeholder="e.g., 100"
            value={formData.utl}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Lower Tolerance Limit</label>
          <input
            type="number"
            name="ltl"
            placeholder="e.g., 80"
            value={formData.ltl}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Unit of Measurement</label>
          <input
            type="text"
            name="uom"
            placeholder="e.g., MPa"
            value={formData.uom}
            onChange={handleChange}
            required
          />
        </div>

        {/* If you want to show the material id (disabled) */}
        {/* <div className="form-item">
          <label>Material ID</label>
          <input type="text" name="matId" value={formData.matId} onChange={handleChange} disabled />
        </div> */}

        <div className="form-buttons">
          <button type="submit" className="btn-primary">Save Changes</button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default EditCharacteristics;


