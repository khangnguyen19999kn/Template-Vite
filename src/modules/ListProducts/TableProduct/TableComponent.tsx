import { Button, Popover, Skeleton, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconEdit, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from "react-query";

import { IDataTable } from "@/@types/product";
import { PRODUCT_API } from "@/constant/API/API";
import { TProduct } from "@/constant/Types/product";

import ModalCreateEdit from "../ModalCreateEdit/ModalCreateEdit";

import style from "./TableStyle.module.scss";

interface ITableProps {
  data: IDataTable[];
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TProduct[], unknown>>;
}

export default function TableComponent({ data, refetch }: ITableProps) {
  //This use to open modal
  const [isOpened, { open, close }] = useDisclosure(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [productEdit, setProductEdit] = useState<IDataTable | undefined>(undefined);
  useEffect(() => {
    if (data) {
      setTimeout(() => {
        setIsLoaded(true);
      }, 1000);
    }
  }, [data]);
  const renderTableHeaders = (data: IDataTable[]) => {
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
        <th>Actions</th>
      </tr>
    );
  };

  const editEvent = (id: string | number | string[]) => {
    if (typeof id === "number") {
      id = String(id); // Convert the number ID to string
    }
    open();

    const product = data.find(item => item.id === id);
    setProductEdit(product);
    // Perform the necessary actions with the ID
  };

  const deleteEvent = (id: string | number | string[]) => {
    if (typeof id === "number" || Array.isArray(id)) {
      id = String(id);
      // Convert the number ID to string
    }
    axios
      .delete(`${PRODUCT_API}${id}`)
      .then(async () => {
        notifications.show({
          title: "Delete product successfully",
          message: "You have deleted product successfully",
          color: "green",
          icon: <IconCheck size="1rem" />,
        });
        await refetch();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const renderTableRows = (data: IDataTable[]) => {
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
              return <td key={columnIndex}>{column}</td>;
            }
            return null;
          })}
          <td className={style.actionRow}>
            <Button onClick={() => editEvent(id)} color="yellow" className={style.buttonEdit}>
              <IconEdit />
            </Button>
            <Popover width={300} trapFocus position="top" withArrow shadow="md">
              <Popover.Dropdown>
                <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                  <Button color="red" onClick={() => deleteEvent(id)}>
                    Xác nhận xóa
                  </Button>
                  <Button color="gray">Hủy bỏ</Button>
                </div>
              </Popover.Dropdown>
              <Popover.Target>
                <Button color="red">
                  <IconTrash />
                </Button>
              </Popover.Target>
            </Popover>
          </td>
        </tr>
      );
    });
  };

  return (
    <div style={{ height: isLoaded ? "" : "85vh" }}>
      <ModalCreateEdit
        opened={isOpened}
        onClose={close}
        title={"Edit Product"}
        product={productEdit}
        type="edit"
        refetch={refetch}
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
