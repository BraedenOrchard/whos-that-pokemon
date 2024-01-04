import { useEffect, useRef, useState } from "react";

export default function CountdownTimer({isRoundCountdown, countdownLength} : {isRoundCountdown: boolean, countdownLength: number}){
  const [counter, setCounter] = useState<number>(countdownLength);

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter])

  //Change it to apply different classes based on the type of timer
  return(
    <div className={isRoundCountdown ? "countdown" : ""}>
      {
        counter > 0 ?
          <p className={isRoundCountdown ? "timer" : ""}>{counter}</p> :
          isRoundCountdown ? <p className="text-xl">GO!</p> : <></> //display GO after cd  if it's a round countdown
      }
    </div>
  )
}