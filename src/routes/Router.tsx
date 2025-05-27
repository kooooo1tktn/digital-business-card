import { Route, Routes } from "react-router-dom";
import { Cards } from "../pages/Cards";
import { UserDetail } from "../pages/UserDetail";
import { Register } from "../pages/Register";

export const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Cards />} />
        <Route path="/cards/:id" element={<UserDetail />} />
        <Route path="/cards/register" element={<Register />} />
      </Routes>
    </>
  );
};
