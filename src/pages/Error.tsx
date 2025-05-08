import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function Error() {
  const [t] = useTranslation("global");

  return (
    <>
      <main className=" bg-white flex text-tan-500 justify-center items-center h-screen ">
        <div className="text-center p-5 font-medium">
          <p className=" text-8xl font-semibold text-primary ">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            {t("Page Not Found")}
          </h1>
          <p className="mt-6 text-base leading-7 text-quotee-400">
            {t("The page you are looking for does not exist")}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button>
              <Link to="/">{t("Go to home")}</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
