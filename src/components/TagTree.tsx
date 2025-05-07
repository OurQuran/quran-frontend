import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Search,
  Tag,
  Folder,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { ITag } from "@/types/generalTypes";
import { useTranslation } from "react-i18next";
import useGet from "@/react-query/useGet";
import Loading from "./Loading";

interface TreeNodeProps {
  item: ITag;
  level: number;
  searchTerm: string;
}

const levelColors = [
  "bg-primary/10",
  "bg-blue-500/10",
  "bg-cyan-500/10",
  "bg-amber-500/10",
  "bg-emerald-500/10",
];

const tagBorders = [
  "border-primary",
  "border-blue-500",
  "border-cyan-500",
  "border-amber-500",
  "border-emerald-500",
];

const levelBorders = [
  "hover:border-primary focus:border-primary",
  "hover:border-blue-500 focus:border-blue-500",
  "hover:border-cyan-500 focus:border-cyan-500",
  "hover:border-amber-500 focus:border-amber-500",
  "hover:border-emerald-500 focus:border-emerald-500",
];

const TreeNode = ({ item, level, searchTerm }: TreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(level < 1 || searchTerm !== "");
  const hasChildren = item.all_children && item.all_children.length > 0;

  useEffect(() => {
    if (searchTerm !== "") {
      setIsExpanded(true);
    }
  }, [searchTerm]);

  const matchesSearch =
    searchTerm === "" ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.all_children.some((child) =>
      containsSearchTerm(child, searchTerm.toLowerCase())
    );

  if (!matchesSearch) return null;

  const directMatch =
    searchTerm !== "" &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase());

  const colorIndex = level % levelColors.length;
  const borderColorIndex = level % levelBorders.length;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={cn("mb-2", hasChildren && isExpanded ? "" : "")}>
        <Link to={`/tags/${item.id}`} className="block">
          <div
            className={cn(
              "border rounded-lg transition-all duration-200 cursor-pointer overflow-hidden",
              levelColors[colorIndex],
              levelBorders[borderColorIndex],
              directMatch ? "border-primary shadow-md" : ""
            )}
          >
            <div className="flex items-center p-2 gap-2">
              {hasChildren ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="rounded-full cursor-pointer p-2"
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              ) : (
                <div className="h-7 w-7 flex items-center justify-center">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </div>
              )}

              <div className="flex items-center gap-2 flex-1">
                {hasChildren && (
                  <div className="text-muted-foreground">
                    {isExpanded ? (
                      <FolderOpen className="h-4 w-4" />
                    ) : (
                      <Folder className="h-4 w-4" />
                    )}
                  </div>
                )}
                <span
                  className={cn(
                    "font-medium",
                    level === 0 ? "text-md" : "",
                    directMatch
                      ? "underline decoration-primary decoration-2 underline-offset-4"
                      : ""
                  )}
                >
                  {item.name}
                </span>
              </div>

              {item.all_children.length > 0 && (
                <Badge
                  variant="secondary"
                  className={cn(
                    "rounded-full",
                    tagBorders[borderColorIndex],
                    levelColors[colorIndex]
                  )}
                >
                  {item.all_children.length}
                </Badge>
              )}
            </div>
          </div>
        </Link>
      </div>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "sm:pl-6 sm:ml-4 sm:border-l-2 sm:border-dashed",
              level === 0 ? "border-primary/30" : "border-muted-foreground/30"
            )}
          >
            {item.all_children.map((child) => (
              <TreeNode
                key={child.id}
                item={child}
                level={level + 1}
                searchTerm={searchTerm}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

function containsSearchTerm(item: ITag, searchTerm: string): boolean {
  if (item.name.toLowerCase().includes(searchTerm)) {
    return true;
  }

  return item.all_children.some((child) =>
    containsSearchTerm(child, searchTerm)
  );
}

export default function TagTree() {
  const [searchTerm, setSearchTerm] = useState("");
  const [t] = useTranslation("global");
  const { data, isLoading } = useGet<ITag, true>("tags", { name: searchTerm });

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto">
      <Card className="w-full mb-5">
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-5 w-5 text-primary -translate-y-1/2 " />
              <Input
                className="p-5 pl-10 bg-muted"
                placeholder={t("Search tags...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardContent className="flex flex-col gap-10">
          <div>
            {data?.result.length ? (
              data?.result.map((item, index) => (
                <>
                  <TreeNode
                    key={item.id}
                    item={item}
                    level={0}
                    searchTerm={searchTerm}
                  />
                  {index !== data?.result.length - 1 && <hr className="m-3" />}
                </>
              ))
            ) : (
              <div className="text-center">{t("No tags found")}</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
