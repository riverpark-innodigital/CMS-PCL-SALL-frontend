import NormalCard from "../../../../../components/content-card/normal-card";
import SwitchComponent from "../../../../../components/content-input/switch";
import SelectOption from "../../../../../components/content-input/select";
// import { Select } from "antd";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GettingAllRoles, GetiingAllUserDerectory, AddNewMultipleUser } from "../../../../../slicers/usermanageSlicer";
import MultiSelect from "../../../../../components/content-selector/multiple-select";
// import { gettingAllGroupPermissins } from "../../../../../slicers/permissionSlicer";
// import { FiPlus } from "react-icons/fi";
// import { FaRegTrashAlt } from "react-icons/fa";
import ButtonComponent from "../../../../../components/content-buttons/button";
import { ToastifyError, ToastifySuccess } from "../../../../../components/content-alert/toastify";
// import { addNewPermissions } from "../../../../../slicers/permissionSlicer";
import { useNavigate } from "react-router-dom";
import OutlineBTN from "../../../../../components/content-buttons/outline-btn";

const MultipleForm = () => {

    const [status, setStatus] = useState(true);
    const [role, setRole] = useState(null);
    const [names, setNames] = useState([]);
    const [userOptions, setUserOptions] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    // const [selectedPermisson, setSelectedPermission] = useState();
    const [roleOptions, setRoleOptions] = useState([]);
    // const [handlerOptions, setHandlerOptions] = useState([]);
    const [handleBy, setHandlerBy] = useState('');
    // const [BUOptions, setBUOption]= useState([]);
    // const isFacing = useRef(false);
    const isFacingRoles = useRef(false);
    const isFacingUserDirectory = useRef(false);
    const dispatch = useDispatch();
    const roles = useSelector((state) => state.usermanage.roles);
    const userdirectory = useSelector((state) => state.usermanage.directoryUser);
    // const companybus = useSelector((state) => state.permission.groupPermissions);
    // const handlers = useSelector((state) => state.usermanage.handlers);
    // const isFacingHandlers = useRef(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [validRole, setValidRole] = useState(null);
    const [validNames, setValidNames] = useState(null);
    // const [validGroup, setValidGroup] = useState(null);
    
     
    // const addGroup = () => {
    //     if (selectedPermisson && !selectedGroups.includes(selectedPermisson)) {
    //       setSelectedGroups([...selectedGroups, selectedPermisson]);
    //     }
    //     setSelectedPermission(null);
    //   };
    
    //   const removeGroup = (group) => {
    //     setSelectedGroups(selectedGroups.filter((g) => g !== group));
    //   };
  
    //   const handleChageBU = (e) => {
    //       const data = e.split(",");
    //       setSelectedPermission({
    //           value: data[4],
    //           label: `${data[0]}, ${data[1]}, ${data[2]}, ${data[3]}`,
    //       });
    //   }

    const onChange = (checked) => {
        setStatus(checked);
    };

    const handleChangeNameSelection = (value) => {
        setValidNames('');
        setNames(value);
    };

    const handlerChangeRole = (e) => {
        setValidRole('');
        setRole(e);
    }

    useEffect(() => {
        const fecthRoles = async () => {
            try {
                if (isFacingRoles.current) return;
                isFacingRoles.current = true;
                await dispatch(GettingAllRoles());
                isFacingRoles.current = false;
            } catch (error) {
                return console.log(error);
            }
        }

        if (roles.length === 0) fecthRoles();

        if (roles.length !== 0) {
            const roleList = roles.map((item) => ({
                label: item.nameEng,
                value: item.id,
            })).sort((a, b) => a - b);
            setRoleOptions(roleList);
        }
    }, [dispatch, roles]);

    useEffect(() => {
        const fecthUserDirectory = async () => {
            try {
                if (isFacingUserDirectory.current) return;
                isFacingUserDirectory.current = true;
                await dispatch(GetiingAllUserDerectory());
                isFacingUserDirectory.current = false;
            } catch (error) {
                return console.log(error);
            }
        };

        if (userdirectory.length === 0) fecthUserDirectory();

        if (userdirectory.length !== 0) {
            const name = userdirectory.map((items) => ({
                label: items.name,
                value: `${items.username},${items.name},${items.email}`,
            })).sort((a, b) => a - b);
            setUserOptions(name);
        } 
    }, [dispatch, userdirectory]);

    // useEffect(() => {
    //     const fecthCompany = async () => {
    //         try {
    //             if (isFacing.current) return;
    //             isFacing.current = true;
    //             await dispatch(gettingAllGroupPermissins());
    //             isFacing.current = false;
    //         } catch (error) {
    //             return console.log(error);
    //         }
    //     };

        
    //     if (companybus.length === 0) fecthCompany();

    //     if (companybus.length !== 0) {
    //         const BUList = companybus.map((item) => ({
    //             label: `${item?.GroupUserPermissionNameEN}, ${item?.SaleTeamNameEN}, ${item?.BU?.CompanyNameEN}, ${item?.BU?.BUNameEN}`,
    //             value: `${item?.GroupUserPermissionNameEN},${item?.SaleTeamNameEN},${item?.BU?.CompanyNameEN},${item?.BU?.BUNameEN},${item.GroupUserPermissionID}`,
    //         })).sort((a, b) => a - b);
    //         setBUOption(BUList);
    //     }
    // }, [dispatch, companybus]);

    // useEffect(() => {
    //     const fecthHandlers = async () => {
    //         try {
    //             if (isFacingHandlers.current) return;
    //             isFacingHandlers.current = true;
    //             await dispatch(GettingHandlerBy());
    //             isFacingHandlers.current = false;
    //         } catch (error) {
    //             return console.log(error);
    //         }
    //     }

    //     if (handlers.length === 0) fecthHandlers();

    //     if (handlers.length !== 0) {
    //         const handlerList = handlers.map((item) => ({
    //             label: `${item.nameEng}, ${item.departmentEng}`,
    //             value: item.id,
    //         }));
    //         setHandlerOptions(handlerList);
    //     }
    // }, [dispatch, handlers]);

    const handlerAddNewMultipleUser = async () => {
        try {
            setIsLoading(true);
            let UserData = [];
            let GroupArr = [];

            if (!role || names.length === 0) {
                names.length === 0 ? setValidNames('Please complete all the required information.') : setValidNames('');
                // selectedGroups.length === 0 ? setValidGroup('Please complete all the required information.') : setValidGroup('');
                role === null ? setValidRole('Please complete all the required information.') : setValidRole('');
                setIsLoading(false);
                return;
            }

            for (const group of selectedGroups) {
                GroupArr.push(group.value);
            }
            
            for (const nameData of names) {
                const nameArr = nameData.split(',');
                await UserData.push({
                    ldapUsername: nameArr[0],
                    ldapName: nameArr[1],
                    email: nameArr[2],
                });
            }
            
            const userData = {
                UserData: UserData,
                role: role,
                status: status,
                handleId: handleBy,
            }

            const addNewMultipleUser = await dispatch(AddNewMultipleUser(userData));

            if (addNewMultipleUser.payload.status !== true) throw addNewMultipleUser.payload.message;
            
            // if (addNewMultipleUser.payload.status !== true) throw addNewMultipleUser.payload.message;

            // for (const data of addNewMultipleUser.payload.data) {

            //     console.log(GroupArr);
                
            //     const PermissionData = {
            //         userId: data.ldapUserId,
            //         groupPermissions: GroupArr,
            //     }

            //     const res = await dispatch(addNewPermissions(PermissionData));
            //     console.log(res);
            // }

            setNames("");
            setRole("");
            setHandlerBy("");
            setSelectedGroups([]);
            ToastifySuccess({ lable: "Creating a multiple successful" });
            navigate('/hierarchy-management/user');
        } catch (e) {
            setIsLoading(false);
            console.log(e);
            return ToastifyError({ lable: "Creating a multiple failed" });
        }
    }

    return(
        <div className="max-w-7xl mx-auto 2xl:mx-5">
            <div className="mb-5">
                <span className="font-primaryMedium text-[18px]">Group user information</span>
                <span className="block">Update your Group user details here.</span>
            </div>
            <NormalCard>
                <div className="p-[24px]">
                <div className="flex justify-start mb-2 gap-[20px] items-center">
                    <SwitchComponent tooltipTitle="" onChange={onChange} value={status} />
                    <div>
                        <span className="font-primaryMedium">Available for active</span>
                        <span className="block">The user is currently active and available</span>
                    </div>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-5">
                    <SelectOption validate={validRole} value={role} OnChange={handlerChangeRole} placeholder="Select Role" label="Role" required options={roleOptions} />
                    <MultiSelect validate={validNames} label="Name" placeholder="Select the name" defaultValue={names} options={userOptions} onChange={handleChangeNameSelection} required />
                    {/* <SelectOption value={handleBy} OnChange={(e) => setHandlerBy(e)} placeholder="Select Handle by" label="Handle by" options={handlerOptions} /> */}
                </div>
                </div>
                <div className="mt-[25px] flex justify-end items-center">
                    <div className="flex items-center gap-3">
                        <OutlineBTN size="large" lable="Cancel" func={() => navigate('/hierarchy-management/user')} />
                        <ButtonComponent size="large" isLoading={isLoading} label="Complete" handlerFunc={handlerAddNewMultipleUser} />
                    </div>
                </div>
            </NormalCard>
            {/* <div className="mt-[25px] mb-5">
                <span className="font-primaryMedium text-[18px]">Unit Selection</span>
                <span className="block">Select your team and its corresponding company and business unit.</span>
            </div> */}
            {/* <NormalCard>
                <div className="p-[24px]">
                    <div className="space-y-2">
                        <label className="mt-5">Group, Sale Team & Business Unit <span className="text-red-500">*</span></label>
                        <div className="flex space-x-2 w-full">
                            <div className="w-full">
                                <Select value={selectedPermisson?.label} onChange={handleChageBU} placeholder="Select a Group , Sale team &  Business unit." className="h-[40px] w-full" options={BUOptions} />
                                <div className="flex justify-end">
                                    {
                                        validGroup &&  <p className="text-red-500 text-[12px]">{validGroup}</p>
                                    }
                                </div>
                            </div>
                            <button onClick={addGroup} className="p-2 rounded-md border">
                                <FiPlus className="w-4 h-4" />
                            </button>
                        </div>

                        {selectedGroups.map((group) => (
                            <div className="flex space-x-2 w-full" key={group}>
                                <span className="flex justify-between w-full items-center border p-2 rounded-md">{group.label}</span>
                                <button onClick={() => removeGroup(group)} className="p-2 rounded-md border">
                                    <FaRegTrashAlt className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-[25px] flex justify-end items-center">
                        <div className="flex items-center gap-3">
                            <OutlineBTN size="large" lable="Cancel" func={() => navigate('/hierarchy-management/user')} />
                            <ButtonComponent size="large" isLoading={isLoading} label="Complete" handlerFunc={handlerAddNewMultipleUser} />
                        </div>
                    </div>
                </div>
            </NormalCard> */}
        </div>
    );
};

export default MultipleForm;