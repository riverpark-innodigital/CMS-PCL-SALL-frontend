import PropTypes from "prop-types";
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
  } from "@material-tailwind/react";
import { useState } from "react";
import { Tag } from 'antd';
import parse from 'html-react-parser';
import dateFormat from "dateformat";

const ProductInformation = ({ data }) => {

    const [open, setOpen] = useState(1);
    const handleOpen = (value) => setOpen(open === value ? 0 : value);
    const notFoundTag = <Tag bordered={false} color="#bfbfbf"> Not Data </Tag>

    return(
        <div className="w-full">
            <Accordion open={open === 1} className={`mb-2 rounded-lg border duration-100 ease-in-out border-blue-gray-100 px-4 ${
                open === 1 ? "border-gray-500" : ""
                }`}>
            <AccordionHeader
                onClick={() => handleOpen(1)}
                className={`border-b-0 font-primaryRegular transition-colors ${
                open === 1 ? "" : ""
                }`}
            >
                
            </AccordionHeader>
            <AccordionBody className="pt-0">
                <div>
                    <span className="text-[20px] font-primaryBold">Product Detail</span>
                    <span className="block text-[12px] font-primaryBold">Get detailed information about the product.</span>
                </div>
                <div className="w-full justify-start grid grid-cols-2 mt-2 gap-2">
                    <div className="my-2">
                        <span className="text-gray-800 font-primaryMedium flex justify-start">Product Model</span>
                        <span className="flex justify-start">{data?.ProductNameEn || notFoundTag}</span>
                    </div>
                    <div className="my-2">
                        <span className="text-gray-800 font-primaryMedium flex justify-start">Product Group</span>
                        <span className="flex justify-start">{data?.ProductGroupName || notFoundTag}</span>
                    </div>
                    <div className="my-2">
                        <span className="text-gray-800 font-primaryMedium flex justify-start">Company & BU</span>
                        <span className="flex justify-start">{data?.CompanyName}, {data?.BUName}</span>
                    </div>
                    <div className="my-2">
                        <span className="text-gray-800 font-primaryMedium flex justify-start">Supplier Name</span>
                        <span className="flex justify-start">{data?.SupplierNameEn || notFoundTag}</span>
                    </div>
                    <div className="my-2">
                        <span className="text-gray-800 font-primaryMedium flex justify-start">Created by</span>
                        <span className="flex justify-start">{data?.CreateBy}</span>
                    </div>
                    <div className="my-2">
                        <span className="text-gray-800 font-primaryMedium flex justify-start">Created Date</span>
                        <span className="flex justify-start">{dateFormat(data?.CreateDate, "mediumDate")}</span>
                    </div>
                    <div className="my-2">
                        <span className="text-gray-800 font-primaryMedium flex justify-start">Status</span>
                        <span className="flex justify-start">{data?.Active ? 'Active' : "Inactive"}</span>
                    </div>
                </div>
                <div className="flex mt-6 justify-start text-gray-800 font-primaryMedium">Description</div>
                <div className="w-full text-wrap px-2 py-2 border rounded-md">
                    <div className="flex gap-x-2">
                        <span className="text-[20px] font-primaryMedium">{ data?.ProductDescriptionHeaderEn || notFoundTag }</span>
                    </div>
                    <div className="mt-1 flex justify-start">
                        <div className="break-words text-left">
                        { data?.ProductDescriptionDetailEn ? parse(`${data?.ProductDescriptionDetailEn}`) : notFoundTag }
                        </div>
                    </div>
                </div>
            </AccordionBody>
            </Accordion>
            <Accordion open={open === 2} className={`mb-2 rounded-lg border duration-100 ease-in-out border-blue-gray-100 px-4 ${
                open === 2 ? "border-gray-500-500" : ""
                }`}>
            <AccordionHeader
                onClick={() => handleOpen(2)}
                className={`border-b-0  font-primaryRegular transition-colors ${
                open === 2 ? "" : ""
                }`}
            >
                <div>
                    <span>Supplier Information</span>
                    <span className="block text-[12px] font-primaryRegular">Get detailed information about the product.</span>
                </div>
            </AccordionHeader>
            <AccordionBody className="pt-0">
                <div>
                    <img src={`${import.meta.env.VITE_REDIRECT_IMG}/images/${data?.SupplierImage}`} className="w-[100px]" />
                </div>
                <div className="grid grid-cols-2 mt-5 gap-2">
                    <div className="my-2">
                        <span className="flex justify-start text-gray-800 font-primaryMedium">Supplier Name</span>
                        <span className="flex justify-start">{data?.SupplierNameEn || notFoundTag}</span>
                    </div>
                </div>
                <div className="flex mt-6 justify-start text-gray-800 font-primaryMedium">Desciption:</div>
                <div className="w-full text-wrap px-2 py-2 bg-gray-100 rounded-md">
                    <div className="flex gap-x-2 break-words text-left">
                        <h1>{ data?.SupplierDesctipitationEN  || notFoundTag }</h1>
                    </div>
                </div>
            </AccordionBody>
            </Accordion>
        </div>
    );
};

ProductInformation.propTypes = {
    data: PropTypes.any,
};

export default ProductInformation;