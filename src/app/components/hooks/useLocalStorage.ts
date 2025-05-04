import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    // State to store our value
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    // Initialize with stored value on first render only
    useEffect(() => {
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none use initialValue
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        } catch (error) {
            // If error, use initial value
            console.error(`Error reading localStorage key "${key}":`, error);
        }
    }, [key]); // Only run when key changes, not on every render

    // Return a wrapped version of useState's setter function that
    // persists the new value to localStorage
    const setValue = (value: T) => {
        try {
            // Allow value to be a function
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
}

export default useLocalStorage;