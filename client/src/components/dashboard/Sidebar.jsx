import {
  LayoutDashboard,
  BriefcaseBusiness,
  FileText,
  Sparkles,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";


function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      label: "Applications",
      icon: BriefcaseBusiness,
      path: "/applications",
    },
    {
      label: "Resume",
      icon: FileText,
      path: "/resume",
    },
    {
      label: "AI Career",
      icon: Sparkles,
      path: "/ai-career",
    },
    {
      label: "Job Matcher",
      path: "/job-matcher",
      icon: BriefcaseBusiness,
    },

  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-white/10 bg-zinc-950 transition-all duration-300 ${collapsed ? "w-20" : "w-64"
        }`}
    >
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-white/10 px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
            <Sparkles size={18} />
          </div>

          {!collapsed && (
            <div>
              <p className="text-sm font-semibold">CareerAI</p>
              <p className="text-[10px] text-zinc-600">
                Career workspace
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${active
                  ? "bg-white text-black"
                  : "text-zinc-500 hover:bg-white/5 hover:text-white"
                }`}
            >
              <Icon size={18} />

              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="space-y-2 border-t border-white/10 p-4">
        <button
          onClick={() => navigate("/settings")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-500 transition hover:bg-white/5 hover:text-white"
        >
          <Settings size={18} />

          {!collapsed && <span>Settings</span>}
        </button>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} />

          {!collapsed && <span>Logout</span>}
        </button>

        {/* Collapse */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-xl py-2 text-zinc-600 transition hover:bg-white/5 hover:text-white"
        >
          {collapsed ? (
            <ChevronRight size={17} />
          ) : (
            <ChevronLeft size={17} />
          )}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;