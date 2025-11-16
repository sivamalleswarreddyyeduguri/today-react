// import React, { useEffect, useState } from 'react';
// import '../../styles/Vendor.css';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import axiosInstance from '../shared/axiosInstance';

// const EditVendor = ({ id, onUpdated }) => {
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     name: '',
//     phoneNumber: '',
//     email: '',
//     state: '',
//     city: ''
//   });

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       toast.error('Unauthorized: Please login first.', { position: 'top-center' });
//       return;
//     }
//     (async () => {
//       try {
//         const res = await axiosInstance.get(`http://localhost:8020/api/v1/vendor/${id}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         const v = res.data?.data || res.data;
//         setFormData({
//           name: v?.name ?? '',
//           phoneNumber: v?.phoneNumber ?? '',
//           email: v?.email ?? '',
//           state: v?.state ?? '',
//           city: v?.city ?? ''
//         });
//       } catch (error) {
//         toast.error(error.response?.data?.errorMessage || 'Failed to load vendor', {
//           position: 'top-center'
//         });
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   const handleChange = (e) =>
//     setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     if (!token) {
//       toast.error('Unauthorized: Please login first.', { position: 'top-center' });
//       return;
//     }

//     try {
//       const payload = { vendorId: id, ...formData };
//       const response = await axiosInstance.put(
//         'http://localhost:8020/api/v1/vendor/edit',
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       toast.success(response.data?.statusMsg || 'Vendor updated successfully!', {
//         position: 'top-center',
//         autoClose: 1500
//       });

           
//   setTimeout(() => {
//   onAdded?.();
//   }, 1600);

//     } catch (error) {
//       toast.error(error.response?.data?.errorMessage || 'Failed to update vendor', {
//         position: 'top-center'
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="vendor-form-wrap">
//         <div className="vendor-form dark" style={{ padding: 12 }}>
//           <div style={{ color: '#cbd5e1' }}>Loading vendor details…</div>
//         </div>
//         <ToastContainer />
//       </div>
//     );
//   }

//   return (
//     <div className="vendor-form-wrap">
//       <form onSubmit={handleSubmit} className="vendor-form dark">
//         <div className="form-item">
//           <label>Vendor Name</label>
//           <input
//             type="text"
//             name="name"
//             placeholder="e.g., Acme Supplies"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-item">
//           <label>Phone Number</label>
//           <input
//             type="tel"
//             name="phoneNumber"
//             placeholder="e.g., 9876543210"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-item">
//           <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             placeholder="e.g., vendor@example.com"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-item">
//           <label>State</label>
//           <input
//             type="text"
//             name="state"
//             placeholder="e.g., Maharashtra"
//             value={formData.state}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-item">
//           <label>City</label>
//           <input
//             type="text"
//             name="city"
//             placeholder="e.g., Pune"
//             value={formData.city}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="form-buttons">
//           <button type="submit" className="btn-primary">Save Changes</button>
//         </div>
//       </form>

//       <ToastContainer />
//     </div>
//   );
// };

// export default EditVendor;

import React, { useEffect, useState } from 'react';
import '../../styles/Vendor.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../shared/axiosInstance';

const EditVendor = ({ id, onUpdated }) => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    state: '',
    city: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized: Please login first.', { position: 'top-center' });
      setLoading(false); // avoid stuck loader
      return;
    }
    (async () => {
      try {
        const res = await axiosInstance.get(`http://localhost:8020/api/v1/vendor/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const v = res.data?.data || res.data;
        setFormData({
          name: v?.name ?? '',
          phoneNumber: v?.phoneNumber ?? '',
          email: v?.email ?? '',
          state: v?.state ?? '',
          city: v?.city ?? ''
        });
      } catch (error) {
        toast.error(error.response?.data?.errorMessage || 'Failed to load vendor', {
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
      const payload = { vendorId: id, ...formData };
      const response = await axiosInstance.put(
        'http://localhost:8020/api/v1/vendor/edit',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(response.data?.statusMsg || 'Vendor updated successfully!', {
        position: 'top-center',
        autoClose: 1200
      });

      // If backend returns the updated vendor, send it to parent (optional)
      const updated = response.data?.data || payload;

      // ✅ Notify parent so VendorList can refresh
      setTimeout(() => {
        onUpdated?.(updated); // VendorList: setEditId(null) + refreshKey++
      }, 600);
    } catch (error) {
      toast.error(error.response?.data?.errorMessage || 'Failed to update vendor', {
        position: 'top-center'
      });
    }
  };

  if (loading) {
    return (
      <div className="vendor-form-wrap">
        <div className="vendor-form dark" style={{ padding: 12 }}>
          <div style={{ color: '#cbd5e1' }}>Loading vendor details…</div>
        </div>
        <ToastContainer />
      </div>
    );
  }

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
          <button type="submit" className="btn-primary">Save Changes</button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default EditVendor;

