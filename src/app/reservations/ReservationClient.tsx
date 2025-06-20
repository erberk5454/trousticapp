"use client"
import axios from "axios";
import { toast } from "react-hot-toast";
import React, { useCallback,useState } from "react";
import { useRouter } from "next/navigation";
import { SafeReservation,SafeUser } from "../types";
import Heading from "@/components/Heading";
import Container from "@/components/Container";
import ListingCard from "@/components/listings/ListingCard";

type ReservationClientProps={
    reservations:SafeReservation[] ,
    currentUser?:SafeUser|null
}

const ReservationClient:React.FC<ReservationClientProps>=({reservations,currentUser})=> {
   
   const router=useRouter()
   const [deletingId,setDeletingId]=useState("")
   const onCancel=useCallback((id:string)=>{
    setDeletingId(id)
    axios.delete(`api/reservations/${id}`)
    .then(()=>{
        toast.success("Rezervasyon iptal edildi.")
        router.refresh()
    })
    .catch(()=>{
        toast.error("Birşeyler ters gitti")
    })
    .finally(()=>{setDeletingId("")})
   },[router])
    return ( 
        <Container>
            <Heading title="Rezervasyonlar" subtitle="İşletmenize yapılan rezervasyonlar"/>
             <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
            lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {reservations.map((reservation)=>(
                    <ListingCard key={reservation.id} data={reservation.listing} 
                    actionId={reservation.id} onAction={onCancel} disabled={deletingId===reservation.id}
                    actionLabel="İptal et" currentUser={currentUser} reservation={reservation} />
                ))}
            </div>
        </Container>
     );
}
 
export default ReservationClient;