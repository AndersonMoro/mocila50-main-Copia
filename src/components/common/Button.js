import React from 'react';

function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button', 
  disabled = false,
  icon = null,
  className = ''
}) {
  const baseClasses = "inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    secondary: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500",
    danger: "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500"
  };
  
  const disabledClasses = "opacity-50 cursor-not-allowed";
  
  const classes = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${disabled ? disabledClasses : ''}
    ${className}
  `;
  
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}

export default Button;