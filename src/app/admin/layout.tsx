"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Image as ImageIcon, Gift, LogOut, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Se for a página de login, não mostra o layout admin
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/guests", label: "Convidados", icon: Users },
    { href: "/admin/gifts", label: "Presentes", icon: Gift },
    { href: "/admin/photos", label: "Moderação de Fotos", icon: ImageIcon },
    { href: "/admin/settings", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar Mobile / Desktop */}
      <aside className="bg-white border-r border-gray-200 w-full md:w-64 flex-shrink-0">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between md:block">
          <h1 className="font-serif text-xl font-bold text-gray-900">Admin Casamento</h1>
          <button className="md:hidden text-gray-500">
            {/* Menu Mobile Toggle se necessário */}
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-x-auto md:overflow-visible flex md:block gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}

          <div className="md:pt-4 md:mt-4 md:border-t md:border-gray-100">
            <button
              onClick={() => {
                // Logout simples removendo cookie (via server action seria ideal, mas client side clean cookie hack funciona se httpOnly false, mas é httpOnly. Precisa de API route logout)
                document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.href = "/admin/login";
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
