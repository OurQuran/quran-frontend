import useInfiniteScroll from "@/react-query/useInfiniteScroll";
import { IFilter, ITag } from "@/types/generalTypes";
import AppDialog from "./AppDialog";
import { Button } from "./ui/button";
import TagSelector from "./TagSelector";
import { useTranslation } from "react-i18next";
import useAdd from "@/react-query/useAdd";
import { onError, onSuccess } from "@/helpers/utils";
import { Textarea } from "./ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { FormLabel, FormMessage } from "./ui/form";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function AyahAttachModal({
  ayahId,
  isOpen,
  setIsOpen,
  exisitingTags,
}: {
  ayahId?: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  exisitingTags?: number[];
}) {
  const [t] = useTranslation("global");

  return (
    <AppDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title={t("Attach Tag")}
      description={t("Attach a tag to the ayah")}
    >
      <AttachTag
        ayahId={ayahId || 0}
        setIsOpen={setIsOpen}
        exisitingTags={exisitingTags || []}
      />
    </AppDialog>
  );
}

function AttachTag({
  ayahId,
  setIsOpen,
  exisitingTags,
}: {
  ayahId: number;
  setIsOpen: (isOpen: boolean) => void;
  exisitingTags: number[];
}) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [t] = useTranslation("global");
  const formSchema = z.object({
    tag_id: z.number().min(1, "Tag is required"),
    note: z.string().optional(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tag_id: undefined,
      note: "",
    },
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteScroll<ITag>("tags/search", {
      per_page: 15,
      name: search,
    } as IFilter);
  const tags = data?.pages
    .map((page) => page.result)
    .flat()
    .filter((tag) => !exisitingTags.includes(tag.id));

  const addTagMutation = useAdd(
    "tags/attach",
    () => {
      onSuccess(t("Tag Attached Successfully"));
      queryClient.refetchQueries({ queryKey: ["surah"], exact: false });
      form.reset();
    },
    () => onError(t("There was an error attaching the tag"))
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addTagMutation.mutate({
      ayah_id: ayahId,
      tag_id: values.tag_id,
      note: values.note,
    });
    setIsOpen(false);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tag_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Select Tag")}</FormLabel>
              <FormControl>
                <TagSelector
                  tags={tags || []}
                  search={search}
                  setSearch={setSearch}
                  setTag={(tagId) => {
                    field.onChange(tagId);
                    form.setValue("tag_id", tagId);
                  }}
                  tag={field.value}
                  onScrollEnd={() => {
                    if (hasNextPage && !isFetchingNextPage && !isFetching) {
                      fetchNextPage();
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Note")}</FormLabel>
              <FormControl>
                <Textarea placeholder={t("Add your note here")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{t("Attach Tag")}</Button>
      </form>
    </Form>
  );
}
