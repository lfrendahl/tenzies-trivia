import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Question from './components/Question'

function App() {
  const [started, setStarted] = useState(false)
  const [triviaQuestions, setTriviaQuestions] = useState([])


  function startGame() {
    setStarted(true)
  }

  return (
    <main>
      
      { started ? 
             <div>
              <h1> Here's the trivia!</h1>
             <Question />
             <Question />
             <Question />
             <Question />
             <Question />
             <Question />
             <Question />
             <Question />
             <Question />
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
