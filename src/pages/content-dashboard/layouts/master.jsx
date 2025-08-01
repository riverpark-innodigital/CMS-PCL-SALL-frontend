// Main Library
import { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { ToastContainer } from 'react-toastify';
import MenuComponent from './menu';

// Sup Library
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import Logo from '../../../assets/cms-logo.png';
import CutLogo from '../../../assets/images/imgs/cut_logo.png';

// New Components
import Navbar from "./nav";
import { LayoutProvider } from '../../../constants/contexts/LayoutContext';

// Layout
const DashMasterLayout = ({ children, title }) => {
    const locatpage = useLocation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(Cookies.get('DrawerLeft') === 'true');

    const cbSidebar = (isDrawerOpen) => {
        setIsDrawerOpen(isDrawerOpen);
    }

    const toggleSidebar = () => {
    const newDrawerState = !isDrawerOpen;
    
    setIsDrawerOpen(newDrawerState);
    cbSidebar(newDrawerState);
    Cookies.set("DrawerLeft", newDrawerState);
    };

    useEffect(() => {
        Cookies.set('lastPath', locatpage.pathname);
    }, [locatpage]);

    return (
        <>
            <div className='font-primaryRegular text-blue-gray-700 w-full text-[14px]'>
                <div className='w-full flex duration-300 ease-in-out'>
                    <div
                        className={`h-screen ${ isDrawerOpen === true ? 'w-[312px] ' : 'w-[80px] hover:w-[312px]' } bg-white group border-r transition-all duration-300 ease-in-out `}
                    >
                        <div className={`flex items-center justify-between px-4 py-[22px] transition-opacity duration-300
                        ${isDrawerOpen ? 'opacity-100' : 'group-hover:opacity-100 group-hover:flex hidden'}
                        `}>
                        <img src={Logo} alt="Logo" className="h-8" />
                        <button
                        className="text-gray-700 focus:outline-none lg:hidden"
                        onClick={toggleSidebar}
                        >
                        <svg
                            className="w-6 h-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                        </button>
                        </div>

                        {/* Mini Logo */}
                        <div className={`flex items-center justify-between px-4 py-[22px] transition-opacity duration-300
                        ${isDrawerOpen ? 'hidden' : 'opacity-100 group-hover:opacity-0 group-hover:hidden'}
                        `}>
                        <img src={CutLogo} alt="Logo" className="h-8" />
                        </div>
                        {/* Sidebar Menu */}
                        <div className={`${ isDrawerOpen === true ? '' : '' } p-4 space-y-4 transition-all duration-300`}>
                            <MenuComponent isOpenDrawer={isDrawerOpen} />
                        </div>
                    </div>
                    <div className={`w-full`}>
                        <Navbar cbSidebar={cbSidebar} title={title} />
                        <LayoutProvider>
                            {children}
                        </LayoutProvider>
                    </div>
                </div>
               
               
                <ToastContainer />
                {/* <OldMasterBody children={children} title={title} /> */}
            </div>
        </>
    );
};

DashMasterLayout.propTypes = {
    children: PropTypes.any,
    title: PropTypes.string,
    path: PropTypes.any,
};

export default DashMasterLayout;