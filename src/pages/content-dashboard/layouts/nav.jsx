// src/components/Navbar.js

// Main Library
import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Sup Library
import Cookies from 'js-cookie';

// Axios
import { fecthCurrentAgency } from '../../../slicers/authenticateSlicer';
import PropTypes from "prop-types";

import AvatarComponent from '../../../components/content-avatar/Avatar-full-redrius';
import { useAuth } from '../../../hooks/AuthProvider';
import { useLocation, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { NavLink } from 'react-router-dom';

function Navbar({ title }) {
  // react-redux
  const currentAgency = useSelector((state) => state.auth.currentAgency);
  const dispatch = useDispatch();
  const auth = useAuth();

  // useState
  const [currentAgent, setCurrentAgent] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const location = useLocation();
  const { id } = useParams();

  // For handling fetch state
  const isFatcing = useRef(false);

  useEffect(() => {
    const token = Cookies.get('authToken');
    const fecthcurrenagent = async () => {
      try {
        if (isFatcing.current) return;
        isFatcing.current = true;
        const response = await dispatch(fecthCurrentAgency());
        if (response.payload.status === false)  auth.SignoutAction();
        isFatcing.current = false;
      } catch (error) {
        console.error(error);
      }
    };

    if (!currentAgency && token) fecthcurrenagent();

    setCurrentAgent(currentAgency?.data);

    if (!avatar && currentAgent) {
      let usersplit = currentAgent.fullname.split(' ');

      if (usersplit.length > 1) {
        const first = usersplit[0][0].toUpperCase();
        const last = usersplit[1][0].toUpperCase();
        setAvatar(`${first}${last}`);
      } else {
        const first = usersplit[0][0].toUpperCase();
        setAvatar(first);
      }
    }
  }, [dispatch, currentAgency, currentAgent, avatar, auth]);
  

  return (
    <>
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-white p-4 z-50 shadow-md-b">
        <div className="flex items-center gap-5">
          {/* { !isDrawerOpen && <img src={Logo} alt="Logo" className="h-8" /> } */} 
          <div className='flex items-center gap-[10px]'>
            {
             location.pathname === `/product/update/${id}` && <>
                <NavLink to='/product'>
                    <IoIosArrowBack className='text-[32px]' />
                </NavLink>
              </>
            }
            {
              location.pathname === "/product/create" && <>
                <NavLink to='/product'>
                    <IoIosArrowBack className='text-[32px]' />
                </NavLink>
              </>
            }
            {
              location.pathname === '/hierarchy-management/user/create-single' && <>
                <NavLink to='/hierarchy-management/user'>
                    <IoIosArrowBack className='text-[32px]' />
                </NavLink>
              </>
            }
            {
              location.pathname === `/hierarchy-management/user/update/${id}` && <>
                <NavLink to='/hierarchy-management/user'>
                    <IoIosArrowBack className='text-[32px]' />
                </NavLink>
              </>
            }
            {
              location.pathname === '/hierarchy-management/user/create-multiple' && <>
                <NavLink to='/hierarchy-management/user'>
                    <IoIosArrowBack className='text-[32px]' />
                </NavLink>
              </>
            }
            {
             location.pathname === `/product/update/${id}` && <>
                <span className="text-xl font-primaryBold">Edit Product</span>
              </>
            }
            {
              location.pathname === "/product/create" && <>
                <span className="text-xl font-primaryBold">Create New Product</span>
              </>
            }
            {
              location.pathname === '/hierarchy-management/user/create-single' && <>
                <span className="text-xl font-primaryBold">Add a new User</span>
              </>
            }
            {
              location.pathname === `/hierarchy-management/user/update/${id}` && <>
                <span className="text-xl font-primaryBold">Edit the user</span>
              </>
            }
            {
              location.pathname === '/hierarchy-management/user/create-multiple' && <>
                <span className="text-xl font-primaryBold">Add Multiple Users</span>
              </>
            }
          </div>
          <div className="flex items-center">
            <span className="text-xl font-primaryBold">{title}</span>
          </div> 
        </div>
        <div className="flex items-center space-x-2">
          <AvatarComponent AvatarName={avatar} Cusname={currentAgent} />
        </div>
      </nav>

      {/* Sidebar */}
     
    </>
  );
};

Navbar.propTypes = {
  title: PropTypes.string,
  cbSidebar: PropTypes.any,
};

export default Navbar;
