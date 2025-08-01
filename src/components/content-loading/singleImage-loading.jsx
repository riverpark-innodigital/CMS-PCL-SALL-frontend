import PhotoGif from '../../assets/images/gif/photo.gif';

const SingleImageLoader = () => {
    return(
        <div className="w-full bg-gray-200 flex justify-center py-8 items-center rounded-lg animate-pulse animate-infinite animate-duration-1000 animate-ease-in-out">
            <div>
                <div className='w-full flex items-center justify-center'>
                    <img src={PhotoGif} className='w-[100px]' alt="" />
                </div>
                <span className='flex items-center justify-center'>just a moment please, we loading images file.</span>
            </div>
        </div>
    );
};

export default SingleImageLoader;