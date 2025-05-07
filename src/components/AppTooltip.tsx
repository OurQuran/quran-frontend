import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
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
  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent
        side={direction}
        className={cn("hidden sm:block", className)}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
