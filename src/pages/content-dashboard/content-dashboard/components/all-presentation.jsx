import stand from '../../../../assets/images/svg/stand.svg';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GettingAllPresent } from '../../../../slicers/dashboardSlicer';

// Register chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

const AllPresentation = () => {
    
    const allPresents = useSelector((state) => state.dashboard.allproductpresent);
    const dispatch = useDispatch();
    const [total, setTotal] = useState(0);
    const [data, setData] = useState({
        labels: [],
        datasets: [
        {
            data: [],
            backgroundColor: [],
        },
        ],
    });
    const isFatcing = useRef(false);

    const options = {
        responsive: true, 
        cutout: '60%',
        plugins: {
        legend: false
        },
    };

    useEffect(() => {
        const fecthData = async () => {
            if (isFatcing.current) return;
            isFatcing.current = true;
            await dispatch(GettingAllPresent());
            isFatcing.current = false;
        }

        fecthData();

        if (allPresents.length !== 0) {
            
            const mapSupname = allPresents.map((data) => data.SupplierNameEn);
            const mapQty = allPresents.map((data) => data.PresentQty);
            const mapColorCode = allPresents.map((data) => data.ColorCode);
            const totalCal = allPresents.reduce((total, data) => total + Number(data.PresentQty), 0);
            setTotal(totalCal);
            setData({
                labels: mapSupname,
                datasets: [
                {
                    data: mapQty,
                    backgroundColor: mapColorCode,
                },
                ],
            })
        }
    }, [dispatch, allPresents]);

    return(
        <div className="w-full p-[24px] rounded-[8px] border-gray-200 bg-white border">
            <div className="flex gap-[8px] items-center">
                <div className='border border-gray-200 rounded-[10px] p-[8px]'>
                    <img src={stand} alt="" className='p-[5px] bg-gray-100 rounded-full' />
                </div>
                <span className='font-primaryMedium text-[16px] text-black'>All Presentations</span>
            </div>
            <div className='flex justify-center w-full'>
                <div className='w-[250px] h-[250px] relative'>
                    <Doughnut data={data} options={options} />
                    <div className='flex justify-center w-full mt-[-150px]'>
                        <div>
                            <span className='text-center text-[18px] font-primaryMedium text-black'>Total</span>
                            <span className='block text-center text-[18px] font-primaryBold text-black'>{total}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-[10px]'></div>
            {
                allPresents.map((data, key) => (
                    <div key={key} className='w-full flex items-center justify-between border-b'>
                        <div className='flex items-center py-[5px] gap-[16px]'>
                            <div className='rounded-[4px] w-[20px] h-[20px]' style={{ background: data?.ColorCode }}></div>
                            <img src={`${import.meta.env.VITE_REDIRECT_IMG}/images/${data?.SupplierImage}`} className="w-[30px] h-[30px] object-contain border border-gray-200 rounded-[4px] p-[2px]" alt="" />
                            <span className='text-[12px] text-black'>{data?.SupplierNameEn}</span>
                        </div>
                        <span>{data.PresentQty}</span>
                    </div>
                ))
            }
           
        </div>
    );
};

export default AllPresentation;