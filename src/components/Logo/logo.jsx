import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import Logo from '../../assets/images/imgs/logo.png';

const LogoComponent = ({ fontSize, mode }) => {
    return (
        <Link to="/dashboard" className={`flex flex-col items-center ${mode !== undefined ? 'text-primary' : ''}`}>
            <img src={Logo} className="w-[100px]" alt="" />
        </Link>
    );
};

LogoComponent.propTypes = {
    fontSize: PropTypes.string,
    mode: PropTypes.any,
};

export default LogoComponent;