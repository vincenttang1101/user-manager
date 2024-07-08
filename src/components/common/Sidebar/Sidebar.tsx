import { Link } from "react-router-dom";

import { cn } from "@/libs/utils";
import { useSidebar } from "@/contexts/SidebarContext";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useEffect } from "react";

type SidebarProps = {
  openWidth?: string;
  closedWidth?: string;
  className?: string;
};

export default function Sidebar({
  openWidth = "250px",
  closedWidth = "70px",
  className,
}: SidebarProps) {
  const { isOpen, toggleSidebar } = useSidebar();

  const { width } = useWindowSize();

  useEffect(() => {
    if (width <= 768 && isOpen) {
      toggleSidebar();
    } else if (width > 768 && !isOpen) {
      toggleSidebar();
    }
  }, [width, isOpen, toggleSidebar]);

  return (
    <aside
      className={cn(
        "min-h-screen bg-primary-twilight transition-all duration-200",
        className
      )}
      style={{
        width: isOpen ? openWidth : closedWidth,
      }}
    >
      <div
        className={cn(
          "px-[39px] pb-[90px] pt-[20px] text-center text-[36px] font-medium",
          {
            "px-4 pt-[10px] pb-[50px]": !isOpen,
          }
        )}
      >
        <Link to="/" className="flex items-center justify-center">
          <img
            src="./icons/logo.png"
            alt="Logo"
            className={cn("w-24 aspect-square object-cover", {
              "w-12": !isOpen,
            })}
          />
        </Link>
      </div>

      <nav>
        <ul className="flex flex-col">
          <li>
            <Link
              to="/"
              className={cn(
                "flex items-center gap-[24px] bg-[#04437B] p-[12px] text-[16px]"
              )}
            >
              <img src="/icons/account.svg" alt="Account" className="w-5 h-5" />
              {isOpen && <h2>User Manager</h2>}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
