import Banner from '../../../assets/cms-banner.png';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProductHeader = ({ title }) => {

    const navigate = useNavigate();

    const handleCreate = () => {
        navigate('/product/create');
    };

    return (
        <>
            <div className="banner z-0">
                <img src={Banner} alt=""  className="relative" />
                <div className="gg flex absolute px-[30px]">
                    <h1 className="text-[20px] invisible text-white">{title}</h1>
                    <button onClick={handleCreate} className="flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 focus:outline-none">
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
                        Create New Product
                    </button>
                </div>
                {/* <div className="search-product absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <label className='text-white'>Search</label>
                    <div className="search-box relative flex gap-3">
                        <div className="icon-input absolute left flex items-center h-[100%] ml-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <input type="text" name="" id="" className='pl-9 rounded w-[320px]' placeholder='Search' />
                        <button
                            type="button"
                            className="flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 focus:outline-none"
                        >
                            <span className="flex items-center space-x-1">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                                <span>Search</span>
                            </span>
                        </button>
                    </div>
                </div> */}
            </div>

        </>
    )
};


ProductHeader.propTypes = {
    title: PropTypes.string.isRequired
};

export default ProductHeader;