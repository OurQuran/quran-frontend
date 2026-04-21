import { Metadata, Viewport } from "next";
import {
  getLocalizedMetadata,
  generateCompleteMetadata,
  getLocalizedString,
  generateViewportConfig,
} from "@/helpers/metadataHelper";
import Link from "next/link";
import api from "@/api/axiosInstance";
import { ITag, IBook, IQiraat } from "@/types/generalTypes";
import { NAV_CONFIG } from "@/configs/navConfig";

export function generateViewport(): Viewport {
  return generateViewportConfig();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = getLocalizedMetadata(locale);

  return generateCompleteMetadata({
    locale,
    title: t("Site Index - Our Quran"),
    description: t("SiteIndex_Description"),
    path: "/site-index",
  });
}

export default async function SiteIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { t } = getLocalizedMetadata(locale);

  // Fetch all data for the index
  let books: IBook[] = [];
  let qiraats: IQiraat[] = [];
  let tags: ITag[] = [];

  try {
    const [booksRes, qiraatsRes, tagsRes] = await Promise.all([
      api.get("/books"),
      api.get("/qiraats"),
      api.get("/tags"),
    ]);
    
    const bData = booksRes.data.data;
    const qData = qiraatsRes.data.data;
    const tData = tagsRes.data.data;

    // Normalize: Handle cases where data is nested like { books: [...] } or { result: [...] }
    books = Array.isArray(bData) ? bData : (bData?.books || []);
    qiraats = Array.isArray(qData) ? qData : (qData?.qiraats || []);
    tags = Array.isArray(tData) ? tData : (tData?.tags || tData?.result || []);
  } catch (e) {
    console.error("Index page fetch error:", e);
  }

  const surahs = Array.from({ length: 114 }, (_, i) => i + 1);

  // Helper to flatten tag recursive structure
  const flattenTags = (tagList: ITag[]): ITag[] => {
    let result: ITag[] = [];
    tagList.forEach((tag) => {
      result.push(tag);
      if (Array.isArray(tag.all_children) && tag.all_children.length > 0) {
        result = [...result, ...flattenTags(tag.all_children)];
      }
    });
    return result;
  };

  const allTags = flattenTags(tags);

  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold mb-12 text-center text-primary italic">
        {t("Site Directory")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        {/* ... (Explore, Books, Surahs sections remain the same) */}
        <section>
          <h2 className="text-xl font-bold mb-6 border-b pb-2 text-slate-800">
            {t("Explore")}
          </h2>
          <ul className="space-y-3">
            {(NAV_CONFIG?.mainSections ?? []).map((link) => (
              <li key={link.href}>
                <Link
                  href={`/${locale}${link.href}`}
                  className="hover:text-primary transition-colors underline-offset-4 hover:underline"
                >
                  {t(link.titleKey)}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-6 border-b pb-2 text-slate-800">
            {t("Reading & Books")}
          </h2>
          <ul className="space-y-3">
            {Array.isArray(books) &&
              books.map((book) => (
                <li key={book.id}>
                  <Link
                    href={`/${locale}/reading-books/books/${book.id}`}
                    className="hover:text-primary transition-colors underline-offset-4 hover:underline"
                  >
                    {book.name}
                  </Link>
                </li>
              ))}
            {Array.isArray(qiraats) &&
              qiraats.map((qiraat) => (
                <li key={qiraat.id}>
                  <Link
                    href={`/${locale}/reading-books/qiraats/${qiraat.id}`}
                    className="hover:text-primary transition-colors underline-offset-4 hover:underline"
                  >
                    {getLocalizedString(qiraat.name, locale)}
                  </Link>
                </li>
              ))}
          </ul>
        </section>

        <section className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-6 border-b pb-2 text-slate-800">
            {t("The Holy Quran")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
            {Array.isArray(surahs) &&
              surahs.map((id) => (
                <Link
                  key={id}
                  href={`/${locale}/surah/${id}`}
                  className="text-sm hover:text-primary transition-colors underline-offset-2 hover:underline"
                >
                  {t("Surah")} {id}
                </Link>
              ))}
          </div>
        </section>
      </div>

      {/* Tags section */}
      <section className="mt-20">
        <h2 className="text-xl font-bold mb-10 border-b pb-2 text-slate-800 text-center">
          {t("Topics & Tags")}
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {allTags.map((tag) => (
            <Link
              key={tag.id}
              href={`/${locale}/tags/${tag.id}`}
              className="px-4 py-2 bg-slate-100 border border-transparent rounded-full text-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
