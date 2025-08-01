import React from "react";
import {
  IconButton,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import Trian from '../../../assets/images/gif/dumpster.gif';
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { deleteGroupById } from "../../../slicers/groupSlicer";
import { ToastifySuccess, ToastifyError } from "../../../components/content-alert/toastify";
import { FaRegTrashCan } from "react-icons/fa6";
import ButtonFullComponent from "../../../components/content-buttons/full-button";

export const DeleteGroup = ({ groupId }) => {
  
  const dispatch = useDispatch();
  const [size, setSize] = React.useState(null);

  const hadlerDeleteSup = async () => {
    try {
      const res = await dispatch(deleteGroupById(groupId));
      if (res.payload.status === true) {
        ToastifySuccess({ lable: "Delete group successfully!" });
        setSize(null);
      } else {
        ToastifyError({ lable: "Delete group fail contact support!" });
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
      <IconButton onClick={() => handleOpen("sm")} variant="text" className="rounded-full text-xl">
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
            <h3>Are you sure want to delete this Group?</h3>
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

DeleteGroup.propTypes = {
  groupId: PropTypes.number,
};

export default DeleteGroup;