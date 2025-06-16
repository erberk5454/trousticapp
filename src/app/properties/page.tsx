import EmptyState from "@/components/EmptyState";
import ClientOnly from "@/components/ClientOnly";
import getCurrentUser from "../actions/getCurrentUser";
import PropertiesClient from "./PropertiesClient";
import getListings from "../actions/getListings";





const PropertiesPage=async()=>{
    const currentUser=await getCurrentUser()
    if(!currentUser){
        return(
            <ClientOnly>
            <EmptyState title="Yetkisiz giriş yapamazsınız!" subtitle="Giriş yapın"/>
        </ClientOnly>
        )
    }
    const{ listings}=await getListings({
        userId:currentUser.id
    })
    if(!listings ||listings.length===0){
        return(
            <ClientOnly>
                <EmptyState title="Kayıt bulunamadı" 
                subtitle="Görünüşe göre hiç kaydınız yok"/>
            </ClientOnly>
        )

    }

    return(
        <ClientOnly>
            <PropertiesClient listings={listings} currentUser={currentUser} />
        </ClientOnly>
    )

}

export default PropertiesPage