import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Alex Johnson",
    email: "alex@company.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  navMain: [
    {
      title: "Chat History",
      url: "/chats/history",
      icon: BarChart3,
    },
  ],
};

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("tokenExpiry");
    } catch (e) {
      console.error("[v0] Error clearing credentials", e);
    }
    navigate("/login", { replace: true });
  };

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  const isActive = (url: string) => {
    return location.pathname === url;
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path.startsWith("/agents/create")) return "Create AI Agent";
    if (path.startsWith("/agents/") && path !== "/agents")
      return "Agent Details";
    if (path.startsWith("/agents")) return "AI Agents";
    if (path.startsWith("/analytics")) return "Analytics";
    if (path.startsWith("/users")) return "Users";
    if (path.startsWith("/settings")) return "Settings";
    return "Glick Roofing";
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r border-sidebar-border ">
          <SidebarHeader className="border-b border-sidebar-border ">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <button
                    onClick={() => handleNavigation("/chats")}
                    className="flex items-center gap-2 w-full"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#03a84e] to-[#0a791e] text-white">
                      <img
                        src="/assets/glick-roofing-white-logo.svg"
                        className="size-5"
                        alt="Glick Roofing Logo"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-semibold text-sidebar-foreground">
                        Glick Roofing
                      </span>
                      <span className="text-xs text-sidebar-foreground/80">
                        Chat Management
                      </span>
                    </div>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent className="">
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/60">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {data.navMain.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url)}
                        className={`w-full ${
                          isActive(item.url) ? "bg-[#03a84e] text-white" : ""
                        } hover:bg-[#03a84e] hover:text-white`}
                      >
                        <button
                          onClick={() => handleNavigation(item.url)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-inherit"
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={handleLogout}
                className="bg-[#03a84e] hover:bg-[#028a42] text-white"
                aria-label="Log out"
              >
                <LogOut className="size-4 mr-2" />
                Logout
              </Button>
            </div>
          </header>
          <div className="flex flex-1 flex-col">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
