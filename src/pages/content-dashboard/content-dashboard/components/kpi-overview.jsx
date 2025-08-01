import KPIIcon from '../../../../assets/images/svg/kpi.svg';
import Mockup from '../../../../assets/images/imgs/kpioverviewmock.png';

const KPIOverview = () => {
    return(
        <div className="w-full p-[24px] rounded-[8px] border-gray-200 bg-white border">
            <div className="flex gap-[8px] items-center">
                <div className='border border-gray-200 rounded-[10px] p-[8px]'>
                    <img src={KPIIcon} alt="" className='p-[5px] bg-gray-100 rounded-full' />
                </div>
                <span className='font-primaryMedium text-[16px] text-black'>KPI Overview</span>
            </div>
            <div className='mt-[24px] w-full flex justify-center'>
                <img src={Mockup} alt="" />
            </div>
        </div>
    );
};

export default KPIOverview;