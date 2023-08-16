import { TextInput, Select, NumberInput, Button, Text, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import axios from "axios";
import { useEffect } from "react";
import { RefetchOptions, RefetchQueryFilters, QueryObserverResult } from "react-query";

import { IBrand, IDataTable } from "@/@types/product";
import { BRAND_API, BRAND_SEARCH_BY_NAME_API, PRODUCT_API } from "@/constant/API/API";
import { TProduct } from "@/constant/Types/product";
import { baseformProduct } from "@/constant/variable/baseform";

import style from "./FormProductStyle.module.scss";
interface IFormProductProps {
  type: "create" | "edit";
  productEdit: IDataTable | undefined;
  onClose: () => void;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TProduct[], unknown>>;
  setErrorImg: React.Dispatch<React.SetStateAction<boolean>>;
  setProductEdit: React.Dispatch<React.SetStateAction<IDataTable | undefined>>;
  showListImg: () => JSX.Element | undefined;
  listFileUp: File[];
  setListFileUp: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function FormProduct({
  type,
  productEdit,
  onClose,
  refetch,
  setProductEdit,
  setErrorImg,
  showListImg,
  listFileUp,
  setListFileUp,
}: IFormProductProps) {
  const checkValueSelect = (value: string | number | string[] | undefined) => {
    if (typeof value === "string" && value !== null) {
      return value;
    }
    return "";
  };
  const checkValueNumber = (value: string | number | string[] | undefined) => {
    if (typeof value === "number" && value !== null) {
      return value;
    }
    return 0;
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    keyInput: string
  ) => {
    setProductEdit({
      ...productEdit,
      [keyInput]: e.target.value,
    });
  };
  const onChangeSelect = (value: string | null, keyInput: string) => {
    if (value) {
      setProductEdit({
        ...productEdit,
        [keyInput]: value,
      });
    }
  };
  const onChangeNumber = (value: number | "", keyInput: string) => {
    if (value) {
      setProductEdit({
        ...productEdit,
        [keyInput]: value,
      });
    }
  };
  const form = useForm({
    initialValues: {
      ...productEdit,
    },
    validate: {
      name: value => {
        if (!value) {
          return "Name is required";
        }
        return false;
      },
      type: value => {
        if (!value) {
          return "Type is required";
        }
        return false;
      },
      brand: value => {
        if (!value) {
          return "Brand is required";
        }
        return false;
      },
      concentration: value => {
        if (!value) {
          return "Concentration is required";
        }
        return false;
      },
      priceFor10ml: value => {
        if (!value) {
          return "Price for 10ml is required";
        }
        return false;
      },
      priceForFull: value => {
        if (!value) {
          return "Price for full is required";
        }
        return false;
      },
      quantitySold: value => {
        if (!value) {
          return "Quantity sold is required";
        }
        return false;
      },
      introduce: value => {
        if (!value) {
          return "Introduce is required";
        }
        return false;
      },
    },
  });
  useEffect(() => {
    form.setValues({
      ...productEdit,
    });
  }, [productEdit]);
  const checkBrandHasExist = async (brand: string) => {
    await axios
      .get<IBrand[]>(BRAND_SEARCH_BY_NAME_API + brand)
      .then(async res => {
        if (res.data.length === 0) {
          await axios.post(BRAND_API, { name: brand });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.validate();
    const id = productEdit?.id.toString();
    if (Array.isArray(form.values.img) && form.values.img.length > 0) {
      const data = new FormData();
      const fieldToAppend = [
        "name",
        "type",
        "brand",
        "concentration",
        "priceFor10ml",
        "priceForFull",
        "quantitySold",
        "introduce",
      ];
      fieldToAppend.forEach(field => {
        data.append(field, form.values[field].toString());
      });
      const imgAfter = form.values["img"].slice(0, form.values["img"].length - listFileUp.length);
      data.append("imgAfter", imgAfter.toString());
      listFileUp.forEach(file => {
        data.append("img", file);
      });
      console.log(listFileUp.length);
      if (type === "create") {
        await checkBrandHasExist(data.get("brand") as string);
        axios
          .post(PRODUCT_API, data)
          .then(async () => {
            setProductEdit(baseformProduct);
            onClose();
            setListFileUp([]);
            notifications.show({
              title: "Create new product successfully",
              message: "You have create product successfully",
              color: "green",
              icon: <IconCheck size="1rem" />,
            });
            await refetch();
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        if (id) {
          await checkBrandHasExist(data.get("brand") as string);

          axios
            .put(PRODUCT_API + id, data)
            .then(async () => {
              onClose();
              notifications.show({
                title: "Update product successfully",
                message: "You have update product successfully",
                color: "green",
                icon: <IconCheck size="1rem" />,
              });
              setListFileUp([]);
              await refetch();
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    } else {
      setErrorImg(true);
    }
  };
  return (
    <form onSubmit={submitForm} encType="multipart/form-data">
      {type === "edit" ? <TextInput label="ID" value={productEdit?.id} disabled /> : ""}
      <TextInput
        label="Name"
        {...form.getInputProps("name")}
        value={productEdit?.name}
        onChange={e => onChange(e, "name")}
        placeholder="Enter name product"
      />
      <Select
        data={[
          { value: "men", label: "Men" },
          { value: "women", label: "Women" },
          { value: "unisex", label: "Unisex" },
        ]}
        {...form.getInputProps("type")}
        placeholder="Select type product"
        label="Type"
        value={checkValueSelect(productEdit?.type)}
        onChange={value => onChangeSelect(value, "type")}
      />
      <TextInput
        label="Brand"
        {...form.getInputProps("brand")}
        value={productEdit?.brand}
        onChange={e => onChange(e, "brand")}
        placeholder="Enter brand product"
      />
      <Textarea
        label="Introduce"
        {...form.getInputProps("introduce")}
        value={productEdit?.introduce}
        onChange={e => onChange(e, "introduce")}
        placeholder="Enter introduce product"
      />
      <Select
        data={[
          { value: "EDT", label: "EDT" },
          { value: "EDP", label: "EDP" },
          { value: "Extrait", label: "Extrait" },
        ]}
        {...form.getInputProps("concentration")}
        placeholder="Select concentration product"
        label="Concentration"
        value={checkValueSelect(productEdit?.concentration)}
        onChange={value => onChangeSelect(value, "concentration")}
      />
      <NumberInput
        hideControls
        {...form.getInputProps("priceFor10ml")}
        placeholder="Enter price for 10ml of product"
        type="number"
        label="Price for 10ml"
        value={checkValueNumber(productEdit?.priceFor10ml)}
        onChange={value => onChangeNumber(value, "priceFor10ml")}
      />
      <NumberInput
        hideControls
        {...form.getInputProps("priceForFull")}
        placeholder="Enter price for size full of product"
        type="number"
        label="Price for full"
        value={checkValueNumber(productEdit?.priceForFull)}
        onChange={value => onChangeNumber(value, "priceForFull")}
      />
      <div className={style.wrapperImageList}>
        <Text fw={500}>Image</Text>
        {showListImg()}
      </div>
      <NumberInput
        type="number"
        {...form.getInputProps("quantitySold")}
        label="Quantity sold"
        placeholder="Enter quantity sold of product"
        value={checkValueNumber(productEdit?.quantitySold)}
        onChange={value => onChangeNumber(value, "quantitySold")}
        hideControls
      />

      <div className={style.buttonSide}>
        <Button className={style.buttonSave} type="submit">
          Save
        </Button>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
