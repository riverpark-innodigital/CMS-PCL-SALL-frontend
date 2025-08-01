import { IconButton, Accordion, AccordionBody } from "@material-tailwind/react";
import React, { useRef, useState } from "react";
import { FaEye } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { GettingCompanyById } from "../../../slicers/companySlicer";
import CompanyModal from "./company-modal";
import DocGif from "../../../assets/images/gif/copy.gif";
import DetailLoading from "../../../components/content-loading/detail-loading";
import { EnglishFormat } from "../../../hooks/dateformat";
import { Drawer } from "antd";

const CompanyDrawer = ({ comId }) => {
  const [openRight, setOpenRight] = React.useState(false);
  const dispatch = useDispatch();
  const Facthing = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const currentCompany = useSelector((state) => state.company.currentCompany);
  const open = 2;

  const openDrawerRight = async () => {
    try {
      setIsLoading(true);
      setOpenRight(true);

      if (Facthing.current) return;
      Facthing.current = true;
      const response = await dispatch(GettingCompanyById(comId));
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
              <span>Back to Companys</span>
            </button>
          </div>
          <div className="my-2 flex justify-end">
            {isLoading ? (
              <div className="h-[45px] w-[45px] rounded-md bg-gray-300 animate-pulse animate-infinite animate-duration-1000 animate-ease-in-out"></div>
            ) : (
              <CompanyModal
                data={currentCompany}
                comId={comId}
                conditions="edit"
              />
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
                    Company Detail
                  </span>
                  <span className="text-[14px] block">
                    Get detailed information about the product.
                  </span>
                </div>
                <div className="my-4">
                  <span className="font-primaryMedium text-gray-800 text-[16px]">
                    Company Name
                  </span>
                  <span className="block">{currentCompany?.CompanyNameEN}</span>
                </div>
                <div className="my-4">
                  <span className="font-primaryMedium text-gray-800 text-[16px]">
                    Bussiness Unit
                  </span>
                  <span className="block">{currentCompany?.BusinessUnits?.map((data) => `${data.BusinessUnit.Name}, `)}</span>
                </div>
                <div className="my-4">
                  <span className="font-primaryMedium text-gray-800 text-[16px]">
                    Create By
                  </span>
                  <span className="block">{currentCompany?.CreateBy}</span>
                </div>
                <div className="my-4">
                  <span className="font-primaryMedium text-gray-800 text-[16px]">
                    Create Date
                  </span>
                  <span className="block">
                    {!currentCompany?.CreateDate
                      ? "-"
                      : EnglishFormat(currentCompany?.CreateDate)}
                  </span>
                </div>
                <div className="my-2 text-gray-800 font-primaryMedium">
                  Company Description
                </div>
                <div className="w-full text-wrap px-2 py-2 bg-gray-100 rounded-md">
                  {currentCompany?.DescriptionEN}
                </div>
              </AccordionBody>
            </Accordion>
          </div>
        )}
        <div className="mt-5">
          <span className="text-gray-800 font-primaryMedium text-[16px]">
            Company Document
          </span>
          <span className="block">
            Click to download available files, including documents, images, or
            media, to your device for offline use or further review.
          </span>
        </div>
        <div className="w-full mt-1">
          <div
            className="w-full border hover: items-center flex rounded-md p-2 cursor-default hover:cursor-pointer"
            onClick={() =>
              window.open(
                `${import.meta.env.VITE_REDIRECT_IMG}/files/${
                  currentCompany?.CompanyNameFile
                }`,
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <div>
              <img src={DocGif} className="w-[50px]" alt="" />
            </div>
            <div>
              <span className="text-gray-800 font-primaryMedium text-[16px]">
                Document Name
              </span>
              <span className="block">
                {currentCompany?.CompamyPictureName}
              </span>
            </div>
          </div>
        </div>
      </Drawer>
    </React.Fragment>
  );
};

CompanyDrawer.propTypes = {
  comId: PropTypes.number,
};

export default CompanyDrawer;
