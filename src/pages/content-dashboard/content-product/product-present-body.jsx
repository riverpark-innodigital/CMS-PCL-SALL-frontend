import { useState } from "react";
import { Table } from "antd";
import NormalCard from "../../../components/content-card/normal-card";

const ProductPresentTable = ({ data }) => {
  const [paginationInfo, setPaginationInfo] = useState({
    current: 1,
    pageSize: 50,
  });

  const columns = [
    {
      title: "#",
      dataIndex: "#",
      key: "key",
      width: "5%",
      render: (_text, _record, rowIndex) => (
        <div>
          {(paginationInfo.current - 1) * paginationInfo.pageSize +
            rowIndex +
            1}
        </div>
      ),
    },
    {
      title: "Sale Rep",
      dataIndex: "fullname",
      key: "fullname",
      width: "20%",
      render: (_, { picture, fullname }) => (
        <div className="flex flex-col gap-x-3">
          <div className="flex items-center gap-2">
            {picture ? (
              <img
                src={`${import.meta.env.VITE_REDIRECT_IMG}/images/${picture}`}
                alt="fullname"
                className="flex w-[45px] h-[45px] justify-center p-1 rounded-[10px] object-contain"
              />
            ) : null}
            {fullname}
          </div>
        </div>
      ),
    },
    {
      title: "Qty of Presentations",
      dataIndex: "count",
      key: "count",
      width: "20%",
      render: (_, { count }) => <div>{count}</div>,
    },
  ];

  const handleTableChange = (pagination) => {
    setPaginationInfo({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  return (
    <div>
      <NormalCard>
        <div>
          <div className="px-4 py-5 flex items-center justify-between">
            <div className="flex flex-col bg-white">
              <span className="text-xl font-primaryMedium">
                Total Presentations
              </span>
              <span className="text-sm text-[#475467] font-primaryMedium">
                Ranking of sales representatives based on the number of
                presentations delivered.
              </span>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              current: paginationInfo.current,
              pageSize: paginationInfo.pageSize,
            }}
            onChange={handleTableChange}
          />
        </div>
      </NormalCard>
    </div>
  );
};

export default ProductPresentTable;
