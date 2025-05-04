// src/pages/Profile.js

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetUserDetailsQuery, useUpdateUserDetailsMutation } from '../services/authApi';
import { useAuth } from '../hooks/useAuth';
import { updateUser } from '../features/auth/authSlice';
import { handleApiError } from '../utils/handleApiError';
import PageTitle from '../components/common/PageTitle';
import Button from '../components/common/Button';
import SkeletonLoader from '../components/common/SkeletonLoader';
import { toast } from 'react-toastify';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  // Get user details
  const { data: userDetails, isLoading, error } = useGetUserDetailsQuery();
  const [updateUserDetails, { isLoading: isUpdating }] = useUpdateUserDetailsMutation();
  
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  
  // Update form data when user details are loaded
  useEffect(() => {
    if (userDetails) {
      setFormData({
        email: userDetails.email || '',
        first_name: userDetails.first_name || '',
        last_name: userDetails.last_name || '',
      });
    }
  }, [userDetails]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  
  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Toggle edit mode
  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    
    // Reset form data when canceling edit
    if (isEditing && userDetails) {
      setFormData({
        email: userDetails.email || '',
        first_name: userDetails.first_name || '',
        last_name: userDetails.last_name || '',
      });
      setErrors({});
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      // Call update user API
      const updatedUser = await updateUserDetails(formData).unwrap();
      
      // Update Redux state
      dispatch(updateUser(updatedUser));
      
      // Exit edit mode
      setIsEditing(false);
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      handleApiError(error);
    }
  };
  
  // If data is loading, show skeleton
  if (isLoading) {
    return (
      <div className="profile-page">
        <PageTitle title="Your Profile" />
        <div className="profile-container">
          <SkeletonLoader type="avatar" />
          <div className="profile-details">
            <SkeletonLoader type="text" count={3} />
          </div>
        </div>
      </div>
    );
  }
  
  // If there's an error
  if (error) {
    return (
      <div className="profile-page">
        <PageTitle title="Your Profile" />
        <div className="error-message">
          <h2>Error loading profile</h2>
          <p>There was an error loading your profile information. Please try again later.</p>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>
    );
  }
  
  // Create avatar URL
  const avatarUrl = userDetails ? 
    `https://ui-avatars.com/api/?name=${userDetails.first_name}+${userDetails.last_name}&background=random&size=200` : 
    '';
  
  return (
    <div className="profile-page">
      <PageTitle title="Your Profile" />
      
      <div className="profile-container">
        <div className="profile-avatar">
          <img src={avatarUrl} alt={`${userDetails?.first_name || ''} ${userDetails?.last_name || ''}`} />
        </div>
        
        <div className="profile-details">
          <div className="profile-header">
            <h2>{userDetails?.first_name} {userDetails?.last_name}</h2>
            <div className="profile-username">@{userDetails?.username}</div>
            
            <Button 
              variant={isEditing ? "secondary" : "primary"}
              onClick={handleToggleEdit}
              disabled={isUpdating}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isUpdating}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={isUpdating}
                  />
                  {errors.first_name && <div className="error-message">{errors.first_name}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="last_name">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={isUpdating}
                  />
                  {errors.last_name && <div className="error-message">{errors.last_name}</div>}
                </div>
              </div>
              
              <div className="form-actions">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{userDetails?.email}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Member since:</span>
                <span className="info-value">
                  {new Date().toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* User's posts section (could be added later) */}
      <div className="user-posts-section">
        <h3>Your Posts</h3>
        {/* We could fetch and display the user's posts here */}
        <p>Coming soon...</p>
      </div>
    </div>
  );
};

export default Profile;