import { redirect } from "next/navigation";

export default async function ReadingBooksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/reading-books/books`);
}
