

import getCurrentUser from "@/app/actions/getCurrentUser"
import getListingById from "@/app/actions/getListingById"
import ClientOnly from "@/components/ClientOnly"
import EmptyState from "@/components/EmptyState"
import ListingClient from "./ListingClient"
import getReservations from "@/app/actions/getReservations"

type TParams={
  listingId?:string
}

const ListingPage = async ({params}:{params:TParams}) => {
  const reservations=await getReservations(params)
  const listing= await getListingById(params)
  const currentUser= await getCurrentUser()

  if(!listing){
    return (
      <ClientOnly>
        <EmptyState/>
      </ClientOnly>
    )
  }

  return (
  <ClientOnly>
    
      <ListingClient reservations={reservations??undefined} listing={listing} currentUser={currentUser}/>
  </ClientOnly>
  )
    
}

export default ListingPage