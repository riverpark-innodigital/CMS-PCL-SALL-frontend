import Banner from '../../../../assets/cms-banner.png';
import PropTypes from 'prop-types';
import GroupPerModal from './form/groupper-modal';

const GroupPermissionHeader = ({ title }) => {
    return(
        <>
            <div className="banner z-0">
                <img src={Banner} alt=""  className="relative" />
                <div className="gg flex absolute px-[30px]">
                    <h1 className="text-[20px] invisible text-white">{title}</h1>
                    <GroupPerModal />
                </div>
            </div>
        </>
    );
};

GroupPermissionHeader.propTypes = {
    title: PropTypes.any,
};

export default GroupPermissionHeader;

