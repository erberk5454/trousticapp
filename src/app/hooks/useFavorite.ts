import { useCallback, useState } from "react";
import axios from "axios";
import { SafeUser } from "../types";
import { toast } from "react-hot-toast";

interface IUseFavorite {
  listingId: string;
  currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  const [optimisticState, setOptimisticState] = useState<boolean>(
    currentUser?.favoriteIds?.includes(listingId) || false
  );

  const toggleFavorite = useCallback(async () => {
    if (!currentUser) {
      return toast.error("Giriş yapmalısınız");
    }

    // UI'da hemen değiştir
    setOptimisticState((prev) => !prev);

    try {
      if (optimisticState) {
        await axios.delete(`/api/favorites/${listingId}`);
      } else {
        await axios.post(`/api/favorites/${listingId}`);
      }
    } catch (error) {
      // Eğer hata olursa geri al
      setOptimisticState((prev) => !prev);
      toast.error("Bir hata oluştu");
    }
  }, [currentUser, listingId, optimisticState]);

  return {
    hasFavorited: optimisticState,
    toggleFavorite,
  };
};

export default useFavorite;
