"use client";

import { Tag,Home,LogOut, Users} from "lucide-react"

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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { usePathname } from "next/navigation";
import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {useAuthStore} from "@/lib/stores/useAuthStore";
import {useRouter} from "next/navigation"

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
  {
    title: "Users",
    url: "/users",
    icon: Users,
  }
]



export function AppSidebar() {
  const pathname = usePathname();
  const [showLogoutDialog,setShowLogoutDialog]=useState(false);
  const {isAuthenticated ,hydrated ,logout}=useAuthStore();
  const router = useRouter();

  if (!hydrated) {
    return null; // Or a loading skeleton
  }

  const handleLogout = () => {
    logout();
    console.log("User logged out");
    router.push('/home')
  };
  return (
      <>
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
              {isAuthenticated &&(<SidebarMenuItem>
                <SidebarMenuButton className='cursor-pointer' onClick={() => setShowLogoutDialog(true)}>
                  <LogOut/>
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[425px] bg-backgroundSecondary border-borderColor">
          <DialogHeader>
            <DialogTitle >Are you sure you want to logout</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className='border-borderColor text-buttons'>Cancel</Button>
            </DialogClose>
            <Button
                type="submit"
                className='border-buttons text-buttons'
                onClick={handleLogout}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
  )
}
