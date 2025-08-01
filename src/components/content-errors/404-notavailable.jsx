import NotFoundGif from '../../assets/images/gif/not-available.gif';
import PropTypes from 'prop-types';

const NotAvailableErorr = ({ lable }) => {
    return(
        <div className="w-full py-10 flex justify-center items-center">
            <div>
                <div className="w-full flex justify-center">
                    <img src={NotFoundGif} className='w-[100px]' alt="" />
                </div>
                <div className="w-full flex justify-center">
                    <span>{lable}</span>
                </div>
            </div>
        </div>
    );
};

NotAvailableErorr.propTypes = {
    lable: PropTypes.string,
};

export default NotAvailableErorr;