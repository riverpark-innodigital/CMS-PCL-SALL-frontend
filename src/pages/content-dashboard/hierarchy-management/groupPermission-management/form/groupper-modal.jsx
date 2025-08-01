import { useEffect, useState, useRef } from "react";
import { Modal } from "antd";
import SwitchComponent from "../../../../../components/content-input/switch";
import { IconButton } from "@material-tailwind/react";
import ButtonFullComponent from "../../../../../components/content-buttons/full-button";
import InputComponet from "../../../../../components/content-input/input-full";
import { useSelector, useDispatch } from "react-redux";
import { GettingComAndBu } from "../../../../../slicers/businessuintSlicer";
import SelectOption from "../../../../../components/content-input/select";
import { createNewGroupPermissions, gettingGroupPermissionByID, updateGroupPermissions } from "../../../../../slicers/permissionSlicer";
import { ToastifySuccess, ToastifyError } from "../../../../../components/content-alert/toastify";
import { FiEdit3 } from "react-icons/fi";
import PropTypes from "prop-types";
import OutlineBTN from "../../../../../components/content-buttons/outline-btn";
import { GettingUserByRole } from "../../../../../slicers/usermanageSlicer";
import MultiSelect from "../../../../../components/content-selector/multiple-select";

const GroupPerModal = ({ id }) => {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(true); 
    const [isLoading, setIsLoading] = useState(false);
    const isFacthing = useRef(false);
    const [saleTeamNameEn, setSaleTeamNameEn] = useState('');
    const [saleManagerSelected, setSaleManagerSelected] = useState('');
    const [saleSelected, setSaleSelected] = useState([]);
    const [BU, setBU] = useState('');
    const [BUOptions, setBUOptions] = useState([]);
    const [saleOptions, setSaleOptions] = useState([]);
    const [saleManagerOptions, setManagerSaleOptions] = useState([]);

    const [validsaleteam, setValidsaleteam] = useState('');
    const [validatesaleManager, setValidateSaleManager] = useState('');
    const [validatesale, setValidateSale] = useState('');
    const [validbu, setValidbu] = useState('');
    const companies = useSelector((state) => state.bu.com_bu);
    const dispatch = useDispatch();

    const handlerSubmit = async () => {
        try {
            setIsLoading(true);
           
            if (!saleTeamNameEn || !BU || !saleManagerSelected || saleSelected.length === 0) {
                saleTeamNameEn === '' ? setValidsaleteam('Please complete all the required information.') : setValidsaleteam('');
                BU === '' ? setValidbu('Please complete all the required information.') : setValidbu('');
                saleManagerSelected === '' ? setValidateSaleManager('Please complete all the required information.') : setValidateSaleManager('');
                saleSelected.length === 0 ? setValidateSale('Please complete all the required information.') : setValidateSale('');
                setIsLoading(false);
                return;
            }

            const buSplit = BU.split(',');

            const data = {
                SaleTeamName: saleTeamNameEn,
                ComId: Number(buSplit[0]),
                BUID: Number(buSplit[1]),
                Manager: Number(saleManagerSelected),
                Sale: saleSelected,
                Active: active,
            };

            console.log(data);

            const updateData = {
                id: id,
                data: data,
            };

            const response = id === undefined ? await dispatch(createNewGroupPermissions(data)) : await dispatch(updateGroupPermissions(updateData));

            if (response.payload.status === true) {
                setOpen(false);
                setSaleTeamNameEn('');
                setBU('');
                setValidbu('');
                setValidsaleteam('');
                setSaleSelected([]);
                setSaleManagerSelected('');
                setActive(true);
                setIsLoading(false);
                ToastifySuccess({ lable: `${ id === undefined ? "Create a Group & Sale team successfully!" : "Update Group & Sale team successfully!" }`});
            }
        } catch (error) {
            setOpen(false);
            ToastifyError({lable: `${ id === undefined ? "Create a Group & Sale team failed!" : "Update a Group & Sale team failed!" }`});
            return console.log(error);
        }
    }

    const handlerOpenModal = async () => {
        try {
            setOpen(true);

            if (id) {
                const response = await dispatch(gettingGroupPermissionByID(id));
                if (response.payload.status === true) {
                    const memberFilter = response.payload.data.member.filter((data) => data.role !== 'Sale Manager' && data.id);
                    setSaleTeamNameEn(response.payload.data.saleteamName);
                    setSaleManagerSelected(response.payload.data.teamLaderId);
                    setSaleSelected(memberFilter.map((data) => data.id));
                    setBU(`${response.payload.data.companyId}, ${response.payload.data.BUID}`);
                    console.log(response.payload.data.Active);
                    setActive(response.payload.data.Active);
                }
            }
        } catch (err) {
            return console.log(err);
        }
    }

    const onChange = (checked) => {
        setActive(checked);
    };

    useEffect(() => {
        const FacingAllCompany = async () => {
            try {
                if (isFacthing.current) return;
                isFacthing.current = true;
                await dispatch(GettingComAndBu());
                isFacthing.current = false;
            } catch (error) {
                console.log(error);
            }
        };

        if (companies.length === 0) FacingAllCompany();

        if (companies.length !== 0) {
            const companyData = companies.map((items) => ({
                label: `${items.companyName}, ${items.buName}`,
                value: `${items.companyId}, ${items.buId}`,
            })).sort((a, b) => a - b);
            setBUOptions(companyData);
         
        }
    }, [dispatch, companies]);


    useEffect(() => {
        const facthManager = async () => {
            const response = await dispatch(GettingUserByRole('Sale Manager'));
            if (response.payload.data.user.length !== 0) {
                const mapManagers = response.payload.data.user.map((data) => ({
                    label: data.fullname,
                    value: data.id,
                }));
                setManagerSaleOptions(mapManagers);
            }
        }

        facthManager();
    }, [dispatch]);
    
    useEffect(() => {
        const facthManager = async () => {
            const response = await dispatch(GettingUserByRole('Sale'));
            if (response.payload.data.user.length !== 0) {
                const mapManagers = response.payload.data.user.map((data) => ({
                    label: data.fullname,
                    value: data.id,
                }));
                setSaleOptions(mapManagers);
            }
        }

        facthManager();
    }, [dispatch]);

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
                Create Sale team
            </button>
        }
        <Modal
            title="Create Group & Sale team"
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
                        <span className="block">The Product Group is available for use.</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-[20px] mb-[20px]">
                    <InputComponet
                        vildate={validsaleteam} 
                        label="Sale team name" 
                        required 
                        placeholder="Enter Sale team name"
                        value={saleTeamNameEn} 
                        OnChange={setSaleTeamNameEn} 
                    />
                    <SelectOption
                        validate={validatesaleManager} 
                        value={saleManagerSelected} 
                        OnChange={(e) => setSaleManagerSelected(e)} 
                        placeholder="Select Sale Manager" 
                        label="Sale Manager name" 
                        required 
                        options={saleManagerOptions}
                    />
                </div>
                <div className="w-full grid grid-cols-1 gap-[20px]">
                    <MultiSelect
                        label="Sale Name"
                        placeholder="Select Sale Name"
                        options={saleOptions}
                        required
                        onChange={(e) => setSaleSelected(e)}
                        defaultValue={saleSelected}
                        validate={validatesale}
                    />
                    <SelectOption validate={validbu} value={BU} OnChange={(e) => setBU(e)} placeholder="Select Company & Bussiness unit" label="Company & Bussiness unit" required options={BUOptions} />
                </div>
                <div className="w-full flex justify-end">
                    <div className="gap-x-3 mt-[25px] flex w-[30%] 2xl:w-[30%] justify-between items-center">
                    <OutlineBTN size="large" lable="Cancel" func={() => setOpen(false)} />
                    <ButtonFullComponent isLoading={isLoading} lable={`${ id === undefined ? "Create Sale team" : "Update Sale team" }`} size="large" func={handlerSubmit} />
                    </div>
                </div>
            </div>
        </Modal>
        </>
    );
};

GroupPerModal.propTypes = {
    id: PropTypes.number,
};

export default GroupPerModal;