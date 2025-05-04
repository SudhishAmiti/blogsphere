// src/components/layout/Layout.js

import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../../hooks/useTheme';
import Header from './Header';
import Footer from './Footer';
import './Layout.scss';

const Layout = ({ children }) => {
  const { theme } = useTheme();
  
  // Apply theme to body
  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);
  
  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
      <Footer />
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
    </div>
  );
};

export default Layout;