import  { useContext, createContext, useRef } from 'react';
import PropTypes from 'prop-types';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {

    const containerRef = useRef(null);

    const scrollToTop = () => {
        if (containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <LayoutContext.Provider value={{ scrollToTop }}>
            <main ref={containerRef} className="relative overflow-y-auto h-[90vh]">
                {children}
            </main>
        </LayoutContext.Provider>
    );
};

export const useLayoutContext = () => useContext(LayoutContext);

LayoutProvider.propTypes = {
    children: PropTypes.any,
}