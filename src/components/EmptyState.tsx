"use client";

import { useRouter } from "next/navigation"
import Heading from "./Heading"
import Button from "./Button";

type EmptyStateProps={title?:string,subtitle?:string,showReset?:boolean,}


const EmptyState:React.FC<EmptyStateProps> = ({
    title="Arama kriterlerine uygun sonuç bulunamadı!",
    subtitle="Filtrelerinizi değiştirmeyi denyin",
    showReset}) => {

    const router=useRouter()
  return (
    <div className=" h-[60vh] flex flex-col gap-2 justify-center items-center">

        <Heading center title={title} subtitle={subtitle}/>
        <div className="w-48 mt-4" >
            {showReset && ( <Button outline label="Tüm filtreleri kaldır   " onClick={()=>router.push("/")}    /> )}
        </div>
      
    </div>
    
  )
}

export default EmptyState