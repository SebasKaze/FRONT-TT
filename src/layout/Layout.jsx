import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Layout() {
  return (
    <>
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="pt-24 px-10 min-h-screen p-3 bg-[#fffaf7]">
          <Outlet />
        </main>
      </div>
    </>
  );
}