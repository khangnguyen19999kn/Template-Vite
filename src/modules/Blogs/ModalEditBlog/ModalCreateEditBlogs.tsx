import { Button, FileButton, Modal, TextInput, Image, Text, Loader, Skeleton } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { RefetchOptions, RefetchQueryFilters, QueryObserverResult } from "react-query";

import { BLOGS_API } from "@/constant/API/API";
import { TBlogs, TDataTableBlogs } from "@/constant/Types/blog";
import { baseformBlog } from "@/constant/variable/baseform";

interface IModalCreateCreateEditBlogsProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
  type: "create" | "edit";
  blogs?: TBlogs;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TBlogs[], unknown>>;
}
import Editor from "../Editor/Editor";

import style from "./ModalCreateEditBlogsStyle.module.scss";

export default function ModalCreateEditBlog({
  opened,
  onClose,
  title,
  blogs,
  type,
  refetch,
}: IModalCreateCreateEditBlogsProps) {
  const [file, setFile] = useState<File | null>(null);
  const [hasErrorImg, setErrorImg] = useState(true);
  const [blogEdit, setBlogEdit] = useState<TDataTableBlogs | undefined>(baseformBlog);
  const [contentFrom, setContent] = useState<string>("");
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const handleEditorChange = (content: string) => {
    setContent(content);
    form.setFieldValue("content", content);
  };

  useEffect(() => {
    if (blogs) {
      setIsLoading(false);
      setBlogEdit({
        ...blogs,
      });
      form.setValues({ ...blogs });
      handleEditorChange(blogs.content);
      setErrorImg(false);
    }
    if (type === "create") {
      setIsLoading(false);
    }
  }, [blogs, type]);

  useEffect(() => {
    const addImage = () => {
      if (file) {
        form.setFieldValue("imgPosing", file);
        setErrorImg(false);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setBlogEdit({
              ...blogEdit,
              imgPosing: reader.result,
            });
          }
        };
      }
    };
    addImage();
  }, [file]);
  const removeImage = () => {
    setBlogEdit({
      ...blogEdit,
      imgPosing: null,
    });
    form.setFieldValue("imgPosing", null);
    setErrorImg(true);
  };
  const showImg = () => {
    if (blogEdit) {
      if (typeof blogEdit.imgPosing === "string" && blogEdit.imgPosing !== "") {
        return (
          <div className={style.imageSide}>
            <Image src={blogEdit.imgPosing} width={200} height={200} alt="img" />
            <Text
              onMouseDown={() => {
                removeImage();
              }}
              className={style.buttonRemoveImage}
            >
              X
            </Text>
          </div>
        );
      }
    }

    return (
      <div>
        <div
          className={style.buttonAddImageSide}
          style={{ border: hasErrorImg ? "1px solid red" : 0 }}
        >
          <FileButton onChange={setFile} accept="image/png,image/jpeg">
            {props => (
              <Button className={style.buttonAddImage} {...props}>
                +
              </Button>
            )}
          </FileButton>
        </div>
        <span style={{ color: "red", opacity: hasErrorImg ? 1 : 0 }}>Thêm ít nhất 1 ảnh </span>
      </div>
    );
  };

  const form = useForm({
    initialValues: {
      ...blogEdit,
    },
  });
  const submitForm = () => {
    if (hasErrorImg) {
      return;
    }
    setIsPending(true);
    const data = new FormData();
    const fieldToAppend = Object.keys(form.values);
    fieldToAppend.forEach(field => {
      if (field != "imgPosing") {
        data.append(field, form.values[field]?.toString() || "");
      }
    });
    if (form.values.imgPosing) {
      data.append("imgPosing", form.values.imgPosing as File);
    }
    if (type === "create") {
      axios
        .post(BLOGS_API, data)
        .then(async () => {
          await refetch();
          notifications.show({
            title: "Thêm bài viết thành công",
            message: "Thêm bài viết thành công",
            color: "green",
            icon: <IconCheck />,
          });
          setIsPending(false);
          onClose();
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      if (typeof form.values.id === "string") {
        axios
          .put(`${BLOGS_API}${form.values.id}`, data)
          .then(async () => {
            await refetch();
            notifications.show({
              title: "Sửa bài viết thành công",
              message: "Sửa bài viết thành công",
              color: "green",
              icon: <IconCheck />,
            });
            setIsPending(false);
            onClose();
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size="auto"
      style={{ position: "relative" }}
    >
      {isLoading && <Skeleton className={style.loading} />}
      <form
        onSubmit={form.onSubmit(() => {
          submitForm();
        })}
        encType="multipart/form-data"
      >
        <TextInput
          {...form.getInputProps("title")}
          label="Title"
          placeholder="Nhập title"
          className={style.elementInModal}
          required
        />
        <TextInput
          {...form.getInputProps("author")}
          label="Author"
          placeholder="Nhập tên tác giả"
          className={style.elementInModal}
          required
        />
        <div className={style.elementInModal}>
          <Text className={style.textTitleElement}>Chọn ảnh bìa của bài viết</Text>
          {showImg()}
        </div>
        <div className={style.elementEditInModal}>
          <Text className={style.textTitleElement}>Soạn nội dùng bài viết</Text>
          <Editor
            {...form.getInputProps("content")}
            value={contentFrom}
            handleEditorChange={handleEditorChange}
          />
        </div>
        <div className={style.buttonInModal}>
          <Button type="submit">Lưu</Button>
          <Button onClick={onClose} color="gray" style={{ marginLeft: "5px" }}>
            Hủy
          </Button>
        </div>
      </form>
      {isPending && (
        <div className={style.loading}>
          <Loader color="violet" />
        </div>
      )}
    </Modal>
  );
}
