import { Table, Button,Input, Space } from 'antd';
import { useState, useRef, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useSelector, useDispatch } from 'react-redux';
import { fectOverview } from '../../../../slicers/dashboardSlicer';
import DetailLoading from '../../../../components/content-loading/detail-loading';
import ErrorImage from '../../../../assets/images/imgs/error.png';
import ProductCanvas from '../../content-product/product-canvas';
import { AiOutlineArrowDown, AiOutlineArrowUp  } from "react-icons/ai";

const OverviewContent = () => {

    const [tableData, setTableData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [sortOrderViewer, setSortOrderViewer] = useState(null);
    const searchInput = useRef(null);
    const dispatch = useDispatch();
    const overview = useSelector((state) => state.dashboard.overview);
    const isFetching = useRef(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const fetchOverview = async () => {
            try {
                if (isFetching.current) return;
                isFetching.current = true;
                await dispatch(fectOverview());
                isFetching.current = false;
            } catch (err) {
                return console.log(err);
            }
        }

        if (overview.length === 0) fetchOverview();

        if (overview.length !== 0) {
          setTableData(overview.map((items, key) => ({
            key: key + 1,
            productId: items.ProductId,
            product: items.ProductNameEn,
            ProductGroup: items.GroupProduct.GroupNameEn,
            supplier: items.Supplier.SupplierNameEn,
            supplierImage: items.Supplier.SupplierImage,
            productImage: items.ProductImage,
            view: items.PresentQty,
          })));
          setIsLoading(false);
        };

        setTimeout(() => {
          setIsLoading(false);
        }, 5000);
    }, [overview, dispatch]);

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
          title: '#',
          dataIndex: 'No',
          key: 'No',
          width: '1%',
          render: (_, { key }) => (
            <div>
              {key}
            </div>
          ),
        },
        {
          title: 'Product',
          dataIndex: 'product',
          key: 'product',
          ...getColumnSearchProps('product'),
          render: (_, { product, productImage }) => (
            <div className='flex gap-x-3 items-center'>
              { productImage 
                ? 
                <div className="p-1 border rounded-[10px]">
                  <img src={`${import.meta.env.VITE_REDIRECT_IMG}/images/${productImage}`} alt="Product" width={40} height={40} />
                </div>
                : 
                <img src={`${import.meta.env.VITE_REDIRECT_IMG}/images/${ErrorImage}`} className='w-[35px] h-[35px] rounded-md object-cover' />
              }
              <span>{product}</span>
            </div>
          ),
        },
        {
          title: 'Product Group',
          dataIndex: 'ProductGroup',
          key: 'ProductGroup',
          ...getColumnSearchProps('ProductGroup'),
          render: (_, { ProductGroup }) => (
            <div className='flex gap-x-3 items-center'>
              <span>{ProductGroup}</span>
            </div>
          ),
        },
        {
          title: 'Supplier',
          dataIndex: 'supplier',
          key: 'supplier',
          ...getColumnSearchProps('supplier'),
          render: (_, { supplier, supplierImage }) => (
            <div className='flex gap-x-3 items-center'>
              { supplierImage 
                ? 
                <img src={`${import.meta.env.VITE_REDIRECT_IMG}/images/${supplierImage}`} width={40} height={40} alt={supplier} /> 
                : 
                <img src={`${import.meta.env.VITE_REDIRECT_IMG}/images/${ErrorImage}`} className='w-[35px] h-[35px] rounded-md object-cover' />
              }
              <span>{supplier}</span>
            </div>
          ),
        },
        {
          title: (
            <div className="flex justify-center items-center">
              Qty of Presentations
              {sortOrderViewer === "ascend" && <AiOutlineArrowDown className="ml-2" />}
              {sortOrderViewer === "descend" && <AiOutlineArrowUp className="ml-2" />}
            </div>
          ),
          dataIndex: "view",
          key: "view",
          align: "center",
          sorter: (a, b) => (a.view) - (b.view),
          sortDirections: ["ascend", "descend"],
          render: (_,{view}) => {
              return (
                <div>
                  {view}
                </div>
              );
          },
        },
        {
          title: "Actions",
          key: "actions",
          align: "center",
          render: (_, {productId}) => (
            <div className="flex justify-center gap-2">
              <ProductCanvas proId={parseInt(productId)}/>
              {/* <ProductModal conditions={'delete'} proId={parseInt(proId)} /> */}
            </div>
          ),
        },
    ];

    const handleTableChange = (_, __, sorter) => {
      sorter.columnKey === 'view' && setSortOrderViewer(sorter.order);
    };

    return(
        <div className="w-full bg-white h-fit rounded-md border border-gray-200">
            <div className="p-[24px]">
                <span className='font-primaryMedium text-[18px] text-black'>Overview</span>
            </div>
            <div className="w-full pb-[10px]">
              {
                isLoading ? 
                <div className='px-[24px]'>
                  <DetailLoading /> 
                </div>
                : 
                <Table onChange={handleTableChange} columns={columns} dataSource={tableData} position={["bottomCenter"]} />
              }
            </div>
        </div>
    );
};

export default OverviewContent;