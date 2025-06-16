"use client";

import useFavorite from "@/app/hooks/useFavorite";
import { SafeUser } from "@/app/types";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

type HeartButtonType = {
  listingId: string;
  currentUser?: SafeUser | null;
};

const HeartButton: React.FC<HeartButtonType> = ({ listingId, currentUser }) => {
  const { hasFavorited, toggleFavorite } = useFavorite({ listingId, currentUser });

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // 💥 Ana kapsayıcının tıklama olayını engeller
    toggleFavorite();
  };

  return (
    <div onClick={handleClick} className="relative hover:opacity-80 transition cursor-pointer">
      <AiOutlineHeart
        size={28}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <AiFillHeart
        size={24}
        className={hasFavorited ? "fill-rose-500" : "fill-neutral-500/70"}
      />
    </div>
  );
};

export default HeartButton;
