// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { logout } from '../redux/userSlice';
// import { useNavigate } from 'react-router-dom';
// import '../styles/ProfileMenu.css';

// const ProfileMenu = () => {
//   const username = useSelector(state => state.user.username);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

// const handleLogout = () => {
//   localStorage.removeItem('token'); 
//   localStorage.removeItem('refreshToken');  
//   dispatch(logout());
//   navigate('/login');
// };

//   console.log(username + " from ProfileMenu");

//   return (
//     <div className="profile-menu">
//       <span className="profile-icon">👤</span>
//       <div className="profile-dropdown">
//         <p>{username}</p>
//         <button onClick={handleLogout}>Logout</button>
//       </div>
//     </div>
//   );
// };

// export default ProfileMenu;


// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { logout } from '../redux/userSlice';
// import { useNavigate } from 'react-router-dom';
// import '../styles/ProfileMenu.css';

// const ProfileMenu = () => {
//   const username = useSelector(state => state.user.username);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

// const handleLogout = () => {
//   localStorage.getItem('token'); 
//   localStorage.getItem('refreshToken');  

// };

//   console.log(username + " from ProfileMenu");

//   return (
//     <div className="profile-menu">
//       <span className="profile-icon">👤</span>
//       <div className="profile-dropdown">
//         <p>{username}</p>
//         <button onClick={handleLogout}>Logout</button>
//       </div>
//     </div>
//   );
// };

// export default ProfileMenu;

// import React, { useEffect, useMemo, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { logout as logoutAction } from '../redux/userSlice';
// import { useNavigate } from 'react-router-dom';
// // import axiosInstance from '../shared/axiosInstance';
// import '../styles/ProfileMenu.css';
// import axiosInstance from '../components/shared/axiosInstance';

// const ProfileMenu = () => {
//   const reduxUsername = useSelector((state) => state.user.username);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Load from localStorage on mount
//   const [profile, setProfile] = useState({
//     username: localStorage.getItem('username') || reduxUsername || '',
//     email: localStorage.getItem('email') || '',
//     mobileNumber: localStorage.getItem('mobileNumber') || '',
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [newPassword, setNewPassword] = useState('');

//   // First letter avatar (e.g., 'S' for 'siva')
//   const avatarLetter = useMemo(() => (profile.username ? profile.username[0].toUpperCase() : 'U'), [profile.username]);

//   useEffect(() => {
//     // Keep in sync if localStorage changes elsewhere
//     setProfile({
//       username: localStorage.getItem('username') || reduxUsername || '',
//       email: localStorage.getItem('email') || '',
//       mobileNumber: localStorage.getItem('mobileNumber') || '',
//     });
//   }, [reduxUsername]);

//   const handleLogout = () => {
//     // Clear tokens & user data
//     localStorage.removeItem('token');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('username');
//     localStorage.removeItem('email');
//     localStorage.removeItem('mobileNumber');

//     // Optional: clear everything
//     // localStorage.clear();

//     dispatch(logoutAction()); // update redux state if you track auth there
//     navigate('/login');
//   };

