import { Button, ConfigProvider } from "antd";
import PropTypes from "prop-types";
import DotLoading from "../content-loading/dot-loading";

const ButtonComponent = ({ label, defaultColor, size, handlerFunc, isLoading }) => {
    return(
        <ConfigProvider
        theme={{
            components: {
            Button: {
                defaultBg: defaultColor ? defaultColor : '#00CE86',
                defaultHoverBg: defaultColor ? defaultColor : '#00CE86',
                defaultHoverBorderColor: defaultColor ? defaultColor : '#00CE86',
                defaultBorderColor: defaultColor ? defaultColor : '#00CE86',
                defaultActiveBg: defaultColor ? defaultColor : '#00CE86',
                defaultActiveBorderColor: defaultColor ? defaultColor : '#00CE86',
            },
            },
        }}
        >
            <Button
                className="w-full"
                size={size} 
                onClick={handlerFunc}
            >
                {isLoading ? <DotLoading /> : <span className='text-white text-[14px]'>{label}</span>}    
            </Button>
        </ConfigProvider>
    );
};

ButtonComponent.propTypes = {
    label: PropTypes.string,
    defaultColor: PropTypes.string,
    size: PropTypes.string,
    handlerFunc: PropTypes.func,
    isLoading: PropTypes.bool,
}

export default ButtonComponent;