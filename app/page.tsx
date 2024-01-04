'use client'
import React, { useEffect, useState, useRef } from "react";
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
  const [buttonStyles, setButtonStyles] = useState<{ [key: number]: string }>({});

  const handleOptionClick  = (key: number) => {
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
  }, [isGameRunning, handleOptionClick ]);

  useEffect(() => {
    if (isCountdown) {
      // Countdown is in progress, wait for it to finish
      setTimeout(() => {
        setIsCountdown(false);
        setIsGameRunning(true);
        setVisible(false);
        setPlayerSelection(null);
      }, 3000);
    }
  }, [isCountdown]);

  useEffect(() => {
    if (isGameRunning) {
      // Game is running, set the timeout for handling the round finish
      const timeoutId = setTimeout(() => {
        handleRoundFinish();
      }, 5000);

      // Clear the timeout if the component unmounts or game state changes
      return () => clearTimeout(timeoutId);
    }
  }, [isGameRunning, correctOption, playerSelection]);

  useEffect(() => {
    handleStreak();
  }, [winState, playerSelection, visible])

  const handleStreak = () => {
    if (winState === true) {
      setStreak((prevStreak) => prevStreak + 1);
    } else if (winState === false) {
      setStreak(0);
    } else if (playerSelection === null && visible) {
      setStreak(0); 
    }
  };
  
  const selectGameChoices = () => {
    const shuffledList = pokemon.sort(() => Math.random() - 0.5);
    const selection = shuffledList.slice(0, 4);
    const winnerIndex = randomIndex();
    setSelectedOptions(selection);
    setCorrectOption(selection[winnerIndex]);
  
    // Initialize button styles
    const initialButtonStyles: { [key: number]: string } = {};
    selection.forEach((pokemon) => {
      initialButtonStyles[pokemon.id] = '';
    });
    setButtonStyles(initialButtonStyles);
  };

  const checkButtons = () => {
    const updatedStyles: { [key: number]: string } = {};
  
    for (const pokemon of selectedOptions) {
      if (pokemon.id === correctOption?.id) {
        updatedStyles[pokemon.id] = 'winner';
      } else {
        updatedStyles[pokemon.id] = 'loser';
      }
    }
  
    setButtonStyles(updatedStyles);
  };

  const handleRoundFinish = (selectedID?: number) => {
    setVisible(true);
    
    if (correctOption) {
      checkButtons();
    }
    if (selectedID) {
      setPlayerSelection(selectedID);
      setWinState(selectedID === correctOption?.id);
    }
    setIsGameRunning(false);
  };

  const handleGameStart = () => {
    setRoundCounter((prevCount) => prevCount + 1);
    setIsCountdown(true);
    setWinState(null);
    selectGameChoices();
    setIsGameStarted(true);
  };

  const renderOptionButtons = () => {
    return selectedOptions.map((p) => (
      <OptionButton
        key={p.id}
        id={p.id}
        text={p.name.toUpperCase()}
        onClick={() => handleOptionClick(p.id)}
        className={buttonStyles[p.id]}
      />
    ));
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
          <div className="flex-row">{renderOptionButtons()}</div>
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
