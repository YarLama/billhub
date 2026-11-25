import { ComponentProps, ReactNode } from "react";

interface ButtonProps extends ComponentProps<'button'> {
  label?: string;
  children?: ReactNode;
}

export const Button = ({ label = "", children, ...props}: ButtonProps) => {
  return <button className="border border-gray-400 bg-gray-200 rounded-sm mt-2" {...props} >{children ?? label}</button>
}
