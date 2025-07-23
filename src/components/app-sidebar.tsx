"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ClipboardList, Home, FileText, Camera, Settings, LogOut, X } from "lucide-react"
import {
  CustomSidebar,
  CustomSidebarContent,
  CustomSidebarFooter,
  CustomSidebarGroup,
  CustomSidebarGroupContent,
  CustomSidebarHeader,
  CustomSidebarMenu,
  CustomSidebarMenuButton,
  CustomSidebarMenuItem,
  useCustomSidebar,
} from "@/components/custom-sidebar"

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Claims",
    url: "/claims",
    icon: FileText,
  },
  {
    title: "Inspections", 
    url: "/inspections",
    icon: Camera,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile, toggleSidebar } = useCustomSidebar()

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(url)
  }

  // Handler for link clicks
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <CustomSidebar>
      <CustomSidebarHeader>
        <div className="flex items-center justify-between gap-2 px-2 py-1 w-full">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg">Claims App</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close sidebar"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </CustomSidebarHeader>
      <CustomSidebarContent>
        <CustomSidebarGroup>
          <CustomSidebarGroupContent>
            <CustomSidebarMenu>
              {items.map((item) => (
                <CustomSidebarMenuItem key={item.title}>
                  <CustomSidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url} onClick={handleLinkClick}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </CustomSidebarMenuButton>
                </CustomSidebarMenuItem>
              ))}
            </CustomSidebarMenu>
          </CustomSidebarGroupContent>
        </CustomSidebarGroup>
      </CustomSidebarContent>
      <CustomSidebarFooter>
        <CustomSidebarMenu>
          <CustomSidebarMenuItem>
            <CustomSidebarMenuButton>
              <LogOut />
              <span>Sign Out</span>
            </CustomSidebarMenuButton>
          </CustomSidebarMenuItem>
        </CustomSidebarMenu>
      </CustomSidebarFooter>
    </CustomSidebar>
  )
}