import { IconButton, Accordion, AccordionBody } from "@material-tailwind/react";
import React, { useRef, useState } from "react";
import { FaEye } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import DetailLoading from "../../../../components/content-loading/detail-loading";
import { EnglishFormat } from "../../../../hooks/dateformat";
import { Drawer } from "antd";
import { GettingCurrentBU } from "../../../../slicers/businessuintSlicer";
import BUSINESS_UNIT_SHECEMA from "../../../../utils/schema/bu";
import BUModal from "./bu-modal";

const CompanyDrawer = ({ buid }) => {
  const [openRight, setOpenRight] = React.useState(false);
  const dispatch = useDispatch();
  const Facthing = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentbu = useSelector((state) => state.bu.currentbu);
  const open = 2;

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
              <BUModal id={buid} />
              // <CompanyModal
              //   data={currentCompany}
              //   comId={comId}
              //   conditions="edit"
              // />
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
