import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';
import { useState } from 'react';

const TextEditor = ({ value, OnChange, maxLength, format, vildate }) => {

    const [error, setError] = useState('');
    const [charCount, setCharCount] = useState(0); // Tracks the character count

    const handleChangeValue = (e) => {
        const inputValue = e.target.value;
        const regexThai = /^[\u0E00-\u0E7F\s0-9-@#_$%^&*()!,?"' ]*$/;
        const regexEN = /^[A-Za-z0-9-@#_$%^&*()!,?"' ]*$/;
        const regexENNumber = /^[A-Za-z0-9-@#_$%^&*()!,?"' ]*$/;

        if (format === true) {
            if (regexThai.test(inputValue) && inputValue.length <= (maxLength === undefined ? 255 : maxLength)) {
                OnChange(inputValue);
                setCharCount(inputValue.length);
                setError(''); // Clear error
              } else if (!regexThai.test(inputValue)) {
                setError('Invalid character!');
              }   
        } else if (format === false) {
            if (regexEN.test(inputValue) && inputValue.length <= (maxLength === undefined ? 255 : maxLength)) {
                OnChange(inputValue);
                setCharCount(inputValue.length);
                setError(''); // Clear error
              } else if (!regexEN.test(inputValue)) {
                setError('Invalid character!');
              }  
        } else if (format === undefined) {
            if (regexENNumber.test(inputValue) && inputValue.length <= (maxLength === undefined ? 255 : maxLength)) {
                OnChange(inputValue);
                setCharCount(inputValue.length);
                setError(''); // Clear error
            } else if (!regexEN.test(inputValue)) {
                setError('Invalid character!');
            }  
        }
    }

    return(
        <div>
            <ReactQuill className="rounded-lg mt-4" theme="snow" value={value} onChange={handleChangeValue} />
        {
            maxLength !== undefined &&
            <p className="ml-1 text-[12px]">
                ({charCount}/{maxLength})
            </p>
        }
        {
            error && !vildate && <p className="text-red-500 text-[12px]">{error}</p>
        }
        {
            vildate && <p className="text-red-500 text-[12px]">{vildate}</p>
        }
    </div>
    );
};

TextEditor.propTypes = {
    label: PropTypes.string,
    color: PropTypes.string,
    value: PropTypes.string,
    OnChange: PropTypes.func,
    type: PropTypes.string,
    icon: PropTypes.any,
    maxLength: PropTypes.number,
    format: PropTypes.bool,
    vildate: PropTypes.string,
};

export default TextEditor;