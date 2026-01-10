import { Moon, Sun } from "lucide-react"
import { Button } from "@antigravity/ds"
import { useTheme } from "./theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative inline-flex h-8 w-14 items-center rounded-full bg-zinc-200 p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-zinc-800"
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 dark:bg-zinc-950 ${theme === "dark" ? "translate-x-6" : "translate-x-0"
          }`}
      />
      <div className="z-10 flex w-full justify-between px-1 pointer-events-none">
        <Sun
          className={`h-4 w-4 transition-all duration-300 ${theme === "light" ? "text-yellow-500 opacity-100" : "text-zinc-400 opacity-50"
            }`}
        />
        <Moon
          className={`h-4 w-4 transition-all duration-300 ${theme === "dark" ? "text-blue-400 opacity-100" : "text-zinc-400 opacity-50"
            }`}
        />
      </div>
    </button>
  )
}
