import { ThemeSwitch } from "@limia/design-system-src/components/theme-switch"
import { useTheme } from "./theme-provider"
import posthog from "posthog-js"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <ThemeSwitch
      checked={isDark}
      onCheckedChange={(checked: boolean) => {
        const newTheme = checked ? "dark" : "light"
        setTheme(newTheme)
        posthog.capture("Theme Toggled", { theme_mode: newTheme })
      }}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    />
  )
}

