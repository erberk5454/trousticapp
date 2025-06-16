import EmptyState from "@/components/EmptyState";
import ClientOnly from "@/components/ClientOnly";
import getFavoriteListings from "../actions/getFavoriteListings";

import getCurrentUser from "../actions/getCurrentUser";
import FavoriteClient from "./FavoriteClient";


const FavoritesPage = async () => {

    const listings=await getFavoriteListings()
    const currentUser=await getCurrentUser()
    if(listings.length===0)
   { return (
        <ClientOnly>
            <EmptyState title="Favori yer bulunamadı." subtitle="Görünüşe göre hiç favori yeriniz yok."/>
        </ClientOnly>

      )}

    return (
        <ClientOnly>
            <FavoriteClient listings={listings} currentUser={currentUser}/>
        </ClientOnly>
    )
}
 
export default FavoritesPage;