"use client";

import { useEffect, useState } from "react";

type ClientOnlyProps={

    children:React.ReactNode
}

const ClientOnly:React.FC<ClientOnlyProps> = ({children}) => {
  
  const[hasMounted,setHasMounted]=useState(false)
  useEffect(()=>{setHasMounted(true)})

  if(!hasMounted){return null}
  
    return (
    <div>
      <>
      {children}
      </>
    </div>
  )
}

export default ClientOnly