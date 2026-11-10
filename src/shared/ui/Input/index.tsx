import { ComponentProps } from "react";

interface InputProps extends ComponentProps<'input'> {
  label?: string;
  error?: string;
}

export const Input = ({ label = "", id, error, ...props}: InputProps) => {
  return (
    <div className="flex flex-col">
      {label && <label>{label}</label>}
      <input className="bg-gray-200 border border-gray-400" id={id} {...props} />
      {error && <p>{error}</p>}
    </div>
  );
}
