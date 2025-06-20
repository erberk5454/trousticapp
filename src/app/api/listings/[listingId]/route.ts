import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from"@/app/libs/prismadb"


type TParams={
    listingId?:string
}

export async function DELETE(request:Request,{params}:{params:TParams}){
    const currentUser=await getCurrentUser()
    if(!currentUser){
        return NextResponse.error()
    }
    const {listingId}=params

    if(!listingId || typeof listingId!=="string"){
        throw new Error("Geçersiz ID")
    }

    const listing=await prisma.listing.deleteMany({
        where:{
            id:listingId,
            userId:currentUser.id
        }
    })

    return NextResponse.json(listing)
}