import { SurahsType } from "./enums";

export interface IBookmark {
  id: number;
  ayah_id: number;
  user_id: number;
  ayah: IAayh;
}

export interface IAayh {
  id: number;
  text: string;
  number_in_surah: number;
  page: number;
  surah_id: number;
  hizb_id: number;
  juz_id: number;
  sajda: number;
  ayah_template: string;
  bookmarked: boolean;
  translation: string;
  audio?: string;
  tags: Partial<ITag>[];
  pure_text: string;
}

export interface ISurahs {
  id: number;
  number: number;
  name_ar: string;
  name_en: string;
  name_en_translation: string;
  type: SurahsType;
}

export interface IEdition {
  id: number;
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
}

export interface ITag {
  id: number;
  parent_id: number | null;
  name: string;
  all_children: ITag[];
  ayahs: IAayh[];
}

export interface ITagDashbaord {
  id: number;
  name: string;
  children_count: number;
  creator: IUser | null;
  updater: IUser | null;
  parent: ITagDashbaord | null;
}

export interface ITaggedAyah {
  id: number;
  ayah: IAayh;
  tag: ITagDashbaord;
  created_by: number | null;
  updated_by: number | null;
  updated_at: string | null;
  created_at: string;
}

export interface IFilter {
  revelation_order?: string;
  name?: string;
  type?: string;
  surah?: string;
  text_edition?: number;
  audio_edition?: number;
  page?: number;
  per_page?: number;
  sort_by?: string;
}

export interface IUser {
  id: number;
  name: string;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
}
