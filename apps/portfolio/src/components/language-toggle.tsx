import { Languages } from "lucide-react"
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@limia/design-system"
import { useLanguage } from "./language-provider"

export function LanguageToggle() {
    const { setLanguage } = useLanguage()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Languages className="h-[1.2rem] w-[1.2rem] transition-all" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                    English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("pt-br")}>
                    Português
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

