import React from "react"
import { IButton } from "../interfaces/IButton"

export const PrimaryButton: React.FC<IButton> = ({text, onClick}) => {
  return(
    <button 
      className="flex bg-green-500 p-2 rounded button"
      onClick={() => onClick()}
    >{text}</button>
  )
}

export const OptionButton: React.FC<IButton> = ({id, text, buttonState, onClick}) => {
  return(
    <button id={''+id} className={'button'} onClick={() => onClick()}>{text}</button>
  )
}