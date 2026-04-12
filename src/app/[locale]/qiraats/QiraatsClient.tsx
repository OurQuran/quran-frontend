"use client";

import Loading from "@/components/Loading";
import QiraatCard from "@/components/QiraatCard";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useQiraatStore } from "@/store/qiraatStore";

export default function QiraatsClient() {
  const { t } = useTranslation("global");
  const { qiraats, fetchQiraats } = useQiraatStore();

  const [isLoading, setIsLoading] = useState(!qiraats.length);

  useEffect(() => {
    const loadData = async () => {
      if (qiraats.length === 0) {
        await fetchQiraats();
      }
      setIsLoading(false);
    };
    loadData();
  }, [qiraats.length, fetchQiraats]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("Qira'ats", { defaultValue: "Qira'ats" })}</h1>
      </div>
      
      {isLoading ? (
        <Loading />
      ) : qiraats.length === 0 ? (
        <div className="text-center text-muted-foreground mt-10">
          {t("no_qiraats_found", { defaultValue: "No Qira'ats found." })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {qiraats.map((qiraat) => (
            <QiraatCard key={qiraat.id} qiraat={qiraat} />
          ))}
        </div>
      )}
    </div>
  );
}
