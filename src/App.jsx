import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import Question from './components/Question'

function App() {
  const [started, setStarted] = useState(false)
  const [data, setData] = useState([])
  const [questions, setQuestions] = useState([])
  const [fillerAnswers, setFillerAnswers] = useState([])
  const [tenzies, setTenzies] = useState(false)


  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=10&category=18")
        .then(res => res.json())
        .then(data => setData(data.results))
        setQuestions(data.map(elem => {
          return ({
          isHeld: false,
          question: elem.question,
          correct_answer: elem.correct_answer    
        })
        }))
        setFillerAnswers(data.map(elem => elem.incorrect_answers).reduce((acc, cur)=> cur.concat(acc), []))
}, [])

console.log(fillerAnswers)


// .question  .incorrect_answers (array) .correct_answer

 

  function startGame() {
    setStarted(true)
  }

  return (
    <main>
      
      { started ? 
             <div>
              <h1> Here's the trivia!</h1>
             <Question />          
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
