import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function AppTooltip({
  trigger,
  content,
  direction = "bottom",
  className,
  ...props
}: {
  trigger: React.ReactNode;
  content: React.ReactNode;
  direction?: "bottom" | "top" | "right" | "left";
  className?: string;
}) {
  const { i18n } = useTranslation();
  const dir = i18n.language === "ar" || i18n.language === "ku" ? "rtl" : "ltr";
  
  let finalDirection = direction;
  if (dir === "rtl") {
    if (direction === "right") finalDirection = "left";
    else if (direction === "left") finalDirection = "right";
  }

  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent
        side={finalDirection}
        className={cn("hidden sm:block", className)}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
