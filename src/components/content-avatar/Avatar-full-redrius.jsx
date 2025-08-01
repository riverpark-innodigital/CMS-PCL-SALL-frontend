import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/AuthProvider';
import SingleLaoding from '../content-loading/single-loading';
import RedirusFullLoading from '../content-loading/redirusfull-loading';

import { TbLogout2 } from "react-icons/tb";
import { FaAngleDown } from "react-icons/fa6";

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";


const AvatarComponent = ({ AvatarName, Cusname }) => {

    const auth = useAuth();
    
    return(
      <div>
        {
          Cusname?.fullname === undefined ?
          <div className='flex items-center gap-x-2'>
            <RedirusFullLoading />
            <SingleLaoding otherStyle="w-[100px] h-[20px]" />
          </div>
          :
          <Menu
            animate={{
              mount: { y: 0 },
              unmount: { y: 25 },
            }}
          >
            <MenuHandler>
              <button className='flex border-none items-center gap-x-4'>
                  
                    { 
                      Cusname?.picture?.url ? 
                      <div className={`${Cusname?.picture?.url ? '' : 'border-2'} w-[45px] h-[45px] rounded-full border-red-500 bg-primary flex items-center justify-center relative`}>
                        <img src={`${Cusname?.picture?.url}`} alt="" className='w-full h-full rounded-full object-cover' /> 
                        <div className='w-[15px] h-[15px] rounded-full bg-yellow-600 absolute bottom-0 right-0 border border-white'></div>
                      </div>
                      :
                      <div className={`${Cusname?.picture?.url ? '' : 'border-2'} w-[45px] h-[45px] rounded-full border-red-500 bg-primary flex items-center justify-center relative`}>
                        <span className='font-primaryMedium text-[14px] flex items-center justify-center text-secondery'>{AvatarName}</span>
                        <div className='w-[15px] h-[15px] rounded-full bg-yellow-600 absolute bottom-0 right-0 border border-white'></div>
                      </div>
                    }
                 
                  <div className='flex-col text-left'>
                      <div className='font-primaryBold'>{`${Cusname?.fullname}`}</div>
                      <div>{`${Cusname?.role}`}</div>
                  </div>
                  <FaAngleDown className='text-black' />
              </button>
            </MenuHandler>
            <MenuList>
              <MenuItem onClick={() => auth.SignoutAction()}>
                <div className='flex items-center gap-x-2'>
                  <TbLogout2 />
                  <span>Sign Out</span>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
        }
      </div>
    );
};

AvatarComponent.propTypes = {
    AvatarName: PropTypes.string,
    Cusname: PropTypes.any,
};

export default AvatarComponent;