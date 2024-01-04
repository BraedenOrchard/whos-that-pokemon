'use client'
import React, { useEffect, useState } from "react";
import { PrimaryButton, OptionButton } from "./components/Buttons";
import { randomIndex } from "./lib/game";
import CountdownTimer from "./components/CountdownTimer";
import { fetchList } from "./lib/pokeapi";
import { IPokemon } from "./interfaces/IPokemon";

const Home: React.FC = () => {
  const [pokemon, setPokemon] = useState<IPokemon[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<IPokemon[]>([]);
  const [correctOption, setCorrectOption] = useState<IPokemon | null>(null);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [winState, setWinState] = useState<boolean | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [isCountdown, setIsCountdown] = useState<boolean>(false);
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
  const [roundCounter, setRoundCounter] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [playerSelection, setPlayerSelection] = useState<number | null>(null);

  const handleSelectedOption = (key: number) => {
    setIsGameRunning(false);
    if (isGameRunning) {
      checkButtons();
      if (correctOption && key === correctOption.id) {
        setWinState(true);
      } else {
        setWinState(false);
      }
      setVisible(true);
    }
  };

  useEffect(() => {
    const fetchListData = async () => {
      try {
        const data = await fetchList();
        setPokemon(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchListData();
  }, [winState]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isGameRunning) {
        switch (event.key) {
          case "1":
          case "2":
          case "3":
          case "4":
            const selectedIndex = Number(event.key) - 1; // Adjust to 0-based index
            const selectedID = selectedOptions[selectedIndex]?.id;
            handleRoundFinish(selectedID);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGameRunning, handleSelectedOption]);

  useEffect(() => {
    if (isGameRunning && correctOption) {
      setTimeout(() => {
        handleRoundFinish();
      }, 5000);
    }
  }, [isGameRunning, correctOption, playerSelection]);

  useEffect(() => {
    if(!isGameRunning && correctOption){
      handleStreak();
    }
  }, [winState, playerSelection, correctOption, isGameRunning])

  const handleStreak = () => {
    console.log("aqsdf")
    if(winState === true){
      console.log('1')
      setStreak((prevStreak) => prevStreak + 1) 
    }
    else if(winState === false){ 
      console.log('2')
      setStreak(0) 
    }
    else if(playerSelection === null){
      console.log("3")
    }
  }

  const selectGameChoices = () => {
    const shuffledList = pokemon.sort(() => Math.random() - 0.5);
    const selection = shuffledList.slice(0, 4);
    const winnerIndex = randomIndex();
    setSelectedOptions(selection);
    setCorrectOption(selection[winnerIndex]);
  };

  const checkButtons = () => {
    for (let x in selectedOptions) {
      const currentButton = document.getElementById(`${selectedOptions[x].id}`);
      if (selectedOptions[x].id === correctOption?.id) {
        currentButton?.classList.add("winner");
      } else {
        currentButton?.classList.add("loser");
      }
    }
  };

  const handleRoundFinish = (selectedID?: number) => {
    setIsGameRunning(false);
    setVisible(true);
    
    if (correctOption) {
      checkButtons();
    }
    if (selectedID) {
      setPlayerSelection(selectedID)
      correctOption && selectedID === correctOption.id
        ? setWinState(true)
        : setWinState(false)
    }
  };

  const handleGameStart = () => {
    setRoundCounter((prevCount) => prevCount + 1);
    setIsCountdown(true);
    setWinState(null);
    selectGameChoices();
    setIsGameStarted(true);
    setPlayerSelection(null)

    setTimeout(() => {
      setIsCountdown(false);
      setIsGameRunning(true);
      setVisible(false);
    }, 3500);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      {isCountdown ? (
        <CountdownTimer isRoundCountdown={true} countdownLength={3} />
      ) : isGameStarted ? (
        <>
          <img
            width={250}
            height={250}
            src={correctOption?.image}
            className={visible ? "visible" : "blank"}
          />
          <div className="flex-row">
            {selectedOptions.map((p) => (
              <OptionButton
                key={p.id}
                id={p.id}
                text={p.name.toUpperCase()}
                onClick={() => handleRoundFinish(p.id)}
              />
            ))}
          </div>
          <span>Round {roundCounter}</span>
          <span>Streak: {streak}</span>
          {isGameRunning ? (
            <CountdownTimer isRoundCountdown={false} countdownLength={5} />
          ) : (
            <button onClick={handleGameStart}>Play again?</button>
          )}
        </>
      ) : (
        <PrimaryButton onClick={handleGameStart} text="Let's play!" />
      )}
    </main>
  );
};

export default Home;
