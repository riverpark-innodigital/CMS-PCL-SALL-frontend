import React, { useState, useEffect } from "react";
import { Modal, Input, Select, Button, Radio, Upload, Row, Col, Typography, Form, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import {
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { LuPen } from "react-icons/lu";
import {
  Drawer,
} from "@material-tailwind/react";
const { TextArea } = Input;
const { Title } = Typography;

import { useDispatch, useSelector } from "react-redux";
import { getProductById, editProductById } from "../../../slicers/productsaleSlicer";
import { fecthAllSupplier } from "../../../slicers/supplierSlicer";

const ProductEditModal = ({ proId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const dispatch = useDispatch();
  const [size, setSize] = React.useState(null);

  const suppliers = useSelector((state) => state.supplier.suppliers);

  useEffect(() => {
    if (isModalVisible) {
      dispatch(fecthAllSupplier());
    }
  }, [isModalVisible, dispatch]);


  const productDetails = useSelector((state) => state.productsale.singleProduct);

  useEffect(() => {
    if (isModalVisible && proId) {
      dispatch(getProductById({ productId: proId }));
    }
  }, [isModalVisible, proId, dispatch]);



  const handleOpen = (value) => {
    setSize(value)
    setIsModalVisible(true)
  };

  const [form] = Form.useForm();


  const handleCloseModal = () => {
    setIsModalVisible(false);
    form.resetFields();
    setFileList([]);
  };

  const handleUpload = ({ file, fileList: newFileList }) => {
    setFileList(newFileList);
  };

  useEffect(() => {
    
    if (productDetails) {
      form.setFieldsValue({
        productName: productDetails.ProductNameTh || "",
        supplier: productDetails.SupplierId || "",
        description: productDetails.ProductDescriptionHeaderTh || "",
        isActive: productDetails.Active !== undefined ? productDetails.Active : true,
      });
    }
  }, [productDetails, form]);  // ตรวจสอบเมื่อ productDetails เปลี่ยนแปลง

  const handleFormSubmit = async (values) => {
    try {
      
      const formData = new FormData();
      formData.append("SupplierId", values.supplier);
      formData.append("ProductNameTh", values.productName);
      formData.append("ProductDescriptionHeaderTh", values.description);
      formData.append("Active", values.isActive);
      formData.append("UpdateBy", "Porjai Mak");
      console.log(formData);
      
      const body = {
        SupplierId: values.supplier,
        ProductNameTh: values.productName,
        ProductDescriptionHeaderTh: values.description,
        isActive: values.isActive,
        UpdateBy: "Porjai Mak"
      }

      if (fileList.length > 0) {
        formData.append("ProductImageMain", fileList[0].originFileObj);
        fileList.slice(1).forEach((file) =>
          formData.append("ProductImageChildren", file.originFileObj)
        );
      }
      handleCloseModal();
      await dispatch(editProductById({productId: proId, updateData: body}))
        .then((response)=> {
          console.log(response.status);
        });
      
      
      // if (response.data.message === "success") {
      //   message.success("Product updated successfully!");
      //   handleCloseModal();
      // } else {
      //   message.error(response.payload.message || "Failed to update product");
      // }
    } catch (error) {
      message.error("An error occurred while updating the product");
    }
  };

  return (
    <div>
      <IconButton onClick={() => handleOpen("md")} variant="text" className="rounded-full text-xl">
        <LuPen />
      </IconButton>
      <Dialog
        open={isModalVisible} // ใช้ isModalVisible แทน size
        size={size || "md"}
        handler={handleOpen}
      >
        <DialogHeader>
          Add new supplier
        </DialogHeader>
        <DialogBody>
          <Form
            layout="vertical"
            onFinish={handleFormSubmit}
            form={form}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Product Name"
                  name="productName"
                  rules={[{ required: true, message: "Please input the product name!" }]}
                >
                  <Input placeholder="Enter product name" />
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
                <Form.Item
                  label="Supplier"
                  name="supplier"
                  rules={[{ required: false, message: "Please select a supplier!" }]}
                >
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

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Model" name="model">
                  <Select disabled>
                    <Select.Option value="model1">Model 1</Select.Option>
                    <Select.Option value="model2">Model 2</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Upload Image">
              <Upload.Dragger
                accept=".svg,.png,.jpg,.gif"
                multiple
                fileList={fileList}
                disabled // Disable Upload Dragger
                listType="picture-card"
                showUploadList={{ showPreviewIcon: false }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
              </Upload.Dragger>
            </Form.Item>

            <Form.Item label="Status" name="isActive">
              <Radio.Group>
                <Row gutter={16}>
                  <Col span={12}>
                    <Radio value={true}>
                      <Title level={5}>Active</Title>
                      <p style={{ fontSize: "12px", color: "#888" }}>
                        The active status indicates that the product is available for sale.
                      </p>
                    </Radio>
                  </Col>
                  <Col span={12}>
                    <Radio value={false}>
                      <Title level={5}>Inactive</Title>
                      <p style={{ fontSize: "12px", color: "#888" }}>
                        The product is temporarily unavailable or removed from the store's active listings.
                      </p>
                    </Radio>
                  </Col>
                </Row>
              </Radio.Group>
            </Form.Item>

            <div style={{ textAlign: "right" }}>
              <Button onClick={handleCloseModal} style={{ marginRight: "10px" }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        </DialogBody>
      </Dialog>
    </div>
  );
};

export default ProductEditModal;
