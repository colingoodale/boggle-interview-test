import fs from 'fs';
import logo from './logo.svg';
import './App.css';
import React, {Component, useState} from 'react';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';


 const App = () => {
   //items to save in state
   //save the die distribution
  const [dieOrder, setDieOrder] = useState([
    ['a','a','a','f','r','s'], 
    ['a','a','e','e','e','e'], 
    ['a','a','f','i','r','s'], 
    ['a','d','e','n','n','n'], 
    ['a','e','e','e','e','m'], 
    ['a','e','e','g','m','u'], 
    ['a','e','g','m','n','n'], 
    ['a','f','i','r','s','y'], 
    ['b','j','k','q','x','z'], 
    ['c','c','e','n','s','t'], 
    ['c','e','i','i','l','t'], 
    ['c','e','i','l','p','t'], 
    ['c','e','i','p','s','t'], 
    ['d','d','h','n','o','t'], 
    ['d','h','h','l','o','r'], 
    ['d','h','l','n','o','r'], 
    ['d','h','l','n','o','r'], 
    ['e','i','i','i','t','t'], 
    ['e','m','o','t','t','t'], 
    ['e','n','s','s','s','u'], 
    ['f','i','p','r','s','y'], 
    ['g','o','r','r','v','w'], 
    ['i','p','r','r','r','y'], 
    ['n','o','o','t','u','w'], 
    ['o','o','o','t','t','u']
    ])
   //Start state
   const [gameStarted, setGameStarted] = useState(false);
   const [currentLetters, setCurrentLetters] = useState('')
   const [lastClicked, setLastClicked] = useState([]);
   const [dictionary, setDictionary] = useState();
   const [userWords, setUserWords] = useState();
   const [submittedWords, setSubmittedWords] = useState([]);



   const fetchDictionary = async () => {
     let dictionaryGrab = await fetch('https://raw.githubusercontent.com/redbo/scrabble/master/dictionary.txt')
     let dictionaryToText = await dictionaryGrab.text()
     let dictionaryArray = dictionaryToText.split(('\n'));
     console.log(dictionaryArray);
     setDictionary(dictionaryArray);
   }
  const buttonStatus = {
    unchosen: {
      default:'#2596be',
      hover: '#62b6d6'
    },
    currentLetter: {
      default:'#2ab526',
      hover: '#76f174'
    }
    
  }
   //Bonus add timer listener to start stats
  const wordShuffle = (wordMutation) => {
    for(let i=wordMutation.length-1;i>0;i--){
      let j = Math.floor(Math.random() * (i+1));
      [wordMutation[i], wordMutation[j]] = [wordMutation[j], wordMutation[i]];
    }
    return wordMutation;
  }
  const shuffle = (arrayMutation) => {
    for(let i=arrayMutation.length-1;i>0;i--){
      let shuffledWordReplace = wordShuffle(arrayMutation[i]);
      let j = Math.floor(Math.random() * (i+1));
      [arrayMutation[i], arrayMutation[j]] = [arrayMutation[j], arrayMutation[i]];
    }
    return arrayMutation;
  }
  
  const randomizeCubes = () => {
    const arrayMutation = dieOrder;
    let shuffled = shuffle(arrayMutation);
    setDieOrder(shuffled);
  }
  const handleItemClick = (item, i) => {
    if(i === lastClicked[lastClicked.length-1]){
      console.log("if hit");
      let mutatedLetters = currentLetters.split("");
      mutatedLetters.pop();
      let mutatedLastClicked = lastClicked;
      mutatedLastClicked.pop();
      setLastClicked(mutatedLastClicked);
      setCurrentLetters(mutatedLetters);
    }else{
      console.log("cliecked Item", item, i)
      let mutatedLetters = currentLetters;
      mutatedLetters += item;
      console.log(mutatedLetters)
      let newClickAddition = lastClicked;
      newClickAddition.push(i);
      setLastClicked(newClickAddition);
      setCurrentLetters(mutatedLetters);
      console.log(currentLetters, lastClicked);
    }

    
  }
  const submitWord = () => {
    console.log(dictionary);
    let capitalized = currentLetters.toUpperCase();
    let isWord = dictionary.indexOf(capitalized);
    console.log(isWord)
    if(isWord > -1){
      let newWordSubmit = {
        score:currentLetters.length,
        word:currentLetters
      }
      let wordAddition = submittedWords;
      wordAddition.push(newWordSubmit);
      setSubmittedWords(wordAddition);
      setLastClicked([])
      setCurrentLetters('')
      console.log(submittedWords);
    }else{
      let newWordSubmit = {
        score:-2,
        word:currentLetters
      }
      let wordAddition = submittedWords;
      wordAddition.push(newWordSubmit);
      setSubmittedWords(wordAddition);
      setLastClicked([]);
      setCurrentLetters('');
      console.log(submittedWords);
    }
  }
  const startGame = () => {
    fetchDictionary();
    randomizeCubes();
    setGameStarted(true)
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>Boggle!!</div>
        {gameStarted === true &&
          <div className="die-container"> 
          <div className="grid">
          {
            dieOrder.map((die, i)=>{
              var textClicked = lastClicked.indexOf(i);
              if(textClicked >= 0 ){
                return(
                  <div className="die-clicked" value={i} onClick={()=>handleItemClick(die[0], i)}>
                    {die[0]}
                  </div>
                )
              }else{
                return(
                  <div className="die" value={i} onClick={()=>handleItemClick(die[0], i)}>
                    {die[0]}
                  </div>  
              )
              }
              
            })
          }
          </div>
          </div>
        }
        {gameStarted === false &&
          <Button variant='contained' color="primary" onClick={()=>startGame()} className="start-button">Start Game!</Button>
        }
        {gameStarted === true &&
        <>
          <div className="currentWord">{currentLetters}</div>
          <Button variant='contained' color='secondary' onClick={()=>submitWord()} className="word-check-button">Submit Word</Button>
        </>
        }
        {submittedWords.map(word => {
          return(
          <>
          <div className="submittedWords">{word.word}: {word.score}</div>
          </>
        )})}

        
        
      </header>
    </div>
  );
}

export default App;
