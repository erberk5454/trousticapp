"use client";
//harika

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
  onRemove: (url: string) => void;
};

const MAX_FILES = 30;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value, onRemove }) => {
  const handleUpload = useCallback(
    (result: any) => {
      const url = result.info?.secure_url;
      if (!url) return;
      if (value.includes(url)) {
        toast.error("Bu resim zaten eklendi.");
        return;
      }
      onChange([...value, url]);
    },
    [value, onChange]
  );

  return (
    <div className="space-y-4 relative">
      {/* Eğer hiç resim yoksa placeholder göster */}
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
          {(widgetApi) => (
            <div
              onClick={(e) => {
                e.preventDefault();
                widgetApi?.open();
              }}
              className="cursor-pointer hover:opacity-70 transition border-dashed border-2 p-10 border-neutral-300 flex flex-col items-center gap-4 text-neutral-600"
            >
              <TbPhotoPlus size={40} />
              <div className="font-semibold">Resim Yükleyin</div>
            </div>
          )}
        </CldUploadWidget>
      )}

      {/* Eğer resim varsa: yeşil buton + galeri */}
      {value.length > 0 && (
        <>
          {/* Yeşil buton sol üstte */}
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
  {(widgetApi) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        widgetApi?.open();
      }}
      className="absolute -top-4 left-0 z-10 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded-full shadow transition flex items-center gap-2"
    >
      <TbPhotoPlus size={18} />
      Resim Ekle
    </button>
  )}
</CldUploadWidget>


          {/* Galeri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[150px] overflow-y-auto max-h-[400px] pr-2 pt-6">
            {value.map((url, idx) => (
              <div
                key={url}
                className={clsx(
                  "relative overflow-hidden rounded-lg group",
                  idx === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
                )}
              >
                <Image src={url} alt={`img-${idx}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => onRemove(url)}
                  className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <MdClose size={20} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageUpload;
