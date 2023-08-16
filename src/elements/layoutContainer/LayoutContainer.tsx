import { ReactNode } from "react";

import FooterSection from "@/modules/FooterSection/FooterSection";
import NavbarSection from "@/modules/NavbarSection/NavbarSection";

import style from "./LayoutContainerStyle.module.scss";
const LayoutContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <div
        style={{
          width: "10%",
        }}
      >
        <NavbarSection />
      </div>
      <section className={style.layoutContainer}>
        <div className={style.content}>{children}</div>
        <FooterSection />
      </section>
    </div>
  );
};

export default LayoutContainer;
