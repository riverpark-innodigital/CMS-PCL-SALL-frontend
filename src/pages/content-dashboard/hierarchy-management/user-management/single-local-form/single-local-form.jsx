import NormalCard from "../../../../../components/content-card/normal-card";
import { useState, useEffect, useRef } from "react";
import SwitchComponent from "../../../../../components/content-input/switch";
import { useDropzone } from "react-dropzone";
import { FiUser } from "react-icons/fi";
import { FaRegTrashAlt } from "react-icons/fa";
import SelectOption from "../../../../../components/content-input/select";
import Upload from "../../../../../assets/images/svg/Upload.svg";
import InputComponet from "../../../../../components/content-input/input-full";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "../../../../../components/content-buttons/button";
import { AddnewSingleLocalUser, GettingUserByID, UpdateLocalUser } from "../../../../../slicers/usermanageSlicer";
import { GettingAllRoles } from "../../../../../slicers/usermanageSlicer";
import { ToastifyError, ToastifySuccess } from "../../../../../components/content-alert/toastify";
import { useNavigate, useParams } from "react-router-dom";
import OutlineBTN from "../../../../../components/content-buttons/outline-btn";
import { ErrorDialog } from "../../../../../components/content-modal/alert-dialog";

const SingleLocalForm = () => {
    const [status, setStatus] = useState(true);
    const [role, setRole] = useState('');
    const [Name, setName] = useState('');
    const [Password, setPassword] = useState('');
    const [Email, setEmail] = useState('');
    const [roleOptions, setRoleOptions] = useState([]);
    const isFacingRoles = useRef(false);
    const [image, setImage] = useState(null);
    const [pictureProfile, setPictureProfile] = useState(null);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [RemoveImage, setRemoveImage] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const roles = useSelector((state) => state.usermanage.roles);
    const { id } = useParams();

    const [validRole, setValidRole] = useState(null);
    const [validNames, setValidNames] = useState(null);
    const [validPassword, setValidPassword] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [fileOverSize, setFileOverSize] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    
  
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
          setPictureProfile(file);
          setRemoveImage(false);
        }
      },
    });

    const onChange = (checked) => {
        setStatus(checked);
    };

    const removeImage = () => {
        setImage(null);
        setPictureProfile(null);
        setRemoveImage(true);
    }

    const hadlerAddnewUser = async () => {
        try {
            setIsLoading(true);
                        
            let GroupArr = [];

            if (!role || !Name || (!id && !Password)) {
                Name === '' ? setValidNames('Please complete all the required information.') : setValidNames('');
                role === '' ? setValidRole('Please complete all the required information.') : setValidRole('');
                Password === '' ? setValidPassword('Please complete all the required information.') : setValidPassword('');
                setIsLoading(false);
                return;
            }
            
            for (const group of selectedGroups) {
                GroupArr.push(group.value);
            }
            
            const userData = {
                username: Name,
                email: Email,
                role: role,
                password: Password,
                status: status,
                ProfilePicture: pictureProfile,
            };

            const dataUpdate = {
                id: id,
                username: Name,
                email: Email,
                role: role,
                password: Password,
                status: status,
                ProfilePicture: pictureProfile,
                isRemovePicture: RemoveImage
            }   

            const addNewUser = id ? await dispatch(UpdateLocalUser(dataUpdate)) : await dispatch(AddnewSingleLocalUser(userData));
                
            if (addNewUser.payload.status !== true) throw "Error";   

            setName("");
            setEmail("");
            setRole("");
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
        if (id) {
            const gettingUserData = async () => {
                try {
                    const data = await dispatch(GettingUserByID(id));
                    setName(data.payload.data.username);
                    setEmail(data.payload.data.email || "");
                    setRole(data.payload.data.role);
                    setStatus(data.payload.data.active);
                    setImage(data.payload.data.picture
                        ? `${import.meta.env.VITE_REDIRECT_IMG}/images/${data.payload.data.picture}`
                        : '');
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
                                <span className="text-xs text-gray-400">PNG, JPG (Maximum 3 MB)</span>
                            </div>
                            </div>
                    </div>
                    <div className="grid sm:grid-cols-1 grid-cols-2 gap-5 my-5">
                        <SelectOption value={role} OnChange={handlerChangeRole} validate={validRole} placeholder="Select Role" label="Role" required options={roleOptions} />
                        <InputComponet label="Name" placeholder="Enter your name." OnChange={setName} value={Name} vildate={validNames} disabled={id ? true : false} required />
                        <InputComponet label="Password" placeholder="Enter your password." OnChange={setPassword} value={Password}  vildate={validPassword} required={id ? false : true} type="password"/>
                        <InputComponet label="Email" placeholder="Enter your email." OnChange={setEmail} value={Email}  />
                    </div>
                    </div>
                    <div className="mt-[25px] flex justify-end items-center">
                        <div className="flex items-center gap-5">
                            <OutlineBTN size="large" lable="Cancel" func={() => navigate('/hierarchy-management/user')} />
                            <ButtonComponent size="large" isLoading={isLoading} label="Complete" handlerFunc={hadlerAddnewUser} />
                        </div>
                    </div>
                </NormalCard>
            </div>
        </>
    );
};

export default SingleLocalForm;