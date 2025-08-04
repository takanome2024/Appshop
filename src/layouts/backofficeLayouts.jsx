import { Outlet } from "react-router";
import { AdminProductProvider } from "../components/adminProduct";

export default function BackofficeLayouts(){
  return(
    <AdminProductProvider>
      <>
      <Outlet />
      </>
    </AdminProductProvider>
  )
}