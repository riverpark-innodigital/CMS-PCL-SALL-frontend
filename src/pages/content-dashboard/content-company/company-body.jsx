import NormalCard from "../../../components/content-card/normal-card";
import { useState, useRef, useEffect } from "react";
import { Table, Button,Input,Space } from 'antd';
import DotLoader from "../../../components/content-loading/dot-loader";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import NotFound from "../../../assets/images/imgs/error.png";
import { GettingAllCompany } from "../../../slicers/companySlicer";
import { useDispatch, useSelector } from "react-redux";
import CompanyDrawer from "./company-drawer";
// import CompanyModal from "./company-modal";
import dateFormat from "dateformat";
import { AiOutlineArrowDown, AiOutlineArrowUp  } from "react-icons/ai";
import SearchInputComponent from "../../../components/content-input/search-input";

const CompanyBody = () => {

    const dispatch = useDispatch();
    const companys = useSelector((state) => state.company.companys);
    const [isLoading, setIsLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchAll, setSearchAll] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [sortOrderCreate, setSortOrderCreate] = useState(null);
    const [sortOrderUpdated, setSortOrderUpdated] = useState(null);
    const searchInput = useRef(null);
    const isFatcing = useRef(false);
    const [data, setData] = useState([]);

    const handleTableChange = (_, __, sorter) => {
      sorter.columnKey === 'CreateDate' ? setSortOrderCreate(sorter.order) : setSortOrderUpdated(sorter.order);
    };  

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
                  confirm({
                    closeDropdown: false,
                  });
                  setSearchText(selectedKeys[0]);
                  setSearchedColumn(dataIndex);
                }}
              >
                Filter
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
          title: '#',
          dataIndex: 'key',
          key: 'key',
          width: '1%',
          ...getColumnSearchProps('key'),
          render: (_, { index }) => index
        },
        {
          title: 'Company Name',
          dataIndex: 'NameEN',
          key: 'NameEN',
          ...getColumnSearchProps('NameEN'),
          render: (_, { NameEN, image }) => 
            <div className="flex gap-x-3 items-center">
            {
              !image ?
                <div>
                  <div className='flex justify-center'>
                    <img className='w-[30px]' src={NotFound} />
                  </div>
                  <div className='flex justify-center text-[12px]'>Not Available</div>
                </div>
                :
                <div className='flex justify-center'>
                  <img className='w-[45px]' src={`${import.meta.env.VITE_REDIRECT_IMG}/images/${image}`} alt="" />
                </div>
              }
              {/* <GetNewObject data={CreateDate} /> */}
              <div>
                <span className="font-primaryMedium">{NameEN}</span>
              </div>
            </div>,
        },
        {
          title: 'Bussiness Unit',
          key: 'BUNameEN',
          dataIndex: 'BUNameEN',
          ...getColumnSearchProps('BUNameEN'),
          render: (_, { BUNameEN }) => (
            <div className="max-w-[100px] text-nowrap text-ellipsis">
              {BUNameEN}
            </div>
          ),
        },
        {
          title: 'Status',
          key: 'tags',
          dataIndex: 'tags',
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
          render: (_, { tags }) => (
            <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "fit-content",
              margin: "0 auto",
            }}
            className={
              tags === "Active"
                ? "bg-green-50 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300"
                : "bg-red-50 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300"
            }
          >
            <svg
              width="7"
              height="7"
              viewBox="0 0 12 12"
              fill={tags === "Active" ? "#52c41a" : "#ff4d4f"}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="6" cy="6" r="6" />
            </svg>
            <span>{tags}</span>
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
            dataIndex: "CreateDate",
            key: "CreateDate",
            align: "center",
            sorter: (a, b) => new Date(a.CreateDate) - new Date(b.CreateDate),
            sortDirections: ["ascend", "descend"],
            render: (_,{CreateDate}) => {
              console.log(CreateDate);
                 if (!CreateDate) return <span className="text-gray-500">No Date</span>;
                return (
                    <div className="text-center">
                        {dateFormat(CreateDate, "mediumDate")}
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
            dataIndex: "UpdateDate",
            key: "UpdateDate",
            align: "center",
            sorter: (a, b) => new Date(a.UpdateDate) - new Date(b.UpdateDate),
            sortDirections: ["ascend", "descend"],
            render: (_,{UpdateDate}) => {
                if (!UpdateDate) return <span className="text-gray-500">No Date</span>;
                return (
                    <div className="text-center">
                        {dateFormat(UpdateDate, "mediumDate")}
                    </div>
                );
            },
        },
        {
          title: 'Created By.',
          dataIndex: 'CreateBy',
          key: 'CreateBy',
          ...getColumnSearchProps('CreateBy'),
          render: (_, {CreateBy}) => <a>{CreateBy}</a>,
        },
        {
          title: 'Action',
          key: 'action',
          render: (_, record) => (
            <div className='w-full flex gap-x-3'>
              <CompanyDrawer comId={record.key} />
              {/* <CompanyModal comId={record.key} conditions='delete' /> */}
            </div>
          ),
        },
    ];

    useEffect(() => {
      setIsLoading(true);
      const GetAll = async () => {
        try {
          if (isFatcing.current) return;
          isFatcing.current = true;
          await dispatch(GettingAllCompany());
          isFatcing.current = false;
        } catch (e) {
          return console.log(e);
        }
      }

      companys.length === 0 && GetAll();

      if (companys.length !== 0) {
        setData(
          companys?.map((company, key) => ({
            key: company?.CompanyId,
            image: company?.CompamyPicture,
            index: key + 1,
            NameTH: company?.CompanyNameTH,
            NameEN: company?.CompanyNameEN,
            BUNameEN: company?.BusinessUnits?.map((bu) => `${bu.BusinessUnit.Name}, `),
            tags: company?.Active ? "Active" : "Inactive",
            CreateBy: company?.CreateBy,
            CreateDate: new Date(company?.CreateDate).toISOString().split("T")[0] || 'undefined',
            UpdateDate: new Date(company?.UpdateDate).toISOString().split("T")[0] || 'undefined',
          }))
        );

        setIsLoading(false);
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }, [dispatch, companys]);

    const filteredData = data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchAll.toLowerCase())
      )
    );

    return(
      <div>
         <div className="w-ful flex justify-center">
            <div className="mb-[100px] w-[530px]">
              <SearchInputComponent value={searchAll} onChange={setSearchAll} placeholder="Search" />
            </div>
          </div>
          <NormalCard>
            <div className="text-xl py-5 px-4 font-primaryMedium bg-white">All Companys</div>
            <div className="w-full">
                {
                isLoading ?
                <div className='flex justify-center items-center h-[250px]'>
                    <DotLoader />
                </div>
                :
                <Table onChange={handleTableChange} columns={columns} dataSource={data && filteredData} />
                }
            </div>
        </NormalCard>
      </div>
    );
};

export default CompanyBody;