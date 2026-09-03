// "use client";

// import ProtectedRoute from "@/components/auth/ProtectedRoute";
// import { useAuth } from "@/context/AuthContext";


// export default function Dashboard() {
//   const { logout } = useAuth();


// async function handleLogout() {
//   await logout();
// }
//   return (
//     <ProtectedRoute>
//       <main className="min-h-screen bg-white">
//         <h1>Dashboard</h1>
//         <button className="w-32 h-32  " onClick={()=> handleLogout()}>beloo</button>
//       </main>
//     </ProtectedRoute>
//   );
// }


import { redirect } from "next/navigation";

export default function DashboardPage() {
  redirect("/dashboard/qrcodes");
}