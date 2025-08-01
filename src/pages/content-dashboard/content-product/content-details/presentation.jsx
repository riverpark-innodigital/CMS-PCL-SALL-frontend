import PropTypes from 'prop-types';
import { AiOutlineFile } from "react-icons/ai";

const PresentationDetail = ({ presents }) => {
    return(
        <>
            <div className='mb-[10px]'>
                <span className="text-[18px] font-primaryMedium">Presentation</span>
                <span className="text-[14px] block text-blue-gray-300">Display presentation(PDF) files here.</span>
            </div>
            <div className="w-full border border-gray-300 rounded-[12px] p-[24px]">
                {
                    presents?.map((data, key) => (
                        <div onClick={() => window.open(`${import.meta.env.VITE_REDIRECT_IMG}/files/${data?.FileName}`, "_blank", "noopener,noreferrer")} key={key} className="hover:cursor-pointer w-full border rounded py-[10px] px-[20px] my-2">
                            <div className="flex gap-x-4 items-center">
                                <div>
                                    <AiOutlineFile className="text-4xl text-red-600 bg-red-100 rounded-full p-2 border-2 border-red-50" />
                                </div>
                                <div>
                                    <span>{data?.FileOriginalName}</span>
                                    {/* <p className="text-gray-800 flex justify-start">200 MB</p> */}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    );
};

PresentationDetail.propTypes = {
    presents: PropTypes.array,
}

export default PresentationDetail;