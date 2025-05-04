import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

/**
 * Custom hook for managing the theme (dark/light mode)
 * @returns [darkMode, toggleDarkMode] tuple
 */
const useTheme = (): [boolean, () => void] => {
    // Get the theme from localStorage or use system preference as fallback
    const [darkMode, setDarkMode] = useLocalStorage<boolean>('darkMode', false);
    const [mounted, setMounted] = useState(false);

    // Toggle the dark mode
    const toggleDarkMode = useCallback(() => {
        setDarkMode(!darkMode);
    }, [darkMode, setDarkMode]);

    // Effect to check for system preference on initial render
    useEffect(() => {
        setMounted(true);

        // Check for dark mode preference in localStorage
        const savedDarkMode = localStorage.getItem('darkMode');

        if (savedDarkMode === null) {
            // If no preference is set, use system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setDarkMode(prefersDark);
        }
    }, [setDarkMode]);

    // Effect to add or remove 'dark' class to/from the document body
    useEffect(() => {
        if (!mounted) return;

        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode, mounted]);

    return [darkMode, toggleDarkMode];
};

export default useTheme;