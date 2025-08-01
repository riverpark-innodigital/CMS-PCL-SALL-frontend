import alert from '../../../../assets/images/svg/Featured.svg';
import {
    DialogBody,
    DialogFooter,
  } from "@material-tailwind/react";
import {useState} from 'react';
import ButtonFullComponent from "../../../../components/content-buttons/full-button";
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import OutlineBTN from '../../../../components/content-buttons/outline-btn';

const ConfirmProduct = ({ func, lable, isLoading, type }) => { 
  const [openResponsive, setOpenResponsive] = useState(false);

  const hadlerCreate = () => {
      setOpenResponsive(false);
      func();
  };

    return(
      <div className="w-full">
        <div className="flex w-full">
            <ButtonFullComponent isLoading={isLoading} size="large" lable={lable} func={() => setOpenResponsive(true)} />
        </div>
      <Modal
        centered
        open={openResponsive}
        onOk={() => setOpenResponsive(false)}
        onCancel={() => setOpenResponsive(false)}
        width={{
          xs: '90%',
          sm: '80%',
          md: '70%',
          lg: '60%',
          xl: '50%',
          xxl: '40%',
        }}
        footer={null}
      >
        <DialogBody>
          {
            type === 'create' ?
            <div className="w-full">
              <div className="w-full flex justify-center items-center mt-2 mb-5">
                <img src={alert} className="w-[65px] h-[65px]" alt="" />
              </div>
              <div className="w-full flex justify-center font-primaryMedium items-center text-[18px] text-black">
                <span>Do you want to create a product ?</span>
              </div>
              <div className="w-full flex justify-center items-center">
                <span>Confirm to proceed with Creating the product to the system.</span>
              </div>
            </div>
            :
            <div className="w-full">
              <div className="w-full flex justify-center items-center mt-2 mb-5">
                <img src={alert} className="w-[65px] h-[65px]" alt="" />
              </div>
              <div className="w-full flex justify-center font-primaryMedium items-center text-[18px] text-black">
                <span>Do you want to update the product ?</span>
              </div>
              <div className="w-full flex justify-center items-center">
                <span>Confirm to proceed with updating this product to the system.</span>
              </div>
            </div>
          }
        </DialogBody>
        <DialogFooter>
          <div className="flex gap-x-3 w-full">
            <OutlineBTN size="large" func={() => setOpenResponsive(false)} lable="Cancel" otherStyle='w-full' />
            <ButtonFullComponent size="large"  func={hadlerCreate} lable="Confirm" otherStyle="bg-bgsucces" />
          </div>
        </DialogFooter>
      </Modal>
    </div>
    );
};

ConfirmProduct.propTypes = {
    func: PropTypes.func,
    lable: PropTypes.string,
    isLoading: PropTypes.bool,
    type: PropTypes.string,
}

export default ConfirmProduct;