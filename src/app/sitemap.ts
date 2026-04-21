import { MetadataRoute } from "next";
import { i18nConfig } from "@/i18n-config";
import axios from "axios";
import { getAbsoluteUrl } from "@/helpers/metadataHelper";

const API_URL = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:3000";

export const revalidate = 259200; // Revalidate once every 3 days

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = i18nConfig.locales;
  const mainRoutes = [
    "",
    "/advanced-search",
    "/tags",
    "/login",
    "/signup",
    "/reading-books/books",
    "/reading-books/qiraats",
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Helper to fetch data safely
  const fetchData = async (url: string) => {
    try {
      const resp = await axios.get(`${API_URL}/${url}`);
      const data = resp.data?.data;

      // Handle nested structures like { books: [...] } or { result: [...] }
      if (data && typeof data === "object" && !Array.isArray(data)) {
        if (Array.isArray(data.books)) return data.books;
        if (Array.isArray(data.qiraats)) return data.qiraats;
        if (Array.isArray(data.tags)) return data.tags;
        if (Array.isArray(data.result)) return data.result;
      }

      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error(`Sitemap fetch error (${url}):`, e);
      return [];
    }
  };

  // Fetch dynamic entities
  const [books, qiraats, tags] = await Promise.all([
    fetchData("books"),
    fetchData("qiraats"),
    fetchData("tags"),
  ]);

  // Flatten tags recursively
  const getAllTagIds = (tagList: any[]): number[] => {
    let ids: number[] = [];
    if (!Array.isArray(tagList)) return ids;
    tagList.forEach((tag) => {
      if (tag && tag.id) {
        ids.push(tag.id);
        if (Array.isArray(tag.all_children) && tag.all_children.length > 0) {
          ids = [...ids, ...getAllTagIds(tag.all_children)];
        }
      }
    });
    return ids;
  };
  const allTagIds = getAllTagIds(tags);

  // Add routes for each locale
  locales.forEach((locale) => {
    // Main routes
    mainRoutes.forEach((route) => {
      entries.push({
        url: getAbsoluteUrl(route, locale),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1 : 0.8,
      });
    });

    // Surahs (1-114)
    for (let i = 1; i <= 114; i++) {
      entries.push({
        url: getAbsoluteUrl(`/surah/${i}`, locale),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

    // Books
    books.forEach((book: any) => {
      entries.push({
        url: getAbsoluteUrl(`/reading-books/books/${book.id}`, locale),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });

    // Qiraats
    qiraats.forEach((qiraat: any) => {
      entries.push({
        url: getAbsoluteUrl(`/reading-books/qiraats/${qiraat.id}`, locale),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });

    // Tags
    allTagIds.forEach((tagId) => {
      entries.push({
        url: getAbsoluteUrl(`/tags/${tagId}`, locale),
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    });
  });

  return entries;
}
