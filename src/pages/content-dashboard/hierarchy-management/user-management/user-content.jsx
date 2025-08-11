import { useEffect, useState, useRef } from "react";
import DotLoader from "../../../../components/content-loading/dot-loader";
import { Table, Button, Input, Space } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { gettingAlluser } from "../../../../slicers/usermanageSlicer";
import dateFormat from "dateformat";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@material-tailwind/react";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import SearchInputComponent from "../../../../components/content-input/search-input";

const UserContent = () => {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.usermanage.users);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchAll, setSearchAll] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sortOrders, setSortOrders] = useState({
    Fullname: null,
    saleteam: null,
    role: null,
    updatedAt: null,
    updatedBy: null,
  });
  const searchInput = useRef(null);
  const isFacing = useRef(false);
  const navigate = useNavigate();
  const [paginationInfo, setPaginationInfo] = useState({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    if (isFacing.current) return;
    isFacing.current = true;
    dispatch(gettingAlluser());
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    if (allUsers.length > 0) {
      const user = allUsers;
      setTableData(
        user.map((user, index) => ({
          key: index + 1,
          id: user?.userId,
          Fullname: user?.appUser?.fullname ?? user?.name,
          status: user?.appUser?.active ? "Active" : "Inactive",
          role: user?.appUser?.userRole?.nameEng ?? "No Data",
          updatedAt: user?.appUser?.updatedAt,
          updatedBy: user?.updatedBy,
          updatedAtText: user?.appUser?.updatedAt
            ? dateFormat(user?.appUser?.updatedAt, "mediumDate")
            : "-",
          saleteam: user?.appUser?.SaleTeam[0]?.SaleTeam?.SaleTeamName ?? "-",
        }))
      );
      setIsLoading(false);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, [dispatch, allUsers]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
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
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
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
          color: filtered ? "#1677ff" : undefined,
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
            backgroundColor: "#ffc069",
            padding: 0,
          }}
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
      render: (_text, _record, rowIndex) => (
        <div>
          {(paginationInfo.current - 1) * paginationInfo.pageSize +
            rowIndex +
            1}
        </div>
      ),
    },
    {
      title: (
        <div className="flex items-center">
          Name
          {sortOrders.Fullname === "ascend" && (
            <AiOutlineArrowDown className="ml-2" />
          )}
          {sortOrders.Fullname === "descend" && (
            <AiOutlineArrowUp className="ml-2" />
          )}
        </div>
      ),
      dataIndex: "Fullname",
      key: "Fullname",
      ...getColumnSearchProps("Fullname"),
      sorter: (a, b) => a.Fullname.localeCompare(b.Fullname),
      sortOrder: sortOrders.Fullname,
      render: (_, { Fullname }) => <div>{Fullname}</div>,
    },
    {
      title: (
        <div className="flex items-center">
          Sale team
          {sortOrders.saleteam === "ascend" && (
            <AiOutlineArrowDown className="ml-2" />
          )}
          {sortOrders.saleteam === "descend" && (
            <AiOutlineArrowUp className="ml-2" />
          )}
        </div>
      ),
      dataIndex: "saleteam",
      key: "saleteam",
      ...getColumnSearchProps("saleteam"),
      sorter: (a, b) => a.saleteam.localeCompare(b.saleteam),
      sortOrder: sortOrders.saleteam,
      render: (_, { saleteam }) => <div>{saleteam}</div>,
    },
    {
      title: (
        <div className="flex items-center">
          Role
          {sortOrders.role === "ascend" && (
            <AiOutlineArrowDown className="ml-2" />
          )}
          {sortOrders.role === "descend" && (
            <AiOutlineArrowUp className="ml-2" />
          )}
        </div>
      ),
      dataIndex: "role",
      key: "role",
      ...getColumnSearchProps("role"),
      sorter: (a, b) => {
        const orderMap = {
          "Administrator": 1,
          "Sale": 2,
          "Sale Manager": 3,
          "No data": 99 
        };
        return orderMap[a.role] - orderMap[b.role];
      },
      sortOrder: sortOrders.role,
      render: (_, { role }) => <div>{role}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Active",
          value: "Active",
        },
        {
          text: "Inactive",
          value: "Inactive",
        },
      ],
      onFilter: (value, record) => record.status.includes(value), // ✅ Fix: Filter by status
      sorter: (a, b) => a.status.localeCompare(b.status), // ✅ Fix: Sort alphabetically
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
          Last Updated
          {sortOrders.updatedAt === "ascend" && (
            <AiOutlineArrowDown className="ml-2" />
          )}
          {sortOrders.updatedAt === "descend" && (
            <AiOutlineArrowUp className="ml-2" />
          )}
        </div>
      ),
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      sortOrder: sortOrders.updatedAt,
      sortDirections: ["ascend", "descend"],
      render: (_, { updatedAt }) => {
        if (!updatedAt) return <span className="text-gray-500">No Date</span>;
        const [datefformat] = new Date(updatedAt).toISOString().split("T");
        return (
          <div className="text-center">
            {dateFormat(datefformat, "mediumDate")}
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex items-center">
          Updated by
          {sortOrders.updatedBy === "ascend" && (
            <AiOutlineArrowDown className="ml-2" />
          )}
          {sortOrders.updatedBy === "descend" && (
            <AiOutlineArrowUp className="ml-2" />
          )}
        </div>
      ),
      dataIndex: "updatedBy",
      key: "updatedBy",
      ...getColumnSearchProps("updatedBy"),
      sorter: (a, b) => a.updatedBy.localeCompare(b.updatedBy),
      sortOrder: sortOrders.updatedBy,
      render: (_, { updatedBy }) => <div>{updatedBy}</div>,
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (_, { id }) => (
        <IconButton
          onClick={() => navigate(`/hierarchy-management/user/update/${id}`)}
          variant="text"
          className="rounded-full text-xl text-gray-600"
        >
          <FiEdit3 />
        </IconButton>
      ),
    },
  ];

  // const handleTableChange = (_, __, sorter) => {
  //   sorter.columnKey === "createdDate"
  //     ? setSortOrderUpdated(sorter.order)
  //     : setSortOrderUpdated(sorter.order);
  // };
  const handleTableChange = (pagination, filters, sorter) => {
    setPaginationInfo({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
    if (Array.isArray(sorter)) {
      const firstSorter = sorter[0] || {};
      setSortOrders({
        Fullname: null,
        saleteam: null,
        role: null,
        updatedAt: null,
        updatedBy: null,
        [firstSorter.columnKey]: firstSorter.order || null,
      });
    } else {
      setSortOrders({
        Fullname: null,
        saleteam: null,
        role: null,
        updatedAt: null,
        updatedBy: null,
        [sorter.columnKey]: sorter.order || null,
      });
    }
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
          <SearchInputComponent
            value={searchAll}
            onChange={setSearchAll}
            placeholder="Search"
          />
        </div>
      </div>
      <div className="bg-white rounded-[10px] drop-shadow-md">
        <div className="px-[24px] py-[20px] text-[18px] font-primaryMedium">
          <span>All Users</span>
        </div>
        <div className="w-full">
          {isLoading ? (
            <div className="flex bg-white justify-center items-center h-[250px]">
              <DotLoader />
            </div>
          ) : (
            <Table
              onChange={handleTableChange}
              columns={columns}
              dataSource={tableData && filteredData}
              // pagination={{ pageSize: 10 }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserContent;
