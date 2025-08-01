import { Modal } from 'antd';
import ButtonFullComponent from '../content-buttons/full-button';
import PropTypes from 'prop-types';
import { FiCheckCircle } from "react-icons/fi";
import OutlineBTN from '../content-buttons/outline-btn';

export const ConfirmModal = ({ title, description, open, onCancel, onConfirm }) => {
    
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
           <div className='flex justify-center text-[18px] font-primaryMedium mt-[20px]'>
                <span>{title}</span>
           </div>
           <div className='flex justify-center text-[14px] mb-[20px]'>
                <span>{description}</span>
           </div>
           <div className='grid grid-cols-2 md:grid-cols-1 gap-[10px]'>
            <OutlineBTN size="large" lable="Cancel" func={onCancel} />
            <ButtonFullComponent lable="Confirm" size="large" func={onConfirm} />
           </div>
        </Modal>
        </>
    );
};

ConfirmModal.propTypes = {
    BTNLabel: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onCancel: PropTypes.any,
    onConfirm: PropTypes.any,
}