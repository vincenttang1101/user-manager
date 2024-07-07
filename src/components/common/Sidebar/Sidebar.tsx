import { Link } from "react-router-dom";

import { cn } from "@/libs/utils";

type SidebarProps = {
  isOpen?: boolean;
  openWidth?: string;
  closedWidth?: string;
  className?: string;
};

export default function Sidebar({
  isOpen = true,
  openWidth = "250px",
  closedWidth = "70px",
  className,
}: SidebarProps) {
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
            "px-0": !isOpen,
          }
        )}
      >
        <Link to="/" className="flex items-center justify-center">
          <img
            src="./icons/logo.png"
            alt="Logo"
            className="w-24 aspect-square object-cover"
          />
        </Link>
      </div>

      <nav>
        <ul className="flex flex-col">
          <li
            className={cn(
              "flex items-center gap-[24px] bg-[#04437B] p-[12px] text-[16px]"
            )}
          >
            <img src="/icons/account.svg" alt="Account" className="w-5 h-5" />
            {isOpen && <h2>User Manager</h2>}
          </li>
        </ul>
      </nav>
    </aside>
  );
}
