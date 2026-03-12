import { Globe, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setLang } from "@/helpers/localStorage";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
  { code: "ku", label: "کوردی" },
];

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const fontClass = i18n.language === "en" ? "font-poppins" : "font-kurdish";

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setLang(code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-primary bg-accent/20 hover:bg-accent/40 backdrop-blur-sm border border-border/50 shadow-xs"
        >
          <Globe className="h-[1.1rem] w-[1.1rem] shrink-0" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-card/90 backdrop-blur-md border-border/50 min-w-[8rem]"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              "flex items-center justify-between mb-1 cursor-pointer",
              i18n.language === lang.code
                ? "bg-accent/60 text-accent-foreground font-medium"
                : "text-muted-foreground",
              fontClass,
            )}
          >
            <span>{lang.label}</span>
            {i18n.language === lang.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
