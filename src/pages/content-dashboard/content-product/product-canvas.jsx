import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { FaEye } from "react-icons/fa";
import { AiOutlineFolder, AiOutlineFile } from "react-icons/ai";
import { IoArrowBack } from "react-icons/io5";
import { Image, Tag, notification, Empty, Drawer } from 'antd';
import DetailLoading from "../../../components/content-loading/detail-loading";
import { IconButton } from "@material-tailwind/react";
// import SupplierModal from "./supelier-modal";
import { getProductById } from "../../../slicers/productsaleSlicer";
import { getFolderById } from "../../../slicers/productfileSlicer";
import { FiEdit3 } from "react-icons/fi";
import ProductInformation from "./content-details/prodiuct-information";
import SingleLaoding from "../../../components/content-loading/single-loading";
import ProductFolderDetial from "./content-details/product-folder";
import ReactPlayer from 'react-player'
import PresentationDetail from "./content-details/presentation";

const ProductCanvas = ({ proId }) => {


  const dispatch = useDispatch();
  const [openRight, setOpenRight] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [folders, setFolders] = useState([]);
  const [media, setMedia] = useState();
  const [image, setImage] = useState([]);
  const [supData, setSupData] = useState();
  const [foldersData, setFoldersData] = useState([]);
  const [presentData, setPresentData] = useState([]);
  const Facthing = useRef(false);

  const notFoundTag = <Tag bordered={false} color="#bfbfbf"> Not Found </Tag>

  const openDrawerRight = async () => {
    try {
      setIsLoading(true);
      setOpenRight(true);

      if (Facthing.current) return;
      Facthing.current = true;
      const response = await dispatch(getProductById({ productId: proId }));
      const resfolders = await dispatch(getFolderById({ productId: proId }));

      if (response.payload.status === true) {
        Facthing.current = false;
        const data = response.payload.data;
        const folders = resfolders.payload.data;
        const present = response.payload.data.PresentFile;       

        if (folders !== undefined && folders.length > 0) {
          setFolders(
            folders.map((folder) => ({
              label: (
                <div className="flex items-center gap-5">
                  <AiOutlineFolder className="text-3xl text-red-600" />
                  <p>{folder.ProductFolderNameEn || notFoundTag}</p>
                </div>
              ),
              children: folder.ProductFiles.length > 0 ? folder.ProductFiles.map((file) => (
                <div key={file.ProductFileId} className="flex items-center gap-3 ml-10 p-2 border-gray-500">
                  <AiOutlineFile className="text-4xl text-red-600 bg-red-100 rounded-full p-2 border-2 border-red-50" />
                  <div className="flex-col text-left">
                    <a href={`${import.meta.env.VITE_REDIRECT_IMG}/files/${file.ProductFile}`} className="font-medium">
                      {file.ProductFileNameEn || notFoundTag}
                    </a>
                    <p className="text-gray-800">200 MB</p>
                  </div>
                </div>
              )) : (
                <Empty description="No files available" /> // Displaying empty state if no files are found
              ),
            }))
          );
        } else {
          setFolders([{
            label: <div>No folders available</div>,
            children: <Empty description="No folders available" />,
          }]);
        }
    
        setImage(data.ProductImageChildren);
        setSupData(data);
        setMedia(data);
        setFoldersData(folders);
        setPresentData(present);
        setIsLoading(false);
      } else {
        notification.error({
          message: 'Error',
          description: 'Unable to fetch product data.',
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      notification.error({
        message: 'Error',
        description: 'An unexpected error occurred while loading product details.',
      });
      setIsLoading(false);
    }
  };

  const onClose = () => {
    setOpenRight(false);
  };

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <IconButton onClick={openDrawerRight} variant="text" className="rounded-full text-xl text-gray-600">
            <FaEye />
        </IconButton>
      </div>
      <Drawer
        className='rounded-l-[20px]'
        width={850}
        footer={false}
        closable={false}
        onClose={onClose}
        open={openRight}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <div className="flex items-start justify-between">
          <div className="mb-6 items-center">
            <button
                color="blue-gray"
                onClick={onClose}
                className="flex px-2 py-1 gap-x-2 items-center rounded-md hover:bg-gray-100 duration-100 ease-in-out"
              >
              <IoArrowBack />
              <span>Back to Products</span>
            </button>
          </div>
          <div className="my-2 flex justify-end">
            {
              isLoading ?
              <div className="h-[45px] w-[45px] rounded-md bg-gray-300 animate-pulse animate-infinite animate-duration-1000 animate-ease-in-out"></div>
              :
              <IconButton onClick={() => window.location.href = `${import.meta.env.VITE_REDIRECT_URL}/product/update/${proId}` } className="rounded-full text-xl text-gray-600" variant="text">
                <FiEdit3 />
              </IconButton>
            }
          </div>
        </div>
        <div>
          {isLoading ? 
          <DetailLoading /> 
          : 
          <ProductInformation data={supData} />
          }
        </div>
        <div className="mt-[20px]">
            {
              isLoading ?
              <DetailLoading />
              :
              <PresentationDetail presents={presentData} />
            }
        </div>
        <div className="mt-5 flex justify-start">
          <span className="text-[18px] font-primaryMedium">Product Images</span>
        </div>
        <div className="flex justify-start">
          <p className="block text-gray-500">Display images of your product here.</p>
        </div>
        <div className="mt-2">
          {
          isLoading ? 
          <DetailLoading /> 
          : (
            <div className="grid grid-cols-3 justify-center gap-3">
              {image?.length > 0 ? image.map((img, index) => (
                <div key={index} className=" border border-gray-300 flex justify-center items-center rounded-lg min-h-[150px] p-4">
                  {img.productImageImage ? (
                    <Image
                      className="object-cover p-2 w-[150px] h-[250px]"
                      src={`${import.meta.env.VITE_REDIRECT_IMG}/images/${img.productImageImage}`}
                      alt={img.ProductImageNameEn || img.ProductImageNameTh}
                    />
                  ) : (
                    <Empty description="No image available" />
                  )}
                </div>
              )) : (
                <Empty description="No images available" />
              )}
            </div>
          )}
        </div>
        <div className="mt-5 flex justify-start">
          <span className="text-[18px] font-primaryMedium">Product Media</span>
        </div>
        <div className="flex justify-start">
          <p className="block text-gray-500">Display your product video here.</p>
        </div>
        {
          isLoading ? 
          <DetailLoading />
          :
          <div className="mt-2 flex justify-center">
            {
            media?.ProductUpVideo && (
              <video
                className="w-full rounded-lg"
                controls
                src={`${import.meta.env.VITE_REDIRECT_IMG}/videos/${media.ProductUpVideo}`}
              >
                Your browser does not support the video tag.
              </video>
            )}
            {
            media?.ProductVideo && (
              // <iframe
              //   src={media?.ProductVideo}
              //   className="w-full h-[545px] rounded-lg"
              //   frameBorder="0"
              //   allow="autoplay; fullscreen"
              //   allowFullScreen
              // ></iframe>
              <ReactPlayer className="w-full h-[545px] rounded-lg" url={media?.ProductVideo} />
            )}
            {
              !media?.ProductVideo && !media?.ProductUpVideo && <Empty description="No video available" /> // Displaying empty state if no video is available
            }
          </div>
        }
        <div className="my-4">
          <div className="flex items-start">
            { isLoading ? <SingleLaoding otherStyle="w-[100px] h-[20px]" /> : <span className="font-primaryMedium text-[16px]">{supData?.MeadiaTitle}</span> }
          </div>
          <div className="flex items-start mt-1">
            { isLoading ? <SingleLaoding otherStyle="w-[100px] h-[20px]" /> : <span className="text-gray-600">{supData?.MeadiaDescription}</span> }
          </div>
        </div>
        <div className="mt-5 flex justify-start">
          <span className="text-[18px] font-primaryMedium">Product Files</span>
        </div>
        <div className="flex justify-start">
          <p className="block text-gray-500">Display files of your product here.</p>
        </div>
        {/* <div>
          {isLoading ?
          <DetailLoading /> : (
            folders?.length > 0 ? (
              <Collapse items={folders} />
            ) : (
              <Empty description="No folders available" />
            )
          )}
        </div> */}
        <div className="mt-3">
          <div>
            {isLoading ?
              <DetailLoading /> : (
                folders?.length > 0 ? (
                  <ProductFolderDetial folderData={foldersData} />
                ) : (
                  <Empty description="No folders available" />
                )
              )}
            </div>
        </div>
      </Drawer>
    </>
  );
};

ProductCanvas.propTypes = {
  proId: PropTypes.any,
};
export default ProductCanvas;