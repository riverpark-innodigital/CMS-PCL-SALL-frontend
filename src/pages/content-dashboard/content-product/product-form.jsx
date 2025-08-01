import React, { useState, useEffect } from 'react';

import { Modal, Input, Select, Button, Radio, Upload, Row, Col, Typography, Image, Form, message } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title } = Typography;

import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from "../../../slicers/productsaleSlicer";
import { fetchAllSupplier } from "../../../slicers/supplierSlicer";

const ProductFormModal = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        productName: '',
        // productNo: '',       disabled to talk for more detail.
        supplier: '',
        // productGroup: '',    disabled to talk for more detail.
        // model: '',           disabled to talk for more detail.
        description: '',
        isActive: true,
    });
    const [fileList, setFileList] = useState([]); // เก็บไฟล์ที่อัปโหลดหลายไฟล์
    // const [suppliers, setSuppliers] = useState([]); // ใช้เก็บข้อมูล suppliers แบบเก่าเลิกใช้แล้ว

    const dispatch = useDispatch();
    const suppliers = useSelector((state) => state.supplier.suppliers);
    // Fetch suppliers data
    useEffect(() => {
        if (isModalVisible) {
            dispatch(fetchAllSupplier()); // เรียก action เพื่อดึงข้อมูล suppliers
        }
    }, [isModalVisible, dispatch]);

    // ใช้ useForm hook จาก Ant Design
    const [form] = Form.useForm(); 

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        form.resetFields(); // รีเซ็ตข้อมูลทั้งหมดในฟอร์ม
        setFileList([]); // เคลียร์ข้อมูลของไฟล์
        setFormData({
            productName: '',
            // productNo: '',
            supplier: '',
            // productGroup: '',
            // model: '',
            description: '',
            isActive: true,
        }); // รีเซ็ตข้อมูลใน state formData
    };

    const handleRadioChange = (e) => {
        setFormData((prev) => ({ ...prev, isActive: e.target.value }));
    };

    const handleUpload = ({ file, fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handleFormSubmit = async (values) => {
        console.log(values);
        try {
            // สร้าง FormData
            const formData = new FormData();
            
            // ส่งค่าพื้นฐานต่างๆ
            formData.append("SupplierId", parseInt(values.supplier));
            formData.append("ProductNameTh", values.productName);
            formData.append("ProductDescriptionHeaderTh", values.description); // ข้อมูลอื่นๆ ที่จำเป็น
            formData.append("Active", values.isActive);
    
            // ตั้งค่าผู้สร้างและผู้ปรับปรุง
            formData.append("CreateBy", "Porjai Mak");
            formData.append("UpdateBy", "Projai Mak");
    
            // จัดการกับชื่อไฟล์
            if (fileList.length > 0) {
                formData.append("ProductImageMain", fileList[0].name);
    
                // สำหรับ ProductImageChildren จะเก็บเป็นชื่อไฟล์ที่เหลือ
                const productImageChildren = fileList.slice(1).map((file) => ({
                    ProductImageNameTh: values.productName,
                    ProductImageNameEn: values.productName,
                    productImageImage: file.name, // เก็บชื่อไฟล์
                    Active: values.isActive,
                }));
    
                formData.append("ProductImageChildren", JSON.stringify(productImageChildren)); // เก็บข้อมูลเป็น JSON
            }
    
            console.log("FormData to be sent:");
            formData.forEach((value, key) => {
                console.log(key, value);
            });
    
            // ส่งข้อมูลไปยัง API
            const response = await dispatch(createProduct(formData));
            console.log(response);
            
            if (response.payload.status) {
                message.success("Product created successfully!");
                handleCloseModal();
            } else {
                message.error(response.data.message || "Failed to create product");
            }
        } catch (error) {
            message.error("An error occurred while creating the product");
        }
    };
    
    
    

    return (
        <div>
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
                Create New Product
            </button>

            <Modal
                title="Add Product"
                centered
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={null}
                width={700}
                style={{
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Form
                    layout="vertical"
                    onFinish={handleFormSubmit}
                    initialValues={formData}
                    style={{ width: '100%' }}
                    form={form} // กำหนด form ด้วย useForm hook
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Product name"
                                name="productName"
                                rules={[{ required: true, message: 'Please input the product name!' }]}
                            >
                                <Input placeholder="Add Product name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Product No." name="productNo">
                                <Input placeholder="Add Product No." disabled />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Supplier" name="supplier">
                                <Select
                                    placeholder="Select Supplier"
                                    options={suppliers?.length > 0 ? suppliers.map(supplier => ({
                                        label: supplier.SupplierNameTh,
                                        value: supplier.SupplierId,
                                    })) : []}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Product Group" name="productGroup">
                                <Select placeholder="Select Product Group" disabled>
                                    <Select.Option value="group1">Group 1</Select.Option>
                                    <Select.Option value="group2">Group 2</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Model</label>
                        <Select disabled value={formData.model} style={{ width: '100%' }}>
                            <Select.Option value="model1">Model 1</Select.Option>
                            <Select.Option value="model2">Model 2</Select.Option>
                        </Select>
                    </div>

                    <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '8px' }}>Upload Image</label>
                        <Upload.Dragger
                            accept=".svg,.png,.jpg,.gif"
                            multiple
                            progress
                            onChange={handleUpload}
                            fileList={fileList}
                            style={{
                                marginBottom: '15px',
                            }}
                            listType="picture-card"
                            showUploadList={{
                                showPreviewIcon: false,
                            }}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                SVG, PNG, JPG or GIF (max. 800x400px)
                            </p>
                        </Upload.Dragger>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <Form.Item label="Product Description" name="description">
                            <TextArea
                                rows={4}
                                placeholder="Describe the product"
                                maxLength={275}
                                showCount
                            />
                        </Form.Item>
                    </div>

                    {/* Radio buttons for Active/Inactive */}
                    <Form.Item
                        label="Status"
                        name="isActive"
                    >
                        <Radio.Group onChange={handleRadioChange}>
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
                                                The product is temporarily unavailable or removed from the store's active listings.
                                            </p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Radio.Group>
                    </Form.Item>


                    <div style={{ textAlign: 'right', marginTop: '1em' }}>
                        <Button onClick={handleCloseModal} style={{ marginRight: '10px' }}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductFormModal;
