'use client'
import { fetchList } from "./lib/pokeapi";
import { IPokemon } from "./interfaces/IPokemon";
import React, { useEffect, useState } from "react";
import { PrimaryButton, OptionButton } from "./components/Buttons";
import { randomIndex, startGame } from "./lib/game";

const Home: React.FC = () =>{
  const [pokemon, setPokemon] = useState<IPokemon[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<IPokemon[]>([]);
  const [correctOption, setCorrectOption] = useState<IPokemon | null>(null);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [winState, setWinState] = useState<boolean | null>(null); //Change this to be a bool
  const [visible, setVisible] = useState<boolean>(false)

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
  }, []);

  const selectGameChoices = () => {
    const shuffledList = pokemon.sort(() => Math.random() - 0.5); //Shuffle the inital list
    const selection = shuffledList.slice(0, 4); //Pick the first four from the shuffled list
    const winnerIndex = randomIndex(); //Picks a random index
    setSelectedOptions(selection);
    setCorrectOption(selection[winnerIndex]);
  }

  const checkSelectedOption = (key: number) => {
    //feels very hacky, not sure if there's a better way to do this but it works
    for(let x in selectedOptions){
      const currentButton = document.getElementById(`${selectedOptions[x].id}`)
      if(selectedOptions[x].id === correctOption?.id){
        currentButton?.classList.add('winner')
      }else{
        currentButton?.classList.add('loser')
      }
    }
    if(correctOption && key === correctOption.id){
      setWinState(true);
    }else{
      setWinState(false)
    }
    setVisible(true)
  }

  const handleGameStart = () => {
    setIsGameStarted(true);
    setWinState(null);
    selectGameChoices();
  }

  return(
    <main className="flex items-center justify-center h-screen">
      {
        isGameStarted ?         
        <>
          {/* seems to set black to white, see how to fix */}
          <img width={250} height={250} src={correctOption?.image} className={visible ? 'visible' : 'blank'} />
          {
            selectedOptions.map((p) => (
              <OptionButton 
                key={p.id}
                id={p.id}
                // buttonState={winState}
                text={p.name.toUpperCase()} 
                onClick={ () => checkSelectedOption(p.id) } />
            ))
          }
        </> :
        <PrimaryButton onClick={handleGameStart} text="Let's play!" />
      }
    </main>
  )
}

export default Home