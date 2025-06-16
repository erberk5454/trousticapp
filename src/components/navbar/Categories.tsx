'use client'

import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import Container from "../Container";
import {
  GiBarn, GiBoatFishing, GiCactus, GiCastle, GiCaveEntrance,
  GiForestCamp, GiIsland, GiWindmill
} from "react-icons/gi";
import { MdOutlineVilla } from "react-icons/md";
import { usePathname, useSearchParams } from "next/navigation";
import { FaSkiing } from "react-icons/fa";
import { BsSnow } from "react-icons/bs";
import { IoDiamond } from "react-icons/io5";
import CategoryBox from "../CategoryBox";
import React from "react";

interface CategoriesProps {
  className?: string;
}

export const categories = [
  { label: "Plaj", icon: TbBeach, description: "Burası plaja çok yakın!" },
  { label: "DeğirmenEv", icon: GiWindmill, description: "Burada yel değirmeni var!" },
  { label: "Modern", icon: MdOutlineVilla, description: "Burası modern dizayn edilmiş!" },
  { label: "Kasaba", icon: TbMountain, description: "Burası küçük bir kasabada!" },
  { label: "YüzmeHavuzlu", icon: TbPool, description: "Burada yüzme havuzu var!" },
  { label: "Ada", icon: GiIsland, description: "Bu yer bir ada da yer alıyor!" },
  { label: "Göl", icon: GiBoatFishing, description: "Bu yer göle çok yakın!" },
  { label: "Kayak", icon: FaSkiing, description: "Burada kayak aktivitesi var!" },
  { label: "Kaleler", icon: GiCastle, description: "Burası bir kale!" },
  { label: "Camping", icon: GiForestCamp, description: "Burada kamp yapılabiliyor!" },
  { label: "Dondurucu", icon: BsSnow, description: "Burası biraz dondurucu!" },
  { label: "Mağara", icon: GiCaveEntrance, description: "Bu yer bir mağarada!" },
  { label: "Çöl", icon: GiCactus, description: "Bu yer bir çölde!" },
  { label: "Ambar", icon: GiBarn, description: "Burası ahıra benziyor!" },
  { label: "Lux", icon: IoDiamond, description: "bu yer gerçekten lüx!" }
]

const Categories: React.FC<CategoriesProps> = ({ className }) => {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();
  const isMainPage = pathname === "/";

  if (!isMainPage) return null;

  return (
    <Container>
      <div className={`pt-4 flex flex-row items-center justify-between overflow-x-auto transition-all duration-300 ease-in-out ${className}`}>
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            selected={category === item.label}
            icon={item.icon}
          />
        ))}
      </div>
    </Container>
  );
};

export default Categories;
