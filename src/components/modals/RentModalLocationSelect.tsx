"use client";

import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";
import { locations } from "@/data/locations";

interface LocationOption {
  label: string;
  value: string;
  latlng: [number, number];
  city: string;
  district: string;
}

export default function RentModalLocationSelect() {
  const { setValue } = useFormContext();
  const [selected, setSelected] = useState<LocationOption | null>(null);

  const options: LocationOption[] = useMemo(() => {
    return locations.map((loc) => {
      const city =
        loc.city.charAt(0).toUpperCase() + loc.city.slice(1).toLowerCase();
      const district =
        loc.district.charAt(0).toUpperCase() +
        loc.district.slice(1).toLowerCase();
      return {
        label: `${district}, ${city}`,
        value: `${district}, ${city}`,
        latlng: (loc.latlng || [0, 0]) as [number, number],
        city,
        district,
      };
    });
  }, []);

  const handleChange = (_: any, newValue: LocationOption | null) => {
    setSelected(newValue);
    setValue("location", newValue);
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Şehir veya İlçe Seçin
      </label>
      <Autocomplete
        options={options}
        value={selected}
        onChange={handleChange}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          <TextField {...params} label="Şehir / İlçe" variant="outlined" />
        )}
        isOptionEqualToValue={(option, value) =>
          option.value === value.value && option.label === value.label
        }
        filterSelectedOptions
      />
    </div>
  );
}
