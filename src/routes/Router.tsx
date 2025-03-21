import { Route, Routes } from "react-router-dom";
import { Cards } from "../cards";
import { Id } from "../id";

export const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Cards />} />
        <Route path="/cards/:id" element={<Id />} />
      </Routes>
    </>
  );
};
