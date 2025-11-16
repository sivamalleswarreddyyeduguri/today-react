import React, { useEffect, useState } from 'react';
import '../../styles/Vendor.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../shared/axiosInstance';

const AddInspectionLot = ({ onAdded }) => {
  const [formData, setFormData] = useState({
    matId: '',      // String (per DTO)
    plantId: '',    // String (per DTO)
    vendorId: '',   // Number (but keep as string in input, cast on submit)
    stDt: '',       // yyyy-MM-dd
    crDt: ''        // yyyy-MM-dd
  });

  const [materials, setMaterials] = useState([]);
  const [plants, setPlants] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized: Please login first.', { position: 'top-center' });
      setLoadingOptions(false);
      return;
    }

    (async () => {
      try {
        const [matRes, plantRes, vendorRes] = await Promise.all([
          axiosInstance.get('http://localhost:8020/api/v1/material/get-all', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axiosInstance.get('http://localhost:8020/api/v1/plant/get-all', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axiosInstance.get('http://localhost:8020/api/v1/vendor/all', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const mats = (matRes.data?.data || matRes.data || []).map(m => ({
          value: String(m.materialId),
          label: m.materialDesc ?? `Material ${m.materialId}`
        }));
        const pls = (plantRes.data?.data || plantRes.data || []).map(p => ({
          value: String(p.plantId),
          label: p.plantName ?? `Plant ${p.plantId}`
        }));
        const vens = (vendorRes.data?.data || vendorRes.data || []).map(v => ({
          value: String(v.vendorId),
          label: v.name ?? `Vendor ${v.vendorId}`
        }));

        setMaterials(mats);
        setPlants(pls);
        setVendors(vens);
      } catch (error) {
        toast.error(error.response?.data?.errorMessage || 'Failed to load dropdown options', {
          position: 'top-center'
        });
      } finally {
        setLoadingOptions(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const validateDates = (cr, st) => {
    // Client-side check to complement @ValidDateRange
    // Typical rule: creationDate <= startDate
    if (!cr || !st) return true;
    return cr <= st;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized: Please login first.', { position: 'top-center' });
      return;
    }

    // Basic validations matching LotCreationDto
    if (!formData.matId || !formData.plantId) {
      toast.error('Please select Material and Plant.', { position: 'top-center' });
      return;
    }
    if (!formData.vendorId) {
      toast.error('Please select Vendor.', { position: 'top-center' });
      return;
    }
    if (!formData.crDt || !formData.stDt) {
      toast.error('Please provide both Creation Date and Start Date (yyyy-mm-dd).', { position: 'top-center' });
      return;
    }
    if (!validateDates(formData.crDt, formData.stDt)) {
      toast.error('Creation Date cannot be after Start Date.', { position: 'top-center' });
      return;
    }

    try {
      // Align payload with LotCreationDto schema
      const payload = {
        matId: String(formData.matId),
        plantId: String(formData.plantId),
        vendorId: Number(formData.vendorId),   // DTO says int
        stDt: formData.stDt,                  // yyyy-mm-dd
        crDt: formData.crDt                   // yyyy-mm-dd
      };

      const res = await axiosInstance.post(
        'http://localhost:8020/api/v1/inspection/create/lot', // adjust if your create endpoint differs
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(res.data?.statusMsg || 'Inspection Lot created successfully!', {
        position: 'top-center',
        autoClose: 1200
      });

      setTimeout(() => {
        onAdded?.(res.data?.data || payload);
      }, 600);
    } catch (error) {
      toast.error(error.response?.data?.errorMessage || 'Failed to create inspection lot', {
        position: 'top-center'
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      matId: '',
      plantId: '',
      vendorId: '',
      stDt: '',
      crDt: ''
    });
  };

  return (
    <div className="vendor-form-wrap">
      <form onSubmit={handleSubmit} className="vendor-form dark">
        <div className="form-item">
          <label>Material</label>
          <select
            name="matId"
            value={formData.matId}
            onChange={handleChange}
            required
            disabled={loadingOptions || materials.length === 0}
          >
            <option value="">Select material</option>
            {materials.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="form-item">
          <label>Plant</label>
          <select
            name="plantId"
            value={formData.plantId}
            onChange={handleChange}
            required
            disabled={loadingOptions || plants.length === 0}
          >
            <option value="">Select plant</option>
            {plants.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="form-item">
          <label>Vendor</label>
          <select
            name="vendorId"
            value={formData.vendorId}
            onChange={handleChange}
            required
            disabled={loadingOptions || vendors.length === 0}
          >
            <option value="">Select vendor</option>
            {vendors.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="form-item">
          <label>Creation Date</label>
          <input
            type="date"
            name="crDt"
            value={formData.crDt}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-item">
          <label>Inspection Start Date</label>
          <input
            type="date"
            name="stDt"
            value={formData.stDt}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">Add Inspection Lot</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddInspectionLot;