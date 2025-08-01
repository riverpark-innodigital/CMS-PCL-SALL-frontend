import { useState } from 'react';
import { Modal, message } from 'antd';
import { useDispatch } from 'react-redux';
import { createGroup, getGroupById, updateGroupById } from "../../../slicers/groupSlicer";
import InputComponet from "../../../components/content-input/input-full";
import { IconButton } from '@material-tailwind/react';
import { LuPen } from "react-icons/lu";
import { fetchAllSupplier } from '../../../slicers/supplierSlicer';
import PropTypes from "prop-types";
import ButtonFullComponent from '../../../components/content-buttons/full-button';
import SwitchComponent from '../../../components/content-input/switch';
import OutlineBTN from '../../../components/content-buttons/outline-btn';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import MultiSelect from '../../../components/content-selector/multiple-select';
import { ErrorDialog } from '../../../components/content-modal/alert-dialog';

const GroupForm = ({ groupId }) => {
    const dispatch = useDispatch();
    const { Dragger } = Upload;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [groupCode, setGroupCode] = useState('');
    const [groupNameEn, setGroupNameEn] = useState('');
    const [status, setStatus] = useState(true);
    const [supSelected, setSupSelectd] = useState([]);
    const [suplierOptions, setSuplierOptions] = useState([]);
    const [defaultImage, setDefaultImage] = useState([]);
    // add current user setUpdateBy or setCreateBy don't use defualt 'Projai Mak'

    const [validNameEN, setValidNameEN] = useState('');
    const [validSup, setValidSup] = useState('');
    const [files, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [fileOverSize, setFileOverSize] = useState(false);

    const handleOpenModal = async () => {
        setStatus(true);
        const response = await dispatch(fetchAllSupplier());

        const supFilter = response?.payload?.data.filter((sup) => sup.Active === true);
        const supData = supFilter.map((items) => ({
            label: items?.SupplierNameEn,
            value: items?.SupplierId,
        })).sort((a, b) => a - b);
        setSuplierOptions(supData);
        if (groupId) {
            const response = await dispatch(getGroupById(groupId));
            const supMap = response?.payload?.data?.ProductGroupSup?.map(data => data.SupplierId);
            await setGroupCode(response?.payload?.data?.GroupCode || '');
            await setGroupNameEn(response?.payload?.data?.GroupNameEn || '');
            await setSupSelectd(supMap || []);
            await setStatus(response?.payload?.data?.Active === "true");
            if (response?.payload?.data?.ImageName) {
                await setFileList([{
                    uid: '0',
                    name: `${response?.payload?.data?.ImageName}`,
                    status: 'done',
                    url: `${import.meta.env.VITE_REDIRECT_IMG}/images/${response?.payload?.data?.ImageName}`,
                    thumbUrl: `${import.meta.env.VITE_REDIRECT_IMG}/images/${response?.payload?.data?.ImageName}`,
                }])
                await setDefaultImage([{
                    uid: '0',
                    name: `${response?.payload?.data?.ImageName}`,
                    status: 'done',
                    url: `${import.meta.env.VITE_REDIRECT_IMG}/images/${response?.payload?.data?.ImageName}`,
                    thumbUrl: `${import.meta.env.VITE_REDIRECT_IMG}/images/${response?.payload?.data?.ImageName}`,
                }]);
            }
            setIsModalVisible(true);
        } else {
            setIsModalVisible(true);
        }
    };

    const handleCloseModal = () => {
        setGroupCode("");
        setGroupNameEn("");
        setValidNameEN("");
        setValidSup('');
        setIsModalVisible(false);
    };

    const onChange = (checked) => {
        setStatus(checked);
    };

    const handleFormSubmit = async () => {
        try {
            if ( !groupNameEn || !supSelected) {
                groupNameEn === '' ? setValidNameEN('Please complete all the required information.') : setValidNameEN('');
                supSelected === null || supSelected.length === 0 ? setValidSup('Please complete all the required information.') : setValidSup('');
                return;
            }

            const formData = new FormData();
            formData.append('GroupCode', groupCode);
            formData.append('Suppliers', supSelected);
            formData.append('GroupNameEn', groupNameEn);
            formData.append('GroupNameTh', groupNameEn);
            formData.append('Active', status);
            formData.append('productgroupImage', files);

            let response;

            if (groupId) {
                // Update existing group
                const data = {
                    groupId: groupId,
                    data: formData
                }
                response = await dispatch(updateGroupById({ data }));
            } else {
                // Create new group
                response = await dispatch(createGroup(formData));
            }
    
            // check response
            if (!response || !response.payload) {
                throw new Error("No response from server");
            }            
    
            if (response.payload.status) {
                message.success(groupId ? "group updated successfully!" : "group created successfully!");
                await setGroupCode("");
                await setGroupNameEn("");
                await setValidNameEN("");
                await setValidSup('');
                await setSupSelectd([]);
                await setStatus(true);
                await setFileList([]);
                await setFile(null);
                handleCloseModal();
            } else {
                const errorMessage = response.payload.error || "Unknown error occurred";
                message.error(`Failed to save group: ${errorMessage}`);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(`Server Error: ${error.response.data.message || "Unexpected error occurred"}`);
            } else if (error.message) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error("An unknown error occurred while saving the group.");
            }
        }
    };

        const handleFileChange = ({ file, fileList }) => {
            setFile(file.originFileObj);
            setFileList(fileList);
        };

    const beforeUpload = (file) => {
        const allowedExtensionsNormal = ['.png', '.jpg', '.jpeg'];
        const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        const maxSizeInBytes = 5 * 1024 * 1024;

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

    const customRequest = ({ onSuccess }) => {
        setTimeout(() => {
        onSuccess("ok");
        }, 0);
    };


    const handlerRemoveFile = () => {
      setFileList([]);
      setFile(null);
    };

    return (
        <div>
            <ErrorDialog description="Upload failed: File exceeds size limit or invalid type" title="File too large or unsupported format" open={fileOverSize} onCancel={() => setFileOverSize(false)} />
            { groupId ?
                <IconButton onClick={handleOpenModal} variant="text" className="rounded-full text-xl">
                    <LuPen />
                </IconButton>
                :
                <button onClick={handleOpenModal} className="flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 focus:outline-none">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <div>Create New group</div>
                </button>
            }
            <Modal
                title={groupId ? "Edit a Product Group" : "Add a new Product Group"}
                centered
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={1200}
                style={{
                    padding: '20px',
                    borderRadius: '8px',
                }}
            >
                <div className="flex justify-start mb-2 gap-[20px] items-center">
                    <SwitchComponent tooltipTitle="" onChange={onChange} value={status} />
                    <div>
                        <span className="font-primaryMedium">Available for active</span>
                        <span className="block">The Product Group is currently in use and available.</span>
                    </div>
                </div>
                <div className='my-3'>
                    <InputComponet label="Product Group name" placeholder="Add Product Group name" OnChange={setGroupNameEn} vildate={validNameEN} value={groupNameEn} maxLength={100} required/>
                </div>
                <div className='my-3'>
                    <MultiSelect validate={validSup} label="Supplier" defaultValue={supSelected} placeholder="Select Supplier" options={suplierOptions} onChange={(e) => setSupSelectd(e)} required />
                </div>
                <div className="mt-4">
                <span className="text-gray-800 font-primaryMedium">Upload image <span className='text-red-500'>*</span></span>
                </div>
                <div className="w-full mt-1">
                    <Dragger 
                        name="file"
                        listType="picture"
                        fileList={fileList}
                        onChange={handleFileChange}
                        beforeUpload={beforeUpload}
                        maxCount={1}
                        defaultFileList={defaultImage}
                        onRemove={handlerRemoveFile}
                        customRequest={customRequest}
                    >
                        <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag a file to this area to upload</p>
                        <p className="ant-upload-hint">
                            JPG, PNG (Maximum size 5 mb)
                        </p>
                    </Dragger>
                </div>
                <div className='w-full flex justify-end mt-4'>
                    <div className="gap-x-3 flex w-[30%] 2xl:w-[30%] items-center">
                        <OutlineBTN size="large" lable="Cancel" func={handleCloseModal} />
                        <ButtonFullComponent size="large" otherStyle='text-nowrap w-full text-white' lable={`${groupId ? 'Update Product Group' : 'Create New Product Group' }`} func={handleFormSubmit} />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

GroupForm.propTypes = {
    groupId: PropTypes.number,
}

export default GroupForm;
