import ClientOnly from "@/components/ClientOnly";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import getListings from "./actions/getListings";
import getCurrentUser from "./actions/getCurrentUser";
import ListingCard from "@/components/listings/ListingCard";
import Pagination from "@/components/Pagination";

export default async function Home({
  // searchParams artık bir Promise kabul ediliyor
  searchParams,
}: {
  searchParams: Promise<{ page?: string; userId?: string }>;
}) {
  // 1️⃣ searchParams'i await et
  const params = await searchParams;

  // 2️⃣ İçinden çek
  const page = parseInt(params.page ?? "1");
  const userId = params.userId;

  const { listings, totalPages } = await getListings({
    userId,
    page,
  });

  const currentUser = await getCurrentUser();

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Container>
        <div
          className="
            pt-24 
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3
            lg:grid-cols-4 
            xl:grid-cols-5
            2xl:grid-cols-6
            gap-8"
        >
          {listings.map((listing: any) => (
            <ListingCard
              currentUser={currentUser}
              key={listing.id}
              data={listing}
            />
          ))}
        </div>
        <Pagination currentPage={page} totalPages={totalPages} />
      </Container>
    </ClientOnly>
  );
}
