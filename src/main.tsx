import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Routes from "@/routes";
import { SidebarProvider } from "@/contexts/SidebarContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SidebarProvider>
      <Routes />
    </SidebarProvider>
  </React.StrictMode>
);
