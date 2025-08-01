import { useMemo, useState, useEffect } from 'react';
import { Button, ColorPicker } from 'antd';
import ColorSelectorIcon from "../../assets/images/svg/color-select.svg";
import PropTypes from 'prop-types';

const DefaultColorPicker = ({ onChange, defaultColor, isResetColor }) => {
    const [color, setColor] = useState(defaultColor ?? '#ffffff');

    const bgColor = useMemo(() => (
        typeof color === 'string' ? color : color.toHexString()
    ), [color]);

    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(bgColor);
        }

        if (isResetColor === true) {
            setColor('#ffffff');
        }
    }, [bgColor, onChange, isResetColor]);

    return (
        <>
            <div className='flex'>Select Color <div className='text-red-500'>*</div></div>
            <div className='flex justify-between w-full gap-2 h-[42px]'>
                <div className='h-full w-full rounded-md border border-gray-300' style={{ backgroundColor: bgColor }}></div>
                <ColorPicker value={color} onChange={setColor}>
                    <Button size="large">
                        <div className='flex items-center'>
                            <img src={ColorSelectorIcon} alt="Color Selector" className='w-[20px] h-[20px]' />
                            <span className='text-gray-800 text-[14px] pl-[10px] pr-[20px]'>Color</span>
                        </div>
                    </Button>
                </ColorPicker>
            </div>
        </>
    );
};

DefaultColorPicker.propTypes = {
    onChange: PropTypes.func,
    defaultColor: PropTypes.string,
}

export default DefaultColorPicker;