import PropTypes from "prop-types";
const NormalCard = ({ children }) => {
    return(
        <div className="bg-white rounded-md drop-shadow-lg px-2 py-2">
            {children}
        </div>
    );
};

NormalCard.propTypes = {
    children: PropTypes.node,
};

export default NormalCard;