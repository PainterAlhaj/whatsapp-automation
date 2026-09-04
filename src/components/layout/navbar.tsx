"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Menu, 
  Search as SearchIcon, 
  User, 
  Settings, 
  CreditCard, 
  LogOut, 
  HelpCircle,
  LayoutDashboard, 
  Users, 
  Send, 
  FileText, 
  GitBranch, 
  BarChart3, 
  Plug, 
  History, 
  MessageSquare,
  PlusCircle,
  ArrowRight,
  X
} from "lucide-react"
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

interface SearchItem {
  id: string
  title: string
  category: "Navigation" | "Actions"
  href: string
  icon: React.ComponentType<{ className?: string }>
  keywords?: string[]
}

const SEARCH_ITEMS: SearchItem[] = [
  { id: "dashboard", title: "Dashboard Overview", category: "Navigation", href: "/dashboard", icon: LayoutDashboard, keywords: ["home", "analytics", "stats", "overview"] },
  { id: "contacts", title: "Contacts & Audience", category: "Navigation", href: "/contacts", icon: Users, keywords: ["customers", "users", "phone", "groups", "tags", "csv"] },
  { id: "campaigns", title: "Campaigns & Broadcasts", category: "Navigation", href: "/campaigns", icon: Send, keywords: ["broadcast", "messages", "outreach", "bulk"] },
  { id: "templates", title: "WhatsApp Templates", category: "Navigation", href: "/templates", icon: FileText, keywords: ["meta", "hsm", "message templates"] },
  { id: "automations", title: "Automations & Workflows", category: "Navigation", href: "/automations", icon: GitBranch, keywords: ["flows", "bot", "auto reply", "drip"] },
  { id: "chat", title: "Live Inbox Chat", category: "Navigation", href: "/chat", icon: MessageSquare, keywords: ["messages", "inbox", "conversation", "reply"] },
  { id: "analytics", title: "Analytics & Reports", category: "Navigation", href: "/analytics", icon: BarChart3, keywords: ["charts", "metrics", "volume", "logs"] },
  { id: "activity-logs", title: "Activity Logs", category: "Navigation", href: "/activity-logs", icon: History, keywords: ["history", "events", "audit", "system"] },
  { id: "integrations", title: "Integrations & API", category: "Navigation", href: "/integrations", icon: Plug, keywords: ["webhooks", "meta api", "shopify", "crm"] },
  { id: "billing", title: "Billing & Subscription", category: "Navigation", href: "/billing", icon: CreditCard, keywords: ["plan", "upgrade", "pricing", "invoice", "payment"] },
  { id: "settings", title: "Account Settings", category: "Navigation", href: "/settings", icon: Settings, keywords: ["profile", "password", "theme", "meta setup"] },
  { id: "how-it-works", title: "How It Works & Setup Guide", category: "Navigation", href: "/how-it-works", icon: HelpCircle, keywords: ["guide", "docs", "help", "tutorial"] },
  
  // Quick Actions
  { id: "action-new-contact", title: "Add New Contact", category: "Actions", href: "/contacts?action=new", icon: PlusCircle, keywords: ["create contact", "add phone", "new customer"] },
  { id: "action-new-campaign", title: "Create Broadcast Campaign", category: "Actions", href: "/campaigns?action=new", icon: PlusCircle, keywords: ["send message", "new campaign", "broadcast"] },
  { id: "action-new-template", title: "Create WhatsApp Template", category: "Actions", href: "/templates?action=new", icon: PlusCircle, keywords: ["new template", "add template"] },
]

export function Navbar() {
  const router = useRouter()
  const { toggleMobile } = useLayout()
  const { user, logout } = useAuth()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const [query, setQuery] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : "Authenticated User"
  const initials = user
    ? ((user.firstName?.[0] || "") + (user.lastName?.[0] || "")).toUpperCase() || user.email.slice(0, 2).toUpperCase()
    : "AU"

  // Filter search items based on search query
  const filteredResults = React.useMemo(() => {
    if (!query.trim()) {
      return SEARCH_ITEMS.slice(0, 6)
    }
    const q = query.toLowerCase().trim()
    return SEARCH_ITEMS.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q)
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q))
      return matchTitle || matchKeywords
    })
  }, [query])

  // Click outside listener to close search palette
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Listen for Cmd+K / Ctrl+K & Escape shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
        inputRef.current?.focus()
      } else if (e.key === "Escape") {
        setIsOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSelect = (href: string) => {
    setIsOpen(false)
    setQuery("")
    router.push(href)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % (filteredResults.length || 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % (filteredResults.length || 1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex].href)
      } else if (query.trim()) {
        handleSelect(`/contacts?search=${encodeURIComponent(query)}`)
      }
    }
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

        {/* Global Interactive Search Input & Command Palette */}
        <div ref={containerRef} className="relative w-full max-w-xs md:max-w-md hidden sm:block">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setIsOpen(true)
                setSelectedIndex(0)
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleInputKeyDown}
              placeholder="Search sections, tools, contacts... (⌘K)"
              className="w-full pl-9 pr-8 h-9 bg-muted/30 hover:bg-muted/50 focus:bg-background border-border rounded-lg text-xs md:text-sm transition-all duration-200"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("")
                  inputRef.current?.focus()
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden md:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground pointer-events-none">
                ⌘K
              </kbd>
            )}
          </div>

          {/* Interactive Search Overlay Palette */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border border-border bg-background shadow-lg overflow-hidden z-50 animate-in fade-in duration-150">
              <div className="p-2 border-b border-border/60 bg-muted/20 flex items-center justify-between text-[11px] text-muted-foreground font-semibold px-3">
                <span>{query.trim() ? "Search Results" : "Quick Nav & Shortcuts"}</span>
                <span>Press Enter to select</span>
              </div>

              <div className="max-h-72 overflow-y-auto p-1.5 space-y-1">
                {filteredResults.length > 0 ? (
                  filteredResults.map((item, idx) => {
                    const Icon = item.icon
                    const isSelected = idx === selectedIndex
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.href)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold"
                            : "hover:bg-muted/60 text-foreground"
                        }`}
                      >
                        <div className={`p-1.5 rounded-md ${isSelected ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground"}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate">{item.title}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{item.category} • {item.href}</div>
                        </div>
                        <ArrowRight className={`h-3.5 w-3.5 shrink-0 transition-transform ${isSelected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"}`} />
                      </button>
                    )
                  })
                ) : (
                  <div className="p-3 text-center space-y-2">
                    <p className="text-xs text-muted-foreground">No navigation items found for &quot;{query}&quot;</p>
                    <button
                      type="button"
                      onClick={() => handleSelect(`/contacts?search=${encodeURIComponent(query)}`)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                    >
                      Search Contacts for &quot;{query}&quot;
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Trigger */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            const searchQuery = prompt("Search WhatsApp Automation System:")
            if (searchQuery) {
              router.push(`/contacts?search=${encodeURIComponent(searchQuery)}`)
            }
          }}
          className="sm:hidden h-8 w-8 text-muted-foreground"
          aria-label="Search"
        >
          <SearchIcon className="h-5 w-5" />
        </Button>

        {/* How It Works Quick Guide Link */}
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-8 px-2.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/50 gap-1.5 cursor-pointer"
        >
          <Link href="/how-it-works" title="How It Works & Setup Guide">
            <HelpCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="hidden md:inline">How It Works</span>
          </Link>
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

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
