"use client"

import type * as React from "react"
import {
  AudioWaveform,
  Command,
  Frame,
  GalleryVerticalEnd,
  SquareTerminal,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  CreditCard,
  Database,
  Globe,
  Layers,
} from "lucide-react"

import { NavMain } from "@/components/app/nav-main"
import { NavProjects } from "@/components/app/nav-projects"
import { NavUser } from "@/components/app/nav-user"
import { TeamSwitcher } from "@/components/app/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

// This is sample data for the ERP system
const data = {
  user: {
    name: "Admin User",
    email: "admin@company.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "Company ERP",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Branch Office",
      logo: AudioWaveform,
      plan: "Pro",
    },
    {
      name: "Warehouse",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: "Overview",
          url: "/dashboard/overview",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        {
          title: "Reports",
          url: "/dashboard/reports",
        },
      ],
    },
    {
      title: "Sales & CRM",
      url: "/sales",
      icon: ShoppingCart,
      items: [
        {
          title: "Customers",
          url: "/sales/customers",
        },
        {
          title: "Orders",
          url: "/sales/orders",
        },
        {
          title: "Invoices",
          url: "/sales/invoices",
        },
        {
          title: "Quotes",
          url: "/sales/quotes",
        },
      ],
    },
    {
      title: "Inventory",
      url: "/inventory",
      icon: Package,
      items: [
        {
          title: "Products",
          url: "/inventory/products",
        },
        {
          title: "Stock Management",
          url: "/inventory/stock",
        },
        {
          title: "Suppliers",
          url: "/inventory/suppliers",
        },
        {
          title: "Purchase Orders",
          url: "/inventory/purchase-orders",
        },
      ],
    },
    {
      title: "Human Resources",
      url: "/hr",
      icon: Users,
      items: [
        {
          title: "Employees",
          url: "/hr/employees",
        },
        {
          title: "Payroll",
          url: "/hr/payroll",
        },
        {
          title: "Attendance",
          url: "/hr/attendance",
        },
        {
          title: "Leave Management",
          url: "/hr/leave",
        },
      ],
    },
    {
      title: "Accounting",
      url: "/accounting",
      icon: CreditCard,
      items: [
        {
          title: "Chart of Accounts",
          url: "/accounting/chart",
        },
        {
          title: "Journal Entries",
          url: "/accounting/journal",
        },
        {
          title: "Financial Reports",
          url: "/accounting/reports",
        },
        {
          title: "Tax Management",
          url: "/accounting/tax",
        },
      ],
    },
    {
      title: "Content Management",
      url: "/cms",
      icon: Layers,
      isActive: true,
      items: [
        {
          title: "Page Builder",
          url: "/cms/builder",
          isActive: true,
        },
        {
          title: "Media Library",
          url: "/cms/media",
        },
        {
          title: "Templates",
          url: "/cms/templates",
        },
        {
          title: "SEO Settings",
          url: "/cms/seo",
        },
      ],
    },
    {
      title: "Reports & Analytics",
      url: "/reports",
      icon: BarChart3,
      items: [
        {
          title: "Sales Reports",
          url: "/reports/sales",
        },
        {
          title: "Financial Reports",
          url: "/reports/financial",
        },
        {
          title: "Inventory Reports",
          url: "/reports/inventory",
        },
        {
          title: "Custom Reports",
          url: "/reports/custom",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Website Redesign",
      url: "/projects/website",
      icon: Globe,
    },
    {
      name: "Mobile App",
      url: "/projects/mobile",
      icon: Frame,
    },
    {
      name: "API Integration",
      url: "/projects/api",
      icon: Database,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
