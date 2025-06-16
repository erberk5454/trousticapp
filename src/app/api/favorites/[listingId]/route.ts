
import {NextResponse} from "next/server"
import getCurrentUser from "@/app/actions/getCurrentUser"
import prisma from "@/app/libs/prismadb"

type IParams={
    listingId?:string
}

export  async function POST(request:Request,{params}:{params:IParams}) {
    const currentuser= await getCurrentUser()
    if(!currentuser){
        return NextResponse.error()
    }

    const {listingId}=await params
    if(!listingId||typeof listingId!=="string"){
        throw new Error("Invalid ID")
    }

    let favoriteIds=[...(currentuser.favoriteIds ||[])]
    favoriteIds.push(listingId)

    const user =await prisma.user.update({
        where:{
            id: currentuser.id
        },
        data:{
            favoriteIds
        }
    })
    return NextResponse.json(user)
    
}

export async function DELETE(request:Request,{params}:{params:IParams}) {
    const currentUser=await getCurrentUser()
    if(!currentUser){return NextResponse.error()}
    const{listingId}= await params
    if(!listingId||typeof listingId!=="string"){throw new Error("Invalıd ID")}
    let favoriteIds=[...(currentUser.favoriteIds||[])]
    favoriteIds=favoriteIds.filter((id)=>id!==listingId)
    const user= await prisma.user.update(
        {where:{id:currentUser.id},data:{favoriteIds}})

return NextResponse.json(user)

}
  
