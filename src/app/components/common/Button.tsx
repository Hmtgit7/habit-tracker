'use client';

import React from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className = '',
    ...props
}) => {
    // Define styles based on variant
    const variantStyles = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
        outline: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        ghost: 'text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-gray-800'
    };

    // Define sizes
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-5 py-2.5 text-lg'
    };

    // Combine all styles
    const buttonStyles = `
    rounded-md font-medium transition-colors duration-200
    flex items-center justify-center gap-2
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
    disabled:opacity-60 disabled:cursor-not-allowed
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

    return (
        <motion.button
            className={buttonStyles}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && (
                <span className="mr-2">
                    <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </span>
            )}

            {!isLoading && leftIcon && <span>{leftIcon}</span>}
            <span>{children}</span>
            {!isLoading && rightIcon && <span>{rightIcon}</span>}
        </motion.button>
    );
};

export default Button;