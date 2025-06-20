"use client"
import { signIn } from "next-auth/react"
import axios from "axios"
import { AiFillGithub } from "react-icons/ai"
import {FcGoogle} from "react-icons/fc"
import { useCallback,useState } from "react"
import{FieldValues,SubmitHandler,useForm} from "react-hook-form"
import useRegisterModal from "@/app/hooks/useRegisterModal"
import Modal from "./Modal"
import Heading from "../Heading"
import Input from "../inputs/Input"
import toast from "react-hot-toast"
import Button from "../Button"
import useLoginModal from "@/app/hooks/useLoginModal"
import { useRouter } from "next/navigation"

const LoginModal = () => {
  
  const router=useRouter()
  const registerModal=useRegisterModal()
  const loginModal=useLoginModal()
  const[isLoading,setIsLoading]=useState(false)
  const {register,
    handleSubmit,
    formState:{
        errors,
    }}=useForm<FieldValues>({
        defaultValues:{
            
            email:"",
            password:""


        }
    })
    const onSubmit:SubmitHandler<FieldValues>=(data)=>{
        signIn("credentials",{...data,redirect:false})
        .then((callback)=>{setIsLoading(false)
            if(callback?.ok){toast.success("Giriş Yapıldı!")
            router.refresh()
            loginModal.onClose()
            }
 })
       
    }
    const toggle=useCallback(()=>{loginModal.onClose();registerModal.onOpen()},[loginModal,registerModal])
    const bodyContent=( <div className=" flex flex-col gap-4">
        <Heading title="Tekrar Hoş Geldiniz" subtitle="Hesabınıza giriş yapın"/>
        <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required />
        <Input id="password" label="Password" type="password" disabled={isLoading} register={register} errors={errors} required />
        </div> )

    const footerContent=(
        <div className=" flex flex-col gap-4 mt-3">
            <hr className=" opacity-20"/>
            <Button outline label="Google ile giriş yap" icon={FcGoogle} onClick={()=>signIn("google")}/>
            <Button outline label="Github ile giriş yap" icon={AiFillGithub} onClick={()=>signIn("github")}/>
        
            <div className=" text-neutral-500 text-center mt-4 font-light">
                <div className="justify-center flex flex-row items-center gap-2">
                    <div>İlk defa mı Airbnb kullanıyorsunuz?</div>
                    <div onClick={toggle} className="text-neutral-800 cursor-pointer hover:underline">Kayıt ol</div>
                </div>
            </div>
        </div>
    )
    return (
    <Modal
    disabled={isLoading}
    isOpen={loginModal.isOpen}
    title="Giriş yap"
    actionLabel="Devam et"
    onClose={loginModal.onClose}
    onSubmit={handleSubmit(onSubmit)}
    body={bodyContent}
    footer={footerContent}

    />
  )
}

export default LoginModal
