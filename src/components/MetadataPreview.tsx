"use client";

import React from "react";
import Image from "next/image";

interface MetadataPreviewProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  siteName?: string;
}

export const MetadataPreview: React.FC<MetadataPreviewProps> = ({
  title,
  description,
  image = "/web-icon/og-image.png",
  url = "https://ourquran.com",
  siteName = "Our Quran",
}) => {
  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-50 rounded-xl border border-slate-200 mt-10">
      <h3 className="text-xl font-bold text-slate-800 mb-2">Social Sharing Preview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Facebook/LinkedIn Preview */}
        <div className="flex flex-col border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm max-w-sm">
          <div className="relative h-48 w-full bg-slate-200">
            <Image
              src={image}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="p-3 bg-[#f2f3f5] border-t border-slate-200">
            <div className="text-[12px] text-slate-500 uppercase tracking-wider mb-1">
              {new URL(url).hostname.toUpperCase()}
            </div>
            <div className="font-bold text-slate-900 line-clamp-1 text-[16px]">
              {title}
            </div>
            <div className="text-slate-600 text-[14px] line-clamp-2 mt-1">
              {description}
            </div>
          </div>
        </div>

        {/* Twitter Preview */}
        <div className="flex flex-col border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm max-w-sm">
          <div className="relative h-48 w-full">
            <Image
              src={image}
              alt="Twitter Preview"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[12px] px-2 py-0.5 rounded backdrop-blur-sm">
              {new URL(url).hostname}
            </div>
          </div>
          <div className="p-4">
            <div className="font-bold text-slate-900 line-clamp-1 mb-1">
              {title}
            </div>
            <div className="text-slate-500 text-[14px] line-clamp-2">
              {description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
