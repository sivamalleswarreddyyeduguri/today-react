import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Carousel as BootstrapCarousel } from 'bootstrap';
import axiosInstance from '../components/shared/axiosInstance';
import Navbar from '../layouts/Navbar';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize Bootstrap carousel manually
    const carouselElement = document.getElementById('loginCarousel');
    if (carouselElement) {
      new BootstrapCarousel(carouselElement, {
        interval: 3000,
        ride: 'carousel',
        pause: false,
        touch: true,
      });
    }
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/api/v1/user/login', credentials);
      const { token, refreshToken, username, email, roles, mobileNumber, id } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('username', username);
      localStorage.setItem('email', email);
      localStorage.setItem('id', id);
      localStorage.setItem('mobileNumber', mobileNumber);
      localStorage.setItem('roles', JSON.stringify(roles));

      dispatch(setUser({ username, email, mobileNumber, roles }));

      toast.success('Login successful!', { position: 'top-center', autoClose: 1500 });

      setTimeout(() => {
        const rolesArray = Array.isArray(roles) ? roles : [roles];
        if (rolesArray.some(role => ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_INSPECTOR'].includes(role))) {
          navigate('/home');
        } else {
          navigate('/');
        }
      }, 1600);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed', { position: 'top-center' });
    }
  };

  return (
    <div className="d-flex flex-column vh-100 overflow-hidden">
      <Navbar />

      <div className="container-fluid flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="row w-100 g-0 shadow rounded overflow-hidden" style={{ maxWidth: '900px' }}>

          {/* Left Section */}
          <div className="col-md-6 bg-light p-5 d-flex flex-column justify-content-center">
            <h2 className="mb-3">LOGIN</h2>
            <p className="mb-4">Please log in to access resources for a better experience.</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-3 input-group">
                <span className="input-group-text">👤</span>
                <input
                  name="username"
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3 input-group">
                <span className="input-group-text">🔒</span>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-hcl w-100">Login Now</button>
            </form>
            <p className="mt-3 text-center">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>

          {/* Right Section with Carousel */}
          <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center p-5 bg-hcl text-white">
            <div id="loginCarousel" className="carousel slide w-100 h-50 position-relative">
              
              {/* Carousel Indicators */}
              <div className="carousel-indicators">
                <button type="button" data-bs-target="#loginCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#loginCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#loginCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
              </div>

              {/* Carousel Items */}
              <div className="carousel-inner text-center">
                <div className="carousel-item active">
                  <h4>Very good works are waiting for you. Login Now!</h4>
                  <p>Explore our quality inspection features.</p>
                </div>
                <div className="carousel-item">
                  <h4>Track inspection lots efficiently!</h4>
                  <p>Manage vendors, plants, and materials seamlessly.</p>
                </div>
                <div className="carousel-item">
                  <h4>Visualize data with ease!</h4>
                  <p>Generate graphs and insights for better decisions.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
