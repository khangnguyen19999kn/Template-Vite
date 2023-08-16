import { Button, Group, Modal, Radio, Select, TextInput } from "@mantine/core";
import { useForm, isEmail, hasLength } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { RefetchOptions, RefetchQueryFilters, QueryObserverResult } from "react-query";

import { ORDER_API } from "@/constant/API/API";
import listCity from "@/constant/JSON/cities.json";
import listDistrict from "@/constant/JSON/districts.json";
import listWards from "@/constant/JSON/wards.json";
import { TOrder } from "@/constant/Types/order";

import style from "./ModalEditOrderStyle.module.scss";
interface IProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
  id: string;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<TOrder[], unknown>>;
}

export default function ModalEditOrder({ opened, onClose, title, id, refetch }: IProps) {
  const [dataOder, setDataOrder] = useState<TOrder>();
  const [cityCode, setCityCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [wardCode, setWardCode] = useState("");
  const form = useForm({
    initialValues: {
      customerName: "",
      email: "",
      phone: "",
      deliveryWay: "home",
      city: {},
      district: {},
      ward: {},
      address: "",
      totalPrice: "",
    },

    validate: {
      email: isEmail("Email address is not valid"),
      customerName: hasLength(
        { min: 2, max: 40 },
        " Name must be between 2 and 40 characters long"
      ),
      phone: value =>
        /^0\d{9}$/g.test(value) ? null : "Phone number must be 10 digits and start with 0",
      address: hasLength({ min: 2, max: 40 }, " Address must be between 2 and 40 characters long"),
    },
  });
  const dataCitySelect = listCity.map(city => ({
    value: city.code,
    label: city.name,
  }));
  const changeCityCode = (value: string) => {
    setDistrictCode("");
    setWardCode("");
    const citySelect = listCity.find(city => city.code === value);
    if (citySelect) {
      setCityCode(citySelect.code);
      form.setFieldValue("city", {
        name: citySelect.name,
        code: citySelect.code,
      });
      form.setFieldValue("district", {});
      form.setFieldValue("ward", {});
    }
  };
  const dataDistrictSelect = listDistrict
    .filter(city => city.parent_code === cityCode)
    .map(district => ({
      value: district.code,
      label: district.name,
    }));
  const changeDistrictCode = (value: string) => {
    setWardCode("");
    const districtSelect = listDistrict.find(district => district.code === value);
    if (districtSelect) {
      setDistrictCode(districtSelect.code);
      form.setFieldValue("district", {
        name: districtSelect.name,
        code: districtSelect.code,
      });
      form.setFieldValue("ward", {});
    }
  };
  const dataWardSelect = listWards
    .filter(ward => ward.parent_code === districtCode)
    .map(ward => ({
      value: ward.code,
      label: ward.name,
    }));
  const changeWardCode = (value: string) => {
    setWardCode(value);
    const wardSelect = listWards.find(ward => ward.code === value);
    if (wardSelect) {
      form.setFieldValue("ward", {
        name: wardSelect.name,
        code: wardSelect.code,
      });
    }
  };
  useEffect(() => {
    if (id) {
      axios
        .get<TOrder>(`${ORDER_API}/${id}`)
        .then(res => {
          const data: TOrder = res.data;
          setDataOrder(data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [id]);
  useEffect(() => {
    if (dataOder) {
      form.setValues({ ...dataOder });
      changeCityCode(dataOder.city.code);
      changeDistrictCode(dataOder.district.code);
      changeWardCode(dataOder.ward.code);
    }
  }, [dataOder]);
  const submitForm = () => {
    axios
      .put(`${ORDER_API}/${id}`, {
        ...form.values,
      })
      .then(async () => {
        notifications.show({
          title: "Edit order success",
          message: "You have successfully edited the order",
          color: "green",
          autoClose: 5000,
          icon: <IconCheck />,
        });
        await refetch();
        onClose();
      })
      .catch(err => {
        console.log(err);
      });
  };
  return (
    <div>
      <Modal
        opened={opened}
        onClose={() => {
          onClose();
        }}
        title={title}
        transitionProps={{ transition: "fade", duration: 600, timingFunction: "linear" }}
      >
        <form
          onSubmit={form.onSubmit(() => {
            submitForm();
          })}
        >
          <div>
            <div>
              <TextInput
                placeholder="Your name"
                label="Full name"
                withAsterisk
                {...form.getInputProps("customerName")}
                className={style.inputFormEle}
              />

              <TextInput
                placeholder="Your Phone Number"
                label="Phone Number"
                withAsterisk
                {...form.getInputProps("phone")}
                className={style.inputFormEle}
              />
            </div>
            <TextInput
              placeholder="Your Email"
              label="Email"
              withAsterisk
              {...form.getInputProps("email")}
              className={style.inputFormEle}
            />
          </div>
          <div>
            <Radio.Group
              label="Chọn phương thức giao hàng"
              defaultValue="home"
              value={form.values.deliveryWay}
              withAsterisk
              onChange={value => form.setFieldValue("deliveryWay", value)}
              className={style.inputFormEle}
            >
              <Group mt="xs">
                <Radio value="home" label="Giao hàng tại nhà" />
                <Radio value="company" label="Giao hàng tại công ty" />
              </Group>
            </Radio.Group>
            <div>
              <Select
                label="City"
                placeholder="Chọn Tỉnh thành phố"
                searchable
                value={cityCode}
                onChange={changeCityCode}
                data={dataCitySelect}
                withAsterisk
                required
                className={style.inputFormEle}
              />

              <Select
                label="District"
                placeholder="Chọn quận huyện"
                searchable
                value={districtCode}
                data={dataDistrictSelect}
                onChange={changeDistrictCode}
                disabled={cityCode === ""}
                required
                withAsterisk
                className={style.inputFormEle}
              />
            </div>
            <div>
              <Select
                label="Ward"
                placeholder="Chọn phường xã"
                searchable
                value={wardCode}
                data={dataWardSelect}
                onChange={changeWardCode}
                disabled={districtCode === ""}
                withAsterisk
                required
                className={style.inputFormEle}
              />

              <TextInput
                placeholder="Đường số, tên đường"
                label="Address"
                withAsterisk
                disabled={wardCode === ""}
                {...form.getInputProps("address")}
                className={style.inputFormEle}
              />
            </div>
          </div>
          <div className={style.buttonSave}>
            <Button type="submit">Xác nhận</Button>
            <Button onClick={onClose} color="gray" style={{ marginLeft: "5px" }}>
              Hủy
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