//   const handleEditToggle = () => {
//     setIsEditing((prev) => !prev);
//     // Reset password field when toggling
//     setNewPassword('');
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfile((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();

//     try {
//       const token = localStorage.getItem('token');
//              const id =  localStorage.getItem('id');

//       // Build request payload; include password only if set
//       const payload = {
//         username: profile.username,
//         email: profile.email,
//         mobileNum: profile.mobileNumber, 
//         ...(newPassword ? { password: newPassword } : {}),
//       };

//       const response = await axiosInstance.put(`/user/update/${id}`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Persist updates locally
//       localStorage.setItem('username', profile.username);
//       localStorage.setItem('email', profile.email);
//       localStorage.setItem('mobileNumber', profile.mobileNumber);


//       setIsEditing(false);
//     } catch (error) {
//       // toast.error(error.response?.data?.errorMessage || 'Failed to update profile');
//       console.error('Failed to update profile', error);
//     }
//   };

//   return (
//     <div className="profile-menu-container">
//       {/* Header with avatar letter */}
//       <div className="profile-header">
//         <div className="avatar-circle" aria-label="User avatar">
//           {avatarLetter}
//         </div>
//         <div className="profile-header-info">
//           <h3 className="profile-name">{profile.username || 'User'}</h3>
//           {/* <p className="profile-subtitle">Admin Profile</p> */}
//         </div>
//         <div className="profile-actions">
//           <button type="button" className="btn ghost" onClick={handleEditToggle}>
//             {isEditing ? 'Cancel' : 'Edit'}
//           </button>
//           <button type="button" className="btn danger" onClick={handleLogout}>
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Content */}
//       {!isEditing ? (
//         // View mode
//         <div className="profile-details">
//           <div className="detail-row">
//             <span className="detail-label">Username</span>
//             <span className="detail-value">{profile.username || '-'}</span>
//           </div>
//           <div className="detail-row">
//             <span className="detail-label">Email</span>
//             <span className="detail-value">{profile.email || '-'}</span>
//           </div>
//           <div className="detail-row">
//             <span className="detail-label">Mobile Number</span>
//             <span className="detail-value">{profile.mobileNumber || '-'}</span>
//           </div>
//         </div>
//       ) : (
//         // Edit mode
//         <form className="profile-edit-form" onSubmit={handleSave}>
//           <div className="form-row">
//             <label htmlFor="username">Username</label>
//             <input
//               id="username"
//               name="username"
//               value={profile.username}
//               onChange={handleChange}
//               placeholder="Enter username"
//               autoComplete="off"
//             />
//           </div>

//           <div className="form-row">
//             <label htmlFor="email">Email</label>
//             <input
//               id="email"
//               name="email"
//               type="email"
//               value={profile.email}
//               onChange={handleChange}
//               placeholder="Enter email"
//               autoComplete="off"
//             />
//           </div>

//           <div className="form-row">
//             <label htmlFor="mobileNumber">Mobile Number</label>
//             <input
//               id="mobileNumber"
//               name="mobileNumber"
//               value={profile.mobileNumber}
//               onChange={handleChange}
//               placeholder="Enter mobile number"
//               autoComplete="off"
//             />
//           </div>

//           <div className="form-row">
//             <label htmlFor="newPassword">Set New Password</label>
//             <input
//               id="newPassword"
//               name="newPassword"
//               type="password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               placeholder="Leave blank to keep current password"
//               autoComplete="new-password"
//             />
//           </div>

//           <div className="form-actions">
//             <button type="submit" className="btn primary">Save</button>
//             <button type="button" className="btn ghost" onClick={handleEditToggle}>
//               Cancel
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default ProfileMenu;

import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../styles/ProfileMenu.css';
import axiosInstance from '../components/shared/axiosInstance';

const ProfileMenu = () => {
  const reduxUsername = useSelector((state) => state.user.username);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load from localStorage on mount
  const [profile, setProfile] = useState({
    username: localStorage.getItem('username') || reduxUsername || '',
    email: localStorage.getItem('email') || '',
    mobileNumber: localStorage.getItem('mobileNumber') || '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // First letter avatar (e.g., 'S' for 'siva')
  const avatarLetter = useMemo(
    () => (profile.username ? profile.username[0].toUpperCase() : 'U'),
    [profile.username]
  );

  useEffect(() => {
    // Keep in sync if localStorage changes elsewhere
    setProfile({
      username: localStorage.getItem('username') || reduxUsername || '',
      email: localStorage.getItem('email') || '',
      mobileNumber: localStorage.getItem('mobileNumber') || '',
    });
  }, [reduxUsername]);

  const handleLogout = () => {
    // Clear tokens & user data
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('mobileNumber');

    dispatch(logoutAction()); // update redux state if you track auth there
    navigate('/login');
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    // Reset password field when toggling
    setNewPassword('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id'); // make sure you store this at login

      if (!id) {
        toast.error('User id is missing. Please re-login.', { position: 'top-center' });
        return;
      }

      // Build request payload; include password only if set
      const payload = {
        username: profile.username,
        email: profile.email,
        mobileNum: profile.mobileNumber,
        ...(newPassword ? { password: newPassword } : {}),
      };

      const response = await axiosInstance.put(`/api/v1/admin/update/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Persist updates locally
      localStorage.setItem('username', profile.username);
      localStorage.setItem('email', profile.email);
      localStorage.setItem('mobileNumber', profile.mobileNumber);

      // ✅ Success toast (message can be customized)
      toast.success(response.data?.statusMsg || 'Profile updated successfully!', {
        position: 'top-center',
        autoClose: 1500,
      });

      setIsEditing(false);
    } catch (error) {
      // ❌ Error toast
      toast.error(error.response?.data?.errorMessage || 'Failed to update profile', {
        position: 'top-center',
      });
      console.error('Failed to update profile', error);
    }
  };

  return (
    <div className="profile-menu-container">
      {/* Header with avatar letter */}
      <div className="profile-header">
        <div className="avatar-circle" aria-label="User avatar">
          {avatarLetter}
        </div>
        <div className="profile-header-info">
          <h3 className="profile-name">{profile.username || 'User'}</h3>
          {/* <p className="profile-subtitle">Admin Profile</p> */}
        </div>
        <div className="profile-actions">
          <button type="button" className="btn ghost" onClick={handleEditToggle}>
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          <button type="button" className="btn danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      {!isEditing ? (
        // View mode
        <div className="profile-details">
          <div className="detail-row">
            <span className="detail-label">Username</span>
            <span className="detail-value">{profile.username || '-'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{profile.email || '-'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Mobile Number</span>
            <span className="detail-value">{profile.mobileNumber || '-'}</span>
          </div>
        </div>
      ) : (
        // Edit mode
        <form className="profile-edit-form" onSubmit={handleSave}>
          <div className="form-row">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              value={profile.username}
              onChange={handleChange}
              placeholder="Enter username"
              autoComplete="off"
            />
          </div>

          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Enter email"
              autoComplete="off"
            />
          </div>

          <div className="form-row">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              id="mobileNumber"
              name="mobileNumber"
              value={profile.mobileNumber}
              onChange={handleChange}
              placeholder="Enter mobile number"
              autoComplete="off"
            />
          </div>

          <div className="form-row">
            <label htmlFor="newPassword">Set New Password</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              autoComplete="new-password"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn primary">Save</button>
            <button type="button" className="btn ghost" onClick={handleEditToggle}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileMenu;