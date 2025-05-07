import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function ErrorElement() {
  const [t] = useTranslation("global");

  return (
    <>
      <main className=" bg-transparent flex text-tan-500 justify-center items-center h-screen ">
        <div className="text-center p-5 font-medium">
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary sm:text-5xl">
            {t("somethingWrongHappened")}
          </h1>
          <p className="mt-6 text-base leading-7">{t("errorMessage")}</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button>
              <Link to=".." className="button">
                {t("back")}
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
