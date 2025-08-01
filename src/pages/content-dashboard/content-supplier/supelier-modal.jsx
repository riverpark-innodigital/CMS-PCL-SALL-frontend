import React, { useEffect, useRef } from "react";
import {
  IconButton,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import InputComponet from "../../../components/content-input/input-full";
import { useState } from "react";
import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
// import { Textarea } from "@material-tailwind/react"; 
import { FiEdit3 } from "react-icons/fi";
import Trian from '../../../assets/images/gif/dumpster.gif';
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { createNewSupplier, updateSupplier, deleteSuppplier } from "../../../slicers/supplierSlicer";
import { ToastifySuccess, ToastifyError } from "../../../components/content-alert/toastify";
import { FaRegTrashCan } from "react-icons/fa6";
import ButtonFullComponent from "../../../components/content-buttons/full-button";
import { message } from 'antd';
import TextArea from "../../../components/content-input/textarea";
import { GettingAllCompany } from "../../../slicers/companySlicer";
import { Modal } from 'antd';
import SwitchComponent from "../../../components/content-input/switch";
import MultiSelect from "../../../components/content-selector/multiple-select";
import OutlineBTN from "../../../components/content-buttons/outline-btn";
import DefaultColorPicker from "../../../components/content-colorpicker/default-colorpicker";
import { ConfirmModal } from "../../../components/content-modal/comfirm-modal";
import { SuccessDialog, ErrorDialog } from "../../../components/content-modal/alert-dialog";
 
const SupplierModal = ({ conditions, supId, data }) => {
  return (
    <>
      { conditions === undefined && <CreateSupplier /> }
      { conditions === 'edit' && <UpdateSupplier data={data} supId={supId} /> }
      { conditions === 'delete' && <DeleteSupplier supId={supId} /> }
    </>
  );
};

export const CreateSupplier = () => {

  const dispatch = useDispatch();
  const companies = useSelector((state) => state.company.companys);
  const [supplierNameENG, setSupplierNameENG] = useState('');
  const [active, setActive] = useState(true);
  const [descriptionENG, setDescriptionENG] = useState('');
  const [company, setCompany] = useState(null);
  const [files, setFile] = useState(null);
  const [color, setColor] = useState('#1677ff');
  const [loading, setLoading] = useState(false);
  const [companyOptions, setCompanyOptions] = useState([]);
  const isFacthing = useRef(false);

  const [validNameEN, setValidNameEN] = useState('');
  const [validfile, setvalidfile] = useState(null);
  const [validCompany, setvalidCompany] = useState(null);

  const [openResponsive, setOpenResponsive] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [errorMSG, setErrorMSG] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [fileOverSize, setFileOverSize] = useState(false);
  const [isResetColor, setIsresetColor] = useState(false);

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

    const handleColorChange = (color) => {
        setColor(color);
    };

    const handleFileChange = ({ file }) => {
      setvalidfile(null);
      if (files === null) {
        setFile(file.originFileObj); 
      }
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

    const handlerRemoveFile = (file) => {
      console.log(file);
      setFile(null);
      setFileList([]);
    }

    const handlerSupplier = async () => {
      try {   
        if (!supplierNameENG || files === null) {
            supplierNameENG === '' ? setValidNameEN('Please complete all the required information.') : setValidNameEN('');
            files === null ? setvalidfile('Please complete all the required information.') : setvalidfile('');
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
        if (company !== null) {
          company.forEach((company, index) => {
            formData.append(`companyId[${index}]`, company);
          });
        }
        formData.append('suplNmEn', supplierNameENG);
        formData.append('suplDescripEN', descriptionENG);
        formData.append('suplImg', files);
        formData.append('colorCode', color);
        formData.append('Active', active);  

        const res = await dispatch(createNewSupplier(formData));
        if (res.payload.status === 'success') {
          resetForm();
        } else {
          setOpenConfirm(false);
          setLoading(false);
          setErrorMSG(res.payload.message);
          setErrorModal(true);
        }
      } catch (error) {
        console.log(error);
        
      }
    }

    const resetForm = async () => {
      setOpenResponsive(false);
      setOpenConfirm(false);
      setSupplierNameENG("");
      setDescriptionENG("");
      await setIsresetColor(true);
      setCompany([]);
      await setFile(null);
      setLoading(false);
      await setColor("#ffffff");
      setFileList([]);
      setSuccessModal(true);
    }

    const onChange = (checked) => {
      setActive(checked);
    };

    useEffect(() => {
      const fetchAllCompany = async () => {
        try {
          if (isFacthing.current) return;
          isFacthing.current = true;
          await dispatch(GettingAllCompany());
          isFacthing.current = false;
        } catch (error) {
          return console.log(error);
        }
      }

      if (companies.length === 0) fetchAllCompany();

      if (companies.length !== 0) {
        const companyFilter = companies.filter(com => com.Active === true);
        const companyData = companyFilter.map((items) => ({
            label: `${items.CompanyNameEN}`,
            value: items.CompanyId,
        })).sort((a, b) => a - b);
        setCompanyOptions(companyData);
      }
    }, [dispatch, companies]);

  const handlerOpen = () => {
    setDescriptionENG('');
    setSupplierNameENG('');
    setColor("#FFFFFF");
    setIsresetColor(false);
    setOpenResponsive(true);
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
          title="Do you want to create a supplier?" 
          description="Confirm to proceed with creating supplier." 
          open={openConfirm}
          onCancel={handlerCancelConfirm}
          onConfirm={Save}
        />
        <SuccessDialog
          title="Updated successfully"
          onCancel={() => setSuccessModal(false)}
          open={successModal}
        />
        <ErrorDialog 
          description="Upload failed: File exceeds size limit or invalid type" 
          title="File too large or unsupported format" 
          open={fileOverSize} 
          onCancel={() => setFileOverSize(false)} 
        />
        <ErrorDialog 
          title={errorMSG}
          open={errorModal} 
          onCancel={handlerCloseError} 
        />
        <div className="flex gap-3">
        <button onClick={handlerOpen} className="flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 focus:outline-none">
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
            Create New Supplier
        </button>
      </div>
      <Modal
        title="Add new supplier"
        centered
        open={openResponsive}
        onOk={() => setOpenResponsive(false)}
        onCancel={() => setOpenResponsive(false)}
        footer={false}
        width={1300}
      >
        <div className="flex justify-start mb-2 gap-[20px] items-center">
            <SwitchComponent tooltipTitle="" onChange={onChange} value={active} />
            <div>
                <span className="font-primaryMedium">Available for active</span>
                <span className="block">The supplier is operational and available for use.</span>
            </div>
        </div>
        <div className="w-full flex justify-between gap-[25px]">
          <div className="w-[85%]">
            <InputComponet vildate={validNameEN} label="Supplier Name" OnChange={setSupplierNameENG} placeholder="Enter Supplier name" maxLength={100} value={supplierNameENG} required />
          </div>
          <div className="w-[15%]">
            <DefaultColorPicker defaultColor={color} isResetColor={isResetColor} onChange={handleColorChange} />
          </div>
        </div>
        <div className="w-full grid grid-cols-1 gap-[25px] mt-[25px]">
          <MultiSelect label="Company & Business unit" placeholder="Select Company & Business unit" defaultValue={company} options={companyOptions} onChange={(e) => setCompany(e)} validate={validCompany} />
        </div>
        <div className="w-full grid grid-col-1 gap-[25px] pt-[25px]">
          <div className="w-full">
              <TextArea placeholder="Enter the description" color="red" label="Description" OnChange={setDescriptionENG} maxLength={5000} value={descriptionENG}/>
          </div>
        </div>
        <div className="mt-5">
          <span className="text-gray-800 font-primaryMedium">Upload the supplier image</span>
        </div>
        <div className="w-full mt-1">
          <Dragger 
            name="file"
            listType="picture"
            onChange={handleFileChange}
            beforeUpload={beforeUpload}
            fileList={fileList}
            onRemove={handlerRemoveFile}
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
          <div className="mx-1 flex justify-end">
              {
                  validfile && <p className="text-red-500 text-[12px]">{validfile}</p>
              }
          </div>
        </div>
        <div className="w-full flex justify-end">
          <div className="gap-x-3 mt-[25px] flex w-[30%] 2xl:w-[30%] justify-between items-center">
            <OutlineBTN lable="Cancel" func={() => setOpenResponsive(false)} size="large" />
            <ButtonFullComponent isLoading={loading} lable="Create New Supplier" func={handlerSupplier} size="large" />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const UpdateSupplier = ({ supId, data }) => {
  const dispatch = useDispatch();
  const [supplierNameENG, setSupplierNameENG] = useState(data?.SupplierNameEn);
  const [descriptionENG, setDescriptionENG] = useState(data?.SupplierDescriptionEN);
  const [company, setCompany] = useState([]);
  const [active, setActive] = useState(data?.Active);
  const [files, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [color, setColor] = useState(data?.ColorCode);
  const [companyOptions, setCompanyOptions] = useState([]);
  const companies = useSelector((state) => state.company.companys);
  const [fileOverSize, setFileOverSize] = useState(false);

  const defaultImage = [{
    uid: '0',
    name: `${data?.SupplierImage}`,
    status: 'done',
    url: `${import.meta.env.VITE_REDIRECT_IMG}/images/${data?.SupplierImage}`,
    thumbUrl: `${import.meta.env.VITE_REDIRECT_IMG}/images/${data?.SupplierImage}`,
  }];

    const { Dragger } = Upload;

    const [validNameEN, setValidNameEN] = useState('');
    const [validCompany, setvalidCompany] = useState('');
    const [openResponsive, setOpenResponsive] = useState(false);
    const [validfile, setvalidfile] = useState(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [errorMSG, setErrorMSG] = useState("");
    const [errorModal, setErrorModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [isResetColor, setIsresetColor] = useState(false);

    const handleFileChange = ({ file }) => {
      setvalidfile('');
      if (files === null) {
        setFile(file.originFileObj); 
      }
    };

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

    const handlerUpdateSupplier = async () => {
      try { 
        if (!supplierNameENG) {
          supplierNameENG === '' ? setValidNameEN('Please complete all the required information.') : setValidNameEN('');
          setLoading(false);
          return; 
        }

        if ((files === null || files === undefined) && data?.SupplierImage === null) {
          console.log((files === null || files === undefined) && data?.SupplierImage === null);
          
          files === null || files === undefined ? setvalidfile('Please complete all the required information.') : setvalidfile('')
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
          const DataformData = new FormData();
          company.forEach((company, index) => {
            DataformData.append(`companyId[${index}]`, company);
          });
          DataformData.append('suplNmEn', supplierNameENG);
          DataformData.append('suplDescripEN', descriptionENG);
          DataformData.append('suplImg', files);
          DataformData.append('colorCode', color);
          DataformData.append('Active', active);  

          const body = {
            id: supId,
            DataformData: DataformData,
          }

          const res = await dispatch(updateSupplier(body));
          console.log(res);
          if (res.payload.status === 'success') {
            setLoading(false);
            resetForm();
          } else {
            setLoading(false);
            setOpenConfirm(false);
            setErrorMSG(res.payload.message || res.payload.error);
            setErrorModal(true);
          }
      } catch (error) {
        console.log(error);
      }
    }

    const resetForm = async () => {
      setOpenConfirm(false);
      setIsresetColor(true);
      setSuccessModal(true);
    }

    
    const handlerRemoveFile = async () => {
      await setFile(null);
    }

    const onChange = (checked) => {
      setActive(checked);
    };


    useEffect(() => {
      if (companies.length !== 0) {
        const companyFilter = companies.filter(com => com.Active === true);
        const companyData = companyFilter.map((items) => ({
            label: `${items.CompanyNameEN}`,
            value: items.CompanyId,
        })).sort((a, b) => a - b);
        setCompanyOptions(companyData);
      }
    }, [companies]);

    const hannlderOpen = async () => {
      let ComArr = [];
      for (const companyId of data.SupplierCompany) {
        ComArr.push(companyId.Company.CompanyId);
        setCompany(ComArr);
      }
      console.log(company);
      await setIsresetColor(true);
      setIsresetColor(false);
      setOpenResponsive(true);
    }

    const handleColorChange = (color) => {
      setColor(color);
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
            title="Do you want to update?" 
            description="Confirm to proceed with Updating." 
            open={openConfirm}
            onCancel={handlerCancelConfirm}
            onConfirm={Save}
        />
        <SuccessDialog
          title="Updated successfully"
          onCancel={() => setSuccessModal(false)}
          open={successModal}
        />
        <ErrorDialog 
          description="Upload failed: File exceeds size limit or invalid type" 
          title="File too large or unsupported format" 
          open={fileOverSize} 
          onCancel={() => setFileOverSize(false)} 
        />
        <ErrorDialog 
          title={errorMSG}
          open={errorModal} 
          onCancel={handlerCloseError} 
        />
        <div className="flex gap-3">
          <IconButton onClick={hannlderOpen} variant="text" className="rounded-full text-xl text-gray-600">
            <FiEdit3 />
          </IconButton>
        </div>
        <Modal
          title="Edit supplier"
          centered
          open={openResponsive}
          onOk={() => setOpenResponsive(false)}
          onCancel={() => setOpenResponsive(false)}
          footer={false}
          width={1300}
        >
        <div className="flex justify-start mb-2 gap-[20px] items-center">
            <SwitchComponent tooltipTitle="" onChange={onChange} value={active} />
            <div>
                <span className="font-primaryMedium">Available for active</span>
                <span className="block">The Supplier is available for use.</span>
            </div>
        </div>
        <div className="w-full flex justify-between gap-[25px]">
          <div className="w-[85%]">
            <InputComponet vildate={validNameEN} label="Supplier Name" OnChange={setSupplierNameENG} placeholder="Enter Supplier name" maxLength={100} value={supplierNameENG} required/>
          </div>
          <div className="w-[15%]">
            <DefaultColorPicker isResetColor={isResetColor} onChange={handleColorChange} defaultColor={color} />
          </div>
        </div>
        <div className="w-full grid grid-cols-1 gap-[25px] mt-[25px]">
          <MultiSelect label="Company & Business unit" placeholder="Select Company & Business unit" defaultValue={company} options={companyOptions} onChange={(e) => setCompany(e)} validate={validCompany} />
        </div>
        <div className="w-full grid grid-col-1 gap-[25px] pt-[25px]">
          <div className="w-full">
              <TextArea placeholder="Enter the description" color="red" label="Description" OnChange={setDescriptionENG} maxLength={5000} value={descriptionENG}/>
          </div>
        </div>
        <div className="mt-5">
          <span className="text-gray-800 font-primaryMedium">Upload the supplier image</span>
        </div>
        <div className="w-full mt-1">
          <Dragger 
            name="file"
            listType="picture"
            onChange={handleFileChange}
            defaultFileList={defaultImage}
            beforeUpload={beforeUpload}
            onRemove={handlerRemoveFile}
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
          <div className="mx-1 flex justify-end">
              {
                  validfile && <p className="text-red-500 text-[12px]">{validfile}</p>
              }
          </div>
        </div>
        <div className="w-full flex justify-end">
          <div className="gap-x-3 mt-[25px] flex w-[30%] 2xl:w-[30%] justify-between items-center">
            <OutlineBTN lable="Cancel" func={() => setOpenResponsive(false)} size="large" />
            <ButtonFullComponent size="large" isLoading={loading} lable="Update Supplier" func={handlerUpdateSupplier} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export const DeleteSupplier = ({ supId }) => {

  const dispatch = useDispatch();
  const [size, setSize] = React.useState(null);

  const hadlerDeleteSup = async () => {
    try {
      const res = await dispatch(deleteSuppplier(supId));
      if (res.payload.status ==='success') {
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

UpdateSupplier.propTypes = {
  supId: PropTypes.number,
  data: PropTypes.any,
};

DeleteSupplier.propTypes = {
  supId: PropTypes.number,
};

SupplierModal.propTypes = {
  conditions: PropTypes.any,
  supId: PropTypes.any,
  data: PropTypes.any,
};

export default SupplierModal;