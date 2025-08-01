import { useState } from "react";
import { Modal } from "antd";
import SwitchComponent from "../../../../components/content-input/switch";
import { IconButton } from "@material-tailwind/react";
import ButtonFullComponent from "../../../../components/content-buttons/full-button";
import InputComponet from "../../../../components/content-input/input-full";
import { useDispatch } from "react-redux";
import { GettingCurrentBU, UpdatingBU } from "../../../../slicers/businessuintSlicer";
import { FiEdit3 } from "react-icons/fi";
import PropTypes from "prop-types";
import OutlineBTN from "../../../../components/content-buttons/outline-btn";
import TextArea from "../../../../components/content-input/textarea";
import { CreateNewBU } from "../../../../slicers/businessuintSlicer";
import { ConfirmModal } from "../../../../components/content-modal/comfirm-modal";
import BUSINESS_UNIT_SHECEMA from "../../../../utils/schema/bu";
import { SuccessDialog, ErrorDialog } from "../../../../components/content-modal/alert-dialog";

const BUModal = ({ id }) => {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(true); 
    const [buname , setBUname] = useState('');
    const [validbuName, setValidBuName] = useState('');
    const [Description, setDescription] = useState('');
    const [IsopenModal, setIsopenModal] = useState(false);
    const [IsopenSuccessModal, setIsopenSuccessModal] = useState(false);
    const [IsopenErrorDialog, setIsopenErrorDialog] = useState(false);
    const [errMSG, setErrMSG] = useState('');
    const [successMSG, setsuccessMSG] = useState('');
    const dispatch = useDispatch();

    const handlerSubmit = async () => {
        try {
            if (!buname) {
                buname === '' ? setValidBuName('Please complete all the required information.') : setValidBuName('');
                return;
            }

            await setIsopenModal(true);
            setOpen(false);
        } catch (error) {
            setOpen(false);
            return console.log(error);
        }
    }


    const SaveData = async () => {
        try {
            const data = {
                name: buname,
                description: Description,
                Active: active,
            };

            const updateData = {
                id: id,
                data: data,
            };

            const response = id === undefined ? await dispatch(CreateNewBU(data)) : await dispatch(UpdatingBU(updateData));

            if (response.payload.status === true) {
                await id !== undefined ? setsuccessMSG('Updated successfully') : setsuccessMSG('Created successfully');
                setOpen(false);
                setActive(true);
                setBUname('');
                setDescription('');
                setValidBuName('');
                setIsopenSuccessModal(true);
            } else {
                setErrMSG(response.payload.error);
                throw response.payload.error;
            }
        } catch (error) {
            setIsopenModal(false);
            setIsopenErrorDialog(true);
            return console.log(error);
        }
    }

    const handleModalConfirm = async () => {
        setIsopenModal(false); 
        await SaveData();
    };

    const handlerOpenModal = async () => {
        try {
            setOpen(true);

            if (id) {
                const response = await dispatch(GettingCurrentBU(id));
                if (response.payload.status === true) {
                    setActive(response.payload.data.Active);
                    setBUname(response.payload.data.Name);
                    setDescription(response.payload.data.Description);
                }
            }
        } catch (err) {
            return console.log(err);
        }
    }

    const onChange = (checked) => {
        setActive(checked);
    };

    const handlerCloseModal = () => {
        setOpen(false);
        setActive(true);
        setBUname('');
        setDescription('');
        setValidBuName('');
    };

    const handlerCancelConfirm = () => {
        setIsopenModal(false);
        setOpen(true);
    }


    const handlerCloseAll = () => {
        setIsopenModal(false);
        setIsopenSuccessModal(false);
        setOpen(false);
    }

    const handlerCloseErrDialog = () => {
        setIsopenErrorDialog(false);
        setOpen(true);
    }

    return(
        <>
        {
            id !== undefined ?
            <IconButton onClick={handlerOpenModal} variant="text" className="rounded-full text-xl text-gray-600">
                <FiEdit3 />
            </IconButton>
            :
            <button onClick={handlerOpenModal} className="flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 focus:outline-none">
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
                Add a new Business Unit
            </button>
        }
        <Modal
            title={id ? 'Edit Business Unit' : 'Add a new Business Unit'}
            centered
            open={open}
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            footer={false}
            width={1000}
        >
            <div>
                <div className="flex justify-start mb-2 gap-[20px] items-center">
                    <SwitchComponent tooltipTitle="" onChange={onChange} value={active} />
                    <div>
                        <span className="font-primaryMedium">Available for active</span>
                        <span className="block">The Business Unit is available for use.</span>
                    </div>
                </div>
                <div className="w-full grid grid-cols-1 gap-[20px]">
                    <InputComponet maxLength={100} vildate={validbuName} label="Business Unit Name" placeholder="Enter Business Unit Name" required value={buname} OnChange={setBUname} />
                    <TextArea OnChange={setDescription} value={Description} maxLength={5000} label="Description" placeholder="Enter The Description" />
                </div>
                <div className="w-full flex justify-end">
                    <div className="gap-x-3 mt-[25px] flex w-[30%] 2xl:w-[30%] justify-between items-center">
                    <OutlineBTN size="large" lable="Cancel" func={handlerCloseModal} />
                    <ButtonFullComponent isLoading={false} lable={`${ id === undefined ? "Create Business Unit" : "Update Business Unit" }`} size="large" func={handlerSubmit} />
                    </div>
                </div>
            </div>
        </Modal>
        <ConfirmModal 
            open={IsopenModal}
            title={BUSINESS_UNIT_SHECEMA.CONFIRM_TITLE} 
            description={BUSINESS_UNIT_SHECEMA.CONFIRM_DESCRIPTION} 
            onCancel={handlerCancelConfirm}
            onConfirm={handleModalConfirm}
        />
        <SuccessDialog
            title={successMSG !== '' ? successMSG : BUSINESS_UNIT_SHECEMA.SUCCESS_MODAL_TITLE }
            onCancel={handlerCloseAll}
            open={IsopenSuccessModal}
        />
        <ErrorDialog
            title={errMSG === '' ? 'Creating Business Unit failed' : errMSG}
            onCancel={handlerCloseErrDialog}
            open={IsopenErrorDialog}
        />
        </>
    );
};

BUModal.propTypes = {
    id: PropTypes.number,
};

export default BUModal;