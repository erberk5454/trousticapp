'use client'

import Container from "../Container"
import Logo from "./Logo"
import Search from "./Search"
import UserMenu from "./UserMenu"
import Categories from "./Categories"
import React, { useEffect, useState } from "react"
import { SafeUser } from "@/app/types"

type NavbarProps = {
  currentuser?: SafeUser | null
}

const Navbar: React.FC<NavbarProps> = ({ currentuser }) => {
  const [showCategories, setShowCategories] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setShowCategories(scrollY < 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-4 border-b-[1px] border-neutral-50/40">
        <Container>
          <div className='flex flex-row items-center justify-between gap-3 md:gap-0'>
            <Logo />
            <Search />
            <UserMenu currentuser={currentuser} />
          </div>
        </Container>
      </div>

     
      <Categories
  className={`
    transition-all duration-300 ease-in-out  overflow-y-hidden
    ${showCategories ? 'max-h-[80px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2 overflow-hidden pointer-events-none'}
  `}
/>
    </div>
  )
}

export default Navbar
