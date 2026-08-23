"use client"

import * as React from "react"
import Link from "next/link"
import { Bell, Menu, Search as SearchIcon, User, Settings, CreditCard, LogOut, Check } from "lucide-react"
import { useLayout } from "./layout-context"
import { ThemeToggle } from "../theme/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth/auth-context"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  unread: boolean
}

const dummyNotifications: Notification[] = [
  {
    id: "1",
    title: "Campaign Completed",
    description: "Your campaign 'June Newsletter' has finished sending to 1,248 contacts.",
    time: "5m ago",
    unread: true,
  },
  {
    id: "2",
    title: "Template Approved",
    description: "Template 'Welcome_User_v2' has been approved by Meta.",
    time: "2h ago",
    unread: true,
  },
  {
    id: "3",
    title: "Payment Successful",
    description: "Your monthly plan has been renewed successfully.",
    time: "1d ago",
    unread: false,
  }
]

export function Navbar() {
  const { toggleMobile } = useLayout()
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = React.useState<Notification[]>(dummyNotifications)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : "Authenticated User"
  const initials = user
    ? ((user.firstName?.[0] || "") + (user.lastName?.[0] || "")).toUpperCase() || user.email.slice(0, 2).toUpperCase()
    : "AU"

  // Listen for Cmd+K / Ctrl+K to focus search input
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const unreadCount = notifications.filter(n => n.unread).length

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 backdrop-blur-md px-4 md:px-6">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Hamburger menu toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleMobile}
          className="md:hidden h-9 w-9 text-muted-foreground hover:bg-muted dark:hover:bg-accent rounded-lg border border-border"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Global Search Input */}
        <div className="relative w-full max-w-xs md:max-w-sm hidden sm:block">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search... (⌘K)"
            className="w-full pl-9 pr-4 h-9 bg-muted/30 hover:bg-muted/50 focus:bg-background border-border rounded-lg text-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Trigger */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="sm:hidden h-8 w-8 text-muted-foreground"
          aria-label="Search"
        >
          <SearchIcon className="h-5 w-5" />
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications Popover Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="relative h-8 w-8 text-muted-foreground hover:bg-muted dark:hover:bg-accent rounded-lg"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 md:w-96 mt-2" align="end">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <span className="font-semibold text-sm">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium hover:underline flex items-center gap-1"
                >
                  <Check className="h-3.5 w-3.5" /> Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-border">
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                  No new notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex flex-col gap-1 p-4 text-left transition-colors duration-150 ${
                      notification.unread
                        ? "bg-muted/30 dark:bg-muted/10 font-medium"
                        : "hover:bg-muted/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-foreground">{notification.title}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0">{notification.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 font-normal">
                      {notification.description}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="p-2 border-t border-border/80 text-center bg-muted/20">
              <Link
                href="/notifications"
                className="text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-bold hover:underline"
              >
                View all notifications
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full border border-border overflow-hidden p-0 cursor-pointer"
              aria-label="User account"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={fullName} />
                <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-semibold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none text-foreground">{fullName}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/billing" className="cursor-pointer flex items-center">
                  <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Billing & Subscription</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer flex items-center">
                  <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Account Settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-red-600 dark:text-red-400 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/20 dark:focus:text-red-400 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
