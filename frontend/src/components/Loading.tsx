import React from 'react'

const Loading = () => {
  return (
    <div>
        Loading
    </div>
  )
}

export const Skeleton=()=>{
  return (
  <div className="skeleton-loader">
    <div className="skeleton-shape"></div>
    <div className="skeleton-shape"></div>
    <div className="skeleton-shape"></div>
  </div>
  )
}

export default Loading
