import { useState, useCallback, useRef, useEffect } from 'react';

const useHistory = (initialState) => {
    const [state, setState] = useState(initialState);
    const [past, setPast] = useState([]);
    const [future, setFuture] = useState([]);

    const lastChangeTime = useRef(0);

    // We use refs to access the latest state/history in event listeners or timeouts
    // without triggering re-renders or stale closures if we were to use them directly in dependencies excessively.
    // However, for the return values, we rely on standard state.

    const canUndo = past.length > 0;
    const canRedo = future.length > 0;

    const undo = useCallback(() => {
        if (past.length === 0) return;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        setFuture(prev => [state, ...prev]);
        setState(previous);
        setPast(newPast);
    }, [past, state]);

    const redo = useCallback(() => {
        if (future.length === 0) return;

        const next = future[0];
        const newFuture = future.slice(1);

        setPast(prev => [...prev, state]);
        setState(next);
        setFuture(newFuture);
    }, [future, state]);

    const set = useCallback((newStateOrUpdater, debounce = false) => {
        setState(prevState => {
            const newState = typeof newStateOrUpdater === 'function'
                ? newStateOrUpdater(prevState)
                : newStateOrUpdater;

            // Prevent unnecessary updates
            if (JSON.stringify(newState) === JSON.stringify(prevState)) return prevState;

            const now = Date.now();

            if (debounce) {
                // Logic: If the user is typing continuously (gap < 1000ms), we treat it as one "session".
                // We only push to history if it's the *start* of a session (gap > 1000ms).
                if (now - lastChangeTime.current > 1000) {
                    setPast(prev => [...prev, prevState]);
                    setFuture([]);
                }
                // If gap < 1000ms, we just update the state (extending the current session).
                // The 'past' remains the state *before* this session started.
            } else {
                // For structural changes (buttons, adds, deletes), always checkpoint.
                setPast(prev => [...prev, prevState]);
                setFuture([]);
            }

            lastChangeTime.current = now;
            return newState;
        });
    }, []);

    const clearHistory = useCallback(() => {
        setPast([]);
        setFuture([]);
    }, []);

    return {
        state,
        set,
        undo,
        redo,
        canUndo,
        canRedo,
        clearHistory,
        past,
        future
    };
};

export default useHistory;
