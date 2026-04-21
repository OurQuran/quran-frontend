import { cache } from "react";
import api from "@/api/axiosInstance";

/**
 * Shared data fetching service with React cache memoization.
 * In Next.js App Router, these functions will share results between
 * generateMetadata and the actual Page component, saving API calls.
 */

export const getSurahData = cache(async (id: string) => {
  try {
    const response = await api.get(`/surahs/${id}`);
    return response.data?.data;
  } catch (error) {
    console.error(`Error fetching surah data (${id}):`, error);
    return null;
  }
});

export const getBookData = cache(async (id: string) => {
  try {
    const response = await api.get(`/books/${id}`);
    return response.data?.data;
  } catch (error) {
    console.error(`Error fetching book data (${id}):`, error);
    return null;
  }
});

export const getTagData = cache(async (id: string) => {
  try {
    const response = await api.get(`/tags/${id}`);
    return response.data?.data;
  } catch (error) {
    console.error(`Error fetching tag data (${id}):`, error);
    return null;
  }
});
