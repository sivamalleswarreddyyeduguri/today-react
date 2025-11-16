// import React from 'react';
// import { useParams } from 'react-router-dom';
// import EntityEditForm from '../shared/EntityEditForm';

// const EditPlant = () => {
//   const { id } = useParams();

//   return (
//     <EntityEditForm
//       title="Edit Plant"
//       fetchUrl={`http://localhost:8020/api/v1/plant/${id}`}
//       updateUrl="http://localhost:8020/api/v1/plant/edit"
//       redirectUrl="/plant-list"
//       fields={[
//         { name: 'plantName', label: 'Plant Name', type: 'text' },
//         { name: 'state', label: 'State', type: 'text' },
//         { name: 'city', label: 'City', type: 'text' },
//         // { name: 'status', label: 'Active', type: 'checkbox' }
//       ]}
//       entityKey="plantId"
//     />
//   );
// };

// export default EditPlant;

import React, { useEffect, useState } from 'react';
import '../../styles/Vendor.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../shared/axiosInstance';

const EditPlant = ({ id, onUpdated }) => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    plantName: '',
    state: '',
    city: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized: Please login first.', { position: 'top-center' });
      setLoading(false); // prevent stuck loader
      return;
    }
    (async () => {
      try {
        const res = await axiosInstance.get(`http://localhost:8020/api/v1/plant/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const p = res.data?.data || res.data;
        setFormData({
          plantName: p?.plantName ?? '',
          state: p?.state ?? '',
          city: p?.city ?? ''
        });
      } catch (error) {
        toast.error(error.response?.data?.errorMessage || 'Failed to load plant details', {
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
      // Include plantId in body if your backend expects it
      const payload = { plantId: id, ...formData };

      const response = await axiosInstance.put(
        'http://localhost:8020/api/v1/plant/edit',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(response.data?.statusMsg || 'Plant updated successfully!', {
        position: 'top-center',
        autoClose: 1200
      });

      // If backend returns the updated plant, pass it up (optional, supports optimistic UI)
      const updated = response.data?.data || payload;

      // ✅ Correct callback to refresh the list in PlantList
      setTimeout(() => {
        onUpdated?.(updated); // PlantList closes modal + refreshes via refreshKey
      }, 600);
    } catch (error) {
      toast.error(error.response?.data?.errorMessage || 'Failed to update plant', {
        position: 'top-center'
      });
    }
  };

  if (loading) {
    return (
      <div className="vendor-form-wrap">
        <div className="vendor-form dark" style={{ padding: 12 }}>
          <div style={{ color: '#cbd5e1' }}>Loading plant details…</div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="vendor-form-wrap">
      <form onSubmit={handleSubmit} className="vendor-form dark">
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
          <button type="submit" className="btn-primary">Save Changes</button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default EditPlant;