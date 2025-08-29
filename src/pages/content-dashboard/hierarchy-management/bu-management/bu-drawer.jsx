import { IconButton, Accordion, AccordionBody } from "@material-tailwind/react";
import React, { useRef, useState } from "react";
import { FaEye } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import DetailLoading from "../../../../components/content-loading/detail-loading";
import { EnglishFormat } from "../../../../hooks/dateformat";
import { Drawer } from "antd";
import { GettingAllBU, GettingCurrentBU } from "../../../../slicers/businessuintSlicer";
import BUSINESS_UNIT_SHECEMA from "../../../../utils/schema/bu";
import BUModal from "./bu-modal";
import axios from "axios";
import Cookies from "js-cookie";
import { TrashIcon } from "../../../../components/Icons/trash-icon";
import { ConfirmModal } from "../../../../components/content-modal/comfirm-modal";
import { ErrorDialog, SuccessDialog } from "../../../../components/content-modal/alert-dialog";
import { TrashPopupIcon } from "../../../../components/Icons/trashpopup-icon";

const CompanyDrawer = ({ buid }) => {
  const [openRight, setOpenRight] = React.useState(false);
  const dispatch = useDispatch();
  const Facthing = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentbu = useSelector((state) => state.bu.currentbu);
  const open = 2;
  const [openConfirm, setOpenConfirm] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorMSG, setErrorMSG] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const authToken = Cookies.get("authToken");

  const openDrawerRight = async () => {
    try {
      setIsLoading(true);
      setOpenRight(true);

      if (Facthing.current) return;
      Facthing.current = true;
      const response = await dispatch(GettingCurrentBU(buid));
      if (response.payload.status === true) {
        Facthing.current = false;
        setIsLoading(false);
      }
    } catch (error) {
      return console.log(error);
    }
  };

  const onClose = () => {
    setOpenRight(false);
  };

  const handlerCancelConfirm = () => {
    setOpenConfirm(false);
  };

  const deleteBU = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/bumanagement/businessunit/${buid}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessModal(true);
      setOpenConfirm(false);
    } catch (error) {
      setErrorMSG(error.response?.data?.message || error.message);
      setOpenConfirm(false);
      setErrorModal(true);
    }
  };

  return (
    <React.Fragment>
      <div className="flex flex-wrap gap-4">
        <IconButton
          onClick={openDrawerRight}
          variant="text"
          className="rounded-full text-xl text-gray-600"
        >
          <FaEye />
        </IconButton>
      </div>
      <Drawer
        className="rounded-l-[20px]"
        width={850}
        footer={false}
        closable={false}
        onClose={onClose}
        open={openRight}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <div className="flex items-center justify-between">
          <div className="mb-6 items-center">
            <button
              color="blue-gray"
              onClick={onClose}
              className="flex px-2 py-1 gap-x-2 items-center rounded-md hover:bg-gray-100 duration-100 ease-in-out"
            >
              <IoArrowBack />
              <span>Back to Business unit</span>
            </button>
          </div>
          <div className="my-2 flex justify-end">
            {isLoading ? (
              <div className="h-[45px] w-[45px] rounded-md bg-gray-300 animate-pulse animate-infinite animate-duration-1000 animate-ease-in-out"></div>
            ) : (
              <div className="flex items-center gap-2">
              <BUModal id={buid} />
              <button onClick={() => setOpenConfirm(true)}>
                <TrashIcon className="w-5 h-5 text-red-500" />
              </button>
              <ConfirmModal
                title="Do you want to delete?"
                description="Confirm to proceed with Remove this business unit"
                open={openConfirm}
                onCancel={handlerCancelConfirm}
                onConfirm={deleteBU}
                color="#C00101"
                notShowIcon={true}
              />
              <SuccessDialog
                title="Removed successfully"
                onCancel={async () => {
                  setSuccessModal(false);
                  setOpenRight(false);
                  await dispatch(GettingAllBU());
                }}
                open={successModal}
                icon={<TrashPopupIcon />}
              />
              <ErrorDialog
                title={errorMSG}
                open={errorModal}
                onCancel={() => {
                  setErrorMSG("");
                  setErrorModal(false);
                }}
              />
              </div>
            )}
          </div>
        </div>
        {isLoading ? (
          <DetailLoading />
        ) : (
          <div className="w-full">
            <Accordion
              open={open === 2}
              className={`mb-2 rounded-lg border duration-100 ease-in-out border-blue-gray-100 px-4 ${
                open === 2 ? " border-gray-300" : ""
              }`}
            >
              <AccordionBody className="pt-0">
                <div className="mt-4">
                  <span className="text-gray-800 text-[24px] font-primaryMedium">
                    {BUSINESS_UNIT_SHECEMA.TITLE}
                  </span>
                  <span className="text-[14px] block">
                    {BUSINESS_UNIT_SHECEMA.DESCRIPTION}
                  </span>
                </div>
                <div className="my-4">
                  <span className="font-primaryMedium text-gray-800 text-[16px]">
                    Business Unit
                  </span>
                  <span className="block">{currentbu?.Name}</span>
                </div>
                <div className="w-full grid grid-cols-2">
                  <div className="my-4">
                    <span className="font-primaryMedium text-gray-800 text-[16px]">
                      Create By
                    </span>
                    <span className="block">{currentbu?.CreateBy}</span>
                  </div>
                  <div className="my-4">
                    <span className="font-primaryMedium text-gray-800 text-[16px]">
                      Create Date
                    </span>
                    <span className="block">{ !currentbu?.CreateDate ? '-' : EnglishFormat(currentbu?.CreateDate) }</span>
                  </div>
                </div>
                <div className="my-4">
                  <span className="font-primaryMedium text-gray-800 text-[16px]">
                    Detail
                  </span>
                  <div className="w-full border rounded-md p-[10px]">
                    {currentbu?.Description ? currentbu?.Description : 'No Data'}
                  </div>
                </div>
              </AccordionBody>
            </Accordion>
          </div>
        )}
      </Drawer>
    </React.Fragment>
  );
};

CompanyDrawer.propTypes = {
  buid: PropTypes.number,
};

export default CompanyDrawer;
