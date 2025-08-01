import NormalCard from "../../../../components/content-card/normal-card";
import InputComponet from "../../../../components/content-input/input-full";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState, useEffect, useRef, useMemo } from "react";
import { Upload, message, Switch, ConfigProvider, Input } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@material-tailwind/react";
// import { getSupplierByCompanyId } from "../../../../slicers/supplierSlicer";
import { LuPlus } from "react-icons/lu";
import FolderFile from "./folder-file";
// import OutlineButtonComponent from "../../../../components/content-buttons/outline-button";
import { useNavigate, useParams } from 'react-router-dom';
import { ToastifyError, ToastifySuccess } from "../../../../components/content-alert/toastify";
import { createProduct, getProductById, editProductById, deleteProductFile, deleteProductFolder } from "../../../../slicers/productsaleSlicer";
import { getFolderById } from "../../../../slicers/productfileSlicer";
import TextArea from "../../../../components/content-input/textarea";
import { getModelBySup } from "../../../../slicers/modelSlicer";
// import { getGroupBySupId } from "../../../../slicers/groupSlicer";
import DetailLoading from "../../../../components/content-loading/detail-loading";
import { Tooltip } from 'antd';
import ConfirmProduct from "./confirm-modal";
import { useLayoutContext } from '../../../../constants/contexts/LayoutContext';
import { Reorder } from "framer-motion";
import { updateProductFile } from "../../../../slicers/productsaleSlicer";
import SelectOption from "../../../../components/content-input/select";
import OutlineBTN from "../../../../components/content-buttons/outline-btn";
import { fetchAllGroups } from "../../../../slicers/groupSlicer";
import { GettingSupByGroup } from "../../../../slicers/supplierSlicer";
import { GettingCompanyBySup } from "../../../../slicers/companySlicer";
import { ErrorDialog } from "../../../../components/content-modal/alert-dialog";
import { GettingAllCompany } from "../../../../slicers/companySlicer";
import UploadIcon from '../../../../assets/images/imgs/upload.png';
import { GettingComAndBu } from "../../../../slicers/businessuintSlicer";

const text = <span>This switch use for change status of product</span>;

