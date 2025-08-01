import { useSelector, useDispatch } from "react-redux";
import { fetchTopSupplier } from "../../../../slicers/dashboardSlicer";
import { useEffect, useRef, useState } from "react";
import ListLoading from "../../../../components/content-loading/list-loading";
import NotAvailableErorr from "../../../../components/content-errors/404-notavailable";

const MostSuplierContent = () => {

    const dispatch = useDispatch();
    const isFatcing = useRef(false);
    const topSupplier = useSelector((state) => state.dashboard.topSupplier);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        const fetchTopSup = async () => {
            try {
                if (isFatcing.current) return;
                isFatcing.current = true;
                await dispatch(fetchTopSupplier());
                isFatcing.current = false;
            } catch (err) {
                return console.log(err);
            }
        }

        if (topSupplier.length === 0) fetchTopSup();

        if (topSupplier.length !== 0) setIsLoading(false);

        console.log(topSupplier.length);
        setTimeout(() => {
            setIsLoading(false);
        }, 5000);
        
    }, [dispatch, topSupplier]);

    return (
        <div className="w-full grid grid-cols-1 bg-white h-full rounded-md shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]">
            <div className="py-[20px] px-[24px]">
                <span className="text-[18px] font-primaryMedium">Top Suppliers</span>
            </div>
            {
                isLoading ?
                <ListLoading />
                :
                topSupplier.length === 0 || !topSupplier ?
                <div className="w-full flex justify-center items-center py-[90px] px-[25px]">
                    <NotAvailableErorr lable="Most Supplier Not Found." />
                </div>
                :
                topSupplier.map((items, key) => (
                    <div key={key} className="border-t mb-0 border-b w-full flex justify-between">
                        <div className="p-[16px] flex justify-center items-center">
                            <span>{key + 1}</span>
                        </div>
                        <div className="w-full items-center flex justify-between p-[16px]">
                            <div className="font-primaryMedium text-[18px]">
                                <img src={`${import.meta.env.VITE_REDIRECT_IMG}/images/${items?.SupplierImage}`} className="w-[80px]" alt="" />
                            </div>
                            <div className="flex">
                                <div>
                                    <div className="flex justify-end">
                                        <span>User access:</span>
                                    </div>
                                    <div className="flex justify-end">
                                        <span>Products:</span>
                                    </div>
                                </div>
                                <div className="w-[40px]">
                                    <div className="flex justify-end">
                                        <span>{items.userAccess}</span>
                                    </div>
                                    <div className="flex justify-end">
                                        <span>{items.products}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default MostSuplierContent;