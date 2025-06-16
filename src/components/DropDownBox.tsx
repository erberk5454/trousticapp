"use client";

import { useMemo, useState } from "react";
import { locations } from "@/data/locations";
import { TextField, Autocomplete } from "@mui/material";

interface DropDownBoxProps {
  onSelect: (location: {
    label: string;
    value: string;
    latlng: [number, number];
    district: string;
  } | null) => void;
}

type OptionType = {
  label: string;
  value: string;
  latlng: [number, number];
  city: string;
  district: string;
};

const DropDownBox = ({ onSelect }: DropDownBoxProps) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

  const options: OptionType[] = useMemo(() => {
    return locations
      .filter((loc) => Array.isArray(loc.latlng) && loc.latlng.length === 2)
      .map((loc) => {
        const city = loc.city.charAt(0).toUpperCase() + loc.city.slice(1).toLowerCase();
        const district = loc.district.charAt(0).toUpperCase() + loc.district.slice(1).toLowerCase();
        return {
          label: `${district}, ${city}`,
          value: `${district}, ${city}`,
          latlng: [loc.latlng[0], loc.latlng[1]] as [number, number],
          city,
          district,
        };
      });
  }, []);

  const handleChange = (_: any, newValue: OptionType | null) => {
    setSelectedOption(newValue);
    if (newValue) {
      onSelect({
        label: newValue.label,
        value: newValue.value,
        latlng: newValue.latlng,
        district: newValue.district,
      });
    } else {
      onSelect(null);
    }
  };

  return (
    <Autocomplete
      options={options}
      value={selectedOption}
      onChange={handleChange}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => (
        <TextField {...params} label="Şehir Seçin" variant="outlined" />
      )}
      sx={{ width: "100%" }}
    />
  );
};

export default DropDownBox;
