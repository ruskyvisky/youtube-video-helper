import { useEffect, useRef } from 'react';

export function useAutoSave<T>(
    data: T,
    onSave: (data: T) => void | Promise<void>,
    delay: number = 2000
) {
    const timeoutRef = useRef<NodeJS.Timeout>();
    const dataRef = useRef<T>(data);
    const isFirstRender = useRef(true);

    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    useEffect(() => {
        // Skip auto-save on first render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
            onSave(dataRef.current);
        }, delay);

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data, delay, onSave]);

    // Manual save function
    const saveNow = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        onSave(dataRef.current);
    };

    return { saveNow };
}
