import { useSidebar } from "@/contexts/SidebarContext";
import { RiMenuFoldFill, RiMenuUnfoldFill } from "react-icons/ri";

export default function Header() {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <div className="bg-primary-twilight px-5">
      <div className="py-2 flex items-center gap-4">
        {isOpen ? (
          <RiMenuFoldFill
            className="cursor-pointer"
            size={25}
            onClick={toggleSidebar}
          />
        ) : (
          <RiMenuUnfoldFill
            className="cursor-pointer"
            size={25}
            onClick={toggleSidebar}
          />
        )}
        <h1 className="text-2xl font-bold text-white">HRDept Company</h1>
      </div>
    </div>
  );
}
