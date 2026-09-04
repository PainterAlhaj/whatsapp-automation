"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const themes: { name: "light" | "dark" | "system"; label: string; description: string; icon: React.ReactNode }[] = [
    {
      name: "light",
      label: "Light Mode",
      description: "Clean, high contrast bright theme for daylight environments.",
      icon: <Sun className="h-4 w-4 text-amber-500" />,
    },
    {
      name: "dark",
      label: "Dark Mode",
      description: "Sleek, low-light theme ideal for reduced eye strain.",
      icon: <Moon className="h-4 w-4 text-blue-400" />,
    },
    {
      name: "system",
      label: "System Default",
      description: "Automatically match your operational system theme preferences.",
      icon: <Laptop className="h-4 w-4 text-emerald-500" />,
    },
  ];

  if (!mounted) {
    return (
      <Card className="border-border/80 shadow-xs text-left font-sans">
        <CardContent className="p-6 text-center text-xs text-muted-foreground">
          Loading theme preferences...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 text-left font-sans text-xs">
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-bold text-foreground">Theme Selection</CardTitle>
          <CardDescription className="text-[11px]">
            Dynamically adjust the workspace UI lighting environment across all application modules.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="grid gap-3 sm:grid-cols-3 pt-2">
            {themes.map((t) => {
              const isActive = theme === t.name;
              return (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setTheme(t.name)}
                  className={cn(
                    "flex flex-col justify-between p-4 rounded-xl border text-left transition-all focus:outline-none cursor-pointer relative",
                    isActive
                      ? "border-emerald-500 bg-emerald-500/[0.04] ring-1 ring-emerald-500/40 shadow-xs"
                      : "border-border/80 hover:bg-muted/40 hover:border-border"
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg bg-muted text-muted-foreground",
                        isActive && "bg-emerald-500/10"
                      )}
                    >
                      {t.icon}
                    </div>
                    {isActive && (
                      <span className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-foreground block text-xs">{t.label}</span>
                    <span className="text-[10px] text-muted-foreground block mt-1 leading-normal">
                      {t.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

