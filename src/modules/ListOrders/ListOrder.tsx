import { TextInput } from "@mantine/core";
import { useState } from "react";
import { useQuery } from "react-query";

import { ORDER_API } from "@/constant/API/API";
import { TOrder } from "@/constant/Types/order";

import style from "./StyleListOrder.module.scss";
import TableOrder from "./TableOrder/TableOrder";

export default function ListOrder() {
  const [searchText, setSearchText] = useState("");
  const { data: dataSearch, refetch } = useQuery<TOrder[]>(["searchedProducts"], () =>
    fetch(ORDER_API).then(res => res.json())
  );
  const formatData = (dataFormat: TOrder[]) => {
    const formattedData: TOrder[] = dataFormat
      ? dataFormat.map((order: TOrder) => ({
          id: order.id,
          customerName: order.customerName,
          email: order.email,
          phone: order.phone,
          deliveryWay: order.deliveryWay,
          city: order.city,
          district: order.district,
          ward: order.ward,
          address: order.address,
          itemBuy: order.itemBuy,
          isVerify: order.isVerify,
          status: order.status,
          totalPrice: order.totalPrice,
        }))
      : [];
    return formattedData;
  };

  return (
    <div>
      <div className={style.searchInputSide}>
        <TextInput
          value={searchText}
          onChange={event => setSearchText(event.currentTarget.value)}
          className={style.searchInput}
          placeholder="Nhập tên khách hàng bạn muốn tìm"
        />
      </div>
      <div className={style.listOrderContainer}>
        <TableOrder data={formatData(dataSearch || [])} refetch={refetch} />
      </div>
    </div>
  );
}
