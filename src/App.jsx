import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import Answer from './components/Answer'
import he from 'he'

function App() {
  const [started, setStarted] = useState(false)
  const [data, setData] = useState([])
  const [questions, setQuestions] = useState([])
  //Question count will be used for which question to display and the right answer counter.
  const [count, setCount] = useState(0)
  //all the wrong answers returned
  const [fillerAnswers, setFillerAnswers] = useState([])
  
  //an array of the right answer and all the wrong answers, shuffled and turned into objects
  const [currentAnswers, setCurrentAnswers] = useState([])
  const [tenzies, setTenzies] = useState(false)


  //Get the data and use it to set the questions objects and the filler answers
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10&category=18&type=multiple")
        .then(res => res.json())
        .then(data => setData(data.results))
}, [])

useEffect(() => {
  setQuestions(data.map(elem => {
    return ({
    isHeld: false,
    question: he.decode(elem.question),
    correct_answer: he.decode(elem.correct_answer)    
  })
  }))
}, [data])

useEffect(() => {
  setFillerAnswers(data.map(elem => (elem.incorrect_answers)).reduce((acc, cur)=> cur.concat(acc), []))
}, [data])


//generate a set of 10 answers that starts with the correct answer and then adds 10 random answers.
function gatherAnswers() {
  let answerChoices = []
  answerChoices.push(questions[0].correct_answer)
  while (answerChoices.length <= 9) {
      const randomNumber = Math.floor(Math.random() * fillerAnswers.length)
      answerChoices.push(he.decode(fillerAnswers[randomNumber]))
  }
  return shuffleAnswers(answerChoices)
}

//makes it so the correct answer is not always first
function shuffleAnswers(answerChoices) {
  let choices = [...answerChoices]
  console.log(choices)
  let shuffled = choices
  .map(value => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value)
  return choices
}

//makes answers into objects that can hold the state of being correct
function allNewButtons(answerChoices) {
  let choices = shuffleAnswers(gatherAnswers())
  console.log(`the choices are ${choices}`)
  const newArray = []
  for(let i = 0; i < 10; i++) {
      const newAnswerObject = {
          value: choices[i],
          correct: false,
          id: i + 1
      }
      newArray.push(newAnswerObject)
  }
  return newArray
}

//Start game button -- sets started as true to display trivia page, generates answer buttons
  function startGame() {
    setStarted(true)
    setCurrentAnswers(allNewButtons())
  }

  function checkAnswer() {
    console.log('checking')
  }
  const answerElements = currentAnswers.map((answer) => (
    <Answer key={answer.id} value={answer.value} correct={answer.correct} checkAnswer={checkAnswer} />
))

console.log(answerElements)
/*const answerElements = currentAnswers.map((answer) => (
  <Answer key={answer.id} value={answer.value} correct={answer.correct} checkAnswer={() => checkAnswer(die.id)} />
))*/


  return (
    <main>
      
      { started ? 
             <div>
                <h1> Here's the trivia!</h1>
                <h2>{questions[count].question}</h2>   
                <div className='question-container'>    
                  {answerElements}
                </div>
              </div>
              :
             <div>
                <h1>Tenzies Trivia </h1>
                <h3>May your questions be easy and your clicks be fast.</h3>
                <p> Answer 10 questions right to collect all ten trivia points and win Tenzies Trivia! </p>
                <button onClick={startGame}> Start Quiz </button> 
             </div>
      }       
    </main>
  )
}

export default App
