import React, { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import {  getProductById,  deleteProductById } from "../../../slicers/productsaleSlicer";

// Components
import ButtonFullComponent from "../../../components/content-buttons/full-button";
import { ToastifySuccess } from "../../../components/content-alert/toastify";
import InputComponet from "../../../components/content-input/input-full";

// Design Library
import { IconButton, Button, Dialog, DialogHeader, DialogBody, DialogFooter, Textarea } from "@material-tailwind/react";
import { InboxOutlined } from '@ant-design/icons';
import { FaRegTrashCan } from "react-icons/fa6";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { LuPlus, LuPen } from "react-icons/lu";
import { Upload } from 'antd';
// Assest
import Trian from '../../../assets/images/gif/dumpster.gif';

const ProductModal = ({ conditions, proId, data }) => {
  return (
    <>
      {conditions === undefined && <CreatProduct />}
      {conditions === 'edit' && <UpdateProduct data={data} proId={proId} />}
      {conditions === 'delete' && <DeleteProduct proId={proId} />}
    </>
  );
};

export const CreatProduct = () => {

  const dispatch = useDispatch();
  const [size, setSize] = useState(null);

  const [supplierNameTh, setSupplierNameTh] = useState('');
  const [supplierNameENG, setSupplierNameENG] = useState('');
  const [file, setFile] = useState(null);

  const { Dragger } = Upload;

  const handleFileChange = ({ file }) => {
    console.log(file.originFileObj);
    // setFile(file.originFileObj);
  };

  const handlerSupplier = async () => {
    try {
      // if you want to send images you have to use contentType is a multipart upload
      // and you append data to FormData
      const formData = new FormData();
      formData.append('suplNmTh', supplierNameTh);
      formData.append('suplNmEn', supplierNameENG);
      formData.append('suplImg', file);
      formData.append('Active', true);

      const res = await dispatch(createNewProduct(formData));
      if (res.payload.status === 'success') {
        ToastifySuccess({ lable: "Create new supplier successfully!" });
        setSize(null);
      }
    } catch (error) {
      return console.log(error);
    }
  }

  const handleOpen = (value) => setSize(value);

  return (
    <div>
      <div className="flex gap-3">
        <button onClick={() => handleOpen("xl")} class="flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create New Product
        </button>
      </div>
      <Dialog
        open={
          size === "xl"
        }
        size={size || "md"}
        handler={handleOpen}
      >
        <DialogHeader>
          Add new supplier
        </DialogHeader>
        <DialogBody>
          <div className="w-full grid grid-cols-2 gap-3">
            <InputComponet label="Supplier Name (TH)" OnChange={setSupplierNameTh} color="red" value={supplierNameTh} />
            <InputComponet label="Supplier Name (ENG)" OnChange={setSupplierNameENG} color="red" value={supplierNameENG} />
          </div>
          <div className="w-full mt-3">
            <Textarea color="red" label="Descriptions (TH)" />
          </div>
          <div className="w-full mt-3">
            <Textarea color="red" label="Descriptions (ENG)" />
          </div>
          <div className="w-full mt-3">
            <Dragger
              name="file"
              listType="picture"
              onChange={handleFileChange}
              beforeUpload={() => true}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                for a uploading image of supplier.
              </p>
            </Dragger>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => handleOpen(null)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handlerSupplier}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export const UpdateProduct = ({ proId }) => {
  
  const dispatch = useDispatch();
  const [size, setSize] = React.useState(null);
  // Input State text
  const [supplierId, setSupplierId] = useState(null);
  const [productNameTh, setProductNameTh] = useState(null);
  const [productNameEn, setProductNameEn] = useState(null);
  const [productDescriptionHeaderTh, setProductDescriptionHeaderTh] = useState(null);
  const [productDescriptionDetailTh, setProductDescriptionDetailTh] = useState(null);
  const [productDescriptionHeaderEn, setProductDescriptionHeaderEn] = useState(null);
  const [productDescriptionDetailEn, setProductDescriptionDetailEn] = useState(null);
  const [productVideo, setProductVideo] = useState(null);

  const [file, setFile] = useState(null);
  
  const { Dragger } = Upload;

  const handleFileChange = ({ file }) => {
    console.log(file.originFileObj);
    // setFile(file.originFileObj);
  };

  const handlerSupplier = async () => {
    try {
      const formData = new FormData();
      formData.append('suplNmTh', productNameTh);
      formData.append('suplNmEn', productNameEn);
      formData.append('suplImg', file);
      formData.append('Active', true);

      const res = await dispatch(updateProduct(formData, proId));
      if (res.payload.status === 'success') {
        ToastifySuccess({ lable: "Create new supplier successfully!" });
        setSize(null);
      }
    } catch (error) {
      return console.log(error);
    }
  }

  const handleOpen = (value) => setSize(value);

  return (
    <div>
      <div className="flex gap-3">
        <IconButton onClick={() => handleOpen("xl")} variant="text" className="rounded-full text-xl">
          <LuPen />
        </IconButton>
      </div>
      <Dialog
        open={
          size === "xl"
        }
        size={size || "md"}
        handler={handleOpen}
      >
        <DialogHeader>
          แก้ไขข้อมูล Supplier
        </DialogHeader>
        <DialogBody>
          <div className="w-full grid grid-cols-2 gap-3">
            {/* <InputComponet label="Supplier Name (TH)" OnChange={setSupplierNameTh} color="red" value={supplierNameTh} />
            <InputComponet label="Supplier Name (ENG)" OnChange={setSupplierNameENG} color="red" value={supplierNameENG} /> */}
          </div>
          <div className="w-full mt-3">
            <Textarea color="red" label="Descriptions (TH)" />
          </div>
          <div className="w-full mt-3">
            <Textarea color="red" label="Descriptions (ENG)" />
          </div>
          <div className="w-full mt-3">
            <Dragger
              name="file"
              listType="picture"
              onChange={handleFileChange}
              beforeUpload={() => true}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                for a uploading image of supplier.
              </p>
            </Dragger>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => handleOpen(null)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handlerSupplier}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export const DeleteProduct = ({ proId }) => {
  const dispatch = useDispatch();
  const [size, setSize] = useState(null);

  const handlerDeletePro = async () => {
    try {
      const res = await dispatch(deleteProductById(proId));
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

  return (
    <div>
      <div className="flex gap-3">
        <IconButton onClick={() => handleOpen("sm")} variant="text" className="rounded-full text-xl">
          <FiTrash2 />
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
            <h3>Are you sure want to delete this Product?</h3>
          </div>
        </DialogBody>
        <DialogFooter>
          <div className="flex gap-x-3 w-full">
            <ButtonFullComponent func={() => handleOpen(null)} lable="Cancel" />
            <ButtonFullComponent color="red" func={handlerDeletePro} lable="Confirm" />
          </div>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

UpdateProduct.propTypes = {
  proId: PropTypes.number,
  data: PropTypes.any,
};

DeleteProduct.propTypes = {
  proId: PropTypes.number,
};

ProductModal.propTypes = {
  conditions: PropTypes.any,
  proId: PropTypes.any,
  data: PropTypes.any,
};

export default ProductModal;