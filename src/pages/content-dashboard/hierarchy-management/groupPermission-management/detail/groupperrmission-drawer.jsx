import { useState } from 'react';
import { Drawer, Table} from 'antd';
import { FaEye } from 'react-icons/fa';
import { IconButton } from '@material-tailwind/react';
import GroupPerModal from '../form/groupper-modal';
import { IoArrowBack } from 'react-icons/io5';
import PropTypes from "prop-types";
import { useSelector, useDispatch } from'react-redux';
import { gettingGroupPermissionByID } from '../../../../../slicers/permissionSlicer';
import DetailLoading from '../../../../../components/content-loading/detail-loading';
import dateFormat from 'dateformat';
import DotLoader from '../../../../../components/content-loading/dot-loader';

const GroupPermissionDrawerComponent = ({ GroupPermissionID }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoding] = useState(false);
  const dispatch = useDispatch();
  const currentGroupPermissions = useSelector((state) => state.permission.currentGroupPermissions);
  const [tableData, setTableData] = useState([]);

  const columns = [
    {
      title: "#",
      dataIndex: "#",
      key: "key",
      render: (_, { key }) => <div>{key}</div>,
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      render: (_, { name }) => (
        <div>
          { name }
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "Role",
      key: "Role",
      render: (_, { role }) => (
        <div>
          {role}
        </div>
      ),
    },
  ];

  const showDrawer = async () => {
    setOpen(true);
    setIsLoding(true);

     if (GroupPermissionID) {
       const response = await dispatch(gettingGroupPermissionByID(GroupPermissionID));
       if (response.payload.status === true) {
        console.log();
        
         const data = await response.payload.data.member?.map((items, key) => ({
            key: key + 1,
            name: items.name,
            role: items.role
         }))
         setTableData(data);
         setIsLoding(false);
       }
    }
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
       <IconButton onClick={showDrawer} variant="text" className="rounded-full text-xl text-gray-600">
            <FaEye />
        </IconButton>
      <Drawer
        className='rounded-l-[20px]'
        width={850}
        footer={false}
        closable={false}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <div className="flex items-center justify-between">
            <div className="items-center">
                <button
                    color="blue-gray"
                    onClick={onClose}
                    className="flex px-2 py-1 gap-x-2 items-center rounded-md hover:bg-gray-100 duration-100 ease-in-out"
                >
                <IoArrowBack />
                <span>Back to Companys</span>
                </button>
            </div>
            <div className="flex justify-end">
                <GroupPerModal id={GroupPermissionID} />
            </div>
        </div>
        <div className='my-5 w-full border border-gray-300 p-[10px] rounded-[10px]'>
            <div>
                <span className='text-[18px] font-primaryMedium'>Group & Sale team</span>
                <span className='block'>Get detailed information about the Group & Sale team.</span>
            </div>
            {
                isLoading ?
                <div className='my-5'>
                    <DetailLoading />
                </div>
                :
                <div className='my-5 w-full grid grid-cols-2 gap-5'>
                    <div>
                        <span className='font-primaryMedium text-[16px]'>Sale team</span>
                        <span className='block'>{currentGroupPermissions?.saleteamName}</span>
                    </div>
                    <div>
                        <span className='font-primaryMedium text-[16px]'>Team Leader</span>
                        <span className='block'>{currentGroupPermissions?.teamLader}</span>
                    </div>
                    <div>
                        <span className='font-primaryMedium text-[16px]'>Company</span>
                        <span className='block'>{currentGroupPermissions?.company}</span>
                    </div>
                    <div>
                        <span className='font-primaryMedium text-[16px]'>Bussiness Unit</span>
                        <span className='block'>{currentGroupPermissions?.businessUnit}</span>
                    </div>
                    <div>
                        <span className='font-primaryMedium text-[16px]'>Create Date</span>
                        <span className='block'>{dateFormat(currentGroupPermissions?.createdDate, "mediumDate")}</span>
                    </div>
                </div>
            }
            <div className='border bg-white rounded-[10px] py-2 drop-shadow-sm'>
                <div className='my-1 p-[10px]'>
                    <span className='text-[16px] font-primaryMedium'>Users in group</span>
                </div>
                {
                    isLoading ?
                    <div className='h-[100px] w-full flex justify-center items-center'>
                        <DotLoader />
                    </div>
                    :
                    <Table
                        columns={columns}
                        dataSource={tableData}
                        pagination={{ pageSize: 10 }}
                    />
                }
            </div>
        </div>
      </Drawer>
    </>
  );
};

GroupPermissionDrawerComponent.propTypes = {
  GroupPermissionID: PropTypes.number,
};

export default GroupPermissionDrawerComponent;