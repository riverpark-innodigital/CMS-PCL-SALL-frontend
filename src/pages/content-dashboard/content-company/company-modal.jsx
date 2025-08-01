import {
    IconButton,
    Dialog,
    DialogBody,
    DialogFooter,
  } from "@material-tailwind/react";
import InputComponet from "../../../components/content-input/input-full";
import React, { useEffect, useRef, useState } from "react";
import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { FiEdit3 } from "react-icons/fi";
import Trian from '../../../assets/images/gif/dumpster.gif';
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import TextArea from "../../../components/content-input/textarea";
import { ToastifySuccess, ToastifyError } from "../../../components/content-alert/toastify";
import { FaRegTrashCan } from "react-icons/fa6";
import ButtonFullComponent from "../../../components/content-buttons/full-button";
import { message , Modal } from 'antd';
import { CreateCompanys, DeleteCompanyById, UpdateCompanyById } from "../../../slicers/companySlicer";
import SwitchComponent from "../../../components/content-input/switch";
import OutlineBTN from "../../../components/content-buttons/outline-btn";
import MultiSelect from "../../../components/content-selector/multiple-select";
import { GettingAllBU } from "../../../slicers/businessuintSlicer";
import { ErrorDialog } from "../../../components/content-modal/alert-dialog";
import { ConfirmModal } from "../../../components/content-modal/comfirm-modal";
import { SuccessDialog } from "../../../components/content-modal/alert-dialog";

