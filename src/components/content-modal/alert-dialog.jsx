import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { FiCheckCircle } from "react-icons/fi";
import OutlineBTN from '../content-buttons/outline-btn';
import { TbAlertTriangle } from "react-icons/tb";

export const SuccessDialog = ({ title, open, onCancel }) => {
    
    return(
        <>
        <Modal
            centered
            open={open}
            footer={false}
            width={400}
            closable={false}
        >
           <div className='flex justify-center'>
                <div className='p-[10px] rounded-full bg-success100 border-[5px] border-success50'>
                    <FiCheckCircle className='text-success500 text-[20px]' />
                </div>
           </div>
           <div className='flex justify-center text-[18px] font-primaryMedium my-[20px]'>
                <span>{title}</span>
           </div>
           <div className='grid grid-cols-1 gap-[10px]'>
            <OutlineBTN size="large" lable="Cancel" func={onCancel} />
           </div>
        </Modal>
        </>
    );
};


export const ErrorDialog = ({ title, open, onCancel, description }) => {
    return(
        <>
        <Modal
            centered
            open={open}
            footer={false}
            width={400}
            closable={false}
        >
           <div className='flex justify-center'>
                <div className='p-[10px] rounded-full bg-warning100 border-[6px] border-warning50'>
                    <TbAlertTriangle className='text-warning500 text-[25px] font-primaryBold' />
                </div>
           </div>
           <div className='flex justify-center text-[18px] font-primaryMedium mt-[20px]'>
                <span className='text-center'>{title}</span>
           </div>
            <div className='mt-3 flex justify-center mb-[20px]'>
            {
                description &&  <span>{description}</span>
            }
            </div>
           <div className='grid grid-cols-1 gap-[10px]'>
            <OutlineBTN size="large" lable="Cancel" func={onCancel} />
           </div>
        </Modal>
        </>
    );
};

SuccessDialog.propTypes = {
    title: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onCancel: PropTypes.any,
}

ErrorDialog.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onCancel: PropTypes.any,
}