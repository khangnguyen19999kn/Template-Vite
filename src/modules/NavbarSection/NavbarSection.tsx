import { Text, Image, Button } from "@mantine/core";
import { IconBuildingStore, IconClipboardList, IconLogout } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Logo from "@/assets/images/imgGlobal/LogoVer2.png";

import style from "./NavbarSectionStyle.module.scss";

const listTagNav = [
  {
    id: 1,
    name: "Danh sách sản phẩm",
    icon: <IconBuildingStore />,
    link: "/products",
  },
  {
    id: 2,
    name: "Danh sách đơn hàng",
    icon: <IconClipboardList />,
    link: "/orders",
  },
  {
    id: 3,
    name: "Danh sách bài viết",
    icon: <IconClipboardList />,
    link: "/blogs",
  },
];
export default function NavbarSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  useEffect(() => {
    const id = listTagNav.find(item => item.link === currentPath)?.id;
    if (id !== undefined) {
      setActive(id);
    }
  }, [currentPath]);

  const [active, setActive] = useState(1);
  const logout = () => {
    navigate("/");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };
  const checkActive = (id: number) => {
    if (id === active) {
      return style.navItemActive;
    }
    return "";
  };
  const showListTagNav = listTagNav.map(item => {
    return (
      <Link
        to={item.link}
        className={`${style.titleNav} ${checkActive(item.id)}`}
        key={item.id}
        onClick={() => setActive(item.id)}
      >
        <div className={style.wrapper_item_nav}>
          {item.icon}
          <Text className={style.textTitleNav}>{item.name}</Text>
        </div>
      </Link>
    );
  });

  return (
    <div className={style.container}>
      <div className={style.wrapper_Container}>
        <div className={style.logoSide}>
          <Image src={Logo} alt="logo" />
        </div>
        <div className={style.listItemNav}>{showListTagNav}</div>

        <Button
          onClick={() => {
            logout();
          }}
          className={style.container_logout}
        >
          <IconLogout /> Logout
        </Button>
      </div>
    </div>
  );
}
