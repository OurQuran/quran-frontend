import FadeInUp from "@/components/Animation/FadeInUp";
import AyahCard from "@/components/AyahCard";
import Loading from "@/components/Loading";
import { cn } from "@/lib/utils";
import useGet from "@/react-query/useGet";
import { ITag } from "@/types/generalTypes";
import { useParams } from "react-router";

export default function Tag() {
  const { id } = useParams();
  const { data, isLoading } = useGet<ITag, false>(`tags/${id}`);

  return (
    <div className="flex flex-col w-full mt-5">
      {data?.name && (
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-3xl font-semibold">{data.name}</h1>
          <p className="text-gray-600 mt-2">
            {data.ayahs.length} {data.ayahs.length === 1 ? "Ayah" : "Ayahs"}{" "}
            found
          </p>
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
