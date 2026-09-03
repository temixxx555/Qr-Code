import Navbar from "@/components/HomePage/NavBar";


export default function AuthLayout({ children }) {
  return (
    <main className="min-h-screen bg-white">
        <Navbar />
      {children}
    </main>
  );
}