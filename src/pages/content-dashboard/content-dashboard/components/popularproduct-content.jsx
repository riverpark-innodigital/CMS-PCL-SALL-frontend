import { useSelector, useDispatch } from "react-redux";
import { MostviewProduct } from "../../../../slicers/dashboardSlicer";
import { useEffect, useState, useRef } from "react";
import SingleLaoding from "../../../../components/content-loading/single-loading";
import NotAvailableErorr from "../../../../components/content-errors/404-notavailable";

const PopularProductContent = () => {

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
        <div className="w-full bg-white h-fit rounded-md shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
            <div className="pt-[24px] pb-[12px] border-b">
                <span className="font-primaryMedium px-[24px] text-[18px]">Popular Product</span>
            </div>
            {
                isLoading ?
                <div className="px-[24px] pt-[12px] pb-[24px]">
                    <div className="flex w-full gap-x-[16px]">
                        <SingleLaoding otherStyle="w-[111px] h-[111px]" />
                        <div className="w-full flex justify-between gap-x-[16px]">
                            <div className="flex gap-x-3">
                                <SingleLaoding otherStyle="w-[80px] h-[60px]" />
                                <SingleLaoding otherStyle="w-[250px] h-[20px]" />
                            </div>
                            <div className="flex items-end">
                                <div>
                                    <SingleLaoding otherStyle="h-[40px] w-[100px]" /> 
                                    <SingleLaoding otherStyle="h-[30px] w-[100px mt-2" /> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                productMostView.length === 0 || !productMostView ?
                <div className="w-full flex justify-center items-center py-[20px]">
                    <NotAvailableErorr lable="Popular Product Not Found." />
                </div>
                :
                <div className="px-[24px] pt-[12px] pb-[24px]">
                    <div className="flex w-full gap-x-[16px]">
                        <img src={`${import.meta.env.VITE_REDIRECT_IMG}/images/${productMostView[0]?.ProductImage}`} className="w-[150px] object-cover" alt="" />
                        <div className="w-full flex justify-between gap-x-[16px]">
                            <div className="flex gap-x-3">
                                <img src={`${import.meta.env.VITE_REDIRECT_IMG}/images/${productMostView[0]?.SupplierImage}`} className="w-[120px] h-[40px] object-fill" alt="" />
                                <span className="font-primaryMedium text-[16px]">{ productMostView[0]?.ProductNameEn }</span>
                            </div>
                            <div className="flex items-end">
                                <div>
                                    <span className="font-primaryMedium text-[36px]">{ productMostView[0]?.views } Views</span>
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

export default PopularProductContent;