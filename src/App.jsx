import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import Answer from './components/Answer'

function App() {
  const [started, setStarted] = useState(false)
  const [data, setData] = useState([])
  const [questions, setQuestions] = useState([])
  //Question count will be used for which question to display and the right answer counter.
  const [count, setCount] = useState(0)
  const [fillerAnswers, setFillerAnswers] = useState([])
  const [currentAnswers, setCurrentAnswers] = useState([])
  const [tenzies, setTenzies] = useState(false)


  //Get the data and use it to set the questions objects and the filler answers
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10&category=18")
        .then(res => res.json())
        .then(data => setData(data.results))
}, [])

useEffect(() => {
  setQuestions(data.map(elem => {
    return ({
    isHeld: false,
    question: elem.question,
    correct_answer: elem.correct_answer    
  })
  }))
}, [data])

useEffect(() => {
  setFillerAnswers(data.map(elem => elem.incorrect_answers).reduce((acc, cur)=> cur.concat(acc), []))
}, [data])

//makes it so the correct answer is not always first
function shuffleAnswers(answerChoices) {
    let choices = [...answerChoices]
    console.log(choices)
    let shuffled = choices
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
   
console.log(shuffled)
}
//generate a set of 10 answers that starts with the correct answer and then adds 10 random answers.
function setAnswers() {
  let answerChoices = []
  answerChoices.push(questions[0].correct_answer)
  while (answerChoices.length <= 9) {
      const randomNumber = Math.floor(Math.random() * fillerAnswers.length)
      answerChoices.push(fillerAnswers[randomNumber])
  }
  return shuffleAnswers(answerChoices)
}



 

  function startGame() {
    setStarted(true)
    setCurrentAnswers(setAnswers())
  }

  return (
    <main>
      
      { started ? 
             <div>
                <h1> Here's the trivia!</h1>
                <h2>{questions[count].question}</h2>       
                <p>{currentAnswers}</p>
              </div>
              :
             <div>
                <h1>Tenzies Trivia </h1>
                <p>May your questions be easy and your clicks be fast.</p>
                <button onClick={startGame}> Start Quiz </button> 
             </div>
      }       
    </main>
  )
}

export default App
