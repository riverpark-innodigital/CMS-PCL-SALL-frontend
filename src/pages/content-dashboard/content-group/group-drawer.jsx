import { IconButton, Accordion, AccordionBody } from "@material-tailwind/react";
import React, { useRef, useState } from "react";
import { FaEye } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import GroupForm from "./group-form";
import DetailLoading from "../../../components/content-loading/detail-loading";
import { EnglishFormat } from "../../../hooks/dateformat";
import { Drawer } from "antd";
import {
  fetchAllGroups,
  getGroupById,
} from "../../../slicers/groupSlicer";
import { Table } from "antd";
import { TrashIcon } from "../../../components/Icons/trash-icon";
import { ConfirmModal } from "../../../components/content-modal/comfirm-modal";
import {
  ErrorDialog,
  SuccessDialog,
} from "../../../components/content-modal/alert-dialog";
import { TrashPopupIcon } from "../../../components/Icons/trashpopup-icon";
import axios from "axios";
import Cookies from "js-cookie";

const GroupDrawer = ({ groupId }) => {
  const authToken = Cookies.get("authToken");
  const [openRight, setOpenRight] = React.useState(false);
  const dispatch = useDispatch();
  const Facthing = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const currenProductGroup = useSelector((state) => state.group.group);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorMSG, setErrorMSG] = useState("");
  const [errorModal, setErrorModal] = useState(false);
  const open = 2;

  const openDrawerRight = async () => {
    try {
      setIsLoading(true);
      setOpenRight(true);

      if (Facthing.current) return;
      Facthing.current = true;
      const response = await dispatch(getGroupById(groupId));
      if (response.payload.status === true) {
        console.log();
        const data = response.payload.data.ProductGroupSup.map((sup, key) => ({
          key: key + 1,
          SupName: sup.Supplier?.SupplierNameEn,
          Image: sup.Supplier?.SupplierImage,
        }));
        setTableData(data);
        Facthing.current = false;
        setIsLoading(false);
      }
    } catch (error) {
      return console.log(error);
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "No",
      key: "No",
      width: "5%",
      render: (_, { key }) => <div>{key}</div>,
    },
    {
      title: "Supplier Name",
      dataIndex: "groupName",
      key: "groupName",
      render: (_, { SupName, Image }) => (
        <div className="flex items-center gap-2">
          <div className="flex justify-center p-1 border rounded-[10px]">
            <img
              width={40}
              height={40}
              src={`${import.meta.env.VITE_REDIRECT_IMG}/images/${Image}`}
              alt=""
            />
          </div>
          <div>{SupName}</div>
        </div>
      ),
    },
  ];

  const onClose = () => {
    setOpenRight(false);
  };

  const handlerCancelConfirm = () => {
    setOpenConfirm(false);
  };

  const deleteProductGroup = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/productGroup/group/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessModal(true);
      setOpenConfirm(false);
      await dispatch(fetchAllGroups());
    } catch (error) {
      setErrorMSG(error.response?.data?.message || error.message);
      setOpenConfirm(false);
      setErrorModal(true);
    }
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
              <span>Back to Product Group</span>
            </button>
          </div>
          <div className="my-2 flex justify-end">
            {isLoading ? (
              <div className="h-[45px] w-[45px] rounded-md bg-gray-300 animate-pulse animate-infinite animate-duration-1000 animate-ease-in-out"></div>
            ) : (
              <div className="flex items-center gap-2">
                <GroupForm groupId={groupId} />
                <button onClick={() => setOpenConfirm(true)}>
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </button>
                <ConfirmModal
                  title="Do you want to delete?"
                  description="Confirm to proceed with Remove this product group"
                  open={openConfirm}
                  onCancel={handlerCancelConfirm}
                  onConfirm={deleteProductGroup}
                  color="#C00101"
                  notShowIcon={true}
                />
                <SuccessDialog
                  title="Removed successfully"
                  onCancel={() => {
                    setSuccessModal(false);
                    setOpenRight(false);
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
                    Product Group detail
                  </span>
                  <span className="text-[14px] block">
                    Get detailed information about the Product Group
                  </span>
                </div>
                <div className="w-full my-5">
                  <span className="font-primaryBold text-[16px]">
                    Product Group Name
                  </span>
                  <span className="block">
                    {currenProductGroup?.GroupNameEn}
                  </span>
                </div>
                <div className="grid-cols-3 grid gap-[10px]">
                  <div className="w-full my-5">
                    <span className="font-primaryBold text-[16px]">
                      Created by
                    </span>
                    <span className="block">
                      {currenProductGroup?.CreateBy}
                    </span>
                  </div>
                  <div className="w-full my-5">
                    <span className="font-primaryBold text-[16px]">
                      Created date
                    </span>
                    <span className="block">
                      {!currenProductGroup?.CreateDate
                        ? "-"
                        : EnglishFormat(currenProductGroup?.CreateDate)}
                    </span>
                  </div>
                  <div className="w-full my-5">
                    <span className="font-primaryBold text-[16px]">
                      Last Updated
                    </span>
                    <span className="block">
                      {!currenProductGroup?.UpdateDate
                        ? "-"
                        : EnglishFormat(currenProductGroup?.UpdateDate)}
                    </span>
                  </div>
                </div>
                <div className="mt-5 border-2 rounded-[10px]">
                  <div className="p-[20px]">
                    <span className="font-primaryMedium text-[18px]">
                      Supplier Name
                    </span>
                  </div>
                  <Table
                    columns={columns}
                    dataSource={tableData}
                    position={["bottomCenter"]}
                  />
                </div>
              </AccordionBody>
            </Accordion>
          </div>
        )}
      </Drawer>
    </React.Fragment>
  );
};

GroupDrawer.propTypes = {
  groupId: PropTypes.number,
};

export default GroupDrawer;
