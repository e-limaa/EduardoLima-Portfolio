import { Moon, Sun } from "lucide-react"
import { Button } from "@limia/design-system"
import { useTheme } from "./theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      variant="outline"
      size="icon-lg"
      className="relative h-10 w-16 overflow-hidden rounded-full border-border/70 bg-card/90 p-1 shadow-sm backdrop-blur"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span
        className={`absolute left-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-background shadow-sm transition-transform duration-300 ${isDark ? "translate-x-6" : "translate-x-0"
          }`}
      />
      <div className="z-10 flex w-full justify-between px-1 pointer-events-none">
        <Sun
          className={`h-4 w-4 transition-all duration-300 ${!isDark ? "text-primary opacity-100" : "text-muted-foreground opacity-60"
            }`}
        />
        <Moon
          className={`h-4 w-4 transition-all duration-300 ${isDark ? "text-primary opacity-100" : "text-muted-foreground opacity-60"
            }`}
        />
      </div>
    </Button>
  )
}

