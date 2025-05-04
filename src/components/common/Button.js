// src/components/common/Button.js

import React from 'react';
import './Button.scss';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  fullWidth = false,
  startIcon,
  endIcon,
  ...props
}) => {
  const buttonClasses = [
    'custom-button',
    `button-${variant}`,
    `button-${size}`,
    fullWidth ? 'button-full-width' : '',
    disabled ? 'button-disabled' : '',
  ].join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {startIcon && <span className="button-icon button-icon-start">{startIcon}</span>}
      <span className="button-text">{children}</span>
      {endIcon && <span className="button-icon button-icon-end">{endIcon}</span>}
    </button>
  );
};

export default Button;