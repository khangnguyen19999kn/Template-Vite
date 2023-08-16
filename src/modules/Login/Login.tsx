import { Button, TextInput, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconCircleXFilled } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ADMIN_API_VERIFY, LOGIN_API } from "@/constant/API/API";

import style from "./LoginStyle.module.scss";
type TAPIVerify = {
  message: string;
  token: string;
};
export default function Login() {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      phoneNumber: "",
      otp: "",
    },
    validate: {
      phoneNumber: value =>
        /^0\d{9}$/g.test(value) ? null : "Phone number must be 10 digits and start with 0",
    },
  });
  const [hasCheckPhoneNumber, setCheckPhoneNumber] = useState(false);

  const submit = () => {
    if (!hasCheckPhoneNumber) {
      axios
        .post(LOGIN_API, {
          phoneNumber: form.values.phoneNumber,
        })
        .then(() => {
          setCheckPhoneNumber(true);
        })
        .catch(() => {
          notifications.show({
            title: "Error",
            message: "Số điện thoại không hợp lệ",
            color: "red",
            autoClose: 5000,
            icon: <IconCircleXFilled />,
          });
        });
    } else {
      axios
        .post<TAPIVerify>(ADMIN_API_VERIFY, {
          ...form.values,
        })
        .then(res => {
          notifications.show({
            title: "Success",
            message: res.data.message,
            color: "green",
            autoClose: 5000,
            icon: <IconCheck />,
          });
          const { token } = res.data;
          document.cookie = `token=${token}`;
          navigate("/products");
        })
        .catch(() => {
          notifications.show({
            title: "Error",
            message: "Mã OTP không hợp lệ",
            color: "red",
            autoClose: 5000,
            icon: <IconCircleXFilled />,
          });
        });
    }
  };

  return (
    <div className={style.containerLogin}>
      <div className={style.containerLogin__form}>
        <form
          className={style.login_form}
          onSubmit={form.onSubmit(() => {
            submit();
          })}
        >
          <div className={style.wrapper_form}>
            <Text className={style.textLogin}>Đăng Nhập</Text>
            <TextInput
              placeholder="Nhập số điện thoại"
              label="Phone Number"
              required
              className={style.inputFormEle}
              {...form.getInputProps("phoneNumber")}
            />
            <TextInput
              placeholder="Nhập mã OTP đã được gửi tới số điện thoại"
              label="OTP"
              required
              className={hasCheckPhoneNumber ? style.inputFormEle : style.inputFormEle__disable}
              {...form.getInputProps("otp")}
              disabled={!hasCheckPhoneNumber}
            />
            <div className={style.buttonLogin}>
              <Button type="submit">{hasCheckPhoneNumber ? "Đăng nhập " : "Tiếp"}</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
