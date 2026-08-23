"use client"

import * as React from "react"

interface LayoutContextType {
  isSidebarCollapsed: boolean
  setIsSidebarCollapsed: (collapsed: boolean) => void
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
  toggleSidebar: () => void
  toggleMobile: () => void
}

const LayoutContext = React.createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)

  // Load sidebar state from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed")
    if (saved) {
      setIsSidebarCollapsed(saved === "true")
    }
  }, [])

  const handleSetSidebarCollapsed = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed)
    localStorage.setItem("sidebar-collapsed", String(collapsed))
  }

  const toggleSidebar = () => handleSetSidebarCollapsed(!isSidebarCollapsed)
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen)

  return (
    <LayoutContext.Provider
      value={{
        isSidebarCollapsed,
        setIsSidebarCollapsed: handleSetSidebarCollapsed,
        isMobileOpen,
        setIsMobileOpen,
        toggleSidebar,
        toggleMobile,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = React.useContext(LayoutContext)
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}
