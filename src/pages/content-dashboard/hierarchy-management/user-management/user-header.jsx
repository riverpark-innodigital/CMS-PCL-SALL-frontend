import Banner from '../../../../assets/cms-banner.png';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const UserHeader = ({ title }) => {

    const navigate = useNavigate();
    
    return(
        <>
            <div className="banner z-0">
                <img src={Banner} alt=""  className="relative" />
                <div className="gg flex absolute px-[30px]">
                    <h1 className="text-[20px] invisible text-white">{title}</h1>
                    <div className='flex items-center gap-5'>
                        <button onClick={() => navigate('/hierarchy-management/user/create-single')} className="flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 focus:outline-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Add a new user
                        </button>
                        <button onClick={() => navigate('/hierarchy-management/user/create-multiple')} className="flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 focus:outline-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Multiple Users
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

UserHeader.propTypes = {
    title: PropTypes.any,
};

export default UserHeader;

