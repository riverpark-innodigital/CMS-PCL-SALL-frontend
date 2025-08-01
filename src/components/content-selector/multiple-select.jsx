import { Select, ConfigProvider } from "antd";
import PropTypes from "prop-types";

const MultiSelect = ({ options, onChange, defaultValue, label, required, placeholder, validate }) => {

    return(
        <div className="w-full">
            <ConfigProvider
            theme={{
                components: {
                Select: {
                    activeBorderColor: '#00CE86',
                    hoverBorderColor: '#00CE86',
                    colorBorder: "#B0BEC5",
                },
                },
            }}
            >
            <div className="w-full">
            <label className="block text-sm text-gray-700 mb-[2px]">{label}<label className="text-red-600">{required ? ' *' : ''}</label></label>
            </div>
                <Select
                    mode="multiple"
                    allowClear
                    size="large"
                    style={{
                        width: '100%',
                    }}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    value={defaultValue}
                    onChange={onChange}
                    options={options}
                    status={ validate && 'error' }
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                />
                 <div className="mx-1 flex justify-end">
                    {
                        validate && <p className="text-red-500 text-[12px]">{validate}</p>
                    }
                </div>
            </ConfigProvider>
        </div>
    );
};

MultiSelect.propTypes = {
    options: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,
    defaultValue: PropTypes.arrayOf(PropTypes.any),
    label: PropTypes.string,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    validate: PropTypes.string,
}

export default MultiSelect;