import React from 'react'

export default function Answer(props) {
    const styles = {
        backgroundColor: props.correct ? "#F2E9C9" : "#930B54",
        color: props.correct ? 'black' : 'white'
    }
    return(
        <div className='answer-box' onClick={props.correct ? undefined : props.checkAnswer}  style={styles}>
            <h4> {props.value} </h4>
        </div>
    )
}