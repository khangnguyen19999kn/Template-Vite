import { Button, Skeleton, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconEdit, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { RefetchOptions, RefetchQueryFilters, QueryObserverResult } from "react-query";

import ModalWarning from "@/components/ModalWarning/ModalWarning";
import { ORDER_API } from "@/constant/API/API";
import { IDataTableOrder, TOrder, TOrderBuy } from "@/constant/Types/order";

import ModalDetailProductBuy from "../ModalDetailProductBuy/ModalDetailProductBuy";
import ModalEditOrder from "../ModalEditOrder/ModalEditOrder";

import style from "./TableOrderStyle.module.scss";
interface ITableOrderProps {
  data: IDataTableOrder[];
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TOrder[], unknown>>;
}

export default function TableOrder({ data, refetch }: ITableOrderProps) {
  const [isOpenedModalDetail, { open: openModalDetail, close: closeModalDetail }] =
    useDisclosure(false);
  const [
    isOpenedModalWarningConfirm,
    { open: openMoDalWarningConfirm, close: closeMoDalWarningConfirm },
  ] = useDisclosure(false);
  const [
    isOpenedModalConfirmDelete,
    { open: openModalConfirmDelete, close: closeModalConfirmDelete },
  ] = useDisclosure(false);
  const [isOpenedModalEdit, { open: openModalEdit, close: closeModalEdit }] = useDisclosure(false);
  const [idOrder, setIdOrder] = useState<string>("");
  const [dataItembuy, setDataItemBuy] = useState<TOrderBuy[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const detailItemBuy = (id: string) => {
    axios
      .get<TOrder>(`${ORDER_API}/${id}`)
      .then(res => {
        const itemBuy: TOrderBuy[] = res.data.itemBuy;
        setDataItemBuy(itemBuy);
        openModalDetail();
      })
      .catch(err => {
        console.log(err);
      });
  };
  const confirmOrder = (id: string) => {
    axios
      .put(`${ORDER_API}/confirm/${id}`)
      .then(async () => {
        notifications.show({
          title: "Confirm order successfully",
          message: "You have confirmed the order successfully",
          color: "green",
          icon: <IconCheck size="1rem" />,
        });
        await refetch();
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        setIsLoaded(true);
      }, 1000);
    }
  }, [data]);
  const checkStatusBoolean = (
    item: string | number | boolean | string[] | TOrderBuy[] | { name: string; code: string }
  ) => {
    if (typeof item === "boolean" && item === true) {
      return true;
    }
    return false;
  };
  const renderTableHeaders = (data: IDataTableOrder[]) => {
    const firstItem = data[0];
    if (!firstItem) {
      return null;
    }
    const headers = Object.keys(firstItem);
    return (
      <tr className={style.tableColumn}>
        <th>STT</th>
        {headers.map((header, index) => {
          if (!Array.isArray(firstItem[header])) {
            return <th key={index}>{header}</th>;
          }
          return null;
        })}
        <th>ItemBuy</th>
        <th>Actions</th>
      </tr>
    );
  };
  const deleteOrder = (id: string) => {
    axios
      .delete(`${ORDER_API}/${id}`)
      .then(async () => {
        notifications.show({
          title: "Delete order successfully",
          message: "You have delete the order successfully",
          color: "green",
          icon: <IconCheck size="1rem" />,
        });
        await refetch();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const renderTableRows = (data: IDataTableOrder[]) => {
    return data.map((item, index) => {
      const columns = Object.values(item);
      const id = item.id;

      return (
        <tr key={index}>
          <td>{index + 1}</td>
          {columns.map((column, columnIndex) => {
            if (!Array.isArray(column)) {
              if (typeof column === "number") {
                return <td key={columnIndex}>{column.toLocaleString()}</td>;
              }
              if (typeof column === "boolean") {
                return <td key={columnIndex}>{column ? "Đã xác nhận" : "Chưa xác nhận"}</td>;
              }
              if (typeof column === "object" && column !== null) {
                return <td key={columnIndex}>{column.name}</td>;
              }
              return <td key={columnIndex}>{column}</td>;
            }
            return null;
          })}
          <td>
            <Button
              onClick={() => {
                if (typeof id === "string") {
                  detailItemBuy(id);
                }
              }}
            >
              Xem chi tiết
            </Button>
          </td>
          <td>
            <Button
              color="green"
              className={style.buttonAction}
              disabled={checkStatusBoolean(item.status)}
              onClick={() => {
                openMoDalWarningConfirm();
                if (typeof id === "string") {
                  setIdOrder(id);
                }
              }}
            >
              <IconCheck />
            </Button>
            <Button
              color="yellow"
              className={style.buttonAction}
              onClick={() => {
                if (typeof id === "string") {
                  setIdOrder(id);
                }
                openModalEdit();
              }}
            >
              <IconEdit />
            </Button>
            <Button
              color="red"
              onClick={() => {
                openModalConfirmDelete();
                if (typeof id === "string") {
                  setIdOrder(id);
                }
              }}
              className={style.buttonAction}
            >
              <IconTrash />
            </Button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div style={{ height: isLoaded ? "" : "85vh" }}>
      <ModalEditOrder
        opened={isOpenedModalEdit}
        onClose={closeModalEdit}
        title="Chỉnh sửa đơn hàng"
        id={idOrder}
        refetch={refetch}
      />
      <ModalDetailProductBuy
        opened={isOpenedModalDetail}
        onClose={closeModalDetail}
        title={"Sản phẩm đã mua của đơn hàng"}
        itemBuy={dataItembuy}
      />
      <ModalWarning
        confirm={confirmOrder}
        id={idOrder}
        opened={isOpenedModalWarningConfirm}
        onClose={closeMoDalWarningConfirm}
        title="Xác nhận đơn hàng"
        colorConfirmButton="green"
        content="Bạn có chắc chắn muốn xác nhận đơn hàng này không?"
      />
      <ModalWarning
        confirm={deleteOrder}
        id={idOrder}
        opened={isOpenedModalConfirmDelete}
        onClose={closeModalConfirmDelete}
        title="Xác nhận xóa đơn hàng"
        colorConfirmButton="red"
        content="Bạn có chắc chắn muốn xóa đơn hàng này không?"
      />

      <div className={!isLoaded ? style.loaderContainer : style.done}>
        <Skeleton style={{ height: "100%" }} />
      </div>
      <Table
        className={isLoaded ? style.loadingTable : style.done}
        withBorder
        withColumnBorders
        highlightOnHover
        horizontalSpacing="sm"
      >
        <thead>{renderTableHeaders(data)}</thead>
        <tbody>{renderTableRows(data)}</tbody>
      </Table>
    </div>
  );
}
