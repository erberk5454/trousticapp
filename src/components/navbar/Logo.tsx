"use client";
import Image from "next/image";
import { useRouter } from 'next/navigation';

const Logo = () => {
    const router=useRouter();

  return (
    <>
    <Image onClick={()=>router.push("/")} alt='Logo' className='hidden md:block cursor-pointer' 
    height={150} width={150} src="/images/logo.png"/>
     <Image onClick={()=>router.push("/")} alt='Logo2' className='block md:hidden cursor-pointer' 
    height={50} width={50} src="/images/air2logo.png"/>
    </>
  )
}

export default Logo