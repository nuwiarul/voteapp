import React from 'react';
import Image from 'next/image';

//INTERNAL IMPORTR

import Style from './Card.module.css';
import images from '../../assets';

const Card = ({candidateArray, giveVote}) => {

  return (
    <div className={Style.card}>
      {candidateArray.map((el, i) => (
        <div key={i + 1} className={Style.card_box}>
          <div className={Style.image}>
            <img src={el[3]} alt='profile'/>
          </div>
          <div className={Style.card_info}>
            <h2>
              {el[1]} #{el[2].toNumber()}
            </h2>
            <p>Address : {el[6].slice(0, 20)}...</p>
            <p>Age : {el[0]}</p>
            <p className={Style.total}>Total Vote</p>
          </div>
          <div className={Style.card_vote}>
            <p>{el[4].toNumber()}</p>
          </div>
          <div className={Style.card_button}>
            <button onClick={() => giveVote({id: el[2].toNumber(), address: el[6]})}>
              Give Vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Card