"use client";

import { Card, CardContent } from "@/components/ui/card";
import { IQiraat } from "@/types/generalTypes";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { BookOpen, Users } from "lucide-react";

export default function QiraatCard({ qiraat }: { qiraat: IQiraat }) {
  const { t } = useTranslation("global");
  const { locale } = useParams();

  const currentLocale = (locale as "ar" | "en" | "ku") || "en";

  return (
    <Link href={`/${locale}/qiraats/${qiraat.id}`} className="block h-full group">
      <Card className="h-full w-full transition-all duration-200 hover:border-primary flex flex-col justify-center bg-card">
        <CardContent
          className="flex items-center p-4 gap-4 h-full"
          dir={locale === "ar" || locale === "ku" ? "rtl" : "ltr"}
        >
          {/* Icon */}
          <div className="shrink-0 w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
            <Users className="text-primary w-5 h-5" />
          </div>

          {/* Title */}
          <div className="flex-1 flex flex-col justify-center text-start">
            <div className="text-[1.05rem] font-bold leading-[1.6] line-clamp-2">
              {qiraat.name[currentLocale] || qiraat.name.ar}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {qiraat.imam[currentLocale] || qiraat.imam.ar} -{" "}
              {qiraat.riwaya[currentLocale] || qiraat.riwaya.ar}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
