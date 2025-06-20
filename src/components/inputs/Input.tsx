"use client";

import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  Path,
} from "react-hook-form";

interface InputProps<T extends FieldValues> {
  id: Path<T>;  // burası önemli!
  label: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  formatPrice?: boolean;
  multiline?: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

const Input = <T extends FieldValues>({
  id,
  label,
  type = "text",
  required,
  disabled,
  formatPrice,
  multiline = false,
  register,
  errors,
}: InputProps<T>) => {
  const baseClasses = `
    peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed
    ${errors[id] ? "border-rose-500" : "border-neutral-300"}
    ${errors[id] ? "focus:border-rose-500" : "focus:border-black"}
  `;

  return (
    <div className="w-full relative">
      {multiline ? (
        <textarea
          id={id}
          disabled={disabled}
          {...register(id, { required })}
          placeholder=" "
          rows={4}
          className={baseClasses}
        />
      ) : (
        <input
          id={id}
          disabled={disabled}
          {...register(id, { required })}
          placeholder=" "
          type={type}
          className={baseClasses}
        />
      )}

      <label
        htmlFor={id}
        className={`
          absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0]
          left-4 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
          peer-focus:scale-75 peer-focus:-translate-y-3
          ${errors[id] ? "text-rose-500" : "text-zinc-400"}
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
