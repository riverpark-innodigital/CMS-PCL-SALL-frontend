import React, { useRef, useState } from "react";
import { FaEye } from "react-icons/fa";
import {
  IconButton,
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import SupplierModal from "./supelier-modal";
import PropTypes from "prop-types";
import { fecthSupplierByID } from "../../../slicers/supplierSlicer";
import { useDispatch } from "react-redux";
import { Image, Drawer } from 'antd';
import { useSelector } from "react-redux";
import SingleImageLoader from "../../../components/content-loading/singleImage-loading";
import NotAvailableErorr from "../../../components/content-errors/404-notavailable";
import { IoArrowBack } from "react-icons/io5";
import { LuImage } from "react-icons/lu";
import DetailLoading from "../../../components/content-loading/detail-loading";
import { EnglishFormat } from "../../../hooks/dateformat";

const SupplierCanvas = ({ supId }) => {

    const dispatch = useDispatch();
    const supplier = useSelector((state) => state.supplier.currentSupplier);
    const [openRight, setOpenRight] = React.useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const Facthing = useRef(false);
    const [open, setOpen] = React.useState(2);
 
    const handleOpen = (value) => setOpen(open === value ? 0 : value);
   
    const openDrawerRight = async () => {
      try {
        setIsLoading(true);
        setOpenRight(true);

        if (Facthing.current) return;
        Facthing.current = true;
        const response = await dispatch(fecthSupplierByID({ id: supId }));
        if (response.payload.status === 'success') {
          Facthing.current = false;
          setIsLoading(false);
        }
      } catch (error) {
        return console.log(error); 
      }
    }

    const onClose = () => {
      setOpenRight(false);
    };
  
    return (
      <React.Fragment>
        <div className="flex flex-wrap gap-4">
          <IconButton onClick={openDrawerRight} variant="text" className="rounded-full text-xl text-gray-600">
            <FaEye />
          </IconButton>
        </div>
        <Drawer
          className='rounded-l-[20px]'
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
                <span>Back to Suppliers</span>
              </button>
            </div>
            <div className="my-2 flex justify-end">
              {
                isLoading ?
                <div className="h-[45px] w-[45px] rounded-md bg-gray-300 animate-pulse animate-infinite animate-duration-1000 animate-ease-in-out"></div>
                :
                <SupplierModal data={supplier} supId={supId} conditions="edit" />
              }
            </div>
          </div>
          <div>
            {
              isLoading ?
              <DetailLoading />
              :
              <div>
                  <Accordion open={open === 2} className={`mb-2 rounded-lg border duration-100 ease-in-out border-blue-gray-100 px-4 ${
                        open === 2 ? "border-gray-400" : ""
                      }`}>
                    <AccordionBody className="pt-0">
                        <div className="my-[20px]">
                           <span className="text-[24px text-black font-primaryBold">Supplier Detail</span>
                           <span className="block">Get detailed information about the Supplier.</span>
                        </div>
                        <div className="grid grid-cols-2 gap-[20px]">
                          <div>
                            <span className="text-gray-800 font-primaryMedium text-[16px]">Supplier Name</span>
                            <span className="block">{supplier?.SupplierNameEn}</span>
                          </div>
                          <div className="invisible">
                            <span className="text-gray-800 font-primaryMedium text-[16px]">Company & BU</span>
                            <div className="flex max-w-[380px] overflow-x-auto no-scrollbar mt-1 gap-2">
                              {
                                supplier?.SupplierCompany?.map((items, key) => (
                                  <div key={key}>
                                    <span className="block text-nowrap py-[5px] text-center border border-gray-300 px-[5px] rounded">{items?.Company?.CompanyNameEN}</span>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                          <div className="w-full">
                            <span className="text-gray-800 font-primaryMedium text-[16px]">Create By</span>
                            <span className="block">{supplier?.CreateBy}</span>
                          </div>
                          <div className="w-full">
                            <span className="text-gray-800 font-primaryMedium text-[16px]">Create Date</span>
                            <span className="block">{supplier?.CreateDate ? EnglishFormat(supplier?.CreateDate) : '-'}</span>
                          </div>
                        </div>
                        <div className="mt-[25px]">Detail</div>
                        <div className="w-full text-wrap px-2 py-2 bg-gray-100 rounded-md">
                          {supplier?.SupplierDescriptionEN ? supplier?.SupplierDescriptionEN : "No data"}
                        </div>
                    </AccordionBody>
                  </Accordion>
              </div>
            }
          </div>
          <div className="mb-2 mt-10 flex gap-x-2 items-center">
            <LuImage className="text-orange-500 text-[25px]" />
            <span className="text-[16px] font-primaryMedium">Suplier Brand LOGO</span>
          </div>
          <div>
            {
              isLoading ?
              <SingleImageLoader />
              :
              !supplier?.SupplierImage ?
              <NotAvailableErorr lable="This supplier logo not available, you have to make sure to added supplier logo." />
              :
              <div >
                 <Image
                  width={100}
                  src={`${import.meta.env.VITE_REDIRECT_IMG}/images/${supplier?.SupplierImage}`}
                  className="border-2 px-5 py-5 rounded-md"
                />
              </div>
            }
          </div>
        </Drawer>
      </React.Fragment>
    );
};

SupplierCanvas.propTypes = {
  supId: PropTypes.any,
};
export default SupplierCanvas;