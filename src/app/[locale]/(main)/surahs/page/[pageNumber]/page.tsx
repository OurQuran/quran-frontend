import MushafPageClient from "@/components/MushafPageClient";

export default async function Page({ params }: { params: Promise<{ pageNumber: string }> }) {
  const { pageNumber } = await params;
  return <MushafPageClient pageNumber={pageNumber} />;
}
