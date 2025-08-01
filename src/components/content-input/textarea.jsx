import PropType from "prop-types";
import { useState, useEffect } from "react";
import { Input, ConfigProvider } from 'antd';

const TextArea = ({ label, OnChange, value, maxLength, format, vildate, required, placeholder }) => {

    const { TextArea } = Input;
    const [error, setError] = useState('');
    const [charCount, setCharCount] = useState(value.length); // Tracks the character count
    const [, setTyped] = useState(false);

    useEffect(() => {
        setCharCount(value?.length || 0);
    }, [value]);

    const handleChangeValue = (e) => {
        const inputValue = e.target.value;
        const regexThai = /^[\u0E00-\u0E7F\s0-9-@#_$%^&*()!.,?'"/|{};: ]*$/;
        const regexEN = /^[A-Za-z0-9-@#_$%^&*()!.,?'"/|{};: ]*$/;

        if (format === true) {
            if (regexThai.test(inputValue) && inputValue.length <= (maxLength === undefined ? 255 : maxLength)) {
                OnChange(inputValue);
                setCharCount(inputValue.length);
                setError(''); // Clear error
                setTyped(true);
              } else if (!regexThai.test(inputValue)) {
                setError('Invalid character!');
              }   
        } else if (format === false) {
            if (regexEN.test(inputValue) && inputValue.length <= (maxLength === undefined ? 255 : maxLength)) {
                OnChange(inputValue);
                setCharCount(inputValue.length);
                setError(''); // Clear error
                setTyped(true);
              } else if (!regexEN.test(inputValue)) {
                setError('Invalid character!');
              }  
        } else if (format === undefined) {
            if (inputValue.length <= (maxLength === undefined ? 255 : maxLength)) {
                OnChange(inputValue);
                setCharCount(inputValue.length);
                setError(''); // Clear error
                setTyped(true);
            } else if (!regexEN.test(inputValue)) {
                setError('Invalid character!');
            }  
        }
    }

    return(
        <ConfigProvider
            theme={{
                components: {
                Input: {
                    activeBorderColor: '#00CE86',
                    hoverBorderColor: '#00CE86',
                    colorBorder: "#B0BEC5",
                },
                },
            }}
        >
            <div className="w-full">
                <label className="block text-sm text-gray-700 mb-[2px]">{label}<label className="text-red-600">{required ? ' *' : ''}</label></label>
                <TextArea 
                    onChange={handleChangeValue} 
                    value={value}
                    placeholder={placeholder}
                />
                <div className="mx-1 flex justify-between">
                    {
                        maxLength !== undefined &&
                        <p className="text-[12px]">
                            ({charCount}/{maxLength})
                        </p>
                    }
                    {
                        error && <p className="text-red-500 text-[12px]">{error}</p>
                    }
                    {
                        vildate && <p className="text-red-500 text-[12px]">{vildate}</p>
                    }
                </div>
            </div>
        </ConfigProvider>
    );
};

TextArea.propTypes = {
    color: PropType.string,
    label: PropType.string,
    OnChange: PropType.func,
    value: PropType.string,
    maxLength: PropType.number,
    vildate: PropType.string,
    format: PropType.bool,
    required: PropType.bool,
    placeholder: PropType.string,
}

export default TextArea;