import React from 'react'

const Button = (props) => {
  return (
    <div>
      <button onClick={props.changeParameter}>{props.label}</button>
    </div>
  )
}

export default Button