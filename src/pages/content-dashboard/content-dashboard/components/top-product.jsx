import Cube from '../../../../assets/images/svg/cube.svg';
import { useSelector, useDispatch } from "react-redux";
import { MostviewProduct } from "../../../../slicers/dashboardSlicer";
import { useEffect, useState, useRef } from "react";
import SingleLaoding from "../../../../components/content-loading/single-loading";
import NotAvailableErorr from "../../../../components/content-errors/404-notavailable";

const TopProduct = () => {
    
     const dispatch = useDispatch();
    const isFatcing = useRef(false);
    const productMostView = useSelector((state) => state.dashboard.productMostView);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        const fetchMostView = async () => {
            try {
                if (isFatcing.current) return;
                isFatcing.current = true;
                await dispatch(MostviewProduct());
                isFatcing.current = false;
            } catch (err) {
                return console.log(err);
            }
        }

        if (productMostView.length === 0) fetchMostView();
        
        if (productMostView.length !== 0) setIsLoading(false);

        setTimeout(() => {
            setIsLoading(false);
        }, 5000);
    }, [dispatch, productMostView]);

    return(
        <div className="w-full p-[24px] rounded-[8px] border-gray-200 bg-white border">
            <div className="flex gap-[8px] items-center">
                <div className='border border-gray-200 rounded-[10px] p-[8px]'>
                    <img src={Cube} alt="" className='p-[5px] bg-gray-100 rounded-full' />
                </div>
                <span className='font-primaryMedium text-[16px] text-black'>Top Product</span>
            </div>
            {
                isLoading ?
                <div className="flex flex-col w-full pt-3 pb-6">
                    <div className='flex gap-3 justify-between '>
                        <SingleLaoding otherStyle="w-[120px] h-[90px]" />
                        <SingleLaoding otherStyle="w-[250px] h-[30px]" />
                    </div>
                    <div className='flex flex-col items-end'>
                        <SingleLaoding otherStyle="h-[40px] w-[100px]" />
                        <SingleLaoding otherStyle="h-[30px] w-[100px] mt-2" />
                    </div>
                </div>
                :
                productMostView.length === 0 || !productMostView ?
                <div className="w-full flex justify-center items-center py-[20px]">
                    <NotAvailableErorr lable="Popular Product Not Found." />
                </div>
                :
                <div className="px-[24px] pt-[12px] pb-[24px]">
                    <div className="flex w-full">
                        <img src={`${import.meta.env.VITE_REDIRECT_IMG}/images/${productMostView[0]?.ProductImage}`} className="w-[100px] h-[100px] object-contain" alt="" />
                        <div className="w-full flex justify-between gap-x-[16px]">
                            <div className="w-full grid grid-cols-1">
                                <div className='flex w-full justify-end'>
                                    <span className="font-primaryMedium text-black text-[16px]">{ productMostView[0]?.ProductNameEn }</span>
                                </div>
                                <div className='flex w-full justify-end'>
                                    <span className="font-primaryMedium text-black text-[36px]">{ productMostView[0]?.views }</span>
                                </div>
                                <div className='flex w-full justify-end'>
                                    <span className="block">Latest updated</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default TopProduct;