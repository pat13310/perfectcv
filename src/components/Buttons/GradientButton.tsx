import React, { ButtonHTMLAttributes, FC } from 'react';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const GradientButton: FC<GradientButtonProps> = ({ 
  children, 
  className = '', 
  disabled = false,
  type = 'button',
  ...props 
}) => {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={`w-full md:w-auto px-6 py-2 text-white font-medium rounded-3xl transition-all duration-300
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                 ${disabled 
                   ? 'bg-gray-300 cursor-not-allowed' 
                   : 'bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90 hover:opacity-100'}
                 ${className}`}
    >
      {children}
    </button>
  );
};

export default GradientButton;
