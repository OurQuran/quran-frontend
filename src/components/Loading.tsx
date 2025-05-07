import QuranLogoIcon from "./QuranLogoIcon";

export default function Loading({
  className = "w-96 h-96",
}: {
  className?: string;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className={`${className} flex flex-col items-center justify-center`}>
        <QuranLogoIcon className="w-24 h-24 text-secondary animate-pulse" />
      </div>
    </div>
  );
}
