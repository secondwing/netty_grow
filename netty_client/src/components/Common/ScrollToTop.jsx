import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            // If there is a hash, scroll to the element
            const element = document.getElementById(hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // If no hash, scroll to top
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]);

    return null;
}

export default ScrollToTop;
