import React from 'react'
import Image from 'next/image'

//INTERNAL IMPORT
import Style from '../Card/Card.module.css'
import images from '../../assets'
import VoterCardStyle from './VoterCard.module.css'

const VoterCard = ({voterArray}) => {
  return (
    <div className={Style.card}>
      {voterArray.map((el, i) => (
        <div key={i + 1}>
          <div className={Style.card_box}>
            <div className={Style.image}>
              <img src={el[2]} alt="Profile Photo" />
            </div>
            <div className={Style.card_info}>
              <h2>
                {el[1]} #{el[0].toNumber()}
              </h2>
              <p>Address: {el[3].slice(0, 30)}...</p>
              <p>Details</p>
              <p className={VoterCardStyle.vote_status}>
                {el[6] == true ? "You Already Voted" : "Not Voted"}
              </p>
            </div>
          </div>
        </div>
      ))

      }
    </div>
  )
}

export default VoterCard