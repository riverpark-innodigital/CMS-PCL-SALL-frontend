import { useState} from 'react';
import { Modal, Radio, Row, Col, Typography, message } from 'antd';
const { Title } = Typography;
import { useDispatch, useSelector } from 'react-redux';
import { createModel, getModelById, updateModelById } from "../../../slicers/modelSlicer";
import InputComponet from "../../../components/content-input/input-full";
import { IconButton, Option, Button } from '@material-tailwind/react';
import { LuPen } from "react-icons/lu";
import PropTypes from 'prop-types';
import { fetchAllSupplier, fecthSupplierByID } from '../../../slicers/supplierSlicer';
import Selector from '../../../components/content-input/selection';
import ButtonFullComponent from '../../../components/content-buttons/full-button';

const ModelForm = ({ modelId }) => {
    const dispatch = useDispatch();
    const supplier = useSelector((state) => state.supplier.suppliers);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modelCode, setModelCode] = useState('');
    const [modelNameTh, setModelNameTh] = useState('');
    const [modelNameEn, setModelNameEn] = useState('');
    const [status, setStatus] = useState(true);
    const [supSelected, setSupSelectd] = useState(null);
    // add current user setUpdateBy or setCreateBy don't use defualt 'Projai Mak'

    const [validNameTH, setValidNameTH] = useState('');
    const [validNameEN, setValidNameEN] = useState('');
    const [validSup, setValidSup] = useState('');
    const [validGroupCode, setValidGroupCode] = useState('');

    const handleOpenModal = async () => {
        await dispatch(fetchAllSupplier());
        if (modelId) {
            const response = await dispatch(getModelById(modelId));
            const sup = await dispatch(fecthSupplierByID({id: response?.payload?.data?.SupplierId}));
            await setModelCode(response?.payload?.data?.ModelCode || '');
            await setModelNameTh(response?.payload?.data?.ModelNameTh || '');
            await setModelNameEn(response?.payload?.data?.ModelNameEn || '');
            await setSupSelectd(sup?.payload?.data?.SupplierId || null);
            await setStatus(response?.payload?.data?.Active || true);
            setIsModalVisible(true);
        } else {
            setIsModalVisible(true);
        }
    };

    const handleCloseModal = () => {
        setModelCode("");
        setModelNameEn("");
        setModelNameTh("");
        setValidNameEN('');
        setValidNameTH('');
        setValidSup('');
        setValidGroupCode('');
        setIsModalVisible(false);
    };

    const handleRadioChange = (e) => {
        setStatus(e.target.value);
    };

    const handleFormSubmit = async () => {
        try {

            if (!modelNameTh || !modelNameEn || !modelCode || !supSelected) {
                modelNameEn === '' ? setValidNameTH('Please complete all the required information.') : setValidNameTH('');
                modelNameTh === '' ? setValidNameEN('Please complete all the required information.') : setValidNameEN('');
                modelCode === '' ? setValidGroupCode('Please complete all the required information.') : setValidGroupCode('');
                supSelected === null ? setValidSup('Please complete all the required information.') : setValidSup('');
                return;
            }

            const FromData = {
                ModelCode: modelCode,
                ModelNameTh: modelNameTh,
                ModelNameEn: modelNameEn,
                Active: status,
                SupplierId: supSelected,
                UpdateBy: "Porjai Mak"
            }

            let response;

            if (modelId) {
                // Update existing model
                const data = {
                    modelId: modelId,
                    data: FromData
                }
                response = await dispatch(updateModelById({ data }));
            } else {
                // Create new model
                response = await dispatch(createModel({ ...FromData }));
            }
    
            // check response
            if (!response || !response.payload) {
                throw new Error("No response from server");
            }
    
            if (response.payload.status) {
                message.success(modelId ? "Model updated successfully!" : "Model created successfully!");
                setModelCode("");
                setModelNameEn("");
                setModelNameTh("");
                setValidNameEN('');
                setValidNameTH('');
                setValidSup('');
                setValidGroupCode('');
                setSupSelectd(null);
                setStatus(true);
                handleCloseModal();
            } else {
                const errorMessage = response.payload.error || "Unknown error occurred";
                message.error(`Failed to save model: ${errorMessage}`);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(`Server Error: ${error.response.data.message || "Unexpected error occurred"}`);
            } else if (error.message) {
                message.error(`Error: ${error.message}`);
            } else {
                message.error("An unknown error occurred while saving the model.");
            }
        }
    };

    return (
        <div>
            { modelId ?
                <IconButton onClick={handleOpenModal} variant="text" className="rounded-full text-xl">
                    <LuPen />
                </IconButton>
                :
                <button onClick={handleOpenModal} className="flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 focus:outline-none">
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
                    <div>Create New Model</div>
                </button>
            }
            <Modal
                title={modelId ? "Edit Model" : "Add New Model"}
                centered
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={1200}
                style={{
                    padding: '20px',
                    borderRadius: '8px',
                }}
            >
                <div>{modelId ? "Edit the details of the product below." : "Fill in the details to create a new product."}</div>
                <Row gutter={16} className='mt-4'>
                    <Col span={12}>
                        <InputComponet vildate={validNameTH} color="red" label="Model Name (TH)" OnChange={setModelNameTh} value={modelNameTh} maxLength={100} format={true} />
                    </Col>
                    <Col span={12}>
                        <InputComponet vildate={validNameEN} color="red" label="Model Name (EN)" OnChange={setModelNameEn} value={modelNameEn} maxLength={100} format={false} />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12} className='my-3'>
                        <InputComponet vildate={validGroupCode} color="red" label="Model Code" OnChange={setModelCode} value={modelCode} maxLength={30} />
                    </Col>
                    <Col span={12} className='my-3'>
                        <Selector
                            Color="red"
                            label="Select Supplier"
                            value={supSelected}
                            data={supplier}
                            OnChange={setSupSelectd}
                            validate={validSup}
                        >
                            {supplier.map((model) => (
                                <Option key={model?.SupplierId} value={model?.SupplierId}>
                                    {model?.SupplierNameEn ? model?.SupplierNameEn : "N/A" } - ({model?.SupplierNameTh ? model?.SupplierNameTh : "N/A" })
                                </Option>
                            ))}
                        </Selector>
                    </Col>
                </Row>
                <Radio.Group onChange={handleRadioChange} value={status}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Row style={{ textAlign: 'left' }}>
                                <Col span={2}>
                                    <Radio value={true} />
                                </Col>
                                <Col span={22}>
                                    <Title level={5}>Active</Title>
                                    <p style={{ fontSize: '12px', color: '#888' }}>
                                        The active status indicates that the product is available for sale.
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Row style={{ textAlign: 'left' }}>
                                <Col span={2}>
                                    <Radio value={false} />
                                </Col>
                                <Col span={22}>
                                    <Title level={5}>Inactive</Title>
                                    <p style={{ fontSize: '12px', color: '#888' }}>
                                        The product is temporarily unavailable or removed from the stores active listings.
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Radio.Group>
                <div className='w-full flex justify-end mt-4'>
                    <div className="gap-x-3 flex w-[50%] 2xl:w-[40%] items-center">
                        <Button
                            variant="text"
                            color="red"
                            onClick={handleCloseModal}
                            className="w-full"
                        >
                            <span className='text-nowrap'>Cancel</span>
                        </Button>
                        <ButtonFullComponent otherStyle='text-nowrap w-full text-white' lable={`${modelId ? 'Update Product Model' : 'Create New Product Model' }`} func={handleFormSubmit} color="green" />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

ModelForm.propTypes = {
    modelId: PropTypes.number,
};

export default ModelForm;
