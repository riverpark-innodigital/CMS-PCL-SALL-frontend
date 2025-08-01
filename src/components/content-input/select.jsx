import { Select, ConfigProvider } from 'antd';
import PropTypes from "prop-types";

const SelectOption = ({ value, OnChange, placeholder, validate, label, required, options, disable }) => {
    return(
        <ConfigProvider
            theme={{
                components: {
                    Select: {
                        activeBorderColor: `${ validate ? 'outline-red-500' : '#00CE86' }`,
                        hoverBorderColor: `${ validate ? 'outline-red-500' : '#00CE86' }`,
                    },
                },
                }}
        >
            <div className="w-full">
                <label className="block text-sm text-gray-700 mb-[2px]">{label}<label className="text-red-600">{required ? ' *' : ''}</label></label>
                {
                    disable ?
                    <Select 
                        showSearch
                        disabled
                        value={value || value !== '' ? value : null } 
                        onChange={OnChange} 
                        placeholder={`${placeholder}`}
                        status={ validate && 'error' }
                        className={`h-[40px] w-full`}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={options}
                    />
                    :
                    <Select 
                        showSearch
                        value={value || value !== '' ? value : null } 
                        onChange={OnChange} 
                        placeholder={`${placeholder}`}
                        status={ validate && 'error' }
                        className={`h-[40px] w-full`}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={options}
                    />
                }
                <div className="mx-1 flex justify-end">
                    {
                        validate && <p className="text-red-500 text-[12px]">{validate}</p>
                    }
                </div>
            </div>
        </ConfigProvider>
    );
};

SelectOption.propTypes = {
    options: PropTypes.array,
    value: PropTypes.any,
    OnChange: PropTypes.any,
    placeholder: PropTypes.string,
    children: PropTypes.node,
    validate: PropTypes.string,
    label: PropTypes.string,
    required: PropTypes.bool,
}

export default SelectOption;