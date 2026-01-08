import { Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}