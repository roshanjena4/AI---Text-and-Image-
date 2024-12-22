import React from 'react'
import loading from './textLoad.gif'

const LoadingText = () => {
  return (
    <div className='text-center' style={{
      backgroundColor: "#2f2f2f"
    }}>
      <img src={loading} alt="Loading" />
    </div>
  )
}

export default LoadingText
