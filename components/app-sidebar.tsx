"use client";

import { Tag,Home, MessageCircle, Users} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
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
    url: "/home",
    icon: Home,
  },
  {
    title: "Tags",
    url: "/tags",
    icon: Tag,
  },
  // {
  //   title: "Posts",
  //   url: "/discussions",
  //   icon: Newspaper,
  // },
  {
    title: "Chats",
    url: "/chats",
    icon: MessageCircle,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings,
  // },
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
