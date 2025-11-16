// import React from 'react';
// import { Link } from 'react-router-dom';
// import '../styles/Navbar.css';

// const Navbar = () => {
//   return (
//     <nav className="navbar">
//       {/* <Link to="/home/vendor-list">Vendor</Link>
//       <Link to="/home/plant-list">Plant</Link>
//       <Link to="/home/material-list">Material</Link> */}
//       {/* <Link to="/home/add-material-characteristics">Material Inspection Characteristics</Link> */}
//       {/* <Link to="/home/inspection-lot-list">Inspection Lot</Link> */}
//       {/* <Link to="/home/search-criteria">Search Criteria</Link> */}
//     </nav>
//   );
// };

// export default Navbar;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="top-navbar" role="banner">
      <div className="nav-inner">
        {/* Brand (left) */}
        <Link to="/" className="brand" aria-label="Go to Home">
          <span className="brand-logo">QI</span>
          <span className="brand-text">Quality Inspect</span>
        </Link>

        {/* Right side links */}
        <nav className="nav-right" aria-label="Primary">
          <Link
            to="/about"
            className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            title="About"
          >
            <span className="icon" aria-hidden>ℹ️</span>
            <span className="label">About</span>
          </Link>

          <Link
            to="/register"
            className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
            title="Create Account"
          >
            <span className="icon" aria-hidden>🆕</span>
            <span className="label">Create Account</span>
          </Link>

          <Link
            to="/login"
            className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
            title="Login"
          >
            <span className="icon" aria-hidden>🔐</span>
            <span className="label">Login</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;