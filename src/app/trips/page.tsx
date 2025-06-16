import EmptyState from "@/components/EmptyState";
import ClientOnly from "@/components/ClientOnly";
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import TripsClient from "./TripsClient";


const TripsPage=async()=>{
    const currentUser=await getCurrentUser()
    if(!currentUser){
        return(
            <ClientOnly>
            <EmptyState title="Yetkisiz giriş yapamazsınız!" subtitle="Giriş yapın"/>
        </ClientOnly>
        )
    }
    const reservations=await getReservations({
        userId:currentUser.id
    })
    if(!reservations ||reservations.length===0){
        return(
            <ClientOnly>
                <EmptyState title="Rezervasyon bulunamadı" subtitle="Görünüşe göre hiç rezervasyon yapmamışsınız"/>
            </ClientOnly>
        )

    }

    return(
        <ClientOnly>
            <TripsClient reservations={reservations} currentUser={currentUser} />
        </ClientOnly>
    )

}

export default TripsPage