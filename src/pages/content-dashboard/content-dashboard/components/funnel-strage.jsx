import trendup from '../../../../assets/images/svg/trend-up.svg';
import funnelmockup from '../../../../assets/images/imgs/funnelmockup.png';

const FunnelStage = () => {
    return(
        <div className="w-full p-[24px] rounded-[8px] border-gray-200 bg-white border">
            <div className="flex gap-[8px] items-center">
                <div className='border border-gray-200 rounded-[10px] p-[8px]'>
                    <img src={trendup} alt="" className='p-[5px] bg-gray-100 rounded-full' />
                </div>
                <span className='font-primaryMedium text-[16px] text-black'>Sales Funnel Stages</span>
            </div>
            <div className='mt-[24px] w-full flex justify-center items-center'>
                <img src={funnelmockup} alt="" />
            </div>
        </div>
    );
};

export default FunnelStage;