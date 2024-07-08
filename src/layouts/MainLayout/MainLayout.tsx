import { Header } from "@/components/common/Header";
import { Sidebar } from "@/components/common/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex text-white">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Header />
        <div className="bg-primary-midnight min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
