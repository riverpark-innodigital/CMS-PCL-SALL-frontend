import { IoIosSearch } from "react-icons/io";
import PropTypes from "prop-types";

const SearchInputComponent = ({
    value,
    onChange,
    placeholder
}) => {
    return(
        <div className="flex px-[14px] gap-[8px] items-center h-[44px] rounded-full border border-gray-300 bg-white">
            <IoIosSearch className="text-[20px]" />
            <input type="text" placeholder={placeholder} className="bg-transparent w-full outline-none" value={value} onChange={(e) => onChange(e.target.value)} />
        </div>
    );
};

SearchInputComponent.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string
}

export default SearchInputComponent;