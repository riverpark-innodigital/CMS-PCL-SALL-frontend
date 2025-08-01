import { useEffect, useState, useRef } from "react";
import DotLoader from "../../../../components/content-loading/dot-loader";
import { Table, Button, Input, Space } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineArrowDown, AiOutlineArrowUp  } from "react-icons/ai";
import dateFormat from "dateformat";
import { gettingAllGroupPermissins } from "../../../../slicers/permissionSlicer";
import GroupPermissionDrawerComponent from "./detail/groupperrmission-drawer";
import SearchInputComponent from "../../../../components/content-input/search-input";

const GroupPermissionContent = () => {

    const dispatch = useDispatch();
    const allGroupPermission = useSelector((state) => state.permission.groupPermissions);
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [sortOrderCreate, setSortOrderCreate] = useState(null);
    const [sortOrderUpdated, setSortOrderUpdated] = useState(null);
    const isFacing = useRef(false);
    const [searchText, setSearchText] = useState('');
    const [searchAll, setSearchAll] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    useEffect(() => {
        if (isFacing.current) return;
        isFacing.current = true;
        dispatch(gettingAllGroupPermissins());
    }, [dispatch]);

    useEffect(() => {
        
    console.log(allGroupPermission);
        setIsLoading(true);
        if (allGroupPermission.length > 0) {
            
            setTableData(allGroupPermission.map((items, index) => ({
                key: index + 1,
                id: items?.id,
                SaleTeamNameEN: items?.saleteamName,
                teamLader: items?.teamLader,
                Active: items?.status ? "Active" : "Inactive",
                member: items?.member,
                BU: items?.com_bu,
                CreateDate: items?.createdDate,
                UpdateDate: items?.updatedDate,
                CreateBy: items?.createdBy,
                UpdateBy: items?.updatedBy,
            })));
            setIsLoading(false);
        }
  
        setTimeout(() => {
          setIsLoading(false);
        }, 5000);
    }, [dispatch, allGroupPermission]);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div
            style={{
            padding: 8,
            }}
            onKeyDown={(e) => e.stopPropagation()}
        >
            <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
                marginBottom: 8,
                display: 'block',
            }}
            />
            <Space>
            <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                width: 90,
                }}
            >
                Search
            </Button>
            <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{
                width: 90,
                }}
            >
                Reset
            </Button>
            <Button
                type="link"
                size="small"
                onClick={() => {
                close();
                }}
            >
                close
            </Button>
            </Space>
        </div>
        ),
        filterIcon: (filtered) => (
        <SearchOutlined
            style={{
            color: filtered ? '#1677ff' : undefined,
            }}
        />
        ),
        onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
        onOpenChange(open) {
            if (open) {
            setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        },
        render: (text) =>
        searchedColumn === dataIndex ? (
            <Highlighter
            highlightStyle={{
                backgroundColor: '#ffc069',
                padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
            />
        ) : (
            text
        ),
        });

      const columns = [
        {
          title: "#",
          dataIndex: "#",
          key: "key",
          render: (_, { key }) => <div>{key}</div>,
        },
        {
          title: "Sale team name",
          dataIndex: "Saleteam",
          key: "Saleteam",
          ...getColumnSearchProps('Saleteam'),
          render: (_, { SaleTeamNameEN }) => (
            <div>
              {SaleTeamNameEN}
            </div>
          ),
        },
        {
          title: "Team Lader",
          dataIndex: "teamLader",
          key: "teamLader",
          ...getColumnSearchProps('teamLader'),
          render: (_, { teamLader }) => (
            <div>
              {teamLader}
            </div>
          ),
        },
        {
          title: "Company & BU",
          dataIndex: "BU",
          key: "BU",
          ...getColumnSearchProps('BU'),
          render: (_, { BU }) => (
            <div>
              {BU}
            </div>
          ),
        },
        {
          title: "Member",
          dataIndex: "Member",
          key: "Member",
          sorter: {
            compare: (a, b) => a.chinese - b.chinese,
            multiple: 3,
          },
          render: (_, { member }) => (
            <div>
              {member}
            </div>
          ),
        },
        {
        title: "Status",
        key: "status",
        align: "center",
        filters: [
          {
            text: 'Active',
            value: 'Active',
          },
          {
            text: 'Inactive',
            value: 'Inactive',
          },
        ],
        onFilter: (value, record) => {
          const tagValue = record.tags ? record.tags.toString() : "";
          return tagValue.includes(value);
        },
        sorter: (a, b) => (a.tags || "").localeCompare(b.tags || ""), // ✅ Handles undefined values
        render: (_, { Active }) => (
                <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    width: "fit-content",
                    margin: "0 auto",
                }}
                className={
                    Active === "Active"
                    ? "bg-green-50 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300"
                    : "bg-red-50 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300"
                }
                >
                <svg
                    width="7"
                    height="7"
                    viewBox="0 0 12 12"
                    fill={Active === "Active" ? "#52c41a" : "#ff4d4f"}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="6" cy="6" r="6" />
                </svg>
                <span>{Active}</span>
                </div>
            ),
        },
            {
              title: (
                <div className="flex justify-center items-center">
                  Created Date
                  {sortOrderCreate === "ascend" && <AiOutlineArrowDown className="ml-2" />}
                  {sortOrderCreate === "descend" && <AiOutlineArrowUp className="ml-2" />}
                </div>
              ),
              dataIndex: "createdDate",
              key: "createdDate",
              align: "center",
              sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
              sortDirections: ["ascend", "descend"],
              render: (_,{CreateDate}) => {
                  if (!CreateDate) return <span className="text-gray-500">No Date</span>;
                  const [createdDate] = new Date(CreateDate).toISOString().split("T");
                  return (
                      <div className="text-center">
                          {dateFormat(createdDate, "mediumDate")}
                      </div>
                  );
              },
            },
            {
              title: (
                <div className="flex justify-center items-center">
                  Last Updated
                  {sortOrderUpdated === "ascend" && <AiOutlineArrowDown className="ml-2" />}
                  {sortOrderUpdated === "descend" && <AiOutlineArrowUp className="ml-2" />}
                </div>
              ),
              dataIndex: "updatedDate",
              key: "updatedDate",
              align: "center",
              sorter: (a, b) => new Date(a.updatedDate) - new Date(b.updatedDate),
              sortDirections: ["ascend", "descend"],
              render: (_,{UpdateDate}) => {
                  if (!UpdateDate) return <span className="text-gray-500">No Date</span>;
                  const [datefformat] = new Date(UpdateDate).toISOString().split("T");
                  return (
                      <div className="text-center">
                          {dateFormat(datefformat, "mediumDate")}
                      </div>
                  );
              },
            },
             {
              title: "Created By",
              dataIndex: "CreateBy",
              key: "CreateBy",
              ...getColumnSearchProps('CreateBy'),
              render: (_, { CreateBy }) => (
                <div>
                  {CreateBy}
                </div>
              ),
            },
            {
                title: "",
                dataIndex: "Active",
                key: "Active",
                render: (_, { id }) => (
                  <div>
                    <GroupPermissionDrawerComponent GroupPermissionID={id} />
                  </div>
                ),
              },
      ];

    const handleTableChange = (_, __, sorter) => {
    sorter.columnKey === 'createdDate' ? setSortOrderCreate(sorter.order) : setSortOrderUpdated(sorter.order);
    };

    const filteredData = tableData.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchAll.toLowerCase())
      )
    );

    return(
      <div>
        <div className="w-full flex justify-center">
          <div className="mb-[100px] w-[530px]">
            <SearchInputComponent value={searchAll} onChange={setSearchAll} placeholder="Search" />
          </div>
        </div>
         <div className="bg-white drop-shadow-md rounded-[10px]">
            <div className="px-[24px] py-[20px] text-[18px] font-primaryMedium">
                <span>All Group & Sale team</span>
            </div>
            <div className="w-full">
            { isLoading ? 
                <div className='flex bg-white justify-center items-center h-[250px]'>
                    <DotLoader />
                </div>
                :
                <Table
                    columns={columns}
                    onChange={handleTableChange}
                    dataSource={tableData && filteredData}
                    pagination={{ pageSize: 10 }}
                />
                }
            </div>
        </div>
      </div>
    );
};

export default GroupPermissionContent;