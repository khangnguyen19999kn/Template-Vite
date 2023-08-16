import { TextInput, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import { useQuery } from "react-query";

import { BLOGS_API } from "@/constant/API/API";
import { TBlogs } from "@/constant/Types/blog";
import { formatDataBlogs } from "@/utils/formatDataBlog";

import style from "./BlogsStyle.module.scss";
import ModalCreateEditBlog from "./ModalEditBlog/ModalCreateEditBlogs";
import TableBlog from "./TableBlog/TableBlog";
export default function Blogs() {
  const { data: dataSearch, refetch } = useQuery<TBlogs[]>(["blog"], () =>
    fetch(BLOGS_API).then(res => res.json())
  );

  const [searchText, setSearchText] = useState("");
  const [isOpenModalCreate, { open: openModalCreate, close: closeModalCreate }] =
    useDisclosure(false);
  return (
    <div>
      <ModalCreateEditBlog
        opened={isOpenModalCreate}
        onClose={closeModalCreate}
        type="create"
        refetch={refetch}
      />
      <div className={style.searchInputSide}>
        <TextInput
          value={searchText}
          onChange={event => setSearchText(event.currentTarget.value)}
          className={style.searchInput}
          placeholder="Nhập tên bài viết cần tìm kiếm"
        />
        <Button
          onClick={() => {
            openModalCreate();
          }}
        >
          Thêm đơn hàng
        </Button>
      </div>
      <div className={style.listBlogsContainer}>
        <TableBlog data={formatDataBlogs(dataSearch || [])} refetch={refetch} />
      </div>
    </div>
  );
}
