import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';

import { useEffect } from 'react';

const MasterLayout = ({children, title}) => {

    useEffect(() => {
        document.title = `${ title === undefined ? 'PCL CMS' : `${title} | PCL CMS`}`;
    }, [title]);

    return(
        <>
        <div className='duration-200 font-primaryRegular'>
            <main>
                {children}
            </main>
            <ToastContainer />
        </div>
        </>
    );
};

MasterLayout.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
};

export default MasterLayout;