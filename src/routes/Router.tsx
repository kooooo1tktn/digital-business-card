import { Route, Routes } from "react-router-dom";
import { Cards } from "../cards";
import { Id } from "../id";
import { Register } from "../register";

export const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Cards />} />
        <Route path="/cards/:id" element={<Id />} />
        <Route path="/cards/register" element={<Register />} />
      </Routes>
    </>
  );
};
