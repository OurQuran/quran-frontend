import { Hash, Minus, MoreHorizontal, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import AppTooltip from "./AppTooltip";
import { ITag } from "@/types/generalTypes";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface TagsProps extends React.HTMLAttributes<HTMLDivElement> {
  tags: Partial<ITag>[];
  limit?: number;
  icon?: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "destructive";
}

export default function AyahTags({
  tags,
  limit = 3,
  icon = <Hash className="w-3 h-3 mr-1" />,
  variant = "default",
  className,
  ...props
}: TagsProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  const [t] = useTranslation("global");
  const visibleTags = !showAllTags ? tags.slice(0, limit) : tags;
  const remainingCount = tags.length - limit;
  const hasMoreTags = remainingCount > 0;

  return (
    <div
      className={cn(
        "flex flex-wrap justify-start flex-row-reverse w-full gap-1.5",
        className
      )}
      {...props}
    >
      <motion.div
        layout
        className="flex flex-wrap justify-start flex-row-reverse gap-1.5 overflow-hidden"
      >
        <AnimatePresence initial={false}>
          {visibleTags.map((tag) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              layout
            >
              <Link to={"/tags/" + tag.id}>
                <Badge variant={variant} className="px-2 py-0.5 text-xs">
                  {icon}
                  {tag.name}
                </Badge>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {hasMoreTags && (
        <>
          <div className="hidden md:block">
            <AppTooltip
              trigger={
                <Badge
                  variant="secondary"
                  className="px-2 py-0.5 text-xs cursor-pointer"
                >
                  <MoreHorizontal className="w-3 h-3 mr-1" />
                  {remainingCount}+
                </Badge>
              }
              content={
                <div className="flex flex-wrap items-stretch gap-1.5">
                  {tags.slice(limit).map((tag, index) => (
                    <Link key={index + "tag"} to={"/tags/" + tag.id}>
                      <Badge variant={variant} className="px-2 py-0.5 text-xs">
                        {icon}
                        {tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              }
              className="max-w-[250px] w-auto"
            />
          </div>
          <div className="block md:hidden">
            <Badge
              variant="secondary"
              className="px-2 py-0.5 text-xs cursor-pointer"
              onClick={() => setShowAllTags((prev) => !prev)}
            >
              {showAllTags ? t("Hide") : t("Show All")}
              {showAllTags ? (
                <Minus className="w-3 h-3 mr-1" />
              ) : (
                <Plus className="w-3 h-3 mr-1" />
              )}
            </Badge>
          </div>
        </>
      )}
    </div>
  );
}
