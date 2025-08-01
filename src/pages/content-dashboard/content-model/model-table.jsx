import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchAllModels } from "../../../slicers/modelSlicer";
import { Table, Flex, Empty, Button,Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import NormalCard from '../../../components/content-card/normal-card';
import ModelForm from './model-form'
// import DeleteModel from './model-modal'
import DotLoader from '../../../components/content-loading/dot-loader';
import GetNewObject from "../../../hooks/new-object";
import dateFormat from "dateformat";
import { AiOutlineArrowDown, AiOutlineArrowUp  } from "react-icons/ai";

const ModelTable = () => {

  const dispatch = useDispatch();
  const { models } = useSelector((state) => state.model);
  
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchAll, setSearchAll] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [sortOrderCreate, setSortOrderCreate] = useState(null);
  const [sortOrderUpdated, setSortOrderUpdated] = useState(null);
  const isFetching = useRef(false);
  const searchInput = useRef(null);

  const [load, setLoad] = useState(false);

  const handleTableChange = (_, __, sorter) => {
    sorter.columnKey === 'CreateDate' ? setSortOrderCreate(sorter.order) : setSortOrderUpdated(sorter.order);
  };

  useEffect(() => {
    setLoad(true)
    const func = async () => {
      if (isFetching.current) return;
      isFetching.current = true;
      await dispatch(fetchAllModels());
    }
    if (models.length === 0 && !isFetching.current) {
      func()
    }
    
    if (models.length > 0) {
      setTableData(models.map((model, index) => ({
        key: index + 1 || 'undefined',
        ModelProductId: model.ModelProductId || null,
        modelCode: model.ModelCode || 'undefined',
        modelNameEn: model.ModelNameEn || 'undefined',
        modelNameTh: model.ModelNameTh || 'undefined',
        status: model.Active ? "Active" : "Inactive",
        createBy: model.CreateBy || 'undefined',
        createDate: model.CreateDate || 'undefined',
        updateBy: model.UpdateBy || 'undefined',
        UpdateDate: model.UpdateDate || 'undefined',
      })));
      setLoad(false)
    }

    setTimeout(() => {
      setLoad(false);
    }, 5000);
  }, [dispatch, models]);

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
      title: 'Model Code',
      dataIndex: 'modelCode',
      key: 'modelCode',
      ...getColumnSearchProps('modelCode'),
      render: (_, { modelCode }) => (
        <div>
          {modelCode}
        </div>
      ),
    },
    {
      title: 'Model Name',
      dataIndex: 'modelName',
      key: 'modelName',
      ...getColumnSearchProps('modelName'),
      render: (_, { modelNameEn, modelNameTh, createDate }) => (
        <div className="flex items-center gap-2">
        <div>
          <GetNewObject date={createDate} />
        </div>
        <Flex vertical>
          <div>{modelNameEn}</div>
          <div>{modelNameTh}</div>
        </Flex>
      </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status'),
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
      title: (
          <div className="flex justify-center items-center">
            Create Date
            {sortOrderCreate === "ascend" && <AiOutlineArrowDown className="ml-2" />}
            {sortOrderCreate === "descend" && <AiOutlineArrowUp className="ml-2" />}
          </div>
        ),
        dataIndex: "CreateDate",
        key: "CreateDate",
        align: "center",
        sorter: (a, b) => new Date(a.createDate) - new Date(b.createDate),
        sortDirections: ["ascend", "descend"],
        render: (_,{createDate}) => {
            if (!createDate) return <span className="text-gray-500">No Date</span>;
            const [datefformat] = new Date(createDate).toISOString().split("T");
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
        dataIndex: "Updatedate",
        key: "Updatedate",
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
      title: 'Create By.',
      dataIndex: 'CreateBy',
      key: 'CreateBy',
      ...getColumnSearchProps('CreateBy'),
      render: (_, {createBy}) => <a>{createBy}</a>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, { ModelProductId }) => (
        <div className="w-full flex gap-x-3">
          <ModelForm modelId={ModelProductId} />
          {/* <DeleteModel modelId={ModelProductId} /> */}
        </div>
      ),
    },
  ];

  return (
    <NormalCard>
      <div className="text-xl py-5 px-4 font-primaryMedium bg-white">All Models</div>
      <div className="w-full">
        {load ? (
          <div className="flex justify-center items-center h-[250px]">
            <DotLoader />
          </div>
        ) : models.length === 0 ? (
          <div className="flex justify-center items-center h-[250px]">
            <Empty description="No models found" />
          </div>
        ) : (
          <Table onChange={handleTableChange} columns={columns} dataSource={tableData} position={["bottomCenter"]} />
        )}
      </div>
    </NormalCard>
  );
};

export default ModelTable;
