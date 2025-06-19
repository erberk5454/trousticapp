// components/inputs/ImageUpload.tsx
"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useCallback } from "react";
import { TbPhotoPlus } from "react-icons/tb";
import { MdClose } from "react-icons/md";
import clsx from "clsx";
import toast from "react-hot-toast";

declare global {
  var cloudinary: any;
}

type ImageUploadProps = {
  onChange: (urls: string[]) => void;
  value: string[];
};

const MAX_FILES = 30;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  const handleUpload = useCallback(
    (result: any) => {
      const url = result.info.secure_url;
      if (!url) return;

      if (value.includes(url)) {
        toast.error("Bu resim zaten yüklendi.");
        return;
      }

      const updated = [...value, url];
      onChange(updated);
    },
    [value, onChange]
  );

  const handleRemove = useCallback(
    (url: string) => {
      const updated = value.filter((item) => item !== url);
      onChange(updated);
    },
    [value, onChange]
  );

  return (
    <div className="space-y-4">
      {/* Upload button */}
      {value.length < MAX_FILES && (
        <CldUploadWidget
          onSuccess={handleUpload}
          uploadPreset="ml_default"
          options={{
            maxFiles: MAX_FILES - value.length,
            maxFileSize: MAX_FILE_SIZE,
            multiple: true,
            resourceType: "image",
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open?.()}
              className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full text-white hover:bg-green-600 transition"
            >
              <TbPhotoPlus size={24} />
            </button>
          )}
        </CldUploadWidget>
      )}

      {/* Placeholder */}
      {value.length === 0 && (
        <CldUploadWidget
          onSuccess={handleUpload}
          uploadPreset="ml_default"
          options={{
            maxFiles: MAX_FILES,
            maxFileSize: MAX_FILE_SIZE,
            multiple: true,
            resourceType: "image",
          }}
        >
          {({ open }) => (
            <div
              className="cursor-pointer hover:opacity-70 transition border-dashed border-2 p-10 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-600"
              onClick={() => open?.()}
            >
              <TbPhotoPlus size={40} />
              <div className="font-semibold">Resim Yükleyin</div>
            </div>
          )}
        </CldUploadWidget>
      )}

      {/* Gallery */}
      {value.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[150px] overflow-y-auto max-h-[400px] pr-2">
          {value.map((url, index) => {
            const isLarge = index === 0;
            return (
              <div
                key={url}
                className={clsx(
                  "relative overflow-hidden rounded-lg group",
                  isLarge ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
                )}
              >
                <Image
                  src={url}
                  alt={`uploaded-${index}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(url)}
                  className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <MdClose size={18} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
