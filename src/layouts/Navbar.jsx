import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import HCLLogo from "../assets/hcltech-new-logo.svg";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container-fluid ms-5">
        {/* Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img 
            src={HCLLogo} 
            alt="HCL Logo" 
            style={{ height: '30px', marginRight: '8px' }} 
          />
          <span>Quality Inspect</span>
        </Link>

      

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto me-5">
            <li className="nav-item mx-2">
              <Link
                to="/about"
                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              >
                ℹ️ About
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/register"
                className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
              >
                🆕 Create Account
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/login"
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                🔐 Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
