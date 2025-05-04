// src/components/common/PageTitle.js

import React from 'react';
import './PageTitle.scss';

const PageTitle = ({ title, subtitle, action, children }) => {
  return (
    <div className="page-title">
      <div className="page-title-content">
        <h1>{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
        {children}
      </div>
      {action && <div className="page-title-action">{action}</div>}
    </div>
  );
};

export default PageTitle;