import React from "react"
import { IPrimaryButton, IOptionButtonProps } from "../interfaces/IButton"

export const PrimaryButton: React.FC<IPrimaryButton> = ({text, onClick}) => {
  return(
    <button 
      className="flex bg-green-500 p-2 rounded button"
      onClick={() => onClick()}
    >{text}</button>
  )
}

export const OptionButton: React.FC<IOptionButtonProps> = ({ id, text, onClick, className }) => {
  return (
    <button id={String(id)} onClick={onClick} className={`button ${className}`}>
      {text}
    </button>
  );
};