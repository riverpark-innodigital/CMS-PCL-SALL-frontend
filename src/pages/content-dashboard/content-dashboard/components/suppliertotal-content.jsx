import Person from "../../../../assets/images/imgs/persons.png";
import { useSelector, useDispatch } from "react-redux"; 
import { fecthSupplierTotal } from "../../../../slicers/dashboardSlicer";
import { useEffect, useRef, useState } from "react";
import SingleLaoding from "../../../../components/content-loading/single-loading";

const SupplierTotalContent = () => {

    const dispatch = useDispatch();
    const isFatcing = useRef(false);
    const supplierTotal = useSelector((state) => state.dashboard.supplierTotal);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        const fetchSupTotal = async () => {
            try {
                if (isFatcing.current) return;
                isFatcing.current = true;
                await dispatch(fecthSupplierTotal());
                isFatcing.current = false;
            } catch (err) {
                return console.log(err);
            }
        }

        if (supplierTotal.length === 0) fetchSupTotal();

        if (supplierTotal.length !== 0) setIsLoading(false);
    }, [supplierTotal, dispatch]);

    return(
         <div className="w-full grid grid-cols-1 gap-[25px] bg-white rounded-md shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] p-[15px]">
            <div className="flex items-center gap-x-[8px]">
                <div className="drop-shadow h-[50px] w-[50px] flex justify-center items-center bg-white rounded-md">
                    <img src={Person} className="p-2 rounded-full bg-gray-100" alt="" />
                </div>
                <div className="text-[18px] font-primaryMedium">
                    <span>Total Suppliers</span>
                </div>
            </div>
            <div className="w-full grid grid-cols-1">
                <div className="font-primaryMedium text-[36px] mt-[-10px]">
                    { isLoading ? <SingleLaoding otherStyle="w-[100px] h-[30px] mb-[5px]" /> : <span>{ supplierTotal }</span> }
                </div>
                <div className="mt-[-10px]">
                    <span>Latest updated</span>
                </div>
            </div>
        </div>
    );
};

export default SupplierTotalContent;