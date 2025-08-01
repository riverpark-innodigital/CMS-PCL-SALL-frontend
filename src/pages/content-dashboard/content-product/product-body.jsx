import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAllProducts } from "../../../slicers/productsaleSlicer";

// import ProductModal from "./product-modal.jsx";
import ProductCanvas from "./product-canvas.jsx";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Table, Button,Input, Space } from 'antd';

import { AiOutlineArrowDown, AiOutlineArrowUp  } from "react-icons/ai";
import DotLoader from "../../../components/content-loading/dot-loader.jsx";
import NormalCard from "../../../components/content-card/normal-card";
import GetNewObject from "../../../hooks/new-object";
import dateFormat from "dateformat";
import SearchInputComponent from "../../../components/content-input/search-input.jsx";

const ProductTable = () => {

  const dispatch = useDispatch();
  const { allProducts } = useSelector((state) => state.productsale);  
  const [sortOrderCreate, setSortOrderCreate] = useState(null);
  const [sortOrderUpdated, setSortOrderUpdated] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchAll, setSearchAll] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const searchInput = useRef(null);
  
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  
  useEffect(() => {
      setIsLoading(true);
      if (allProducts.length > 0) { 
          setTableData(allProducts.map((product, index) => ({
              key: index + 1, 
              productId: product.ProductId,
              productNo: product.ProductNo,
              product: product.ProductNameEn,
              productGroup: product.ProductGroupName,
              model: product.ProductModelName,
              supplier: product.SupplierName,
              supplierImage: product.SupplierImage,
              imageMain: product.ProductImageMain,
              createdDate: product.CreateDate,
              updatedDate: product.Updatedate,
              createdBy: product.CreateBy,
              Campany: product.Campany,
              status: product.Active ? "Active" : "Inactive",
              proId: product.ProductId,
          })));
          setIsLoading(false);
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
  }, [dispatch, allProducts]);

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
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0] || ""}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button type="link" size="small" onClick={close}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      if (!value || typeof value !== "string") return false; // ✅ Prevent errors
      const dataValue = record[dataIndex] ? record[dataIndex].toString().toLowerCase() : "";
      return dataValue.includes(value.toLowerCase());
    },
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
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
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
      width: "5%",
      render: (_, { key }) => <div>{key}</div>,
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      width: "20%",
      ...getColumnSearchProps('product'),
      render: (_, { imageMain, product, createdDate }) => (
        <div className="flex items-center gap-x-3">
          <div>
            <img 
              src={`${import.meta.env.VITE_REDIRECT_IMG}/images/${imageMain}`}
              alt="Product" 
              className='flex w-[45px] h-[45px] justify-center p-1 border rounded-[10px] object-contain'
            />
          </div>
          <GetNewObject date={createdDate}/>
          {product}
        </div>
      ),
    },
    {
      title: "Product Group",
      dataIndex: "productGroup",
      key: "productGroup",
      width: "10%",
      ...getColumnSearchProps('productGroup'),
      render: (_, { productGroup, model }) => (
        <div>
          {productGroup}
          <div className="text-gray-500">{model}</div>
        </div>
      ),
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
      width: "10%",
      ...getColumnSearchProps('supplier'),
      render: (_, { supplierImage, supplier }) => (
        <div className="flex items-center">
          <img src={`${import.meta.env.VITE_REDIRECT_IMG}/images/${supplierImage}`} alt="Supplier" width={40} height={40} className=" mr-2" />
          {supplier}
        </div>
      ),
    },
    {
      title: "Campany & BU",
      dataIndex: "campany",
      key: "campany",
      ...getColumnSearchProps('Campany'),
      width: "15%",
      render: (_, { Campany }) => (
        <div>
          {Campany}
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
      render: (date) => {
          if (!date) return <span className="text-gray-500">No Date</span>;
          const [createdDate] = new Date(date).toISOString().split("T");
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
      render: (_,{updatedDate}) => {
          if (!updatedDate) return <span className="text-gray-500">No Date</span>;
          const [datefformat] = new Date(updatedDate).toISOString().split("T");
          return (
              <div className="text-center">
                  {dateFormat(datefformat, "mediumDate")}
              </div>
          );
      },
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
      onFilter: (value, record) => record.status.includes(value), // ✅ Fix: Filter by status
      sorter: (a, b) => a.status.localeCompare(b.status), // ✅ Fix: Sort alphabetically
      ellipsis: true,
      render: (_, { status }) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "fit-content",
            margin: "0 auto",
          }}
          className={
            status === "Active"
              ? "bg-green-50 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300"
              : "bg-red-50 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300"
          }
        >
          <svg
            width="7"
            height="7"
            viewBox="0 0 12 12"
            fill={status === "Active" ? "#52c41a" : "#ff4d4f"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="6" cy="6" r="6" />
          </svg>
          <span>{status}</span>
        </div>
      ),
    },
    {
      title: "Created by",
      dataIndex: "createdBy",
      key: "createdBy",
      ...getColumnSearchProps('createdBy'),
      align: "center",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, {proId}) => (
        <div className="flex justify-center gap-2">
          <ProductCanvas proId={parseInt(proId)}/>
          {/* <ProductModal conditions={'delete'} proId={parseInt(proId)} /> */}
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

  return (
    <div>
        <div className="w-full flex justify-center">
          <div className="mb-[100px] w-[530px]">
            <SearchInputComponent value={searchAll} onChange={setSearchAll} placeholder="Search" />
          </div>
        </div>
       <NormalCard>
        <div>
            <div className="px-4 py-5 flex items-center justify-between">
              <div className="text-xl font-primaryMedium bg-white">All Products</div>
            </div>
            { isLoading ? 
              <div className='flex bg-white justify-center items-center h-[250px]'>
                <DotLoader />
              </div>
              :
              <Table
                columns={columns}
                dataSource={tableData && filteredData}
                pagination={{ pageSize: 10 }}
                onChange={handleTableChange}
              />
            }
          </div>
        </NormalCard>
    </div>
  );
};

export default ProductTable;
