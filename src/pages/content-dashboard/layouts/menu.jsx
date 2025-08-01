import { useState, useEffect } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import { RxChevronUp, RxChevronDown  } from "react-icons/rx";
import { PiCube } from "react-icons/pi";
import { FiUser } from "react-icons/fi";
import { MdOutlineInsertChartOutlined } from "react-icons/md";

const MenuOption = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <MdOutlineInsertChartOutlined />,
  },
  {
    label: 'Products Management',
    icon: <PiCube />,
    submenu: [
      { label: 'Product', path: '/product' },
      { label: 'Product Group', path: '/group' },
    ],
  },
  {
    label: 'Hierarchy Management',
    icon: <FiUser />,
    submenu: [
      { label: 'User Management', path: '/hierarchy-management/user' },
      { label: 'Group & Sale team', path: '/hierarchy-management/saleteam' },
      { label: 'Company', path: '/company' },
      { label: 'Business Unit', path: '/hierarchy-management/bu' },
      { label: 'Supplier', path: '/supplier' },
    ],
  },
];

const MenuComponent = ({ isOpenDrawer }) => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState({});

  const toggleDropdown = (label) => {
    setDropdownOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  useEffect(() => {
    // Auto-open the dropdown if current path matches submenu item
    MenuOption.forEach((menu) => {
      if (menu.submenu) {
        const isActive = menu.submenu.some(sub => location.pathname.startsWith(sub.path));
        if (isActive) {
          setDropdownOpen((prev) => ({ ...prev, [menu.label]: true }));
        }
      }
    });
  }, [location.pathname]);

  const isMenuActive = (menu) => {
    if (menu.path && location.pathname === menu.path) return true;
    if (menu.submenu) {
      return menu.submenu.some(sub => location.pathname.startsWith(sub.path));
    }
    return false;
  };

  return (
    <div className="space-y-2">
      {MenuOption.map((item, index) => {
        const isActive = isMenuActive(item);
        return (
          <div key={index}>
            {/* Main Menu Item */}
            <div
              className={`flex items-center justify-between w-full px-3 py-2 rounded cursor-pointer font-semibold transition
              ${isActive ? 'text-red-800 bg-red-50' : 'text-gray-800 hover:bg-red-100'}`}
              onClick={() => item.submenu && toggleDropdown(item.label)}
            >
              <NavLink
                to={item.path || '#'}
                className="flex items-center gap-3 w-full"
              >
                <div className={`text-2xl ${isActive ? 'text-red-800' : ''}`}>{item.icon}</div>
                <span
                  className={`
                    transition-all duration-300 
                    ${isOpenDrawer ? 'inline-block' : 'hidden group-hover:inline-block'}
                  `}
                >
                  {item.label}
                </span>
              </NavLink>
              {item.submenu && (
                <span className={`text-xl ${isOpenDrawer ? '' : 'hidden'} group-hover:block`}>
                  {dropdownOpen[item.label] ? <RxChevronDown /> : <RxChevronUp />}
                </span>
              )}
            </div>

            {/* Submenu Items */}
            {item.submenu && dropdownOpen[item.label] && (
              <ul className={`space-y-1 ml-2 ${isOpenDrawer ? '' : 'group-hover:block hidden'}`}>
                {item.submenu.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <NavLink
                      to={subItem.path}
                      className={({ isActive }) =>
                        `pl-12 block px-3 py-2 rounded hover:bg-red-100 transition font-bold ${
                          isActive ? 'bg-red-100 text-red-800' : ''
                        }`
                      }
                    >
                      {subItem.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MenuComponent;
