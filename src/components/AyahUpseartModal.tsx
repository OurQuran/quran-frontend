import useInfiniteScroll from "@/react-query/useInfiniteScroll";
import { IFilter, ITag, ITagDashbaord } from "@/types/generalTypes";
import AppDialog from "./AppDialog";
import { Button } from "./ui/button";
import TagSelector from "./TagSelector";
import { useTranslation } from "react-i18next";
import useAdd from "@/react-query/useAdd";
import { onError, onSuccess } from "@/helpers/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { FormLabel, FormMessage } from "./ui/form";
import { useState } from "react";
import { Input } from "./ui/input";
import useUpdate from "@/react-query/useUpdate";
import { useQueryClient } from "@tanstack/react-query";

export function AyahUpsertModal({
  isOpen,
  setIsOpen,
  selectedTag,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedTag: ITagDashbaord | null;
}) {
  const [t] = useTranslation("global");

  return (
    <AppDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title={selectedTag ? t("Update Tag") : t("Create Tag")}
      description={
        selectedTag ? t("Update the selected tag") : t("Create a new tag")
      }
    >
      <UpsertTag setIsOpen={setIsOpen} selectedTag={selectedTag} />
    </AppDialog>
  );
}
function UpsertTag({
  setIsOpen,
  selectedTag,
}: {
  setIsOpen: (isOpen: boolean) => void;
  selectedTag: ITagDashbaord | null;
}) {
  const [search, setSearch] = useState("");
  const [t] = useTranslation("global");
  const queryClient = useQueryClient();
  const formSchema = z.object({
    parent_id: z.number().optional(),
    name: z.string().min(1, t("Tag name is required")),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: selectedTag
      ? {
          name: selectedTag.name,
          parent_id: selectedTag.parent ? selectedTag.parent.id : undefined,
        }
      : {},
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteScroll<ITag>("tags/search", {
      per_page: 15,
      name: search,
    } as IFilter);

  const tags = data?.pages.map((page) => page.result).flat();

  if (
    selectedTag &&
    selectedTag?.parent &&
    !tags?.find((tag) => tag.id === selectedTag?.parent?.id)
  ) {
    tags?.unshift({
      name: selectedTag.parent.name,
      id: selectedTag.parent.id,
    } as ITag);
  }

  const addTagMutation = useAdd(
    "tags",
    () => {
      onSuccess(t("Tag Added Successfully"));
      queryClient.refetchQueries({
        queryKey: ["tags/dashboard"],
        exact: false,
      });
      setIsOpen(false);
      form.reset();
    },
    () => onError(t("There was an error adding the tag"))
  );

  const updateTagMutation = useUpdate(
    "tags",
    () => {
      onSuccess(t("Tag Updated Successfully"));
      setIsOpen(false);
      queryClient.refetchQueries({
        queryKey: ["tags/dashboard"],
        exact: false,
      });
      form.reset();
    },
    () => onError(t("There was an error updating the tag"))
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    selectedTag
      ? updateTagMutation.mutate({ id: selectedTag.id + "", data: values })
      : addTagMutation.mutate(values);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("Tag name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parent_id"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>{t("Parent Tag")}</FormLabel>
              </div>
              <FormControl>
                <TagSelector
                  tags={tags || []}
                  search={search}
                  setSearch={setSearch}
                  setTag={(tagId) => {
                    field.onChange(tagId);
                    form.setValue("parent_id", tagId);
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

        <Button type="submit">
          {selectedTag ? t("Updated Tag") : t("Add Tag")}
        </Button>
      </form>
    </Form>
  );
}
