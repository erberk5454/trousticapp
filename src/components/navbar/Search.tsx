"use client";

import useSearchModal from "@/app/hooks/useSearchModal";
import { BiSearch } from "react-icons/bi";

const Search = () => {

  const searchModal=useSearchModal()
  return (
    <div className="w-[650px] h-[55px] bg-white shadow-md rounded-full flex items-center overflow-hidden text-[0.875rem] border border-neutral-200">
      
      {/* Lokasyon Bölümü */}
      <div className="relative w-full sm:w-[30%] mx-0 sm:mx-[2px] px-[1.2rem] py-[0.8rem] group hover:bg-neutral-100 focus-within:bg-neutral-100 hover:rounded-full focus-within:rounded-full transition flex flex-col cursor-pointer">
        <p className="text-[0.875rem] font-medium whitespace-nowrap">Yer</p>
        <input
          type="text"
          placeholder="Gidilecek yeri arayın"
          className="bg-transparent border-none pt-[0.2rem] text-[0.875rem] placeholder:text-[0.875rem] outline-none w-full rounded-none focus:rounded-none whitespace-nowrap"
        />
        <div className="hidden sm:block absolute top-1/2 right-0 transform -translate-y-1/2 w-px h-2/3 bg-neutral-200 group-hover:hidden group-focus-within:hidden"></div>
      </div>

      {/* Check In Bölümü */}
      <div className="hidden sm:flex relative w-[20%] mx-[2px] px-[1.2rem] py-[0.8rem] group hover:bg-neutral-100 focus-within:bg-neutral-100 hover:rounded-full focus-within:rounded-full transition flex-col cursor-pointer">
        <p className="text-[0.875rem] font-medium whitespace-nowrap">Giriş</p>
        <input
          type="text"
          placeholder="Tarih seçin"
          className="bg-transparent border-none pt-[0.2rem] text-[0.875rem] placeholder:text-[0.875rem] outline-none w-full rounded-none focus:rounded-none whitespace-nowrap"
        />
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-px h-2/3 bg-neutral-200 group-hover:hidden group-focus-within:hidden"></div>
      </div>

      {/* Check Out Bölümü */}
      <div className="hidden sm:flex relative w-[20%] mx-[2px] px-[1.2rem] py-[0.8rem] group hover:bg-neutral-100 focus-within:bg-neutral-100 hover:rounded-full focus-within:rounded-full transition flex-col cursor-pointer">
        <p className="text-[0.875rem] font-medium whitespace-nowrap">Çıkış</p>
        <input
          type="text"
          placeholder="Tarih seçin"
          className="bg-transparent border-none pt-[0.2rem] text-[0.875rem] placeholder:text-[0.875rem] outline-none w-full rounded-none focus:rounded-none whitespace-nowrap"
        />
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-px h-2/3 bg-neutral-200 group-hover:hidden group-focus-within:hidden"></div>
      </div>

      {/* Guests ve Arama Bölümü */}
      <div className="hidden sm:flex relative w-[30%] mx-[2px] pl-[1.2rem] pr-[3rem] py-[0.8rem] group hover:bg-neutral-100 focus-within:bg-neutral-100 hover:rounded-full focus-within:rounded-full transition flex items-center cursor-pointer">
        <div className="flex flex-col">
          <p className="text-[0.875rem] font-medium whitespace-nowrap">Kişiler</p>
          <input
            type="text"
            placeholder="Misafir ekleyin"
            className="bg-transparent border-none pt-[0.2rem] text-[0.875rem] placeholder:text-[0.875rem] outline-none w-full rounded-none focus:rounded-none whitespace-nowrap"
          />
        </div>
        <span onClick={(e)=>{e.stopPropagation()}} className="absolute right-[10px] top-1/2 transform -translate-y-1/2 bg-[#FF385C] text-white text-[0.875rem] p-[0.7rem] rounded-full">
          <BiSearch size={16} />
        </span>
      </div>
    </div>
  );
};

export default Search;
