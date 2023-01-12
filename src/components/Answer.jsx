import React from 'react'

export default function Answer(props) {
    return(
        <div className='answer-box'>
            <h4> {props.value} </h4>
        </div>
    )
}