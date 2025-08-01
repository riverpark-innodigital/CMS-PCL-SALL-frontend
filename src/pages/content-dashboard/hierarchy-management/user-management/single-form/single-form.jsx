import NormalCard from "../../../../../components/content-card/normal-card";
import { useState, useEffect, useRef } from "react";
import SwitchComponent from "../../../../../components/content-input/switch";
import { useDropzone } from "react-dropzone";
import { FiUser } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import SelectOption from "../../../../../components/content-input/select";
// import { Select } from "antd";
import Upload from "../../../../../assets/images/svg/Upload.svg";
import InputComponet from "../../../../../components/content-input/input-full";
// import { FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
// import { gettingAllGroupPermissins } from "../../../../../slicers/permissionSlicer";
import ButtonComponent from "../../../../../components/content-buttons/button";
import { GetiingAllUserDerectory, GettingUserByID } from "../../../../../slicers/usermanageSlicer";
import { GettingAllRoles } from "../../../../../slicers/usermanageSlicer";
import { ToastifyError, ToastifySuccess } from "../../../../../components/content-alert/toastify";
import { AddnewSingleLdapUser, UpdateUser } from "../../../../../slicers/usermanageSlicer";
// import { addNewPermissions } from "../../../../../slicers/permissionSlicer";
import { useNavigate, useParams } from "react-router-dom";
import OutlineBTN from "../../../../../components/content-buttons/outline-btn";
import { ErrorDialog } from "../../../../../components/content-modal/alert-dialog";

