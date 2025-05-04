// src/components/layout/Header.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { logOut } from '../../features/auth/authSlice';
import { useLogoutMutation } from '../../services/authApi';
import ThemeToggle from '../common/ThemeToggle';
import Button from '../common/Button';
import './Header.scss';

const Header = () => {
  const { isAuthenticated, user, refreshToken } = useAuth();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await logout(refreshToken).unwrap();
      }
      dispatch(logOut());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still log out locally even if API call fails
      dispatch(logOut());
      navigate('/login');
    }
    
    // Close the menu after logout
    setIsMenuOpen(false);
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="main-header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <h1>BlogSphere</h1>
            </Link>
          </div>
          
          <div className="header-right">
            <ThemeToggle />
            
            <div className="mobile-menu-toggle" onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            
            <nav className={`main-nav ${isMenuOpen ? 'is-open' : ''}`}>
              <ul>
                <li>
                  <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
                </li>
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link to="/create" onClick={() => setIsMenuOpen(false)}>New Post</Link>
                    </li>
                    <li className="dropdown">
                      <button className="dropdown-toggle">
                        {user?.username || 'Account'}
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                        </li>
                        <li>
                          <button className="dropdown-item" onClick={handleLogout}>
                            Logout
                          </button>
                        </li>
                      </ul>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                    </li>
                    <li>
                      <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="primary" size="small">Sign Up</Button>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;