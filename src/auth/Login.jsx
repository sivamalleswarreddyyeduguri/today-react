import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import '../styles/auth.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../components/shared/axiosInstance';
import Navbar from '../layouts/Navbar';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
          navigate('/');
        } else {
          navigate('/home');
        }
      }, 1600);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed', { position: 'top-center' });
    }
  };

  return (
    <div>
      {/* Top Navbar */}
      <Navbar />

      {/* Auth Page */}
      <div className="auth-page">
        <div className="auth-container">
          {/* Left Section */}
          <div className="auth-left">
            <h2>LOGIN</h2>
            <p>Please log in to access resources for a better experience.</p>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <span className="icon">👤</span>
                <input
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <span className="icon">🔒</span>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="login-btn">Login Now</button>
            </form>

            <p className="register-text">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>

          {/* Right Section */}
          <div className="auth-right">
            <div className="promo-card">
              <h3>Very good works are waiting for you. Login Now!</h3>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
