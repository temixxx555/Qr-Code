import AdminDashboard from "@/components/Billing/AdminDashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
export default function Page() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
