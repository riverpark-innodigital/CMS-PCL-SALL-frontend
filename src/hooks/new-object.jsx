import PropTypes from 'prop-types';

const GetNewObject = ({ date }) => {

    const currentDate = new Date();

    const ms1 = currentDate.getTime();
    const ms2 = new Date(date).getTime() || currentDate.getTime();
    let diff = ms2 - ms1;
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    return diffDays <= 2 ?
    (
        <div className="bg-primaryofdashboard text-white text-xs px-2 py-1 rounded-md">
            New
        </div>
    )
    : null;
};

GetNewObject.propTypes = {
    date: PropTypes.any,
}

export default GetNewObject;