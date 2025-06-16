"use client"
import { useEffect, useMemo } from "react"
import{io} from "socket.io-client"



const page = () => {
    const socket =useMemo(()=>{
        return io("http://localhost:4000",{
    transports: ["websocket"]   })},[])

 useEffect(() => {
    // socket tanımlıysa bağlan ve olayları dinle
    socket.on("connect", () => {
      console.log("Soket bağlandı",socket.id);
      socket.emit("veri",[3,3,5,7])
      socket.on("geri",(data)=>{console.log(data)})

    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);
  return (
    <div>
      Soket sayfası deneme
    </div>
  )
}

export default page
