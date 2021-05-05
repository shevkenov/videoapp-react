import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function usePrevious(location) {
    const ref = useRef();

    useEffect(() => {
        ref.current = location
    })

    return ref.current
}

export function useLocationChange(callback) {
    const { pathname } = useLocation();
    const prevLocation = usePrevious(pathname);

    useEffect(() => {
        if(pathname !== prevLocation) callback()
        
    }, [prevLocation, pathname, callback])
    
    return prevLocation !== pathname;
}
