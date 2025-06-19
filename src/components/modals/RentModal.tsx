"use client";

import React, { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import Modal from "./Modal";
import Heading from "../Heading";
import { categories } from "../navbar/Categories";
import CategoryInput from "@/components/inputs/CategoryInput";
import DropDownBox from "../DropDownBox";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";
import useRentModal from "@/app/hooks/useRentModal";
import { LocationValue } from "../Map";

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

export interface RentFormValues {
  category: string;
  location: LocationValue | null;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  imageSrc: string[];
  title: string;
  description: string;
  price: number;
}

const RentModal: React.FC = () => {
  const rentModal = useRentModal();
  const router = useRouter();
  const [step, setStep] = useState(STEPS.CATEGORY);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
    reset,
  } = useForm<RentFormValues>({
    mode: "onTouched",
    defaultValues: {
      category: "",
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: [],
      title: "",
      description: "",
      price: 1,
    },
  });

  const category = watch("category");
  const location = watch("location");
  const imageSrc = watch("imageSrc");

  const onDropdownSelect = useCallback(
    (val: { label: string; value: string; latlng: [number, number] } | null) => {
      if (val) {
        const loc: LocationValue = {
          lat: val.latlng[0],
          lng: val.latlng[1],
          address: val.value,
        };
        setValue("location", loc, { shouldValidate: true, shouldDirty: true });
      } else {
        setValue("location", null, { shouldValidate: true, shouldDirty: true });
      }
    },
    [setValue]
  );

  const onMapChange = useCallback(
    (loc: LocationValue) => {
      setValue("location", loc, { shouldValidate: true, shouldDirty: true });
    },
    [setValue]
  );

  const onBack = () => setStep((prev) => prev - 1);

  const onNext = async () => {
    const fieldMap: Record<number, Array<keyof RentFormValues>> = {
      [STEPS.CATEGORY]: ["category"],
      [STEPS.LOCATION]: ["location"],
      [STEPS.INFO]: ["guestCount", "roomCount", "bathroomCount"],
      [STEPS.IMAGES]: ["imageSrc"],
      [STEPS.DESCRIPTION]: ["title", "description"],
      [STEPS.PRICE]: ["price"],
    };

    const valid = await trigger(fieldMap[step] || []);
    if (valid) setStep((prev) => prev + 1);
  };

  const onSubmit: SubmitHandler<RentFormValues> = (data) => {
    if (step !== STEPS.PRICE) return onNext();
    setIsLoading(true);
    axios
      .post("/api/listings", data)
      .then(() => {
        toast.success("Kayıt oluşturuldu!");
        router.refresh();
        reset();
        setStep(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch(() => toast.error("Bir şeyler ters gitti!"))
      .finally(() => setIsLoading(false));
  };

 // Çoklu görsel yükleme yönetimi
const handleImagesChange = useCallback(
  (newImages: string[]) => {
    setValue("imageSrc", newImages, {
      shouldValidate: true,
      shouldDirty: true,
    });
  },
  [setValue]
);
  const handleRemoveImage = (url: string) => {
    const updated = imageSrc.filter((item) => item !== url);
    setValue("imageSrc", updated, { shouldValidate: true, shouldDirty: true });
  };

  const actionLabel = useMemo(
    () => (step === STEPS.PRICE ? "Oluştur" : "Sonraki"),
    [step]
  );

  const secondaryActionLabel = useMemo(
    () => (step === STEPS.CATEGORY ? undefined : "Geri"),
    [step]
  );

  const Map = useMemo(() => dynamic(() => import("../Map"), { ssr: false }), []);

  let bodyContent: React.ReactNode = null;

  if (step === STEPS.CATEGORY) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Kategori seçin" subtitle="Yerinizi tanımlayın" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
          {categories.map((item) => (
            <div
              key={item.label}
              onClick={() => setValue("category", item.label, { shouldValidate: true })}
              className="cursor-pointer"
            >
              <CategoryInput
                selected={category === item.label}
                label={item.label}
                icon={item.icon}
              />
            </div>
          ))}
        </div>
        {errors.category && (
          <p className="text-rose-500">{errors.category.message}</p>
        )}
      </div>
    );
  }

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title="Konum"
          subtitle="Haritaya çift tıklayarak yerinizi seçin."
        />

        <DropDownBox onSelect={onDropdownSelect} />

        {location?.address && (
          <p className="text-sm text-gray-700">
            Seçilen: <span className="font-medium">{location.address}</span>
          </p>
        )}

        <div className="h-60 rounded-lg overflow-hidden">
          <Map
            key={location ? `${location.lat}-${location.lng}` : "default-map"}
            center={location ? { lat: location.lat, lng: location.lng } : undefined}
            selectable
            onChange={onMapChange}
            markerPosition={location ? { lat: location.lat, lng: location.lng } : null}
          />
        </div>

        {errors.location && (
          <p className="text-rose-500">{(errors.location as any).message}</p>
        )}
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Detaylar" subtitle="Misafir sayılarını belirtin" />
        <Counter
          onChange={(v) => setValue("guestCount", v)}
          title="Misafir"
          subtitle="Kaç kişi?"
          value={watch("guestCount")}
        />
        <Counter
          onChange={(v) => setValue("roomCount", v)}
          title="Oda"
          subtitle="Kaç oda?"
          value={watch("roomCount")}
        />
        <Counter
          onChange={(v) => setValue("bathroomCount", v)}
          title="Banyo"
          subtitle="Kaç banyo?"
          value={watch("bathroomCount")}
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-6">
        <Heading title="Fotoğraflar" subtitle="Yerinize ait görselleri yükleyin." />

        <ImageUpload value={imageSrc} onChange={handleImagesChange} />

        {errors.imageSrc && (
          <p className="text-rose-500">{errors.imageSrc.message}</p>
        )}
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Açıklama" subtitle="Yerinizi detaylandırın" />
        <Input<RentFormValues> id="title" label="Başlık" register={register} errors={errors} required />
        <Input<RentFormValues>
          id="description"
          label="Açıklama"
          register={register}
          errors={errors}
          required
          multiline
        />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Fiyat" subtitle="Gecelik ücret" />
        <Input<RentFormValues>
          id="price"
          label="Fiyat"
          formatPrice
          register={register}
          errors={errors}
          required
          type="number"
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={rentModal.isOpen}
      onClose={rentModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step > STEPS.CATEGORY ? onBack : undefined}
      disabled={isLoading}
      title="Evini Kirala"
      body={bodyContent}
    />
  );
};

export default RentModal;
