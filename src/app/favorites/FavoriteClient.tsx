"use client"

import Container from "@/components/Container"
import { SafeListing, SafeUser } from "../types"
import Heading from "@/components/Heading"
import ListingCard from "@/components/listings/ListingCard"

type FavoriteClientProps={
    listings:SafeListing[]
    currentUser?:SafeUser|null
}

const FavoriteClient:React.FC<FavoriteClientProps> = ({
    listings,currentUser
}) => {
    return (
        <Container>
            <Heading title="Favoriler" subtitle="Favori yerlerinizin listesi"/>
             <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
            lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                {listings.map((listing)=>(
                    <ListingCard key={listing.id} data={listing} currentUser={currentUser}  />
                ))}
            </div>
        </Container>
      );
}
 
export default FavoriteClient;