import { Button, Image, Modal, Skeleton, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconEdit, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { RefetchOptions, RefetchQueryFilters, QueryObserverResult } from "react-query";

import { BLOGS_API } from "@/constant/API/API";
import { TBlogs, TDataTableBlogs } from "@/constant/Types/blog";

import ModalCreateEditBlog from "../ModalEditBlog/ModalCreateEditBlogs";

import style from "./TableBlogsStyle.module.scss";
interface ITableBlogsProps {
  data: TDataTableBlogs[];
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TBlogs[], unknown>>;
}
export default function TableBlog({ data, refetch }: ITableBlogsProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadedDetail, setIsLoadedDetail] = useState(false);
  const [isOpenModalDetail, { open: openModalDetail, close: closeModalDetail }] =
    useDisclosure(false);
  const [isOpenModalEdit, { open: openModalEdit, close: closeModalEdit }] = useDisclosure(false);
  const [contentBlog, setContentBlog] = useState<string>("");
  const [blogEdit, setBlogEdit] = useState<TBlogs>();
  const [typeModal, setTypeModal] = useState<"create" | "edit">("create");
  useEffect(() => {
    if (data) {
      setTimeout(() => {
        setIsLoaded(true);
      }, 1000);
    }
  }, [data]);
  // 0 is detailContent, 1 is edit
  const getDetailBlog = (id: string, type: 0 | 1) => {
    axios
      .get<TBlogs>(`${BLOGS_API}/${id}`)
      .then(res => {
        if (type === 0) {
          const { content } = res.data;
          setContentBlog(content);
        } else {
          setBlogEdit(res.data);
        }
        setIsLoadedDetail(true);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const deleteBlog = (id: string) => {
    axios
      .delete(`${BLOGS_API}/${id}`)
      .then(async () => {
        await refetch();
        notifications.show({
          title: "Delete Blog Success",
          message: "Delete Blog Success",
          color: "green",
          icon: <IconCheck />,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const renderTableHeaders = (data: TDataTableBlogs[]) => {
    const firstItem = data[0];
    if (!firstItem) {
      return null;
    }
    const headers = Object.keys(firstItem);
    return (
      <tr className={style.tableColumn}>
        <th>STT</th>
        {headers.map((header, index) => {
          if (header != "content") {
            return <th key={index}>{header}</th>;
          }
          return null;
        })}
        <th>Detail Blog</th>
        <th>Actions</th>
      </tr>
    );
  };
  const renderTableRows = (data: TDataTableBlogs[]) => {
    return data.map((item, index) => {
      const columns = Object.entries(item);
      const id = item.id;
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          {columns.map((column, columnIndex) => {
            if (column[0] != "content" && column[0] != "imgPosing" && column[1] != null) {
              return <td key={columnIndex}>{column[1].toString()}</td>;
            } else if (column[0] == "imgPosing" && column[1] != null) {
              return (
                <td key={columnIndex}>
                  <Image src={column[1].toString()} width={100} height={100} />
                </td>
              );
            }
          })}
          <td>
            <Button
              onClick={() => {
                openModalDetail();
                setContentBlog("");
                setIsLoadedDetail(false);
                setTypeModal("create");
                if (typeof id == "string") {
                  getDetailBlog(id, 0);
                }
              }}
            >
              Xem chi tiết
            </Button>
          </td>
          <td>
            <Button
              color="yellow"
              style={{ marginRight: "5px" }}
              onClick={() => {
                openModalEdit();
                setTypeModal("edit");
                if (typeof id == "string") {
                  getDetailBlog(id, 1);
                }
              }}
            >
              <IconEdit />
            </Button>
            <Button
              color="red"
              onClick={() => {
                if (typeof id == "string") {
                  deleteBlog(id);
                }
              }}
            >
              <IconTrash />
            </Button>
          </td>
        </tr>
      );
    });
  };
  return (
    <div style={{ height: "85vh" }}>
      <ModalCreateEditBlog
        opened={isOpenModalEdit}
        onClose={closeModalEdit}
        title="Chỉnh sửa bài viết"
        type={typeModal}
        refetch={refetch}
        blogs={blogEdit}
      />
      <Modal
        opened={isOpenModalDetail}
        onClose={closeModalDetail}
        title="Chi tiết bài viết"
        size={"auto"}
      >
        {isLoadedDetail ? (
          <div dangerouslySetInnerHTML={{ __html: contentBlog }} />
        ) : (
          <Skeleton style={{ height: "500px", width: "500px" }} />
        )}
      </Modal>
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
