import { Button, FileButton, Image, Modal, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { RefetchOptions, RefetchQueryFilters, QueryObserverResult } from "react-query";

import { IDataTable } from "@/@types/product";
import { TProduct } from "@/constant/Types/product";
import { baseformProduct } from "@/constant/variable/baseform";
import FormProduct from "@/modules/ListProducts/FormProduct/FormProduct";

import style from "./ModalCreateEditStyle.module.scss";
interface IModalCreateEditProductProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
  type: "create" | "edit";
  product?: IDataTable;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TProduct[], unknown>>;
}
export default function ModalCreateEdit({
  opened,
  onClose,
  title,
  product,
  type,
  refetch,
}: IModalCreateEditProductProps) {
  const [file, setFile] = useState<File | null>(null);
  const [productEdit, setProductEdit] = useState<IDataTable | undefined>(baseformProduct);
  const [listFileUp, setListFileUp] = useState<File[]>([]);
  const [hasErrorImg, setErrorImg] = useState(false);
  useEffect(() => {
    if (product) {
      setProductEdit({
        ...product,
      });
    }
  }, [product]);

  const removeImage = (index: number) => {
    if (productEdit && Array.isArray(productEdit?.img)) {
      const newImg = productEdit.img.filter((_, i) => i !== index);
      const newListFileUp = listFileUp.filter((_, i) => i !== index);
      setProductEdit({
        ...productEdit,
        img: newImg,
      });
      setListFileUp(newListFileUp);
    }
  };

  useEffect(() => {
    const addImage = () => {
      if (file) {
        setListFileUp([...listFileUp, file]);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            if (Array.isArray(productEdit?.img)) {
              setProductEdit({
                ...productEdit,
                img: [...(productEdit?.img as []), reader.result],
              });
            } else if (typeof productEdit?.img === "string") {
              setProductEdit({
                ...productEdit,
                img: [productEdit?.img, reader.result],
              });
            }
          }
        };
      }
    };
    addImage();
    setErrorImg(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const showListImg = () => {
    if (productEdit) {
      if (Array.isArray(productEdit?.img) && productEdit?.img.length > 0) {
        return (
          <div className={style.listImage}>
            {productEdit?.img.map((imgItem, index) => (
              <div key={index} className={style.imageSide}>
                <Text
                  onMouseDown={() => {
                    removeImage(index);
                  }}
                  className={style.buttonRemoveImage}
                >
                  X
                </Text>

                <Image src={imgItem} alt="" width={100} height={100} />
              </div>
            ))}
            <div className={style.buttonAddImageSide}>
              <FileButton onChange={setFile} accept="image/png,image/jpeg">
                {props => (
                  <Button className={style.buttonAddImage} {...props}>
                    +
                  </Button>
                )}
              </FileButton>
            </div>
          </div>
        );
      } else {
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
      }
    }
  };

  return (
    <div>
      <Modal
        opened={opened}
        onClose={() => {
          onClose();
        }}
        title={title}
        transitionProps={{ transition: "fade", duration: 500 }}
      >
        <FormProduct
          type={type}
          productEdit={productEdit}
          onClose={onClose}
          refetch={refetch}
          setErrorImg={setErrorImg}
          setProductEdit={setProductEdit}
          showListImg={showListImg}
          listFileUp={listFileUp}
          setListFileUp={setListFileUp}
        />
      </Modal>
    </div>
  );
}
