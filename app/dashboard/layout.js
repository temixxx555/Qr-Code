import Sidebar from "@/components/Dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Sidebar />

      <main className="ml-[270px] min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}