const CompanyModal =  ({ conditions, comId, data }) => {
    return(
        <>
            { conditions === undefined && <CreateCompany /> }
            { conditions === 'edit' && <UpdateCompany data={data} comId={comId} /> }
            { conditions === 'delete' && <DeleteCompany comId={comId} /> }
        </>
    );
};
  
  export const CreateCompany = () => {
  
    const dispatch = useDispatch();
    const bus = useSelector((state) => state.bu.bus);
    const [NameEN, setNameEN] = useState('');
    const [descriptionENG, setDescriptionENG] = useState('');
    const [files, setFile] = useState(null);
    const [Company, setCompany] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(true);
    const [fileList, setFileList] = useState([]);
    const [companyFiles, setCompanyFiles] = useState([]);
    const [buOption, setBuOption] = useState([]);
    const [buSelected, setBuSelected] = useState([]);
    const isFatching = useRef(false);
    const [fileOverSize, setFileOverSize] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [errorMSG, setErrorMSG] = useState("");
    const [errorModal, setErrorModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
  
    const { Dragger } = Upload;

    const beforeUpload = (file) => {
      const allowedExtensionsNormal = ['.png', '.jpg', '.jpeg'];
      const maxSizeInBytes = 5 * 1024 * 1024;
      const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedExtensionsNormal.includes(extension)) {
          message.error(`${file.name} has an unsupported file extension.`);
          return Upload.LIST_IGNORE; // Prevents upload
      }

      if (file.size > maxSizeInBytes) {
          setFileOverSize(true);
          return Upload.LIST_IGNORE;
      }

      return true;
    };

    const beforeUploadPDF = (file) => {
      const allowedExtensionsNormal = ['.pdf'];
      const maxSizeInBytes = 10 * 1024 * 1024;
      const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedExtensionsNormal.includes(extension)) {
          message.error(`${file.name} has an unsupported file extension.`);
          return Upload.LIST_IGNORE; // Prevents upload
      }

      if (file.size > maxSizeInBytes) {
          setFileOverSize(true);
          return Upload.LIST_IGNORE;
      }
      return true;
    };
  
    const handleFileChange = ({ file }) => {
      console.log(file.originFileObj);
      files === null && setFile(file.originFileObj); 
      if (fileList.length === 0) {
        setFileList([...fileList, {
          uid: file.uid,
          name: file.name,
          status: 'done',
          size: file.size,
          type: file.type,
          lastModifiedDate: file.lastModifiedDate,
          lastModified: file.lastModified
        }]);
      }
    };

    const handleCompanyFileChange = ({ file }) => {
      console.log(file.originFileObj);
      Company === null && setCompany(file.originFileObj); 
      if (companyFiles.length === 0) {
        setCompanyFiles([...companyFiles, {
          uid: file.uid,
          name: file.name,
          status: 'done',
          size: file.size,
          type: file.type,
          lastModifiedDate: file.lastModifiedDate,
          lastModified: file.lastModified
        }]);
      }
    };

    const handlerRemoveFile = () => {
      setFileList([]);
      setFile(null);
    };

    const handlerRemoveCompanyFile = () => {
      setCompanyFiles([]);
      setCompany(null);
    };

    const [validNameEN, setValidNameEN] = useState('');
    const [validfile, setvalidfile] = useState(null);
    const [validCom, setvalidCom] = useState(null);
    const [openResponsive, setOpenResponsive] = useState(false);

    const onChange = (checked) => {
        setStatus(checked);
    };

      const handlerSupplier = async () => {
        try {   
          setLoading(false);

          if (!NameEN || files === null || Company === null) {
            NameEN === '' ? setValidNameEN('Please complete all the required information.') : setValidNameEN('');
            files === null ? setvalidfile('Please complete all the required information.') : setvalidfile('');
            Company === null ? setvalidCom('Please complete all the required information.') : setvalidCom('');
            setLoading(false);
            return;
          }
          
          setOpenResponsive(false);
          setOpenConfirm(true);
        } catch (error) {
          setOpenResponsive(false);
          setLoading(false);
          ToastifyError({ lable: error });
          return console.log(error);
        }
      }

      const Save = async () => {
        try {
            const formData = new FormData();
            formData.append('NameEN', NameEN);
            formData.append('BU', buSelected);
            formData.append('Code', NameEN);
            formData.append('DescriptionEN', descriptionENG);
            formData.append('compamyPicture', files);
            formData.append('compamyFile', Company);
            formData.append('Active', status);  
    
            const res = await dispatch(CreateCompanys(formData));
            if (res.payload.status === true) {
              resetForm();
            } else {
              setErrorMSG(res.payload.error);
              setErrorModal(true);
            }
        } catch (error) {
            console.log(error);
        }
      };

      const resetForm = () => {
        setNameEN("");
        setDescriptionENG("");
        setFile(null);
        setCompany(null);
        setBuSelected([]);
        setLoading(false);
        setOpenResponsive(false);
        setFileList([]);
        setCompanyFiles([]);
        setOpenConfirm(false);
        setSuccessModal(true);
      }
   
      const handleOpen = () => {
        setOpenResponsive(true);
        setValidNameEN('');
        setvalidfile('');
        setvalidCom('');
        setFileList([]);
        setCompanyFiles([]);
      };


    useEffect(() => {
      const fechBU = async () => {
        try {
          if (isFatching.current) return;
          isFatching.current = true;
          await dispatch(GettingAllBU());
          isFatching.current = true;
        } catch (error) {
          return console.log(error);
        }
      }

      fechBU();

      if (bus.length !== 0) {
        const buFilter = bus.filter((data) => data.Active === true);
        const bu = buFilter.map((items) => ({
            label: items.Name,
            value: items.BusinessUnitId,
        })).sort((a, b) => a - b);
        setBuOption(bu);
      }
    }, [dispatch, bus]);
    

    const handlerChangeBuSelected = (value) => {
      setBuSelected(value);
    }

    const handlerCancelConfirm = () => {
      setOpenConfirm(false);
      setOpenResponsive(true);
    }

    const handlerCloseError = () => {
      setErrorModal(false);
      setOpenConfirm(false);
      setOpenResponsive(true);
    }
      
    return(
      <div>
          <ConfirmModal 
            title="Do you want to create a company?" 
            description="Confirm to proceed with creating Company." 
            open={openConfirm}
            onCancel={handlerCancelConfirm}
            onConfirm={Save}
          />
          <ErrorDialog 
            description="Upload failed: File exceeds size limit or invalid type" 
            title="File too large or unsupported format" 
            open={fileOverSize} 
            onCancel={() => setFileOverSize(false)} 
          />
          <SuccessDialog
            title="Created successfully"
            onCancel={() => setSuccessModal(false)}
            open={successModal}
          />
          <ErrorDialog 
            title={errorMSG}
            open={errorModal} 
            onCancel={handlerCloseError} 
          />
          <div className="flex gap-3">
          <button onClick={() => handleOpen()} className="flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 focus:outline-none">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path strokeLinecap="round"strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create New Company
        </button>
        </div>
        <Modal
          title="Add new Company"
          centered
          open={openResponsive}
          onOk={() => setOpenResponsive(false)}
          onCancel={() => setOpenResponsive(false)}
          footer={false}
          width={1000}
        >
          <div className="min-h-[400px] max-h-[450px] overflow-y-auto">
            <div className="flex justify-start mb-2 gap-[20px] items-center">
                  <SwitchComponent tooltipTitle="" onChange={onChange} value={status} />
                  <div>
                      <span className="font-primaryMedium">Available for active</span>
                      <span className="block">The Company name is available for use.</span>
                  </div>
              </div>
              <div className="w-full grid grid-cols-1 gap-[25px]">
                  <InputComponet placeholder="Enter company name" vildate={validNameEN} label="Company Name" OnChange={setNameEN} maxLength={100} value={NameEN} required />
                  <MultiSelect label="Business Unit" placeholder="Select the name" defaultValue={buSelected} options={buOption} onChange={handlerChangeBuSelected} />
              </div>
              <div className="w-full grid grid-cols-1 gap-[25px] pt-[25px]">
                <div className="w-full">
                    <TextArea placeholder="Enter the description" label="Descriptions" OnChange={setDescriptionENG} maxLength={5000} value={descriptionENG}/>
                </div>
              </div>
              <div className="mt-5">
                <span className="text-gray-800 font-primaryMedium">Upload the company image  <span className="text-red-500">*</span></span>
              </div>
              <div className="w-full mt-1">
                <Dragger 
                  name="file"
                  listType="picture"
                  onChange={handleFileChange}
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  fileList={fileList}
                  onRemove={handlerRemoveFile}
                >
                    <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        PNG or JPG (Maximum 5mb)
                    </p>
                </Dragger>
                <div className="mx-1 flex justify-end">
                    {
                        validfile && <p className="text-red-500 text-[12px]">{validfile}</p>
                    }
                </div>
              </div>
              <div className="mt-5">
                <span className="text-gray-800 font-primaryMedium">Upload company file  <span className="text-red-500">*</span></span>
              </div>
              <div className="w-full mt-1">
                <Dragger 
                  name="file"
                  listType="picture"
                  onChange={handleCompanyFileChange}
                  beforeUpload={beforeUploadPDF}
                  maxCount={1}
                  fileList={companyFiles}
                  onRemove={handlerRemoveCompanyFile}
                >
                    <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        PDF (Maximum 10mb)
                    </p>
                </Dragger>
                <div className="mx-1 flex justify-end">
                    {
                        validCom && <p className="text-red-500 text-[12px]">{validCom}</p>
                    }
                </div>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <div className="gap-x-3 flex w-[30%] 2xl:w-[30%] mt-[25px] justify-end items-center">
              <OutlineBTN func={() => setOpenResponsive(false)} lable="Cancel" size="large" />
              <ButtonFullComponent isLoading={loading} lable="CREATE NEW COMPANY" func={handlerSupplier} size="large" />
            </div>
          </div>
        </Modal>
      </div>
    );
  };
  
  export const UpdateCompany = ({ comId, data }) => {
    const dispatch = useDispatch();
    const [NameEN, setNameEN] = useState(data?.CompanyNameEN);
    const [descriptionENG, setDescriptionENG] = useState(data?.DescriptionEN);
    const [file, setFile] = useState(null);
    const [Company, setCompany] = useState(null);
    const [active, setActive] = useState(data?.Active);
    const bus = useSelector((state) => state.bu.bus);
    const [loading, setLoading] = useState(false);
    const [buOption, setBuOption] = useState([]);
    const [buSelected, setBuSelected] = useState(data?.BusinessUnits?.map((bu) => (bu?.businessUnitId)));
    const [validNameEN, setValidNameEN] = useState('');
    const [openResponsive, setOpenResponsive] = useState(false);
    const isFatching = useRef(false);
    const [fileOverSize, setFileOverSize] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [errorMSG, setErrorMSG] = useState("");
    const [errorModal, setErrorModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
  
    const defaultImage = [{
      uid: '0',
      name: `${data?.CompamyPicture}`,
      status: 'done',
      url: `${import.meta.env.VITE_REDIRECT_IMG}/images/${data?.CompamyPicture}`,
      thumbUrl: `${import.meta.env.VITE_REDIRECT_IMG}/images/${data?.CompamyPicture}`,
    }];

    const defaultFile = [{
      uid: '0',
      name: `${data?.CompanyNameFile}`,
      status: 'done',
      url: `${import.meta.env.VITE_REDIRECT_IMG}/images/${data?.CompanyNameFile}`,
      thumbUrl: `${import.meta.env.VITE_REDIRECT_IMG}/images/${data?.CompanyNameFile}`,
    }];
  
    const { Dragger } = Upload;
  
    const onChange = (checked) => {
      setActive(checked);
    };
  
      const handleFileChange = ({ file }) => {
        console.log(file.originFileObj);
        setFile(file.originFileObj);
      };

      const handleCompanyFileChange = ({ file }) => {
        console.log(file.originFileObj);
        setCompany(file.originFileObj);
      };
   
  
      const UpdateCompanyByid = async () => {
        try {             
          setLoading(false);

          if (!NameEN) {
            NameEN === '' ? setValidNameEN('Please complete all the required information.') : setValidNameEN('');
            setLoading(false);
            return;
          }
  
          setOpenResponsive(false);
          setOpenConfirm(true);
        } catch (error) {
          setLoading(false);
          ToastifyError({ lable: error });
          return console.log(error);
        }
      }

      const Save = async () => {
        try {
            // if you want to send images you have to use contentType is a multipart upload
            // and you append data to FormData
            const formData = new FormData();
            formData.append('NameEN', NameEN);
            formData.append('BU', buSelected);
            formData.append('Code', NameEN);
            formData.append('DescriptionEN', descriptionENG);
            formData.append('compamyPicture', file);
            formData.append('compamyFile', Company);
            formData.append('Active', active);
            
            const datas = {
              comId: comId,
              formData: formData,
            }
    
            const res = await dispatch(UpdateCompanyById(datas));
            if (res.payload.status === true) {
              resetForm();
            } else {
              setErrorMSG(res.payload.error);
              setErrorModal(true);
            }
        } catch (error) {
            console.log(error);
        }
      };

      const resetForm = () => {
        // setNameEN("");
        // setDescriptionENG("");
        // setFile(null);
        // setCompany(null);
        // setLoading(false);
        // setBuSelected([]);
        setOpenResponsive(false);
        setOpenConfirm(false);
        setSuccessModal(true);
      }

      const handleOpen = () => {
        setOpenResponsive(true);
        setValidNameEN('');
      };
  
    useEffect(() => {
      const fechBU = async () => {
        try {
          if (isFatching.current) return;
          isFatching.current = true;
          await dispatch(GettingAllBU());
          isFatching.current = true;
        } catch (error) {
          return console.log(error);
        }
      }

      fechBU();

      if (bus.length !== 0) {
        const bu = bus.map((items) => ({
            label: items.Name,
            value: items.BusinessUnitId,
        })).sort((a, b) => a - b);
        setBuOption(bu);
      }
    }, [dispatch, bus]);
    

    const handlerChangeBuSelected = (value) => {
      console.log(value);
      setBuSelected(value);
    }

    const beforeUpload = (file) => {
      const allowedExtensionsNormal = ['.png', '.jpg', '.jpeg'];
      const maxSizeInBytes = 5 * 1024 * 1024;
      const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedExtensionsNormal.includes(extension)) {
          message.error(`${file.name} has an unsupported file extension.`);
          return Upload.LIST_IGNORE; // Prevents upload
      }

      if (file.size > maxSizeInBytes) {
          setFileOverSize(true);
          return Upload.LIST_IGNORE;
      }

      return true;
    };

    const beforeUploadPDF = (file) => {
      const allowedExtensionsNormal = ['.pdf'];
      const maxSizeInBytes = 10 * 1024 * 1024;
      const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedExtensionsNormal.includes(extension)) {
          message.error(`${file.name} has an unsupported file extension.`);
          return Upload.LIST_IGNORE; // Prevents upload
      }

      if (file.size > maxSizeInBytes) {
          setFileOverSize(true);
          return Upload.LIST_IGNORE;
      }
      return true;
    };

    const handlerCancelConfirm = () => {
      setOpenConfirm(false);
      setOpenResponsive(true);
    }

    const handlerCloseError = () => {
      setErrorModal(false);
      setOpenConfirm(false);
      setOpenResponsive(true);
    }

    return(
      <div>
         <ConfirmModal 
            title="Do you want to update a company?" 
            description="Confirm to proceed with updating Company." 
            open={openConfirm}
            onCancel={handlerCancelConfirm}
            onConfirm={Save}
          />
          <ErrorDialog 
            description="Upload failed: File exceeds size limit or invalid type" 
            title="File too large or unsupported format" 
            open={fileOverSize} 
            onCancel={() => setFileOverSize(false)} 
          />
          <SuccessDialog
            title="Updated successfully"
            onCancel={() => setSuccessModal(false)}
            open={successModal}
          />
          <ErrorDialog 
            title={errorMSG}
            open={errorModal} 
            onCancel={handlerCloseError} 
          />
          <div className="flex gap-3">
            <IconButton onClick={() => handleOpen()} variant="text" className="rounded-full text-xl text-gray-600">
              <FiEdit3 />
            </IconButton>
          </div>
          <Modal
            title="Edit Company"
            centered
            open={openResponsive}
            onOk={() => setOpenResponsive(false)}
            onCancel={() => setOpenResponsive(false)}
            footer={false}
            width={1300}
          >
            <div className="min-h-400px] max-h-[450px] overflow-y-auto">
            <div className="flex justify-start mb-2 gap-[20px] items-center">
                  <SwitchComponent tooltipTitle="" onChange={onChange} value={active} />
                  <div>
                      <span className="font-primaryMedium">Available for active</span>
                      <span className="block">The Company name is available for use.</span>
                  </div>
              </div>
              <div className="w-full grid grid-cols-1 gap-[25px]">
                  <InputComponet vildate={validNameEN} placeholder="Enter company name" label="Company Name" OnChange={setNameEN} maxLength={100} color="red" value={NameEN} required />
                  <MultiSelect defaultValue={buSelected} label="Business Unit" placeholder="Select the name" options={buOption} onChange={handlerChangeBuSelected} />
              </div>
              <div className="w-full grid grid-cols-1 pt-[25px] gap-[25px]">
                <div className="w-full">
                    <TextArea placeholder="Enter the description" color="red" label="Descriptions" OnChange={setDescriptionENG} maxLength={5000} value={descriptionENG}/>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-gray-800 font-primaryMedium">Upload the company image  <span className="text-red-500">*</span></span>
              </div>
              <div className="w-full mt-1">
              <Dragger 
                name="file"
                listType="picture"
                onChange={handleFileChange}
                defaultFileList={defaultImage}
                beforeUpload={beforeUpload}
                maxCount={1}
              >
                  <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                      PNG or JPG (Maximum 5mb)
                  </p>
              </Dragger>
              </div>
              <div className="mt-4">
                <span className="text-gray-800 font-primaryMedium">Upload company profile <span className="text-red-500">*</span></span>
              </div>
              <div className="w-full mt-1">
              <Dragger 
                name="file"
                listType="picture"
                onChange={handleCompanyFileChange}
                defaultFileList={defaultFile}
                beforeUpload={beforeUploadPDF}
                maxCount={1}
              >
                  <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                      PNG or JPG (Maximum 5mb)
                  </p>
              </Dragger>
              </div>
            </div>
            <div className="flex justify-end w-full mt-[25px]">
              <div className="gap-x-3 flex w-[30%] 2xl:w-[40%] justify-end items-center">
                <OutlineBTN func={() => setOpenResponsive(false)} lable="Cancel" size="large" />
                <ButtonFullComponent color="green" isLoading={loading} lable="UPDATE COMPANY" func={UpdateCompanyByid} size="large" />
              </div>
            </div>
          </Modal>
      </div>
    );
  }
  
  export const DeleteCompany = ({ comId }) => {
  
    const dispatch = useDispatch();
    const [size, setSize] = React.useState(null);
  
    const hadlerDeleteSup = async () => {
      try {
        const res = await dispatch(DeleteCompanyById(comId));
        if (res.payload.status === true) {
          ToastifySuccess({ lable: "Delete supplier successfully!" });
          setSize(null);
        }
      } catch (e) {
        setSize(null);
        return console.log(e);
      }
    }
  
    const handleOpen = (value) => setSize(value);
  
    return(
      <div>
        <div className="flex gap-3">
        <IconButton onClick={() => handleOpen("sm")} variant="text" className="rounded-full text-xl text-gray-600">
          <FaRegTrashCan />
        </IconButton>
      </div>
      <Dialog
        open={
          size === "sm"
        }
        size={size || "md"}
        handler={handleOpen}
      >
        <DialogBody>
            <div className="w-full flex justify-center items-center my-2">
              <img src={Trian} className="w-[150px]" alt="" />
            </div>
            <div className="w-full flex justify-center items-center">
              <h3>Are you sure want to delete this supplier?</h3>
            </div>
        </DialogBody>
        <DialogFooter>
          <div className="flex gap-x-3 w-full">
            <ButtonFullComponent func={() => handleOpen(null)} lable="ยกเลิก" />
            <ButtonFullComponent color="red" func={hadlerDeleteSup} lable="ยืนยัน" />
          </div>
        </DialogFooter>
      </Dialog>
    </div>
    );
  };

CompanyModal.propTypes = {
  conditions: PropTypes.any,
  comId: PropTypes.any,
  data: PropTypes.any,
};

UpdateCompany.propTypes = {
  comId: PropTypes.any,
  data: PropTypes.any,
}

DeleteCompany.propTypes = {
  comId: PropTypes.any,
}

export default CompanyModal;