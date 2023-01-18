import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import Answer from './components/Answer'
//confetti on win
import Confetti from 'react-confetti'
//translate the html code
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
    fetch("https://opentdb.com/api.php?amount=11&category=18&type=multiple")
        .then(res => res.json())
        .then(data => setData(data.results))
}, [])

useEffect(() => {
  setQuestions(data.map(elem => {
    return ({
    question: he.decode(elem.question),
    correct_answer: he.decode(elem.correct_answer)    
  })
  }))
}, [data])

useEffect(() => {
  setFillerAnswers(data.map(elem => (elem.incorrect_answers)).reduce((acc, cur)=> cur.concat(acc), []))
}, [data])

useEffect(() => {
 if (count > 0 ) {
  newQuestionUpdate(newQuestionAnswers)
 }
}, [count])

//Check for tenzies
useEffect(() => {
  setTenzies(currentAnswers.length == 10 && currentAnswers.every(answer => answer.correct === true))
}, [currentAnswers])

//generate an array of 10 answers that starts with the correct answer and then adds 10 random answers.
function gatherAnswers() {
  let answerChoices = []
  answerChoices.push(questions[count].correct_answer)
    while (answerChoices.length <= 9) {
        const randomNumber = Math.floor(Math.random() * fillerAnswers.length)
        answerChoices.push(he.decode(fillerAnswers[randomNumber]))
    }
    return shuffleAnswers(answerChoices)
  }

//generate an array of answer choices that takes in account number of correct
  function newQuestionAnswers() {
    let answerChoices = []
    answerChoices.push(questions[count].correct_answer)
    let correct = currentAnswers.filter(answer => answer.correct === true)
    let numberCorrect = correct.length
    if (numberCorrect > 0) {
          while (answerChoices.length <= 9 - numberCorrect) {
          const randomNumber = Math.floor(Math.random() * fillerAnswers.length)
          answerChoices.push(he.decode(fillerAnswers[randomNumber]))
      }
    } else {
         while (answerChoices.length <= 9) {
        const randomNumber = Math.floor(Math.random() * fillerAnswers.length)
        answerChoices.push(he.decode(fillerAnswers[randomNumber]))
    }
    }
      let shuffled = shuffleAnswers(answerChoices)
      return shuffled
    }

  function newQuestionUpdate() {
    let newValueArray = newQuestionAnswers()
    setCurrentAnswers(prevAnswer => {
      let updatedArray = []
      let addingIndex = 0
       for(let i=0; i<prevAnswer.length; i++) {
         if (prevAnswer[i].correct === true) {
          updatedArray.push({...prevAnswer[i]}) 
         } else {
          updatedArray.push({...prevAnswer[i], value: newValueArray[addingIndex]}) 
          addingIndex++
         }
       }
       return updatedArray
    })
  }



//shuffles an answer array so the correct answer is not always first
function shuffleAnswers(answerChoices) {
  let choices = [...answerChoices]
  let shuffled = choices
  .map(value => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value)
  return shuffled
}

//makes answers into objects that can hold the state of being correct
function allNewButtons() {
  let choices = shuffleAnswers(gatherAnswers())
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

 
  //If the answer is wrong repopulate the answers
  function checkAnswer(value) {
    if (!tenzies) {
    if (questions[count].correct_answer != value) {
           newQuestionUpdate(newQuestionAnswers)
    } else {
        setCurrentAnswers(prevAnswer => prevAnswer.map(answer => {
          return answer.value === questions[count].correct_answer ?
            {...answer, correct: !answer.correct} :
            answer
        }))
        setCount(prevCount => prevCount + 1)      
    }
  }
  }

  function playAgain() {
    setStarted(false)
    setTenzies(false)
  }

  const answerElements = currentAnswers.map((answer) => (
    <Answer key={answer.id} value={answer.value} correct={answer.correct} checkAnswer={() =>checkAnswer(answer.value)} />
))
  

  return (
    <main>
      
      { started ? 
             
               tenzies ? 
               <div>
                    <Confetti />
                    <h1>You win!!</h1>
                    <button className='start-button' onClick={playAgain}>Play Again</button>
                    </div> : 
                        <div>
                        <h1>Here's the trivia!</h1>
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
                <button className='start-button' onClick={startGame}>Start Quiz </button> 
             </div>
      }       
    </main>
  )
}

export default App
