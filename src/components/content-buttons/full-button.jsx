import PropTypes from "prop-types";
import DotLoading from "../content-loading/dot-loading";
import { Button, ConfigProvider } from "antd";

const ButtonFullComponent = ({ lable, func, color, isLoading, size, otherStyle }) => {
    return(
        <ConfigProvider
        theme={{
            components: {
            Button: {
                defaultBg: color ? color : '#00CE86',
                defaultHoverBg: color ? color : '#00CE86',
                defaultHoverBorderColor: color ? color : '#00CE86',
                defaultBorderColor: color ? color : '#00CE86',
                defaultActiveBg: color ? color : '#00CE86',
                defaultActiveBorderColor: color ? color : '#00CE86',
            },
            },
        }}
        >
            <Button
                className={`${otherStyle} w-full`}
                size={size} 
                onClick={func}
            >
                {isLoading ? <DotLoading /> : <span className='text-white text-[14px]'>{lable}</span>}    
            </Button>
        </ConfigProvider>
        // <Button className={`w-full ${otherStyle}`} variant={variant} onClick={func} color={color} disabled={isLoading}>{isLoading ? <DotLoading /> : lable}</Button>
    );
};

ButtonFullComponent.propTypes = {
    lable: PropTypes.string,
    func: PropTypes.func,
    color: PropTypes.string,
    isLoading: PropTypes.bool,
    variant: PropTypes.string,
    otherStyle: PropTypes.string,
    size: PropTypes.string,
}

export default ButtonFullComponent;