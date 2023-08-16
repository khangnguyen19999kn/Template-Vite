import { Button, TextInput } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useQuery } from "react-query";

import { IDataTable } from "@/@types/product";
import { PRODUCT_SEARCH_API } from "@/constant/API/API";
import { TProduct } from "@/constant/Types/product";
import TableComponent from "@/modules/ListProducts/TableProduct/TableComponent";

import ModalCreateEdit from "./ModalCreateEdit/ModalCreateEdit";
import style from "./StyleListProducts.module.scss";

export default function ListProduct() {
  const [searchText, setSearchText] = useState("");
  const [debounced] = useDebouncedValue(searchText, 500);
  const [isOpened, { open, close }] = useDisclosure(false);
  const { data: dataSearch, refetch } = useQuery<TProduct[]>(["searchedProducts", debounced], () =>
    fetch(PRODUCT_SEARCH_API + debounced).then(res => res.json())
  );
  console.log(dataSearch);
  const formatData = (dataFormat: TProduct[]) => {
    const formattedData: IDataTable[] = dataFormat
      ? dataFormat.map((product: TProduct) => ({
          id: product.id,
          name: product.name,
          type: product.type,
          brand: product.brand,
          concentration: product.concentration,
          priceFor10ml: product.priceFor10ml,
          priceForFull: product.priceForFull,
          img: product.img,
          quantitySold: product.quantitySold,
          introduce: product.introduce,
        }))
      : [];
    return formattedData;
  };

  return (
    <div>
      <ModalCreateEdit
        opened={isOpened}
        onClose={close}
        title="Create Product"
        type="create"
        refetch={refetch}
      />
      <div className={style.searchInputSide}>
        <TextInput
          value={searchText}
          onChange={event => setSearchText(event.currentTarget.value)}
          className={style.searchInput}
          placeholder="Nhập sản phẩm bạn muốn tìm"
        />
        <Button
          onClick={() => {
            open();
          }}
        >
          Thêm sản phẩm
        </Button>
      </div>
      <div className={style.listProductsContainer}>
        <TableComponent data={formatData(dataSearch || [])} refetch={refetch} />
      </div>
    </div>
  );
}
