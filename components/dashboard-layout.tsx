"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Mail } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="inset" collapsible="icon" className="border-r">
        <SidebarHeader>
          <div className="flex items-center justify-center p-2">
            <h2 className="text-lg font-semibold">Network Dashboard</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="font-medium"
                isActive={pathname === "/"}
              >
                <Link href="/">
                  <LayoutDashboard
                    className={
                      pathname === "/"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }
                  />
                  <span>Overview</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="font-medium"
                isActive={pathname === "/requests"}
              >
                <Link href="/requests">
                  <Mail
                    className={
                      pathname === "/requests"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }
                  />
                  <span>Requests</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="w-full p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
