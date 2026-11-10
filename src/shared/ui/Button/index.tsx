import { ComponentProps } from "react";

interface ButtonProps extends ComponentProps<'button'> {
  label?: string;
}

export const Button = ({ label = "", ...props}: ButtonProps) => {
  return <button className="border border-gray-400 bg-gray-200 rounded-sm mt-2" {...props} >{label}</button>
}
