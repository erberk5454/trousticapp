"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";

type PaginationProps = {
  totalPages: number;
  currentPage:number
};

const Pagination: React.FC<PaginationProps> = ({ totalPages }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Sayfa numarasını al, yoksa 1
  const currentPageParam = searchParams?.get("page");
  const currentPage = currentPageParam ? Number(currentPageParam) : 1;

  // Sayfa değiştir fonksiyonu
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams as any);
    if (page === 1) {
      // 1. sayfa ise page parametresini kaldırabiliriz (isteğe bağlı)
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }

    router.push(`?${params.toString()}`);
  };

  // Sayfa numaralarını göster (örnek: 1 2 3 4 5 ...)
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      {/* Geri butonu */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`px-3 py-1 rounded border ${
          currentPage <= 1 ? "cursor-not-allowed opacity-50" : "hover:bg-gray-200"
        }`}
      >
        Geri
      </button>

      {/* Sayfa numaraları */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-3 py-1 rounded border ${
            page === currentPage
              ? "bg-rose-500 text-white border-rose-500"
              : "hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}

      {/* İleri butonu */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`px-3 py-1 rounded border ${
          currentPage >= totalPages
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-gray-200"
        }`}
      >
        İleri
      </button>
    </div>
  );
};

export default Pagination;
