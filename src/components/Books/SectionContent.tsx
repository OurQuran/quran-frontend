"use client";

import { useTranslation } from "react-i18next";
import { IBookSectionContent } from "@/types/generalTypes";
import useGet from "@/react-query/useGet";
import Loading from "@/components/Loading";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Download, ShieldCheck, UserRound } from "lucide-react";

interface SectionContentProps {
  bookId: number;
  orderNo: number | null;
}

export default function SectionContent({
  bookId,
  orderNo,
}: SectionContentProps) {
  const { t } = useTranslation("global");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeFootnote, setActiveFootnote] = useState<number | null>(null);
  const [activeFootnoteRef, setActiveFootnoteRef] = useState<number | null>(
    null,
  );
  const [fullscreenImage, setFullscreenImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const handleFootnoteClick = (refNo: number) => {
    setActiveFootnote(refNo);
    const element = document.getElementById(`footnote-${refNo}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // Remove the highlight effect after a brief read-time
    setTimeout(() => {
      setActiveFootnote(null);
    }, 2500);
  };

  const handleFootnoteRefClick = (refNo: number) => {
    setActiveFootnoteRef(refNo);
    const element = document.getElementById(`footnote-ref-${refNo}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setTimeout(() => {
      setActiveFootnoteRef(null);
    }, 2500);
  };

  useEffect(() => {
    setActiveFootnote(null);
    setActiveFootnoteRef(null);
  }, [bookId, orderNo]);

  const { data, isLoading, isError, error } = useGet<IBookSectionContent, false>(
    `books/${bookId}/sections/${orderNo}`,
    { with_images: "1" as any },
    orderNo !== null,
    `book-${bookId}-section-${orderNo}`,
  );

  useEffect(() => {
    if (isError && (error as any)?.response?.status === 404) {
      notFound();
    }
  }, [isError, error]);

  if (orderNo === null) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        {t("select_a_section", {
          defaultValue: "Select a section from the sidebar to start reading.",
        })}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!data || !data.section) {
    return (
      <div className="h-full flex items-center justify-center text-destructive">
        {t("failed_to_load_content", {
          defaultValue: "Failed to load content.",
        })}
      </div>
    );
  }

  const { section, book } = data;

  const renderContent = () => {
    let body = section.body_text || "";

    const imgMap: Record<number, any> = {};
    if (section.images) {
      section.images.forEach((img) => {
        imgMap[img.order] = img;
      });
    }

    const parts = body.split(/(\{\{img\d+\}\})/g);

    return parts.map((part, index) => {
      const match = part.match(/\{\{img(\d+)\}\}/);
      if (match) {
        const n = parseInt(match[1]);
        const img = imgMap[n];
        if (!img) {
          return (
            <span key={index} className="text-destructive inline-block mx-1">
              [img{n} missing]
            </span>
          );
        }
        const imgSrc = `data:${img.mime};base64,${img.data}`;
        const imgAlt = img.filename || `Image ${n}`;
        return (
          <img
            key={index}
            src={imgSrc}
            alt={imgAlt}
            className="max-w-full rounded-lg border border-border block my-4 cursor-zoom-in hover:opacity-95 transition-opacity"
            loading="lazy"
            onClick={() => setFullscreenImage({ src: imgSrc, alt: imgAlt })}
          />
        );
      }
      // Split text into proper paragraphs, eliminating excessive vertical whitespace completely.
      const paragraphs = part
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean);

      if (!paragraphs.length) return null;

      const formatFootnotes = (text: string) => {
        if (!section.refs || section.refs.length === 0) return text;
        const chunks = text.split(/(\[\d+\]|\(\d+\))/g);
        return chunks.map((chunk, i) => {
          const match = chunk.match(/^\[(\d+)\]$|^\((\d+)\)$/);
          if (match) {
            const num = parseInt(match[1] || match[2]);
            const validRef = section.refs!.find((r) => r.ref_no === num);
            if (validRef) {
              return (
                <button
                  key={i}
                  id={`footnote-ref-${num}`}
                  onClick={() => handleFootnoteClick(num)}
                  className={cn(
                    "font-bold text-[0.8em] px-0.5 mx-0.5 rounded align-super cursor-pointer transition-colors duration-700",
                    activeFootnoteRef === num
                      ? "bg-primary text-primary-foreground"
                      : "text-primary hover:bg-primary/10",
                  )}
                  title={validRef.ref_text}
                >
                  {chunk}
                </button>
              );
            }
          }
          return chunk;
        });
      };

      return paragraphs.map((par, i) => (
        <p
          key={`${index}-${i}`}
          className="wrap-break-word mb-2.5 md:mb-3 last:mb-0"
        >
          {formatFootnotes(par)}
        </p>
      ));
    });
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      <div
        className="min-h-[86px] shrink-0 px-6 py-3 border-b border-border bg-card flex flex-col justify-center sticky top-0 z-10"
        dir="rtl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground mb-0.5 line-clamp-1">
              {book.name}
            </div>
            <div className="text-lg font-bold line-clamp-1">
              {section.header_text || `Section #${section.order_no}`}
            </div>
          </div>

          {book.download_url && book.has_pdf && (
            <a
              href={book.download_url}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
              download
            >
              <Download className="h-3.5 w-3.5" />
              {t("Download PDF", { defaultValue: "Download PDF" })}
            </a>
          )}
        </div>

        {(book.author_name || book.supervisor_name) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.72rem] text-muted-foreground">
            {book.author_name && (
              <span className="inline-flex items-center gap-1">
                <UserRound className="h-3.5 w-3.5" />
                {book.author_name}
              </span>
            )}
            {book.supervisor_name && (
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                {book.supervisor_name}
              </span>
            )}
          </div>
        )}
      </div>

      <div
        className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 scroll-smooth"
        id="content-scroll-area"
        data-lenis-prevent
      >
        <div className="max-w-4xl mx-auto">
          {section.header_text && (
            <h2 className="text-2xl font-bold mb-6 text-foreground" dir="rtl">
              {section.header_text}
            </h2>
          )}

          <div
            className={cn(
              "text-[1.1rem] md:text-[1.2rem] text-foreground leading-[1.8] md:leading-loose mb-10",
            )}
            dir="rtl"
            style={{ textAlign: "justify" }}
          >
            {renderContent()}
          </div>

          {section.refs && section.refs.length > 0 && (
            <div className="mt-12 pt-6 border-t border-border">
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4 font-semibold">
                {t("footnotes", { defaultValue: "Footnotes" })} (
                {section.refs.length})
              </h3>
              <div className="flex flex-col gap-2">
                {section.refs.map((ref) => (
                  <div
                    key={ref.ref_no}
                    id={`footnote-${ref.ref_no}`}
                    onClick={() => handleFootnoteRefClick(ref.ref_no)}
                    className={cn(
                      "flex gap-3 text-sm p-2 rounded-md transition-colors duration-700 cursor-pointer hover:bg-primary/5",
                      activeFootnote === ref.ref_no
                        ? "bg-primary/15"
                        : "bg-transparent",
                    )}
                    dir="rtl"
                  >
                    <span className="font-bold text-primary shrink-0 mt-0.5">
                      [{ref.ref_no}]
                    </span>
                    <span className="text-muted-foreground leading-relaxed">
                      {ref.ref_text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setFullscreenImage(null)}
        >
          <img
            src={fullscreenImage.src}
            alt={fullscreenImage.alt}
            className="max-w-full max-h-full object-contain shadow-2xl rounded"
          />
        </div>
      )}
    </div>
  );
}
