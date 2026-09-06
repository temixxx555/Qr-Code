import Sidebar from "@/components/Dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Sidebar />

      <main className="min-h-screen p-5 md:ml-[270px] md:p-8">
        {children}
      </main>
    </div>
  );
}