const SingleForm = () => {
    const [status, setStatus] = useState(true);
    const [role, setRole] = useState('');
    const [Name, setName] = useState('');
    const [Email, setEmail] = useState('');
    const [handleBy, setHandlerBy] = useState('');
    // const [BUOptions, setBUOption]= useState([]);
    const [roleOptions, setRoleOptions] = useState([]);
    // const [handlerOptions, setHandlerOptions] = useState([]);
    const [UserDirectoryOption, setUserDirectoryOption] = useState([]);
    // const isFacing = useRef(false);
    const isFacingRoles = useRef(false);
    // const isFacingHandlers = useRef(false);
    const isFacingUserDirectory = useRef(false);
    const [image, setImage] = useState(null);
    const [selectedGroups, setSelectedGroups] = useState([]);
    // const [selectedPermisson, setSelectedPermission] = useState();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const companybus = useSelector((state) => state.permission.groupPermissions);
    const userdirectory = useSelector((state) => state.usermanage.directoryUser);
    const roles = useSelector((state) => state.usermanage.roles);
    // const handlers = useSelector((state) => state.usermanage.handlers);
    const { id } = useParams();

    const [validRole, setValidRole] = useState(null);
    const [validNames, setValidNames] = useState(null);
    // const [validGroup, setValidGroup] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [fileOverSize, setFileOverSize] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
        

  
    // const addGroup = () => {
    //   if (selectedPermisson && !selectedGroups.includes(selectedPermisson)) {
    //     setSelectedGroups([...selectedGroups, selectedPermisson]);
    //   }
    //   setSelectedPermission(null);
    // };
  
    // const removeGroup = (group) => {
    //   setSelectedGroups(selectedGroups.filter((g) => g !== group));
    // };

    // const handleChageBU = (e) => {
    //     const data = e.split(",");
    //     setSelectedPermission({
    //         value: data[4],
    //         label: `${data[0]}, ${data[1]}, ${data[2]}, ${data[3]}`,
    //     });
    // }
    
  
    const { getRootProps, getInputProps } = useDropzone({
      accept: "image/png, image/jpeg",
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        const maxSizeInBytes = 3 * 1024 * 1024;
        const allowedExtensionsNormal = ['.png', '.jpg', '.jpeg'];
        const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

        if (!allowedExtensionsNormal.includes(extension)) {
            setErrorMsg(`${file.name} has an unsupported file extension.`);
            setFileOverSize(true);
            return;
        }

        if (file.size > maxSizeInBytes) {
            setErrorMsg(`File too large or unsupported format`);
            setFileOverSize(true);
            return;
        }

        if (file) {
          setImage(URL.createObjectURL(file));
        }
      },
    });

    const onChange = (checked) => {
        setStatus(checked);
    };

    const removeImage = () => {
        setImage(null);
    }

    const hadlerAddnewUser = async () => {
        try {
            setIsLoading(true);
            
            const splitName = Name.value !== undefined ?
                Name.value.split(',') : Name.split(',');
                        
            let GroupArr = [];

            if (!role || !Name) {
                Name === '' ? setValidNames('Please complete all the required information.') : setValidNames('');
                // selectedGroups.length === 0 ? setValidGroup('Please complete all the required information.') : setValidGroup('');
                role === '' ? setValidRole('Please complete all the required information.') : setValidRole('');
                setIsLoading(false);
                return;
            }
            
            for (const group of selectedGroups) {
                GroupArr.push(group.value);
            }
            
            const userData = {
                ldapUsername: splitName[0],
                ldapName: splitName[1],
                handleId: handleBy,
                email: Email,
                role: role,
                status: status,
            };

            const dataUpdate = {
                id: id,
                ldapUsername: splitName[0],
                ldapName: splitName[1],
                handleId: handleBy,
                email: Email,
                role: role,
                status: status,
            }

            console.log(dataUpdate);
            

            const addNewUser = id ? await dispatch(UpdateUser(dataUpdate)) : await dispatch(AddnewSingleLdapUser(userData));
                
            if (addNewUser.payload.status !== true) throw "Error";   

            // const PermissionData = {
            //     userId: addNewUser.payload.data.ldapUserId,
            //     groupPermissions: GroupArr,
            // }
            
            // const addNewPer = await dispatch(addNewPermissions(PermissionData));

            // if (addNewPer.payload.status !== true) throw "Error";   

            setName("");
            setEmail("");
            setRole("");
            setHandlerBy("");
            setStatus(true);
            setSelectedGroups([]);
            ToastifySuccess({ lable: "Add new a user infomation successfully!" });
            navigate('/hierarchy-management/user');
        } catch (e) {
            setIsLoading(false);
            console.log(e);
            return ToastifyError({ lable: "Add new a user infomation failed." });
        }
    }

    const handlerChageName = (e) => {
        setValidNames('');
        const dataSplit = e.split(',');
        setEmail(dataSplit[2]);
        setName(e);
    } 

    const handlerChangeRole = (e) => {
        setValidRole('');
        setRole(e);
    }

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
    //         console.log(companybus);
            
    //         const BUList = companybus.map((item) => ({
    //             label: `${item?.GroupUserPermissionNameEN}, ${item?.SaleTeamNameEN}, ${item?.BU?.CompanyNameEN}, ${item?.BU?.BUNameEN}`,
    //             value: `${item?.GroupUserPermissionNameEN},${item?.SaleTeamNameEN},${item?.BU?.CompanyNameEN},${item?.BU?.BUNameEN},${item.GroupUserPermissionID}`,
    //         })).sort((a, b) => a - b);
    //         setBUOption(BUList);
    //     }
    // }, [dispatch, companybus]);

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
    //             label: `${item.fullname}`,
    //             value: item.id,
    //         })).sort((a, b) => a - b);
    //         setHandlerOptions(handlerList);
    //     }
    // }, [dispatch, handlers]);

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
            const userDirectoryList = userdirectory.map((item) => ({
                label: item.name,
                value: `${item.username},${item.name},${item.email}`,
            })).sort((a, b) => a - b);
            setUserDirectoryOption(userDirectoryList);
        }
    }, [dispatch, userdirectory]);

    useEffect(() => {
        if (id) {
            const gettingUserData = async () => {
                try {
                    const data = await dispatch(GettingUserByID(id));
                    data.payload.data.name === undefined ?
                     setName({
                        label: data.payload.data.name,
                        value: `${data.payload.data.fullname}`,
                    })
                    :
                    setName({
                        label: data.payload.data.name,
                        value: `${data.payload.data.username},${data.payload.data.name},${data.payload.data.email}`,
                    });
                    setEmail(data.payload.data.email || "");
                    setRole(data.payload.data.role);
                    setStatus(data.payload.data.active);
                    // setHandlerBy(data.payload.data.handleId);
                    // setSelectedGroups(data.payload.data.groupPermissions.map((item) => ({
                    //     value: item.groupUserPermissionNameEN,
                    //     label: item.groupUserPermissionNameEN,
                    // })).sort((a, b) => a - b));
                } catch (error) {
                    console.log(error);
                }
            } 

            gettingUserData();
        }
    }, [id, dispatch]);

    return(
        <>
            <ErrorDialog 
                description="Upload failed: File exceeds size limit or invalid type" 
                title={errorMsg} 
                open={fileOverSize} 
                onCancel={() => setFileOverSize(false)} 
            />
            <div className="max-w-7xl mx-auto 2xl:mx-5">
                <div className="mb-[10px]">
                    <span className="font-primaryMedium text-[18px]">User information</span>
                    <span className="block">Update your photo and personal details here.</span>
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
                    <div className="my-5">
                        <div className="flex gap-4 items-center">
                            <div className="relative w-[126px] h-[126px] flex justify-center items-center rounded-full bg-red-100">
                                {image ? (
                                <>
                                    <img
                                    src={image}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover"
                                    />
                                    <button
                                        onClick={removeImage}
                                        className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md hover:bg-gray-200"
                                        >
                                        <FaRegTrashAlt className="w-4 h-4 text-red-500" />
                                    </button>
                                </>
                                ) : (
                                <FiUser className="w-10 h-10 text-red-500" />
                                )}
                            </div>
                            
                            <div
                                {...getRootProps()}
                                className="flex flex-col items-center justify-center w-full h-[126px] border-2 border-dashed rounded-lg cursor-pointer"
                            >
                                <input {...getInputProps()} />
                                <img src={Upload} alt="" className="mb-3" />
                                <span className="text-sm text-red-500 font-medium">Click to upload <span className="text-xs text-gray-400">or drag and drop</span></span>
                                <span className="text-xs text-gray-400">PNG, JPG</span>
                            </div>
                            </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5 my-5">
                        <SelectOption value={role} OnChange={handlerChangeRole} validate={validRole} placeholder="Select Role" label="Role" required options={roleOptions} />
                        <SelectOption value={Name} OnChange={handlerChageName} disable={id ? true : false} validate={validNames} placeholder="Select Name" label="Name" required options={UserDirectoryOption} />
                        {/* <SelectOption value={handleBy} OnChange={(e) => setHandlerBy(e)} placeholder="Select Handle by" label="Handle by" options={handlerOptions} /> */}
                    </div>
                    <div className="w-full">
                        <InputComponet label="Email" placeholder="Enter your email." OnChange={setEmail} value={Email} />
                    </div>
                    </div>
                    <div className="mt-[25px] flex justify-end items-center">
                        <div className="flex items-center gap-5">
                            <OutlineBTN size="large" lable="Cancel" func={() => navigate('/hierarchy-management/user')} />
                            <ButtonComponent size="large" isLoading={isLoading} label="Complete" handlerFunc={hadlerAddnewUser} />
                        </div>
                    </div>
                </NormalCard>
                {/* <div className="mb-[10px] mt-[25px]">
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
                            <div className="flex items-center gap-5">
                                <OutlineBTN size="large" lable="Cancel" func={() => navigate('/hierarchy-management/user')} />
                                <ButtonComponent size="large" isLoading={isLoading} label="Complete" handlerFunc={hadlerAddnewUser} />
                            </div>
                        </div>
                    </div>
                </NormalCard> */}
            </div>
        </>
    );
};

export default SingleForm;