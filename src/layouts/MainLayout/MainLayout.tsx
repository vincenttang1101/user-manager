import { Header } from "@/components/common/Header";
import { MainContent } from "@/components/common/MainContent";
import { Sidebar } from "@/components/common/Sidebar";

export default function MainLayout() {
  return (
    <div className="flex text-white min-h-screen h-full">
      <Sidebar className="flex-grow" />
      <div className="flex flex-col flex-grow">
        <Header />
        <MainContent />
      </div>
    </div>
  );
}
