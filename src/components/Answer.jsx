import React from 'react'

export default function Answer(props) {
    const styles = {
        backgroundColor: props.correct ? "#D00772" : "#930B54"
    }
    return(
        <div className='answer-box' onClick={props.checkAnswer}  style={styles}>
            <h4> {props.value} </h4>
        </div>
    )
}