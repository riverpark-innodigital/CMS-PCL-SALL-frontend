import React, { useRef, useState } from "react";
import { FaEye } from "react-icons/fa";
import {
  IconButton,
  Accordion,
  AccordionBody,
} from "@material-tailwind/react";
import SupplierModal from "./supelier-modal";
import PropTypes from "prop-types";
import { fecthSupplierByID, fetchAllSupplier } from "../../../slicers/supplierSlicer";
import { useDispatch } from "react-redux";
import { Image, Drawer } from 'antd';
import { useSelector } from "react-redux";
import SingleImageLoader from "../../../components/content-loading/singleImage-loading";
import NotAvailableErorr from "../../../components/content-errors/404-notavailable";
import { IoArrowBack } from "react-icons/io5";
import { LuImage } from "react-icons/lu";
import DetailLoading from "../../../components/content-loading/detail-loading";
import { EnglishFormat } from "../../../hooks/dateformat";
import { TrashIcon } from "../../../components/Icons/trash-icon";
import { ConfirmModal } from "../../../components/content-modal/comfirm-modal";
import { ErrorDialog, SuccessDialog } from "../../../components/content-modal/alert-dialog";
import { TrashPopupIcon } from "../../../components/Icons/trashpopup-icon";
import axios from "axios";
import Cookies from "js-cookie";

const SupplierCanvas = ({ supId }) => {

    const dispatch = useDispatch();
    const supplier = useSelector((state) => state.supplier.currentSupplier);
    const [openRight, setOpenRight] = React.useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const Facthing = useRef(false);
    const [open, setOpen] = React.useState(2);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [errorMSG, setErrorMSG] = useState("");
    const [errorModal, setErrorModal] = useState(false);
    const authToken = Cookies.get("authToken");
 
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

    const handlerCancelConfirm = () => {
      setOpenConfirm(false);
    };

    const deleteSupplier = async () => {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/supplierManage/supplier/${supId}`,
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
                <div className="flex items-center gap-2">
                <SupplierModal data={supplier} supId={supId} conditions="edit" />
                <button onClick={() => setOpenConfirm(true)}>
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </button>
                <ConfirmModal
                  title="Do you want to delete?"
                  description="Confirm to proceed with Remove this supplier"
                  open={openConfirm}
                  onCancel={handlerCancelConfirm}
                  onConfirm={deleteSupplier}
                  color="#C00101"
                  notShowIcon={true}
                />
                <SuccessDialog
                  title="Removed successfully"
                  onCancel={async () => {
                    setSuccessModal(false);
                    setOpenRight(false);
                    await dispatch(fetchAllSupplier());
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
                          <div className="-mt-1">
                            <span className="text-gray-800 font-primaryMedium text-[16px]">Company</span>
                            <div className="flex max-w-[380px] overflow-x-auto no-scrollbar gap-2">
                              {
                                supplier?.SupplierCompany?.map((items, key) => (
                                  <div key={key}>
                                    <span className="block text-nowrap text-center rounded">{items?.Company?.CompanyNameEN || "-"}</span>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                          <div className="w-full">
                            <span className="text-gray-800 font-primaryMedium text-[16px]">Created By</span>
                            <span className="block">{supplier?.CreateBy}</span>
                          </div>
                          <div className="w-full -mt-1">
                            <span className="text-gray-800 font-primaryMedium text-[16px]">Created Date</span>
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