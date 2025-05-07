import { Button } from "@/components/ui/button";
import {
  Copy,
  Bookmark,
  Tag,
  BookmarkPlus,
  BookmarkMinus,
  BookmarkCheck,
  Play,
  GalleryVerticalEnd,
} from "lucide-react";
import AppTooltip from "./AppTooltip";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { IAayh } from "@/types/generalTypes";
import {
  getTextDirection,
  onError,
  onSuccess,
  uniqueId,
} from "@/helpers/utils";
import { useHover } from "react-haiku";
import AyahTags from "./AyahTags";
import { toast } from "sonner";
import AudioPlayer from "./AudioPlayer";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { requireAuth } from "@/helpers/authGuards";
import { useNavigate } from "react-router";
import useAdd from "@/react-query/useAdd";
import useDelete from "@/react-query/useDelete";
import { useQueryClient } from "@tanstack/react-query";
import { AyahAttachModal } from "./AyahAttachModal";

export default function AyahCard({
  ayah,
  isFocusMode = false,
  hasAudio = true,
  surahLink = false,
}: {
  ayah: IAayh;
  isFocusMode?: boolean;
  hasAudio?: boolean;
  surahLink?: boolean;
}) {
  const queryClient = useQueryClient();
  const [t] = useTranslation("global");
  const { hovered, ref } = useHover();
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const navigate = useNavigate();

  const addBookmarkMutation = useAdd(
    "bookmarks",
    () => {
      onSuccess(t("Ayah added to bookmarks"));
      queryClient.refetchQueries({ queryKey: ["ayah"], exact: false });
    },
    () => onError(t("Ayah could not be added to bookmarks"))
  );
  const removeBookmarkMutation = useDelete(
    "bookmarks",
    () => {
      onSuccess(t("Ayah removed from bookmarks"));
      queryClient.refetchQueries({ queryKey: ["ayah"], exact: false });
    },
    () => onError(t("Ayah could not be removed from bookmarks"))
  );

  const [playerId] = useState(uniqueId());

  function handleCopyText() {
    navigator.clipboard.writeText(ayah.text);
    toast.success(t("Text copied to clipboard"));
  }

  function handleBookmark() {
    console.log(ayah);

    if (requireAuth()) {
      ayah.bookmarked
        ? removeBookmarkMutation.mutate(ayah.id + "")
        : addBookmarkMutation.mutate({
            ayah_id: ayah.id,
          });
    } else {
      navigate("/login");
    }
  }

  function handleAddTag() {
    if (requireAuth()) {
      setTagModalOpen(true);
    } else {
      navigate("/login");
    }
  }

  const sidebarItems = [
    {
      trigger: (
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-border hover:text-primary rounded-full"
          onClick={handleCopyText}
        >
          <Copy className="h-5 w-5" />
        </Button>
      ),
      content: t("Copy Text"),
    },

    {
      trigger: (
        <Button
          variant="ghost"
          // @ts-ignore
          ref={ref}
          size="icon"
          className="hover:bg-border hover:text-primary rounded-full"
          onClick={handleBookmark}
        >
          {hovered && ayah.bookmarked ? (
            <BookmarkMinus className="h-5 w-5" />
          ) : hovered && !ayah.bookmarked ? (
            <BookmarkPlus className="h-5 w-5" />
          ) : ayah.bookmarked ? (
            <BookmarkCheck className="h-5 w-5" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </Button>
      ),
      content:
        hovered && ayah.bookmarked ? (
          <p>{t("Remove Bookmark")}</p>
        ) : hovered && !ayah.bookmarked ? (
          <p>{t("Add Bookmark")}</p>
        ) : ayah.bookmarked ? (
          <p>{t("Remove Bookmark")}</p>
        ) : (
          <p>{t("Add Bookmark")}</p>
        ),
    },
    {
      trigger: (
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-border hover:text-primary rounded-full"
          onClick={handleAddTag}
        >
          <Tag className="h-5 w-5" />
        </Button>
      ),
      content: t("Attach Tag"),
    },
    ...(hasAudio
      ? [
          {
            trigger: (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "hover:bg-border hover:text-primary rounded-full",
                  showAudioPlayer ? "bg-secondary border" : ""
                )}
                onClick={() => setShowAudioPlayer((prev) => !prev)}
              >
                <Play className="h-5 w-5" />
              </Button>
            ),
            content: t("Show Audio"),
          },
        ]
      : []),
    ...(surahLink
      ? [
          {
            trigger: (
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-border hover:text-primary rounded-full"
                onClick={() => navigate(`/surah/${ayah.surah_id}`)}
              >
                <GalleryVerticalEnd className="h-5 w-5" />
              </Button>
            ),
            content: t("Go to surah"),
          },
        ]
      : []),
  ];

  const sidebarBtns = sidebarItems.map((item, index) => {
    return (
      <AppTooltip
        key={index + "sidebar-btn"}
        direction="right"
        trigger={item.trigger}
        content={<div className="text-sm">{item.content}</div>}
      />
    );
  });

  const fixedAyahTemplate = ayah.ayah_template.replace(
    /﴾([\u0660-\u0669]+)﴿/g,
    "<span>﴿$1﴾</span>"
  );

  if (isFocusMode) {
    return (
      <AppTooltip
        trigger={
          <div
            dir="rtl"
            className="text-2xl 
            sm:text-3xl 
            leading-loose  
            hover:bg-secondary 
            text-center 
            font-quran-4 
            p-2
            ayah 
            font-semibold 
            text-foreground"
            dangerouslySetInnerHTML={{
              __html: ayah.number_in_surah == 0 ? ayah.text : fixedAyahTemplate,
            }}
          />
        }
        className={cn(
          "text-base sm:text-lg font-medium text-center w-[600px] bg-primary/60 text-primary-foreground",
          ayah.number_in_surah == 0 ? "!hidden" : ""
        )}
        direction="top"
        content={ayah.translation}
      />
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col justify-between ">
        <div className="flex justify-between gap-4 ">
          <div className="flex flex-col items-center gap-1">{sidebarBtns}</div>
          <div className="w-full flex flex-col items-center gap-4">
            <div
              dir="rtl"
              className="text-2xl sm:text-3xl leading-relaxed font-quran-4 ayah  text-foreground"
              dangerouslySetInnerHTML={{
                __html:
                  ayah.number_in_surah == 0 ? ayah.text : fixedAyahTemplate,
              }}
            />
            <div>
              {ayah.number_in_surah != 0 ? (
                <p
                  dir={getTextDirection(ayah.translation)}
                  className="text-base sm:text-lg font-medium text-foreground"
                >
                  {ayah.translation}
                </p>
              ) : null}
            </div>
            <AyahTags tags={ayah.tags} limit={3} ayahId={ayah.id} />
          </div>
        </div>

        <AnimatePresence>
          {showAudioPlayer && (
            <motion.div
              key="audio-player"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden w-full"
            >
              <AudioPlayer audioId={playerId} src={ayah.audio || ""} />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <AyahAttachModal
        ayahId={ayah.id}
        isOpen={tagModalOpen}
        setIsOpen={setTagModalOpen}
        exisitingTags={
          ayah.tags
            ?.map((tag) => tag.id)
            .filter((id): id is number => id !== undefined) || []
        }
      />
    </Card>
  );
}
