import PropTypes from "prop-types";
import DotLoading from "../content-loading/dot-loading";
import { Button, ConfigProvider } from "antd";

const OutlineBTN = ({ lable, func, color, isLoading, size, otherStyle }) => {
    return(
        <ConfigProvider
        theme={{
            components: {
            Button: {
                defaultBg: color ? color : '#FFFFFF',
                defaultHoverBg: color ? color : '#FFFFFF',
                defaultHoverBorderColor: color ? color : '#00CE86',
                defaultBorderColor: color ? color : '#E0E0E0',
                defaultActiveBg: color ? color : '#FFFFFF',
                defaultActiveBorderColor: color ? color : '#00CE86',
            },
            },
        }}
        >
            <Button
                className={`${otherStyle}`}
                size={size} 
                onClick={func}
            >
                {isLoading ? <DotLoading /> : <span className='text-gray-800 text-[14px] px-[10px]'>{lable}</span>}    
            </Button>
        </ConfigProvider>
        // <Button className={`w-full ${otherStyle}`} variant={variant} onClick={func} color={color} disabled={isLoading}>{isLoading ? <DotLoading /> : lable}</Button>
    );
};

OutlineBTN.propTypes = {
    lable: PropTypes.string,
    func: PropTypes.func,
    color: PropTypes.string,
    isLoading: PropTypes.bool,
    variant: PropTypes.string,
    otherStyle: PropTypes.string,
    size: PropTypes.string,
}

export default OutlineBTN;