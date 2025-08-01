import PropTypes from 'prop-types';
import { useState } from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { IoIosArrowUp, IoIosMore } from "react-icons/io";
import { FiFolderMinus } from "react-icons/fi";
import { Dropdown } from 'antd';
import { ErrorDialog } from '../../../../components/content-modal/alert-dialog';


const FolderFile = ({folderNameTH, id, folderNameEN, onRemove, files, defaultFileList, isLoading, onRemovefile}) => {

    const items = [
        {
          key: '1',
          label: (
            <div onClick={() => onRemove(id)}>
                <span>Delete Folder</span>
            </div>
          ),
        },
      ];

    const [openFolder, setOpenfolder] = useState(false);
    const [fileOverSize, setFileOverSize] = useState(false);
    const { Dragger } = Upload;
    const allowedExtensionsPDF = ['.pdf'];

    const handleFileChange = ({ file }) => {
        if (file.status !== 'removed') {
            files(id, file, folderNameEN, folderNameTH);
        }
    };

    const handleRemove = (e) => {
        onRemovefile(e)
    };

    const beforeUploadPDF = (file) => {
        const maxSizeInBytes = 10 * 1024 * 1024;
        const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        if (!allowedExtensionsPDF.includes(extension)) {
            message.error(`${file.name} has an unsupported file extension.`);
            return Upload.LIST_IGNORE; // Prevents upload
        }

        if (file.size > maxSizeInBytes) {
            setFileOverSize(true);
            return Upload.LIST_IGNORE;
        }

        return true;
    };
    
    return(
        <div className='w-full my-3'>
            <div className='border bg-white  px-3 rounded-md'>
                <div className='w-full flex justify-between items-center cursor-default hover:cursor-pointer'>
                    <div className='flex gap-x-6 items-center h-full w-full py-2'>
                        <FiFolderMinus className='text-[30px]' />
                        <div>
                            <span className='font-primaryMedium text-[16px] text-gray-800'>Folder Name</span>
                            <span className='block'>{ folderNameTH }</span>
                        </div>
                        <div className='hidden'>
                            <span className='font-primaryMedium text-[16px] text-gray-800'>Folder Name (EN)</span>
                            <span className='block'>{ folderNameEN }</span>
                        </div>
                    </div>
                    <div className={`flex w-[20px] h-[20px] mr-[10px] duration-100 ease-in-out text-[20px] text-gray-600 ${openFolder ? 'rotate-180' : ''}`} onClick={() => setOpenfolder(!openFolder)}>
                        <IoIosArrowUp />
                    </div>
                    <Dropdown
                        menu={{
                        items,
                        }}
                        placement="bottomRight"
                        arrow
                    >
                        <div className='bg-none border-none w-[20px] h-[20px] text-[18px] flex justify-center items-center drop-shadow-none'><IoIosMore /></div>
                    </Dropdown>
                </div>
                { 
                    openFolder ? 
                    <div className='w-full py-2 items-center rounded-md duration-100 ease-in-out'>
                        {
                            isLoading ?
                            <div>Loading</div>
                            :
                            <Dragger 
                                name="wfwwff"
                                listType="picture"
                                onChange={handleFileChange}
                                beforeUpload={beforeUploadPDF}
                                defaultFileList={defaultFileList}
                                onRemove={handleRemove}
                                >
                                    <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                    <p className="ant-upload-hint">
                                        PDF (Maximum 10MB)
                                    </p>
                            </Dragger>
                        }
                    </div>
                    : null
                }
            </div>
            <ErrorDialog description="Upload failed: File exceeds size limit or invalid type" title="File too large or unsupported format" open={fileOverSize} onCancel={() => setFileOverSize(false)} />
        </div>
    );
};

FolderFile.propTypes = {
    folderNameTH: PropTypes.string,
    folderNameEN: PropTypes.string,
    onRemove: PropTypes.any,
    files: PropTypes.any,
    id: PropTypes.number,
    defaultFileList: PropTypes.array,
    isLoading: PropTypes.bool,
    onRemovefile: PropTypes.any,
};

export default FolderFile;