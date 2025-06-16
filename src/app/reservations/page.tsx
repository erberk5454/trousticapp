import EmptyState from "@/components/EmptyState";
import ClientOnly from "@/components/ClientOnly";
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import ReservationClient from "./ReservationClient";

const ReservationPage = async () => {
    const currentUser=await getCurrentUser()
    if(!currentUser){
        return(
            <ClientOnly>
                <EmptyState 
                title="Yetkisiz Giriş Talebi" subtitle="Lütfen giriş yapın"/>
            </ClientOnly>
        )
    }
    const reservations=(await getReservations({
        authorId:currentUser.id
    })??[])

    if(reservations?.length===0){
        return(
            <ClientOnly>
                <EmptyState title="Rezervasyon bulunamadı." 
                subtitle="Görünüşe göre kayıdınıza rezervasyon yapılmamış"/>
            </ClientOnly>
        )
    }

    return(
        <ClientOnly>
            <ReservationClient
            reservations={reservations}  currentUser={currentUser}/>
        </ClientOnly>
    )


}
 
export default ReservationPage;