import { SurahsType } from "./enums";

export interface ITranslation {
  ar: string;
  en: string;
  ku: string;
}

export interface IQiraat {
  id: number;
  imam: ITranslation;
  riwaya: ITranslation;
  name: ITranslation;
}

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
  template: string;
  qcf_tajweed_template?: string | null;
  bookmarked: boolean;
  translation: string;
  qiraat_difference_text?: string | null;
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
  qiraat_reading_id?: number | null;
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
  qiraat_reading_id?: number;
  page?: number;
  per_page?: number;
  sort_by?: string;
  q?: string;
  with_images?: string;
}

export interface IUser {
  id: number;
  name: string;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface IBook {
  id: number;
  name: string;
  section_count: number;
}

export interface IBookSection {
  order_no: number;
  header_text: string;
  body_text: string;
  image_count: number;
}

export interface IBookSectionContent {
  section: {
    order_no: number;
    header_text: string;
    body_text: string;
    images?: { order: number; mime: string; data: string; filename: string }[];
    refs?: { ref_no: number; ref_text: string }[];
  };
  book: {
    name: string;
  };
}
