import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  UsersRound,
  Settings,
  BarChart3,
  Menu,
  LogOut,
  ClipboardList,
  BookOpen,
} from "lucide-react";
import { cn } from "../lib/utils";

function useNavItems() {
  const { backendUser, isSuperadminTeamMember } = useSelector((state) => state.auth);
  const isAdmin = backendUser?.role === "super_admin" || backendUser?.role === "admin";

  const items = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/deals", icon: Briefcase, label: "Deals" },
    { to: "/contacts", icon: Users, label: "Contacts" },
    { to: "/reports", icon: BarChart3, label: "Reports" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  if (isSuperadminTeamMember) {
    items.push(
      { to: "/admin/users", icon: Users, label: "Users" },
      { to: "/teams", icon: UsersRound, label: "Teams" },
    );
  }

  if (isAdmin) {
    items.push(
      { to: "/admin/audit-logs", icon: ClipboardList, label: "Audit Logs" },
      { to: "http://localhost:5000/api-docs", icon: BookOpen, label: "API Docs", external: true }
    );
  }

  return items;
}

function SidebarNav({ mobile = false, onNavigate }) {
  const location = useLocation();
  const navItems = useNavItems();

  const appItems = navItems.filter(
    (i) => !i.to.startsWith("/admin/audit") && !i.external
  );
  const adminItems = navItems.filter(
    (i) => i.to.startsWith("/admin/audit") || i.external
  );

  return (
    <nav className="flex flex-col gap-1 px-2">
      {appItems.map((item) => (
        <NavItem key={item.to} item={item} onNavigate={onNavigate} />
      ))}
      {adminItems.length > 0 && (
        <>
          <Separator className="my-2" />
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin</p>
          {adminItems.map((item) => (
            <NavItem key={item.to} item={item} onNavigate={onNavigate} />
          ))}
        </>
      )}
    </nav>
  );
}

function NavItem({ item, onNavigate }) {
  const icon = <item.icon className="size-4 shrink-0" />;
  const cls =
    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground";

  if (item.external) {
    return (
      <a
        href={item.to}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className={cls}
      >
        {icon}
        {item.label}
      </a>
    );
  }

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          cls,
          isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
        )
      }
    >
      {icon}
      {item.label}
    </NavLink>
  );
}

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, backendUser } = useSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = useNavItems();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || "U";

  return (
    <>
      {/* Mobile trigger */}
      <div className="fixed top-0 left-0 z-40 flex h-14 w-full items-center gap-2 border-b bg-background px-4 md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-14 items-center gap-2 border-b px-4">
              <div className="flex items-center gap-2 font-semibold">
                <div className="flex size-7 items-center justify-center rounded-md bg-primary">
                  <LayoutDashboard className="size-4 text-primary-foreground" />
                </div>
                <span>CRM</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto py-4">
              <SidebarNav mobile onNavigate={() => setMobileOpen(false)} />
            </div>
            <Separator />
            <div className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user?.name || user?.email}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="mt-3 w-full justify-start text-muted-foreground"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 size-4" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 font-semibold">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary">
            <LayoutDashboard className="size-4 text-primary-foreground" />
          </div>
          <span>CRM</span>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r bg-background md:flex">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary">
              <LayoutDashboard className="size-4 text-primary-foreground" />
            </div>
            <span>CRM Dashboard</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <SidebarNav />
        </div>
        <Separator />
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate flex items-center gap-1">
                {user?.name || user?.email}
                {backendUser?.role && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                    {backendUser.role.replace("_", " ")}
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="mt-3 w-full justify-start text-muted-foreground"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 size-4" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
