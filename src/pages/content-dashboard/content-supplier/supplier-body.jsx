import { Table, Button,Input,Space } from 'antd';
import SupplierCanvas from './supelier-canvas';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from'react-redux';
import { fetchAllSupplier } from '../../../slicers/supplierSlicer';
// import SupplierModal from './supelier-modal';
import DotLoader from '../../../components/content-loading/dot-loader';
import NormalCard from "../../../components/content-card/normal-card";
import NotFound from "../../../assets/images/imgs/error.png";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import dateFormat from "dateformat";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import SearchInputComponent from '../../../components/content-input/search-input';

const SupplierBody = () => {

  const dispatch = useDispatch();
  const suppliers = useSelector((state) => state.supplier.suppliers);
  const isFacthing = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchAll, setSearchAll] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [sortOrderCreate, setSortOrderCreate] = useState(null);
  const [sortOrderUpdated, setSortOrderUpdated] = useState(null);
  const searchInput = useRef(null);

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
    onFilter: (value, record) => {
        if (!record || record[dataIndex] === undefined || record[dataIndex] === null) {
            return false; // Or handle as appropriate
        }
        try{
            return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
        } catch (e){
            console.error("Error filtering record", e, record, dataIndex);
            return false;
        }
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
      dataIndex: 'index',
      key: 'index',
      width: '4%',
      render: (text) => text,
    },
    {
      title: '',
      dataIndex: 'ColorCode',
      key: 'ColorCode',
      width: '4%',
      render: (_, { ColorCode}) => {
        return (
          <div className='w-full h-full flex justify-center items-center'>
            <div className='w-[10px] h-[10px] rounded-full' style={{backgroundColor: ColorCode}}></div>
          </div>
        )
      },
    },
    {
      title: 'Supplier Name',
      dataIndex: 'SupplierName',
      key: 'SupplierName',
      ...getColumnSearchProps('SupplierNameEN'),
      width: '25%',
      render: (_, { SupplierNameEN, image }) =>  <div className="flex gap-x-3 items-center">
        {
          !image ?
            <div>
              <div className='flex justify-center'>
                <img className='w-[30px]' src={NotFound} />
              </div>
              <div className='flex justify-center text-[12px]'>Not Available</div>
            </div>
            :
            <div>
              <img className='flex w-[45px] h-[45px] justify-center p-1 border rounded-[10px] object-contain' src={`${import.meta.env.VITE_REDIRECT_IMG}/images/${image}`} alt="" />
            </div>
          }
          <div>
            <span className="font-primaryMedium">{SupplierNameEN}</span>
          </div>
        </div>,
    },
    {
      title: 'Company & Business unit',
      dataIndex: 'Company',
      key: 'Company',
      ellipsis: true,
      ...getColumnSearchProps('Company'),
      render: (_, { Company }) => 
          <span className="font-primaryMedium">{Company}</span>
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
            if (!CreateDate) return <span className="text-gray-500">No Date</span>;
            const [datefformat] = new Date(CreateDate).toISOString().split("T");
            return (
                <div className="text-center">
                    {dateFormat(datefformat, "mediumDate")}
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
        dataIndex: "Updated",
        key: "Updated",
        align: "center",
        sorter: (a, b) => new Date(a.UpdateDate) - new Date(b.UpdateDate),
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
      title: 'Created By.',
      dataIndex: 'CreateBy',
      key: 'CreateBy',
      ...getColumnSearchProps('CreateBy'),
      render: (text) => <a>{text}</a>,
  },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className='w-full flex gap-x-3'>
          <SupplierCanvas supId={record.key} />
          {/* <SupplierModal supId={record.key}  conditions='delete' /> */}
        </div>
      ),
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    const FecthAll = async () => {
      try {
        if (isFacthing.current) return;
        isFacthing.current = true;
        const response = await dispatch(fetchAllSupplier());
        if (response.payload.status === 'error') {
          isFacthing.current = false;
        }
      } catch (error) {
        return console.log(error);
      }
    };
    
    if (suppliers.length === 0) FecthAll();

    if (suppliers.length !== 0) {
      setData(
        suppliers.map((supplier, key) => ({
          key: supplier?.SupplierId,
          index: key + 1,
          image: supplier?.SupplierImage,
          SupplierNameTH: supplier?.SupplierNameTh,
          SupplierNameEN: supplier?.SupplierNameEn,
          tags: supplier?.Active ? 'Active' : 'Inactive',
          CreateBy: supplier?.CreateBy,
          ColorCode: supplier?.ColorCode,
          CreateDate: supplier?.CreateDate,
          UpdateDate: supplier?.UpdateDate,
          Company: supplier?.SupplierCompany?.map((items) => {
            return `${items?.Company?.CompanyNameEN}`;
          }),
        }))
      );
      setIsLoading(false);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, [dispatch, suppliers]);

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchAll.toLowerCase())
    )
  );


    return (
      <div>
        <div className="w-full flex justify-center">
          <div className="mb-[100px] w-[530px]">
            <SearchInputComponent value={searchAll} onChange={setSearchAll} placeholder="Search" />
          </div>
        </div>
        <NormalCard>
          <div className="text-xl py-5 px-4 font-primaryMedium bg-white">All Suppliers</div>
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

export default SupplierBody;