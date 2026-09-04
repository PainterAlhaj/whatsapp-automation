import { 
  LayoutDashboard, 
  Users, 
  Send, 
  FileText, 
  GitBranch, 
  BarChart3, 
  CreditCard, 
  Settings,
  Plug,
  History,
  MessageSquare,
  HelpCircle
} from "lucide-react"
import * as React from "react"

export interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  badgeVariant?: "default" | "success" | "warning" | "destructive" | "secondary"
}

export interface NavSection {
  title?: string
  items: NavItem[]
}

export const navigationData: NavSection[] = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
      { name: "Activity Logs", href: "/activity-logs", icon: History },
    ]
  },
  {
    title: "Engagement",
    items: [
      { name: "Live Chat", href: "/chat", icon: MessageSquare, badge: "Live", badgeVariant: "success" },
      { name: "Contacts", href: "/contacts", icon: Users, badge: "1,248" },
      { name: "Campaigns", href: "/campaigns", icon: Send, badge: "3 active", badgeVariant: "success" },
      { name: "Templates", href: "/templates", icon: FileText },
      { name: "Automations", href: "/automations", icon: GitBranch, badge: "New" },
    ]
  },
  {
    title: "Management",
    items: [
      { name: "Billing", href: "/billing", icon: CreditCard },
      { name: "Integrations", href: "/integrations", icon: Plug },
      { name: "Settings", href: "/settings", icon: Settings },
      { name: "How It Works", href: "/how-it-works", icon: HelpCircle, badge: "Guide", badgeVariant: "secondary" },
    ]
  }
]
