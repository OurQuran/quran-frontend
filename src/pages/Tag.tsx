import FadeInUp from "@/components/Animation/FadeInUp";
import AyahCard from "@/components/AyahCard";
import Loading from "@/components/Loading";
import { cn } from "@/lib/utils";
import useGet from "@/react-query/useGet";
import { Helmet } from "react-helmet-async";
import { ITag } from "@/types/generalTypes";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

export default function Tag() {
  const { id } = useParams();
  const [t] = useTranslation("global");
  const { data, isLoading } = useGet<ITag, false>(`tags/${id}`);

  return (
    <div className="flex flex-col w-full mt-5">
      <Helmet>
        <title>
          {data?.name
            ? t("Tag: {{name}} - Our Quran", { name: data.name })
            : t("Our Quran")}
        </title>
        {data?.name && (
          <meta
            name="description"
            content={t("Explore ayahs tagged with {{name}} in the Quran.", {
              name: data.name,
            })}
          />
        )}
      </Helmet>
      {data?.name && (
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-3xl font-semibold">{data.name}</h1>
          <p className="text-muted-foreground mt-2">
            {data.ayahs.length} {data.ayahs.length === 1 ? "Ayah" : "Ayahs"}{" "}
            {t("found")}</p>
        </div>
      )}
      <FadeInUp className={cn("flex flex-col w-full mt-5")}>
        {isLoading ? (
          <Loading />
        ) : (
          data?.ayahs.map((item) => (
            <AyahCard
              key={item.id + "ayah-card"}
              ayah={item}
              hasAudio={false}
              surahLink={true}
            />
          ))
        )}
      </FadeInUp>
    </div>
  );
}
