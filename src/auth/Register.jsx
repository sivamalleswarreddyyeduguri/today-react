// import React, { useState } from 'react';
// // import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import '../styles/auth.css';
// import axiosInstance from '../components/shared/axiosInstance';

// const Register = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     email: '',
//     mobileNum: '',
//     role: 'USER'
//   });

//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const validate = () => {
//     const newErrors = {};
//     const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!*()]).{8,}$/;    
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

//     if (!formData.username.trim()) newErrors.username = 'Username is required';
//     if (!passwordRegex.test(formData.password)) {
//       newErrors.password =
//         'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
//     }
//     if (!emailRegex.test(formData.email)) {
//       newErrors.email = 'Invalid email format';
//     }
//     if (!formData.mobileNum.trim()) newErrors.mobileNum = 'Mobile number is required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: '' }); // clear error on change
//   };

//   const handleSubmit = async (e) => {
//     console.log("formData : ", formData);
    
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       const res = await axiosInstance.post('http://localhost:8020/api/v1/user/register', formData);
//       alert(res.data.statusMsg);
//       navigate('/login');
//     } catch (err) {
//       const errorMessage = err.response?.data?.errorMessage || 'Registration failed';
//       alert(errorMessage);
//     }
//   };

//   return (
//     <div className="auth-page">
//     <div className="auth-container auth-reg-page">
//       <h2>Register</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           name="username"
//           placeholder="Username"
//           onChange={handleChange}
//           required
//         />
//         {errors.username && <span className="error">{errors.username}</span>}

//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           onChange={handleChange}
//           required
//         />
//         {errors.password && <span className="error">{errors.password}</span>}

//         <input
//           name="email"
//           type="email"
//           placeholder="Email"
//           onChange={handleChange}
//           required
//         />
//         {errors.email && <span className="error">{errors.email}</span>}

//         <input
//           name="mobileNum"
//           placeholder="Phone Number"
//           onChange={handleChange}
//           required
//         />
//         {errors.mobileNum && <span className="error">{errors.mobileNum}</span>}

//         <button type="submit">Register</button>
//       </form>
//       <p>
//         Do you want to login? <Link to="/login">Login</Link>
//       </p>
//     </div>
//     </div>
//   );
// };

// export default Register;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';
import axiosInstance from '../components/shared/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../layouts/Navbar';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    mobileNum: '',
    role: 'USER'
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!*()]).{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
    }
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.mobileNum.trim()) newErrors.mobileNum = 'Mobile number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axiosInstance.post('/api/v1/user/register', formData);
      toast.success(res.data.statusMsg || 'Registration successful!', { position: 'top-center', autoClose: 1500 });
      setTimeout(() => navigate('/login'), 1600);
    } catch (err) {
      const errorMessage = err.response?.data?.errorMessage || 'Registration failed';
      toast.error(errorMessage, { position: 'top-center' });
    }
  };

  return (
    <div>
     <Navbar />
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Section */}
        <div className="auth-left">
          <h2>REGISTER</h2>
          <p>Create your account to get started</p>
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
            {errors.username && <span className="error">{errors.username}</span>}

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
            {errors.password && <span className="error">{errors.password}</span>}

            <div className="input-group">
              <span className="icon">✉️</span>
              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />
            </div>
            {errors.email && <span className="error">{errors.email}</span>}

            <div className="input-group">
              <span className="icon">📱</span>
              <input
                name="mobileNum"
                placeholder="Phone Number"
                onChange={handleChange}
                required
              />
            </div>
            {errors.mobileNum && <span className="error">{errors.mobileNum}</span>}

            <button type="submit" className="login-btn">Register</button>
          </form>

          <p className="register-text">
            Do you want to login? <Link to="/login">Login</Link>
          </p>
        </div>

        {/* Right Section */}
        <div className="auth-right">
          <div className="promo-card">
            <h3>Very good works are waiting for you — join now!</h3>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
    </div>
  );
};

export default Register;