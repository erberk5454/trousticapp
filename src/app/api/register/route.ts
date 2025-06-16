import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";


export async function POST(request:Request) {
  const body=await request.json();
  const email=body.email;
  const name=body.name;
  const password=body.password;


const hashedPassword=await bcrypt.hash(password,12)
const user= await prisma.user.create({
    data:{
        email,
        name,
        hashedPassword
    }
});

return NextResponse.json(user);

}
