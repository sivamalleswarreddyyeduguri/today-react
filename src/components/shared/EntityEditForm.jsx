import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/shared/EntityEditForm.css';
import axiosInstance from './axiosInstance';

const EntityEditForm = ({
  title,
  fetchUrl,
  updateUrl,
  redirectUrl,
  fields,
  entityKey
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Unauthorized: Please login first.', { position: 'top-center' });
      navigate('/login');
      return;
    }

    axiosInstance.get(fetchUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setFormData(response.data);
    })
    .catch(error => {
      toast.error('Failed to fetch details', { position: 'top-center' });
    })
    .finally(() => {
      setLoading(false);
    });
  }, [fetchUrl, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axiosInstance.put(updateUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success(response.data.statusMsg || 'Updated successfully!', {
        position: 'top-center',
        autoClose: 2000
      });

      setTimeout(() => {
        navigate(redirectUrl);
      }, 1600);

    } catch (error) {
      toast.error(error.response?.data?.errorMessage || 'Failed to update', {
        position: 'top-center'
      });
    }
  };

  return (
    <div className="entity-edit-container">
      <nav className="entity-edit-nav">
        <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
        <div className="nav-right">
          <button onClick={() => navigate('/home')}>Home</button>
          <button onClick={() => navigate('/logout')}>Logout</button>
        </div>
      </nav>

      <h2>{title}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="entity-edit-form">
          {fields.map((field) => (
            <label key={field.name}>
              {field.label}:
              {field.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  name={field.name}
                  checked={formData[field.name] || false}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required
                />
              )}
            </label>
          ))}
          <div className="form-buttons">
            <button type="submit">Update</button>
            <button type="button" onClick={() => navigate(redirectUrl)}>Cancel</button>
          </div>
        </form>
      )}
      <ToastContainer />
    </div>
  );
};

export default EntityEditForm;