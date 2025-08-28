import PropTypes from 'prop-types';
import { useState } from 'react';
import { Upload, message, Dropdown, Input, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { IoIosArrowUp, IoIosMore } from 'react-icons/io';
import { FiFolderMinus } from 'react-icons/fi';
import { ErrorDialog } from '../../../../components/content-modal/alert-dialog';

const FolderFile = ({
  id,
  folderName,
  folderNameEN,
  onRemove,
  onRename,
  files,
  defaultFileList,
  isLoading,
  onRemovefile,
}) => {
  const [openFolder, setOpenFolder] = useState(false);
  const [fileOverSize, setFileOverSize] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(folderName);
  const [fileList, setFileList] = useState(defaultFileList || []);

  const { Dragger } = Upload;
  const allowedExtensionsPDF = ['.pdf'];

  const menuItems = [
    {
      key: 'rename',
      label: (
        <div
          onClick={() => {
            setTempName(folderName);
            setIsEditing(true);
          }}
        >
          Rename Folder
        </div>
      ),
    },
    {
      key: 'delete',
      label: (
        <div onClick={() => onRemove(id)}>
          Delete Folder
        </div>
      ),
    },
  ];

   const handleChange = ({ fileList: newFileList }) => {
     setFileList(newFileList);
     // ... ถ้าจะส่งขึ้น parent ก็เรียก props.files(id, newFileList) ได้เลย
     if (files) {
        files(id, newFileList, tempName, folderNameEN);
      }
   };

  const handleFileChange = ({ file }) => {
    if (file.status !== 'removed') {
      files(id, file, folderName);
    }
  };

  const handleRemove = (file) => {
    onRemovefile(file);
  };

  const beforeUploadPDF = (file) => {
    const maxSizeInBytes = 10 * 1024 * 1024;
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensionsPDF.includes(ext)) {
      message.error(`${file.name} has an unsupported extension`);
      return Upload.LIST_IGNORE;
    }
    if (file.size > maxSizeInBytes) {
      setFileOverSize(true);
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const saveRename = () => {
    const newName = tempName.trim();
    if (newName) {
      onRename(id, newName, newName);
    }
    setIsEditing(false);
  };

  return (
    <div className="w-full my-3">
      <div className="border bg-white px-3 rounded-md">
        {isEditing ? (
          <div className="flex gap-2 items-center py-2">
            <FiFolderMinus className="text-[30px]" />
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Folder Name"
              style={{ flex: 1 }}
            />
            <Button type="primary" onClick={saveRename}>
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        ) : (
          <div className="w-full flex justify-between items-center py-2 cursor-pointer">
            <div className="flex gap-x-6 items-center">
              <FiFolderMinus className="text-[30px]" />
              <div>
                <span className="font-primaryMedium text-[16px] text-gray-800">
                  Folder Name
                </span>
                <br />
                <span className="block">{folderName}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-[20px] h-[20px] text-[20px] text-gray-600 transform duration-100 ${
                  openFolder ? "" : "rotate-180"
                }`}
                onClick={() => setOpenFolder(!openFolder)}
              >
                <IoIosArrowUp />
              </div>
              <Dropdown
                menu={{ items: menuItems }}
                placement="bottomRight"
                arrow
              >
                <div className="w-[20px] h-[20px] text-[18px] flex justify-center items-center">
                  <IoIosMore />
                </div>
              </Dropdown>
            </div>
          </div>
        )}

        {openFolder && !isEditing && (
          <div className="w-full py-2">
            {isLoading ? (
              <div>Loading</div>
            ) : (
              <Dragger
                name="file"
                listType="picture"
                fileList={fileList}
                // onChange={handleFileChange}
                onChange={handleChange}
                beforeUpload={beforeUploadPDF}
                defaultFileList={defaultFileList}
                onRemove={handleRemove}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">PDF (Max 10MB)</p>
              </Dragger>
            )}
          </div>
        )}
      </div>

      <ErrorDialog
        description="Upload failed: File exceeds size limit or invalid type"
        title="File too large or unsupported format"
        open={fileOverSize}
        onCancel={() => setFileOverSize(false)}
      />
    </div>
  );
};

FolderFile.propTypes = {
  id: PropTypes.number.isRequired,
  folderName: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,       // รับ prop นี้จาก parent
  files: PropTypes.func.isRequired,
  defaultFileList: PropTypes.array,
  isLoading: PropTypes.bool,
  onRemovefile: PropTypes.func.isRequired,
};

export default FolderFile;
