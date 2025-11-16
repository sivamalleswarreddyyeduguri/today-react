// import React, { useState } from 'react';
// import '../../styles/shared/EntityList.css';


// const SearchForm = ({ onSearch, onClose }) => {
//   const [formData, setFormData] = useState({
//     fromDate: '',
//     toDate: '',
//     materialId: '',
//     vendorId: 0,
//     plantId: '',
//     status: ''
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSearch(formData);
//     onClose(); 
//   };

//   return (
//     <form className="search-form" onSubmit={handleSubmit}>
//       <div className="form-row">
//         <label>From Date:</label>
//         <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} required />
//       </div>
//       <div className="form-row">
//         <label>To Date:</label>
//         <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} required />
//       </div>
//       <div className="form-row">
//         <label>Material ID:</label>
//         <input type="text" name="materialId" value={formData.materialId} onChange={handleChange} />
//       </div>
//       <div className="form-row">
//         <label>Vendor ID:</label>
//         <input type="number" name="vendorId" value={formData.vendorId} onChange={handleChange} />
//       </div>
//       <div className="form-row">
//         <label>Plant ID:</label>
//         <input type="text" name="plantId" value={formData.plantId} onChange={handleChange} />
//       </div>
//       <div className="form-row">
//         <label>Status:</label>
//         <input type="text" name="status" value={formData.status} onChange={handleChange} />
//       </div>
//       <button type="submit" className="search-button">Search</button>
//     </form>
//   );
// };

// export default SearchForm;

import React, { useState } from 'react';
import '../../styles/shared/EntityList.css';

const SearchForm = ({ onSearch, onClose }) => {
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    materialId: '',
    vendorId: 0, // UI default; we'll convert 0 -> null on submit
    plantId: '',
    status: ''   // empty means "no status filter"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ensure vendorId stays numeric in state
    if (name === 'vendorId') {
      const num = value === '' ? '' : Number(value);
      setFormData(prev => ({ ...prev, [name]: num }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const normalize = (val) => {
    if (val === null || val === undefined) return null;
    const trimmed = String(val).trim();
    return trimmed.length ? trimmed : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build payload with frontend-friendly normalization:
    // - Strings: trim empty -> null
    // - vendorId: 0 or '' -> null
    const payload = {
      fromDate: formData.fromDate,              // required (yyyy-MM-dd)
      toDate: formData.toDate,                  // required (yyyy-MM-dd)
      materialId: normalize(formData.materialId),
      vendorId:
        formData.vendorId === '' || Number(formData.vendorId) <= 0
          ? null
          : Number(formData.vendorId),
      plantId: normalize(formData.plantId),
      status: normalize(formData.status)        // '' means no filter
    };

    onSearch(payload);
    onClose();
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>From Date:</label>
        <input
          type="date"
          name="fromDate"
          value={formData.fromDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <label>To Date:</label>
        <input
          type="date"
          name="toDate"
          value={formData.toDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <label>Material ID:</label>
        <input
          type="text"
          name="materialId"
          value={formData.materialId}
          onChange={handleChange}
          placeholder="e.g., MAT123"
        />
      </div>

      <div className="form-row">
        <label>Vendor ID:</label>
        <input
          type="number"
          name="vendorId"
          value={formData.vendorId}
          onChange={handleChange}
          min="0"
          placeholder="0 = Any"
        />
      </div>

      <div className="form-row">
        <label>Plant ID:</label>
        <input
          type="text"
          name="plantId"
          value={formData.plantId}
          onChange={handleChange}
          placeholder="e.g., PLANT01"
        />
      </div>

      {/* ✅ Status dropdown with PASS / INSP (optional) */}
      <div className="form-row">
        <label>Status:</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="">-- Any --</option>
          <option value="PASS">PASS</option>
          <option value="INSP">INSP</option>
        </select>
      </div>

      <button type="submit" className="search-button">Search</button>
    </form>
  );
};

export default SearchForm;
