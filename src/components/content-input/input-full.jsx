// import { Input } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Input, ConfigProvider } from 'antd';
import { MdErrorOutline } from "react-icons/md";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'

const InputComponet = ({ label, value, OnChange, vildate, type, maxLength, format, placeholder, required }) => {

    const [error, setError] = useState('');
    const [charCount, setCharCount] = useState(0); // Tracks the character count
    const [typing, setTyped] = useState(false);

    useEffect(() => {
        setCharCount(value?.length || 0);
    }, [value]);
    
    const handleChangeValue = (e) => {
        const inputValue = e.target.value;
        const regexThai = /^[\u0E00-\u0E7F\s0-9-@#_$%^&*()!.,?'"/|{};: ]*$/;
        const regexEN = /^[A-Za-z0-9-@#_$%^&*()!.,?'"/|{}:; ]*$/;


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
        <div className="w-full">
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
                <label className="block text-sm text-gray-700 mb-[2px]">{label}<label className="text-red-600">{required ? ' *' : ''}</label></label>
                {
                    type !== 'password' &&
                    <Input 
                        size="large"
                        type={type == undefined ? 'text' : type} 
                        placeholder={placeholder}
                        value={value}
                        status={ error || vildate && !typing && 'error' }
                        suffix={ error || vildate && !typing && <MdErrorOutline /> }
                        onChange={handleChangeValue} 
                    />
                }
                {
                    type === 'password' &&
                    <Input.Password
                        size="large"
                        type={type == undefined ? 'text' : type} 
                        placeholder={placeholder}
                        value={value}
                        status={ error || vildate && !typing && 'error' }
                        suffix={ error || vildate && !typing && <MdErrorOutline /> }
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        onChange={handleChangeValue} 
                    />
                }
                <div className="mx-1 flex justify-between">
                    {
                        maxLength !== undefined &&
                        <p className="text-[12px]">
                            ({charCount}/{maxLength})
                        </p>
                    }
                    {
                        error && !vildate && <p className="text-red-500 text-[12px]">{error}</p>
                    }
                    {
                        vildate && !error && !typing && <p className="text-red-500 text-[12px]">{vildate}</p>
                    }
                </div>
            </ConfigProvider>
        </div>
    );
};

InputComponet.propTypes = {
    label: PropTypes.string,
    color: PropTypes.string,
    value: PropTypes.string,
    OnChange: PropTypes.func,
    type: PropTypes.string,
    icon: PropTypes.any,
    maxLength: PropTypes.number,
    format: PropTypes.bool,
    vildate: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
};

export default InputComponet;