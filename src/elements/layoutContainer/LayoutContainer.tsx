import { ReactNode } from "react";

import Footer from "@/modules/Footer/Footer";
import Header from "@/modules/Header/Header";

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
        <Header />
      </div>
      <section className={style.layoutContainer}>
        <div className={style.content}>{children}</div>
      </section>
      <Footer />
    </div>
  );
};

export default LayoutContainer;
