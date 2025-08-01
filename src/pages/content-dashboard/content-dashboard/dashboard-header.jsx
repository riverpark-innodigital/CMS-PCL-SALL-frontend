import Banner from '../../../assets/images/imgs/Header.png';
import PropTypes from 'prop-types';

const DashboardHeader = ({ title }) => {
    return(
        <div className="banner-dashboard z-0">
        <img src={Banner} alt="" srcSet="" className="relative w-full" />
        <div className="gg flex absolute px-[30px]">
            <h1 className="text-[20px] invisible text-white hidden">{title}</h1>
        </div>
    </div>
    );
};

DashboardHeader.propTypes = {
    title: PropTypes.any,
};

export default DashboardHeader;

