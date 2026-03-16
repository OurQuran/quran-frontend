import localFont from "next/font/local";

export const quranFont1 = localFont({
  src: "../../public/fonts/quran/quran_font_1.ttf",
  variable: "--font-quran-1",
  display: "swap",
});

export const quranFont2 = localFont({
  src: "../../public/fonts/quran/quran_font_2.otf",
  variable: "--font-quran-2",
  display: "swap",
});

export const quranFont3 = localFont({
  src: "../../public/fonts/quran/quran_font_3.ttf",
  variable: "--font-quran-3",
  display: "swap",
});

export const quranFont4 = localFont({
  src: "../../public/fonts/quran/quran_font_4.ttf",
  variable: "--font-quran-4",
  display: "swap",
});

export const quranFont5 = localFont({
  src: "../../public/fonts/quran/quran_font_5.ttf",
  variable: "--font-quran-5",
  display: "swap",
});

export const arkanGraphik = localFont({
  src: [
    {
      path: "../../public/fonts/kurdish/Arkan_Graphik-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/kurdish/Arkan_Graphik-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/kurdish/Arkan_Graphik-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/kurdish/Arkan_Graphik-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/kurdish/Arkan_Graphik-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/kurdish/Arkan_Graphik-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/kurdish/Arkan_Graphik-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/kurdish/Arkan_Graphik-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/kurdish/Arkan_Graphik-Super.ttf",
      weight: "1000",
      style: "normal",
    },
  ],
  variable: "--font-kurdish",
  display: "swap",
});
