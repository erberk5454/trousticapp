"use client"

import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { SafeReservation,SafeUser } from "../types";
import React, { useCallback, useState } from "react";
import Heading from "@/components/Heading";
import axios from "axios";
import toast from "react-hot-toast";
import ListingCard from "@/components/listings/ListingCard";

type TripsClientProps={

    reservations:SafeReservation[],
    currentUser?:SafeUser | null
}

const TripsClient:React.FC<TripsClientProps> = ({reservations,currentUser}) => {
    
    const router=useRouter()
    const[deletingId,setDeletingId]=useState("")
    const onCancel=useCallback((id:string)=>{
        setDeletingId(id)
        axios.delete(`/api/reservations/${id}`)
        .then(()=>{toast.success("Rezervasyon iptal edildi ")
            router.refresh()
        })
        .catch((error)=>{
            toast.error(error?.response?.data?.console.error);}
            )
        .finally(()=>{
                setDeletingId("")
            })
        


    },[router])
    
    return (  
        <Container>
            <Heading title="Seyahatleriniz" subtitle="Bulunduğunuz ve Gideceğiniz yerler"/>
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
export default TripsClient