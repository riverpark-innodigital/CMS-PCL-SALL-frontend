import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { AiOutlineFile } from "react-icons/ai";
import { Empty } from 'antd';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const ProductFolderDetial = ({ folderData }) => {

    const [isActive, setIsActive] = useState(0);
    const [filterData, setFilltersData] = useState([]);
    const [isEmtpy, setIsEmtpy] = useState(false);

    useEffect(() => {
        folderData !== undefined ? setFilltersData([folderData[0]]) : setIsEmtpy(true); 
    }, [folderData]);

    const handlerFilltersData = (id, index) => {
        setIsActive(index);
        setFilltersData(folderData?.filter((item) => item.ProductFolderId === id));
    }

    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
        const scrollAmount = 200;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
        }
    };

    return(
        <>
        {
            isEmtpy ?
            <Empty description="No folders available" />
            :
            <div className="bg-white border rounded drop-shadow-sm">
                <div className="bg-white px-2 py-2 border-b flex items-center gap-x-2 justify-between">
                    <button className="h-full px-2 py-[16px] border rounded" onClick={() => scroll("left")}>
                        <IoIosArrowBack />
                    </button>
                    <div className="flex w-full overflow-x-auto gap-3 no-scrollbar items-center text-nowrap" ref={scrollRef}>
                        {
                            folderData?.map((item, key) => (
                                <div
                                    key={key}
                                    className={`cursor-pointer flex items-center px-[50px] py-[16px] rounded-md transition duration-200 ${isActive === key? 'bg-primary text-white' : ''}`}
                                    onClick={() => handlerFilltersData(item.ProductFolderId, key)}
                                >
                                    <span>{item.ProductFolderNameEn}</span>
                                </div>
                            ))
                        }
                    </div>
                    <button className="h-full px-2 py-[16px] rounded border" onClick={() => scroll("right")}>
                        <IoIosArrowForward />
                    </button>
                </div>
                <div className="p-[20px] grid grid-cols-1 gap-2 overflow-y-auto no-scrollbar max-h-[650px]">
                    {
                        filterData[0]?.ProductFiles.length !== 0 ?
                        filterData[0]?.ProductFiles?.map((item, key) => (
                            <a onClick={() => window.open(`${import.meta.env.VITE_REDIRECT_IMG}/files/${item?.ProductFile}`, "_blank", "noopener,noreferrer")} key={key} className="hover:cursor-pointer border rounded py-[10px] px-[20px]">
                                <div className="flex gap-x-4 items-center">
                                    <div>
                                        <AiOutlineFile className="text-4xl text-red-600 bg-red-100 rounded-full p-2 border-2 border-red-50" />
                                    </div>
                                    <div>
                                        <span>{item?.ProductFileNameEn}</span>
                                        {/* <p className="text-gray-800 flex justify-start">200 MB</p> */}
                                    </div>
                                </div>
                            </a>
                        ))
                        :
                        <div className="my-5">
                            <Empty description="No files available" />
                        </div>
                    }
                </div>
            </div>
        }
        </>
    );
};

ProductFolderDetial.propTypes = {
    folderData: PropTypes.any,
};

export default ProductFolderDetial;