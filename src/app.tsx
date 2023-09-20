import { BrowserRouter, Routes, Route } from "react-router-dom";

import LayoutContainer from "./elements/layoutContainer/LayoutContainer";
import DashBoardAmin from "./modules/DashBoardAdmin/DashBoardAmin";
import DashBoardStudent from "./modules/DashBoardStudent/DashBoardStudent";
import Login from "./modules/Login/Login";
import PrivateRoute from "./modules/PrivateRoute/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Login />}>
          <Route path="/" />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route
            path="admin"
            element={
              <LayoutContainer>
                <DashBoardAmin />
              </LayoutContainer>
            }
          />
          <Route
            path="/orders"
            element={
              <LayoutContainer>
                <DashBoardStudent />
              </LayoutContainer>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
