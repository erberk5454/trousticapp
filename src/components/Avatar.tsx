"use client"

import Image from "next/image"
import React from "react"

type AvatarProps = {
  src?: string | null
  className?: string
}

const Avatar: React.FC<AvatarProps> = ({ src, className }) => {
  return (
    <div className={
      `relative rounded-full overflow-hidden ${className || ""}`
    }>
      <Image
        src={src || "/images/avatar.png"}
        alt="Avatar"
        fill
        sizes="(max-width: 768px) 100vw, 30px"
        style={{ objectFit: "cover" }}
      />
    </div>
  )
}

export default Avatar
