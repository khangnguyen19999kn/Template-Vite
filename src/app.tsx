import { Notifications } from "@mantine/notifications";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import LayoutContainer from "./elements/layoutContainer/LayoutContainer";
import Blogs from "./modules/Blogs/Blogs";
import ListOrder from "./modules/ListOrders/ListOrder";
import ListProduct from "./modules/ListProducts/ListProduct";
import Login from "./modules/Login/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Notifications position="top-right" />
      <Routes>
        <Route element={<Login />}>
          <Route path="/" />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route
            path="products"
            element={
              <LayoutContainer>
                <ListProduct />
              </LayoutContainer>
            }
          />
          <Route
            path="/orders"
            element={
              <LayoutContainer>
                <ListOrder />
              </LayoutContainer>
            }
          />
          <Route
            path="/blogs"
            element={
              <LayoutContainer>
                <Blogs />
              </LayoutContainer>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
