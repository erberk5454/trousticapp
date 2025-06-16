"use client"
import axios from "axios"
import { AiFillGithub } from "react-icons/ai"
import { FcGoogle } from "react-icons/fc"
import { useCallback, useState } from "react"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import useRegisterModal from "@/app/hooks/useRegisterModal"
import Modal from "./Modal"
import Heading from "../Heading"
import Input from "../inputs/Input"
import toast from "react-hot-toast"
import Button from "../Button"
import { signIn } from "next-auth/react"
import useLoginModal from "@/app/hooks/useLoginModal"

const RegisterModal = () => {
  const registerModal = useRegisterModal()
  const loginModal = useLoginModal()
  const toggle = useCallback(() => {
    loginModal.onOpen()
    registerModal.onClose()
  }, [loginModal, registerModal])

  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmpassword: ""
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    axios
      .post("/api/register", data)
      .then(() => {
        registerModal.onClose()
      })
      .catch(() => {
        toast.error("Bir şeyler ters gitti!")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Airbnb'ye Hoş Geldiniz" subtitle="Hesabınızı oluşturun!" />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        validationRules={{
          required: "Email gerekli",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Geçerli bir email girin"
          }
        }}
      />
      <Input
        id="name"
        label="İsim Soyisim"
        disabled={isLoading}
        register={register}
        errors={errors}
        validationRules={{
          required: "İsim gerekli"
        }}
      />
      <Input
        id="password"
        label="Şifre"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        validationRules={{
          required: "Şifre gerekli",
          minLength: { value: 6, message: "Şifre en az 6 karakter olmalı" }
        }}
      />
      <Input
        id="confirmpassword"
        label="Şifrenizi tekrar girin"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        validationRules={{
          required: "Şifreyi onaylayın",
          validate: (value: string) => value === getValues("password") || "Şifreler eşleşmiyor"
        }}
      />
    </div>
  )

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr className="opacity-20" />
      <Button outline label="Google ile giriş yap" icon={FcGoogle} onClick={() => signIn("google")} />
      <Button outline label="Github ile giriş yap" icon={AiFillGithub} onClick={() => signIn("github")} />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="justify-center flex flex-row items-center gap-2">
          <div>Hesabınız mı var?</div>
          <div onClick={toggle} className="text-neutral-800 cursor-pointer hover:underline">
            Giriş yap
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Kayıt ol"
      actionLabel="Devam et"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  )
}

export default RegisterModal
