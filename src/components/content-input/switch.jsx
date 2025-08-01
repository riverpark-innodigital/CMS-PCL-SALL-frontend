import { Tooltip, ConfigProvider, Switch } from "antd";
import PropTypes from "prop-types";

const SwitchComponent = ({tooltipTitle, value, onChange}) => {
    return(
        <Tooltip placement="top" title={tooltipTitle}>
            <ConfigProvider
                theme={{
                    components: {
                        Switch: {
                        colorPrimary: '#C00101',
                        colorPrimaryHover: '#C00101',
                        },
                    },
                    }}
            >
                <Switch value={value} onChange={onChange}/>
            </ConfigProvider>
        </Tooltip>
    );
};

SwitchComponent.propTypes = {
    tooltipTitle: PropTypes.string,
    value: PropTypes.bool,
    onChange: PropTypes.func,
}

export default SwitchComponent;