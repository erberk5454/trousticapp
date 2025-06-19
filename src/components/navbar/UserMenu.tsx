"use client";

import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import React, { useCallback, useState } from "react";
import MenuItem from "./MenuItem";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import { signOut } from "next-auth/react";
import { SafeUser } from "@/app/types";
import useRentModal from "@/app/hooks/useRentModal";
import { useRouter } from "next/navigation";

type UserMenuProps = {
  currentuser?: SafeUser | null;
};

const UserMenu: React.FC<UserMenuProps> = ({ currentuser }) => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const rentModal = useRentModal();
  const [isOpen, setIsOpen] = useState(false);
  const router=useRouter()

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const onRent = useCallback(() => {
    if (!currentuser) {
      return loginModal.onOpen();
    }
    rentModal.onOpen();
  }, [currentuser, loginModal, rentModal]);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onRent}
          className="whitespace-nowrap hidden lg:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
        >
          Evinizi Airbnb'ye Ekleyin
        </div>

        <div
          onClick={toggleOpen}
          className="
            p-2
            border-[1px] border-neutral-200 
            flex flex-row items-center gap-3 
            rounded-full cursor-pointer 
            hover:shadow-md transition
          "
        >
          {/* Menü ikonu sabit boyutta: */}
          <AiOutlineMenu size={24} className="text-neutral-600" />

          {/* Avatar sabit boyutta, yalnızca lg ve üstü: */}
          <div className="hidden lg:block">
            <Avatar src={currentuser?.image} className="h-9 w-9" />
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="
            absolute rounded-xl shadow-md 
            w-[40vw] md:w-[25vw] lg:w-[15vw]  overflow-hidden 
            right-0 top-12 text-sm bg-white bg-opacity-100 z-50
          "
        >
          <div className="flex flex-col cursor-pointer bg-white bg-opacity-100 z-50">
            {currentuser ? (
              <>
                <MenuItem onClick={() => {router.push('/trips');setIsOpen(false)}} label="Seyahatlerim" />
                <MenuItem onClick={() => {router.push('/favorites');setIsOpen(false)}} label="Favorilerim" />
                <MenuItem onClick={() => {router.push('/reservations');setIsOpen(false)}} label="Rezervasyonlarım" />
                <MenuItem onClick={() => {router.push('/properties');setIsOpen(false)}} label="Kayıtlarım" />
                <MenuItem
                  onClick={() => {
                    rentModal.onOpen();
                    setIsOpen(false);
                  }}
                  label="Benim evim Airbnb"
                />
                <hr className="opacity-20" />
                <MenuItem
                  onClick={() => {
                    signOut();
                    toggleOpen();
                  }}
                  label="Çıkış yap"
                />
              </>
            ) : (
              <>
                <MenuItem onClick={loginModal.onOpen} label="Giriş Yap" />
                <MenuItem onClick={registerModal.onOpen} label="Kayıt Ol" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
