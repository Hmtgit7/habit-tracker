'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useThemeContext } from '../providers/ThemeProvider';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
    leftBorderColor?: string;
    className?: string;
    isHoverable?: boolean;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
    children,
    title,
    subtitle,
    action,
    leftBorderColor,
    className = '',
    isHoverable = false,
    onClick
}) => {
    const { darkMode } = useThemeContext();

    const baseStyles = `
    rounded-xl shadow-sm
    ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
    ${leftBorderColor ? `border-l-4 border-[${leftBorderColor}]` : ''}
    ${isHoverable ? 'cursor-pointer' : ''}
    ${className}
  `;

    const cardContent = (
        <>
            {(title || action) && (
                <div className="flex justify-between items-center mb-4">
                    <div>
                        {title && <h3 className="font-bold text-lg">{title}</h3>}
                        {subtitle && <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </>
    );

    if (isHoverable) {
        return (
            <motion.div
                className={baseStyles}
                whileHover={{ y: -5 }}
                onClick={onClick}
            >
                <div className="p-4">{cardContent}</div>
            </motion.div>
        );
    }

    return (
        <div className={baseStyles} onClick={onClick}>
            <div className="p-4">{cardContent}</div>
        </div>
    );
};

export default Card;