import React from 'react'
import './LastReasultPopup.css'

const LastReasultPopup = ({closePopup}) => {
  return (
    <div className='model'>
      <div className='model-header'>
        <h1>Ball By Ball Reasult</h1>
        <button className='close' onClick={closePopup}>X</button>
      </div>

      <div className='model-content'>
        <div>
            <h1>Round Id: 9208673585046</h1>
            <h1>Match Time:25/12/2024 01:23:59</h1>
        </div>
        <div className='ball-image'>
            <img src="https://w7.pngwing.com/pngs/905/625/png-transparent-cricket-balls-cricket-bats-grasshopper-sport-insects-sphere-thumbnail.png" alt="" />
            <h3>0 RUN</h3>
        </div>
      </div>
    </div>
  )
}

export default LastReasultPopup