const ProductForm = () => {

    const { Dragger } = Upload;
    const { scrollToTop } = useLayoutContext();
    const { id } = useParams();
    const dispatch = useDispatch();
    // const allSuppliers = useSelector((state) => state.supplier.suppliers);
    const allCompany = useSelector((state) => state.bu.com_bu);
    const currentSupplier = useSelector((state) => state.productsale.singleProduct);
    const folders = useSelector((state) => state.productfile.productfiles);
    const groups = useSelector((state) => state.group.groups);
    const [isLoading, setIsLoading] = useState(false);
    const isFetching = useRef(false);
    const [FormDevice, setFormDevice] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    // const [isFolderUpdating, setIsFolderUpdating] = useState(false);
    const [isProductUpdating, setIsProductUpdating] = useState(false);


    // product form
    const [productNameTH, setProductNameTH] = useState('');
    const [productNameEN, setProductNameEN] = useState('');
    const [productNo, setProductNo] = useState('');
    const [descriptionTH, setDescriptionTH] = useState('');
    const [descriptionEN, setDescriptionEN] = useState('');
    const [descriptionHeaderEN, setdescriptionHeaderEN] = useState('');
    const [descriptionHeaderTH, setdescriptionHeaderTH] = useState('');
    const [mediaTitle, setMeadiaTitle] = useState('');
    const [mediaDescription, setMediaDescription] = useState('');
    const [supplier, setSupplier] = useState(null);
    const [imageMain, setImageMain] = useState(null);
    const [imageChildren, setImageChildren] = useState([]);
    const [fileChildren, setfileChildren] = useState([]);
    const [mediaRemove, setMediaRemove] = useState(false);
    const [Meadia, setMeadia] = useState([]);
    const [MeadiaLink, setMeadiaLink] = useState('');
    const [Group, setGroup] = useState(null);
    const [model, setModel] = useState(null);
    const [active, setActive] = useState(true);
    const [isLaodingDataSelection, setIsLoadingDataSelection] = useState(false);
    const [FileRemove, setFileRemove] = useState([]);

    // select options
    const [supplierOption, setSupplierOption] = useState([]);
    const [modelOption, setModelOption] = useState([]);
    const [groupOption, setGroupOption] = useState([]);
    const [company, setCompany] = useState('');
    const [companyOption, setCompanyOptions] = useState([]);

    const [validNameTH, setValidNameTH] = useState('');
    const [validNameEN, setValidNameEN] = useState('');
    const [ProNovalid, setProNovalid] = useState('');
    const [validselectSup, setValidselectSup] = useState(null);
    const [validselectGroup, setvalidselectGroup] = useState(null);
    const [validselectModel, setvalidselectModel] = useState(null);
    const [validcom, setvalidCom] = useState(null);

    const [defaultImageMain, setdefaultImageMain] = useState([]);
    const [defaultPresentFile, setdefaultPresentFile] = useState([]);
    const [defaultImageChildren, setdefaultImageChildren] = useState([]);
    const [defaultMedia, setdefaultMedia] = useState([]);

    const [fileOverSize, setFileOverSize] = useState(false);
    const [removeFolder, setRemoveFolder] = useState([]);
    const isFatchingCom = useRef(false);

    const navigate = useNavigate();

    const handleBackPage = () => {
        navigate(-1);
    };

    // eslint-disable-next-line no-unused-vars
    const [arrow, setArrow] = useState('Show');
    const mergedArrow = useMemo(() => {
      if (arrow === 'Hide') {
        return false;
      }
      if (arrow === 'Show') {
        return true;
      }
      return {
        pointAtCenter: true,
      };
    }, [arrow]);

    const allowedExtensionsNormal = ['.png', '.jpg', '.jpeg'];
    const allowedExtensionsFile = ['.pdf', '.mov', '.avi'];
    const allowedExtensionsVideo = ['.mp4'];

    const beforeUpload = (file) => {
        const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        const maxSizeInBytes = 5 * 1024 * 1024;
        if (!allowedExtensionsNormal.includes(extension)) {
            message.error(`${file.name} has an unsupported file extension.`);
            return Upload.LIST_IGNORE; // Prevents upload
        }

        if (file.size > maxSizeInBytes) {
            setFileOverSize(true);
            return Upload.LIST_IGNORE;
        }

        return true;
    };

    const beforeUploadFile = (file) => {
        const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        const maxSizeInBytes = 50 * 1024 * 1024;
        if (!allowedExtensionsFile.includes(extension)) {
            message.error(`${file.name} has an unsupported file extension.`);
            return Upload.LIST_IGNORE; // Prevents upload
        }

        if (file.size > maxSizeInBytes) {
            setFileOverSize(true);
            return Upload.LIST_IGNORE;
        }

        return true;
    };

    const beforeUploadVedio = (file) => {
        const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
        const maxSizeInBytes = 100 * 1024 * 1024;
        if (!allowedExtensionsVideo.includes(extension)) {
            message.error(`${file.name} has an unsupported file extension.`);
            return Upload.LIST_IGNORE; // Prevents upload
        }

        if (file.size > maxSizeInBytes) {
            setFileOverSize(true);
            return Upload.LIST_IGNORE;
        }

        return true;
    };

    const [components, setComponents] = useState([]);
    const [folder, setFolder] = useState([]);
    const [folderNameTH, setfolderNameTH] = useState("");
    const [folderNameEN, setfolderNameEN] = useState("");
  
    const addComponent = () => {
      if (folderNameTH.trim() === "" || folderNameEN.trim() === "") return;
      setComponents([...components, { id: Date.now(), folderNameTH: folderNameTH, folderNameEN: folderNameEN }]);
      setfolderNameTH("");
      setfolderNameEN("");
    };
  
    const removeComponent = async (id) => {
        await setRemoveFolder([...removeFolder, {
            id: id
        }]);
        setComponents(components.filter((comp) => comp.id !== id));
    };

    const getFolderFile = (id, file, folderNameEN, folderNameTH) => {
        const isDuplicate = folder.some(
            (comp) => comp.file.uid === file.uid
        );

        if (!isDuplicate) {
            setFolder([...folder, {
                id: id,
                folderNameTH: folderNameTH,
                folderNameEN: folderNameEN,
                file: file,
            }]);
        }
    };

    const handlerRemoveFiles = async (e) => {
        await setFileRemove([...FileRemove, {
            id: e.uid,
        }]);
    }

    const handleFileMain = ({ file }) => setImageMain(file.originFileObj);
    const handleFileMedia = ({ file }) =>  {
        if (file.status !== 'removed') {
            setMeadia(file.originFileObj);
            setMediaRemove(false);
        }
    }
    const handleFileChidren = ({ file }) => {
        const isDuplicate = imageChildren.some(
            (image) => image.file.uid === file.uid
        );

        if (!isDuplicate) {
            setImageChildren([...imageChildren, {
                file: file.originFileObj,
            }]);
        }
    }

     const handlePresentFile = ({ file }) => {
        const isDuplicate = fileChildren.some(
            (image) => image.file.uid === file.uid
        );

        if (!isDuplicate) {
            setfileChildren([...fileChildren, {
                file: file.originFileObj,
            }]);
        }
    }

    const CreateNewProduct = async () => {
        try {
            setIsCreating(true);
            
            const comandbuSplit = company.split(',');

            if (!productNameEN || !supplier || !Group) {
                setIsCreating(false);
                await scrollToTop();
                productNameTH === '' ? setValidNameTH('Please complete all the required information.') : setValidNameTH('');
                productNameEN === '' ? setValidNameEN('Please complete all the required information.') : setValidNameEN('');
                productNo === '' ? setProNovalid('Please complete all the required information.') : setProNovalid('');
                // company === '' ? setvalidCom('Please complete all the required information.') : setvalidCom('');
                supplier === null ? setValidselectSup('Please complete all the required information.') : setValidselectSup('');
                Group === null ? setvalidselectGroup('Please complete all the required information.') : setvalidselectGroup('');
                model === null ? setvalidselectModel('Please complete all the required information.') : setvalidselectModel('');
                return;
            }

            const Data = new FormData();
            Data.append('SupplierId', supplier);
            Data.append('ProductNameTh', productNameTH);
            Data.append('ProductNameEn', productNameEN);
            Data.append('ProductCode', productNo);
            Data.append('MediaTitle', mediaTitle);
            Data.append('MediaDescription', mediaDescription);
            Data.append('ProductDescriptionHeaderTh', descriptionHeaderTH);
            Data.append('ProductDescriptionDetailTh', descriptionTH);
            Data.append('ProductDescriptionHeaderEn', descriptionHeaderEN);
            Data.append('ProductDescriptionDetailEn', descriptionEN);
            Data.append('ProductImageMain', imageMain);
            Data.append('ProductUpVideo', Meadia);
            Data.append('GroupProductId', Group);
            Data.append('ModelProductId', model);
            Data.append('CompanyId', comandbuSplit[0]);
            Data.append('BuId', comandbuSplit[1]);
            Array.from(imageChildren).forEach((file) => {
                Data.append(`ProductImageChildren`, file.file);
            });          
            Array.from(fileChildren).forEach((file) => {
                Data.append(`presentFiles`, file.file);
            });          
            Data.append('ProductVideo', MeadiaLink);
            Data.append('Active', active);

            const profolder = components.map((items) => ({
                FolderId: items.id,
                FolderNameTH: items.folderNameTH,
                FolderNameEn: items.folderNameEN,
                File: folder.filter((file) => file.id === items.id).map((file) => ({
                    FolderId: items.id,
                    File: file.file,
                }))
            })) 

            const data = {
                ProductData: Data,
                ProFolder: profolder,
            }

            const response = await dispatch(createProduct(data));

            if (response.payload.status === true) {
                ToastifySuccess({ lable: 'creare new product success!' });
                setIsCreating(false);
                window.location.href = `${import.meta.env.VITE_REDIRECT_URL}/product`;
            } else {
                throw "creating a product failed";
            }
        } catch (error) {
            console.log(error);
            setIsCreating(false);
            ToastifyError({ lable: "Creating new product faild!" })
        }
    }

    useEffect(() => {
        const fecthGroup = async () => {
            try {
                if (isFetching.current) return;
                isFetching.current = true;
                await dispatch(fetchAllGroups());
                isFetching.current = false;
            } catch (error) {
                return console.log(error);
            }
        }

        if (groups.length === 0) fecthGroup();

        if (groups.length !== 0) {
            const groupFilter = groups.filter(group => group.Active === true);
            const groupData = groupFilter.map((items) => ({
                label: `${items.GroupNameEn}`,
                value: items.GroupProductId,
            })).sort((a, b) => a - b);
            setGroupOption(groupData);
        }
    }, [dispatch, groups]);

    useEffect(() => {
        const fecthCompany = async () => {
            try {
                if (isFatchingCom.current) return;
                isFatchingCom.current = true;
                await dispatch(GettingComAndBu());
                isFatchingCom.current = false;
            } catch (error) {
                return console.log(error);
            }
        }

        if (allCompany.length === 0) fecthCompany();

        if (allCompany.length !== 0) {
            const comData = allCompany.map((items) => ({
                label: `${items?.companyName}, ${items?.buName}`,
                value: `${items?.companyId},${items?.buId}`,
            })).sort((a, b) => a - b);
            setCompanyOptions(comData);
        }
    }, [dispatch, allCompany]);

    useEffect(() => { 
        const setVariable = async () => {
            try {
                setIsLoading(true);
                const product = await dispatch(getProductById({productId: id}));
                const prdfile = await dispatch(getFolderById({productId: id}));
                const productArr = await product?.payload.data;
                const folderArr = await prdfile?.payload.data;
                const model = await dispatch(getModelBySup(Number(productArr?.SupplierId)));
                const sups = await dispatch(GettingSupByGroup(Number(productArr?.ProductGroupId)));
                // const company = await dispatch(GettingCompanyBySup(Number(productArr?.SupplierId)));
                console.log(productArr);
                setActive(productArr?.Active);
                await setSupplier(Number(productArr?.SupplierId));
                await setModelOption(model?.payload?.data || []);
                await setSupplierOption(sups?.payload?.data.map((com) => ({
                            label: com.Supplier?.SupplierNameEn,
                            value: com.Supplier?.SupplierId,
                })) || []);
                // await setCompanyOptions(company?.payload?.data.map((com) => ({
                //     label: com.Company?.CompanyNameEN,
                //     value: com.Company?.CompanyId,
                // })) || []);
                await setGroup(Number(productArr?.ProductGroupId) || null);
                await setModel(Number(productArr?.ProductModelId) || null);
                await handleChangeCompany(`${productArr?.CompanyId},${productArr?.BuId}`);
                setProductNameTH(productArr?.ProductNameTh);
                setProductNameEN(productArr?.ProductNameEn);
                setProductNo(String(productArr?.ProductNo));
                setdescriptionHeaderTH(productArr?.ProductDescriptionHeaderTh);
                setdescriptionHeaderEN(productArr?.ProductDescriptionHeaderEn);
                setMeadiaLink(productArr?.ProductVideo || '');
                setFormDevice(productArr?.ProductVideo === null ? true : false);
                setDescriptionEN(productArr?.ProductDescriptionDetailEn);
                setDescriptionTH(productArr?.ProductDescriptionDetailTh);
                setMeadiaTitle(productArr?.MeadiaTitle);
                setMediaDescription(productArr?.MeadiaDescription);

                if (productArr?.ProductImageMain !== null) {    
                    await setdefaultImageMain([{
                        uid: '0',
                        name: `${productArr?.ProductImageMain}`,
                        status: 'done',
                        url: `${import.meta.env.VITE_REDIRECT_IMG}/images/${productArr?.ProductImageMain}`,
                        thumbUrl: `${import.meta.env.VITE_REDIRECT_IMG}/images/${productArr?.ProductImageMain}`,
                    }]);
                }

                if (productArr?.ProductUpVideo !== null) {
                    await setdefaultMedia([{
                        uid: '0',
                        name: `${productArr?.ProductUpVideo}`,
                        status: 'done',
                        url: `${import.meta.env.VITE_REDIRECT_IMG}/videos/${productArr?.ProductUpVideo}`,
                        thumbUrl: `${import.meta.env.VITE_REDIRECT_IMG}/videos/${productArr?.ProductUpVideo}`,
                    }]);
                }
                
                await setdefaultImageChildren(productArr?.ProductImageChildren.map((items) => ({
                    uid: items.productImageImage,
                    name: items.productImageImage,
                    status: 'done',
                    url: `${import.meta.env.VITE_REDIRECT_IMG}/images/${items.productImageImage}`,
                    thumbUrl: `${import.meta.env.VITE_REDIRECT_IMG}/images/${items.productImageImage}`,
                })));

                await setdefaultPresentFile(productArr?.PresentFile.map((items) => ({
                    uid: items.FileName,
                    name: items.FileOriginalName,
                    status: 'done',
                    url: `${import.meta.env.VITE_REDIRECT_IMG}/files/${items.FileName}`,
                    thumbUrl: `${import.meta.env.VITE_REDIRECT_IMG}/files/${items.FileName}`,
                })));
                // setComponents([{ id: Date.now(), folderNameTH: folderNameTH, folderNameEN: folderNameEN }]);
                folderArr ?
                await setComponents(folderArr.map((item) => ({
                    id: item.ProductFolderId,
                    folderNameTH: item.ProductFolderNameTh,
                    folderNameEN: item.ProductFolderNameEn,
                    file: item.ProductFiles.map((file) => ({
                        uid: file.ProductFileId,
                        name: file.ProductFileNameEn,
                        status: 'done',
                        url: `${import.meta.env.VITE_REDIRECT_IMG}/files/${file.ProductFile}`,
                        thumbUrl: `${import.meta.env.VITE_REDIRECT_IMG}/files/${file.ProductFile}`,
                    }))
                })))
                :
                setComponents([]);
                setIsLoading(false);
            } catch (err) {
                return console.log(err);
            }
        }

        if (currentSupplier === null && id !== undefined) {
            setVariable();
        };
    }, [dispatch, id, currentSupplier, folders]);

    const onChange = (checked) => {
        setActive(checked);
    };

    const handleChangeModal = async (e) => {
        console.log(e);
        setGroup(e);

        const sups = await dispatch(GettingSupByGroup(e));
        const supFilter = await sups.payload.data.filter((sup) => sup.Supplier.Active === true);
        const supData = supFilter.map((sup) => ({
            label: sup.Supplier?.SupplierNameEn,
            value: sup.Supplier?.SupplierId,
        })).sort((a, b) => a - b);
        setSupplierOption(supData);
    };

    const handleChangeSup = async (e) => {
       setSupplier(e);
       
    //    const companys = await dispatch(GettingCompanyBySup(e));
    //    console.log(companys.payload.data);
    //    const comFilter = await companys.payload.data.filter((com) => com.Company.Active === true);
    //    const comData = await comFilter.map((com) => ({
    //         label: com.Company?.CompanyNameEN,
    //         value: com.Company?.CompanyId,
    //    }));
    //    setCompanyOptions(comData);
    };

    const handleChangeCompany = async (e) => {
        // const supplier = await dispatch(getSupplierByCompanyId(e));
        setCompany(e);
        // const supFilter = supplier?.payload?.data.filter((sup) => sup.Supplier.Active === true);
        // const supData = supFilter.map((items) => ({
        //     label: items?.Supplier?.SupplierNameEn,
        //     value: items?.Supplier?.SupplierId,
        // })).sort((a, b) => a - b);
        // setSupplierOption(supData || []);
    };

    const handleChangeValue = async (e) => {
        setfolderNameTH(e.target.value);
        setfolderNameEN(e.target.value);
    };

    const updateProductDetail = async () => {
        try {
            setIsProductUpdating(true);

            const comandbuSplit = company.split(',');

            if (!productNameEN || !supplier || !Group) {
                await scrollToTop();
                productNameTH === '' ? setValidNameTH('Please complete all the required information.') : setValidNameTH('');
                productNameEN === '' ? setValidNameEN('Please complete all the required information.') : setValidNameEN('');
                // company === null ? setvalidCom('Please complete all the required information.') : setvalidCom('');
                supplier === '' ? setValidselectSup('Please complete all the required information.') : setValidselectSup('');
                Group === '' ? setvalidselectGroup('Please complete all the required information.') : setvalidselectGroup('');
                model === '' ? setvalidselectModel('Please complete all the required information.') : setvalidselectModel('');
                setIsProductUpdating(false);
                return;
            }

            const Data = new FormData();
            Data.append('SupplierId', supplier);
            Data.append('ProductNameTh', productNameTH);
            Data.append('ProductNameEn', productNameEN);
            Data.append('ProductCode', productNo);
            Data.append('MediaTitle', mediaTitle);
            Data.append('MediaDescription', mediaDescription);
            Data.append('ProductDescriptionHeaderTh', descriptionHeaderTH);
            Data.append('ProductDescriptionDetailTh', descriptionTH);
            Data.append('ProductDescriptionHeaderEn', descriptionHeaderEN);
            Data.append('ProductDescriptionDetailEn', descriptionEN);
            Data.append('ProductImageMain', imageMain);
            Data.append('ProductUpVideo', Meadia);
            Data.append('RemoveVideo', mediaRemove);
            Data.append('GroupProductId', Group);
            Data.append('ModelProductId', model);
            Data.append('CompanyId', comandbuSplit[0]);
            Data.append('BuId', comandbuSplit[1]);
            Array.from(imageChildren).forEach((file) => {
                Data.append(`ProductImageChildren`, file.file);
            });          
            Array.from(fileChildren).forEach((file) => {
                Data.append(`presentFiles`, file.file);
            });          
            Data.append('ProductVideo', MeadiaLink);
            Data.append('Active', active);

            const data = {
                productId: Number(id),
                ProductData: Data,
            }

            const profolder = components.map((items) => ({
                FolderId: items.id,
                FolderNameTH: items.folderNameTH,
                FolderNameEn: items.folderNameEN,
                File: folder.filter((file) => file.id === items.id).map((file) => ({
                    FolderId: items.id,
                    File: file.file,
                }))
            }));

            // console.log(profolder);
            
            // return;

            const dataFile = {
                productId: Number(id),
                ProductFolder: profolder,
            }

            const dataRemovefolder = {
                folders: removeFolder
            }

            const dataRemovefile = {
                FileRemoves: FileRemove,
            }            
            
            await dispatch(updateProductFile(dataFile));
            const response = await dispatch(editProductById(data));

            if (response.payload.status === true) {
                await dispatch(deleteProductFile(dataRemovefile));
                await dispatch(deleteProductFolder(dataRemovefolder));
                setIsProductUpdating(false);
                ToastifySuccess({ lable: 'updating product detail successfully!' });
                setTimeout(() => {
                    navigate('/product');
                }, 2000);
            }
        } catch (error) {
            setIsProductUpdating(false);
            return console.log(error);
        }
    }

    // const updatePorductFile = async () => {
    //     try {
    //         setIsFolderUpdating(true);
    //         const profolder = components.map((items) => ({
    //             FolderId: items.id,
    //             FolderNameTH: items.folderNameTH,
    //             FolderNameEn: items.folderNameEN,
    //             File: folder.filter((file) => file.id === items.id).map((file) => ({
    //                 FolderId: items.id,
    //                 File: file.file,
    //             }))
    //         }));

    //         const data = {
    //             productId: Number(id),
    //             ProductFolder: profolder,
    //         }
            
    //         const response = await dispatch(updateProductFile(data));

    //         if (response.payload.status === true) {
    //             setIsFolderUpdating(false);
    //             ToastifySuccess({ lable: 'updating product folder successfully!' });
    //         }
    //     } catch (error) {
    //         setIsFolderUpdating(false);
    //         return console.log(error);
    //     }
    // };
    

    return (
        <div className="mb-10 2xl:mx-[20px] md:mx-[30px]">
            <div className="mt-10 mb-3">
                <h1 className="font-primaryMedium text-[18px]">{ id === undefined ? 'Create New Product' : 'Update a Product Detail' }</h1>
                <span>Enter the product detail here</span>
            </div>
            <NormalCard>
                {
                    isLoading || isLaodingDataSelection ?
                    <DetailLoading />
                    :
                    <div className="w-full p-[20px]">
                        <div className="flex justify-start mb-2 gap-[20px] items-center">
                            <Tooltip placement="top" title={text} arrow={mergedArrow}>
                                <ConfigProvider
                                    theme={{
                                        components: {
                                          Switch: {
                                            colorPrimary: '#C00101',
                                            colorPrimaryHover: '#C00101',
                                          },
                                        },
                                      }}
                                >
                                    <Switch defaultValue={active} onChange={onChange}/>
                                </ConfigProvider>
                            </Tooltip>
                            <div>
                                <span className="font-primaryMedium">Active the product</span>
                                <span className="block">The active status indicates that the product is currently available</span>
                            </div>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-3">
                            <InputComponet placeholder="Please enter product model." vildate={validNameEN} label="Product Model" required maxLength={100} OnChange={setProductNameEN} value={productNameEN} />
                            <SelectOption value={Group} OnChange={handleChangeModal} placeholder="Select Product Group" validate={validselectGroup} options={groupOption} label="Product Group" required />
                            <SelectOption value={supplier} OnChange={handleChangeSup} placeholder="Select Supplier" validate={validselectSup} label="Supplier" options={supplierOption} required />
                            <SelectOption value={company} OnChange={handleChangeCompany} placeholder="Select Company & Bussiness unit" validate={validcom} label="Company & Bussiness unit" options={companyOption}/>
                        </div>
                        <div className="my-3">
                        </div>
                        <div className="w-full mt-3">
                            <div>
                                <span className="text-[16px] font-primaryMedium">Main Photo</span>
                                <span className="block">Add image for showing first product image</span>
                            </div>
                            {
                                isLoading ?
                                <div>Loading</div> 
                                :
                                <Dragger 
                                maxCount={1}
                                name="file"
                                listType="picture"
                                onChange={handleFileMain}
                                beforeUpload={beforeUpload}
                                defaultFileList={defaultImageMain}
                                className="bg-transparent"
                                >
                                    <p className="ant-upload-drag-icon">
                                    <div className="flex w-full justify-center">
                                         <img src={UploadIcon} alt="" />
                                    </div>
                                    </p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                    <p className="ant-upload-hint">
                                        JPG, PNG (Maximum size 5mb)
                                    </p>
                                </Dragger>
                            }
                        </div>
                        <div className="w-full mt-3">
                            <div>
                                <span className="text-[16px] font-primaryMedium">Secondary Photo</span>
                                <span className="block">Add images for showing images about your product.</span>
                            </div>
                            {
                                isLoading ?
                                <div>Laoding</div>
                                :
                                <Dragger 
                                    name="file"
                                    listType="picture"
                                    onChange={handleFileChidren}
                                    beforeUpload={beforeUpload}
                                    defaultFileList={defaultImageChildren}
                                >
                                    <p className="ant-upload-drag-icon">
                                    <div className="flex w-full justify-center">
                                         <img src={UploadIcon} alt="" />
                                    </div>
                                    </p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                    <p className="ant-upload-hint">
                                        JPG, PNG (Maximum size 5mb)
                                    </p>
                                </Dragger>   
                            }
                        </div>
                        <div className="mt-4">
                            <InputComponet color="red" placeholder="Enter the description header" label="Description Header" maxLength={100} OnChange={setdescriptionHeaderEN} value={descriptionHeaderEN} />
                            <ReactQuill className="rounded-lg mt-4" theme="snow" value={descriptionEN} onChange={setDescriptionEN} />
                        </div>
                    </div>
                }
            </NormalCard>
            <div className="mt-5 mb-3">
                <h1 className="font-primaryMedium text-[18px]">Upload Presentation</h1>
                <span>Allows users to upload presentation(PDF) files to the system for sharing or viewing</span>
            </div>
            <NormalCard>
                {
                    isLoading ?
                    <DetailLoading />
                    :
                    <div className="p-[20px] w-full">
                        <div>
                            <span>Presentation file(PDF)</span>
                        </div>
                        {
                            isLoading ?
                            <div>Loading</div> 
                            :
                            <Dragger 
                            maxCount={10}
                            name="file"
                            listType="picture"
                            onChange={handlePresentFile}
                            beforeUpload={beforeUploadFile}
                            defaultFileList={defaultPresentFile}
                            >
                                <p className="ant-upload-drag-icon">
                                <div className="flex w-full justify-center">
                                    <img src={UploadIcon} alt="" />
                                </div>
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">
                                    PDF (Maximum size 50mb)
                                </p>
                            </Dragger>
                        }
                    </div>
                }
            </NormalCard>
            <div className="my-5 mb-3">
                <h1 className="font-primaryMedium text-[18px]">Upload Media</h1>
                <span>Add video, Media, or other meadia files to showcase or support your product</span>
            </div>
            <NormalCard>
                {
                    isLoading ?
                    <DetailLoading />
                    :
                    <div className="p-[20px] w-full">
                            <div className="flex justify-between gap-x-2">
                                <button className={`${FormDevice ? 'border-red-500 text-red-500' : '' } w-full py-1 px-2 border rounded-md duration-100 ease-in-out`} onClick={() => setFormDevice(true)}>
                                    <span>From Device</span>
                                </button>
                                <button className={`${FormDevice === false ? 'border-red-500 text-red-500' : '' } w-full py-1 px-2 border rounded-md duration-100 ease-in-out`} onClick={() => setFormDevice(false)}>
                                    <span>From URL</span>
                                </button>
                            </div>
                            { 
                                FormDevice ? 
                                <div className="mt-5">
                                    <Dragger 
                                        name="fwfw"
                                        listType="picture"
                                        onChange={handleFileMedia}
                                        beforeUpload={beforeUploadVedio}
                                        defaultFileList={defaultMedia}
                                        maxCount={1}
                                        onRemove={() => setMediaRemove(true)}
                                        >
                                            <p className="ant-upload-drag-icon">
                                            <div className="flex w-full justify-center">
                                                <img src={UploadIcon} alt="" />
                                            </div>
                                            </p>
                                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                            <p className="ant-upload-hint">
                                                MP4, AVI or MOV (Max. 100MB) 
                                            </p>
                                    </Dragger>
                                    <div className="mt-3">
                                    <InputComponet maxLength={100} placeholder="Enter The Title" color="red" value={mediaTitle} OnChange={setMeadiaTitle} label="Video Title" />
                                    </div>
                                    <div className="mt-3">
                                    <TextArea label="Description" value={mediaDescription} placeholder="Enter Video Description" maxLength={5000} OnChange={setMediaDescription}/>
                                    </div>
                                </div>
                                :
                                <div className="mt-5">
                                    <div className="mt-3">
                                        <InputComponet maxLength={100} color="red" value={mediaTitle} OnChange={setMeadiaTitle} placeholder="Enter The Title" label="Video Title" />
                                    </div>
                                    <div className="mt-3">
                                        <InputComponet color="red" placeholder="Enter Video Link (youtube)" label="video URL" OnChange={setMeadiaLink} maxLength={250} value={MeadiaLink}/>
                                    </div>
                                    <div className="mt-3">
                                        <TextArea placeholder="Enter Video Descrition" label="Description" value={mediaDescription} maxLength={5000} OnChange={setMediaDescription}/>
                                    </div>
                                </div>
                            }
                            {/* {
                                id !== undefined &&
                                <div className="my-4 flex justify-end">
                                    <div className="w-[40%] flex gap-x-5">
                                        <ConfirmProduct isLoading={isProductUpdating} lable="Update Product Detail" func={updateProductDetail} />
                                    </div>
                                </div>
                            } */}
                    </div>
                }
            </NormalCard>
            <div className="mt-5 mb-3">
                <h1 className="font-primaryMedium text-[18px]">Document</h1>
                <span>Add PDF files format only to provide addition information about your project</span>
            </div>
            <NormalCard>
                {
                    isLoading ?
                    <DetailLoading />
                    :
                    <div className="w-full mt-2 p-[20px]">
                        <div className="w-full flex gap-x-3 border p-4 rounded-md items-end">
                            <div className="w-full">
                                <ConfigProvider
                                    theme={{
                                        components: {
                                        Input: {
                                            activeBorderColor: '#00CE86',
                                            hoverBorderColor: '#00CE86',
                                            colorBorder: "#B0BEC5",
                                        },
                                        },
                                    }}
                                >
                                    <label className="block text-sm text-gray-700 mb-[2px]">Folder Name</label>
                                    <Input 
                                        size="large"
                                        type='text'
                                        placeholder="Enter Folder Name"
                                        value={folderNameEN}
                                        onChange={handleChangeValue} 
                                    />
                                </ConfigProvider>
                            </div>
                            <div>
                                <IconButton onClick={addComponent} className="border" color="white" variant="gradient">
                                    <LuPlus />
                                </IconButton>
                            </div>
                        </div>
                        <Reorder.Group values={components} onReorder={setComponents}  axis="y">
                            {components.map((comp) => (
                                <Reorder.Item key={comp.id} value={comp}>
                                    <FolderFile 
                                        key={comp.id} 
                                        id={comp.id}
                                        folderNameTH={comp.folderNameTH}
                                        folderNameEN={comp.folderNameEN}
                                        onRemove={removeComponent}
                                        files={getFolderFile}
                                        defaultFileList={comp.file === undefined ? null : comp.file}
                                        isLoading={isLoading}
                                        onRemovefile={handlerRemoveFiles}
                                    />
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    </div>
                }
                <div className="my-4 flex justify-end px-[20px]">
                    <div className="w-[40%] flex gap-x-5">
                        <OutlineBTN func={handleBackPage} size="large" lable="Cancel" />
                        {
                            // id !== undefined && <ConfirmProduct isLoading={isFolderUpdating} lable="Update Product File" func={updatePorductFile} />
                            id !== undefined && <ConfirmProduct isLoading={isProductUpdating} lable="Update Product Detail" func={updateProductDetail} />
                        }
                        {
                            id === undefined && <ConfirmProduct type="create" isLoading={isCreating} lable="Create New Product" func={CreateNewProduct} />
                        }
                    </div>
                </div>
            </NormalCard>
            <ErrorDialog description="Upload failed: File exceeds size limit or invalid type" title="File too large or unsupported format" open={fileOverSize} onCancel={() => setFileOverSize(false)} />
        </div>
    );
};

export default ProductForm;