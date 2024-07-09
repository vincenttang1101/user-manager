import { Outlet } from "react-router-dom";

export default function MainContent() {
  return (
    <div className="bg-primary-midnight min-h-screen px-5 py-10">
      <Outlet />
    </div>
  );
}
