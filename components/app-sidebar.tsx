"use client";

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import Image from 'next/image';
import Logo from '@/public/icons/stickbug-icon.png';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Tags",
    url: "/tags",
    icon: Inbox,
  },
  {
    title: "Discussions",
    url: "/discussions",
    icon: Calendar,
  },
  {
    title: "Chats",
    url: "/chats",
    icon: Search,
  },
  {
    title: "Users",
    url: "/users",
    icon: Settings,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader/>
      <SidebarContent className="pt-20" >
        <SidebarGroup  >
          <SidebarGroupContent>
            <SidebarMenu >
              {items.map((item) => (
                <SidebarMenuItem  key={item.title}>
                  <SidebarMenuButton asChild active={pathname === item.url || (item.url === '/' && pathname === '/')}>
                    <a href={item.url} className="gap-4">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
