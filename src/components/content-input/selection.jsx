import { Select } from "@material-tailwind/react";
import { Empty } from 'antd';
import PropTypes from 'prop-types';

const Selector = ({ validate, value, OnChange, data, children, label }) => { 
    return(
        <div className="w-full">
            <Select color='teal' label={label} value={value} onChange={(value) => OnChange(value)}>
                {
                    data?.length === 0 ?
                    <div className="w-full flex justify-center">
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                    :
                    children
                }
            </Select>
            <div className="mx-1 flex justify-start">
                {
                    validate && <p className="text-red-500 text-[12px]">{validate}</p>
                }
            </div>
        </div>
    );
};

Selector.propTypes = {
    validate: PropTypes.string,
    value: PropTypes.number || PropTypes.string,
    OnChange: PropTypes.func,
    data: PropTypes.any,
    children: PropTypes.node,
    Color: PropTypes.string,
    label: PropTypes.string,
}

export default Selector;