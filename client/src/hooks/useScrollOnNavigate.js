// a normal website jumps to the top when you open a new page, and to the
// Clients section when the link ends in #clients. React Router swaps the page
// without a real page load, so neither happens unless we do it here.
//
// Layout calls this once, so it covers every page
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

export function useScrollOnNavigate() {
    const { pathname, hash, key } = useLocation();
    const previousPath = useRef(pathname);

    useEffect(() => {
        if (hash) {
            document.getElementById(hash.slice(1))?.scrollIntoView();
            return;
        }
        // same page as before (the first load, or a refresh): leave the scroll where the browser put it
        if (previousPath.current === pathname) return;
        previousPath.current = pathname;
        // 'instant' because gradientv.css turns on smooth scrolling, and a new page shouldn't glide
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [pathname, hash, key]);
}
