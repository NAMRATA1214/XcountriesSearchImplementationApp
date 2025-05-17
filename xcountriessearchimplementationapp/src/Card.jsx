import React from 'react'

const Card = ({countryFlag,countryName}) => {
  return (
    <div className='countryCard flex-center'>
        <img src={countryFlag} alt={countryName}  height={80}/>
        <h2>{countryName}</h2>
    </div>
  )
}

export default Card
